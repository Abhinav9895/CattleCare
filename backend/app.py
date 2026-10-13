
import os
import io
import requests
import joblib
import numpy as np

from typing import Optional
from PIL import Image
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.mobilenet_v2 import (
    MobileNetV2,
    preprocess_input,
    decode_predictions,
)
from geopy.distance import geodesic


# ---------------- INIT ----------------

app = FastAPI(title="CattleCare AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------- LOAD MODELS ----------------

image_model = load_model("cattle_disease_model.h5")
text_model = joblib.load("text_model.pkl")

cow_detector = MobileNetV2(weights="imagenet")


# ---------------- IMAGE CLASSES ----------------

classes = ["Foot and Mouth", "Healthy", "Lumpy Skin"]


# ---------------- FOLLOW UPS ----------------

followups = {
    "Lumpy Skin": [
        "Is there skin nodules?",
        "Is there fever?",
        "Is there swelling in legs?",
    ],
    "Foot and Mouth": [
        "Are there mouth blisters?",
        "Is the cow drooling?",
        "Is there limping?",
    ],
    "Healthy": [],
}


# ---------------- TREATMENT ----------------

treatment = {
    "Lumpy Skin": [
        "Isolate infected animal",
        "Control flies and mosquitoes",
        "Consult veterinarian",
    ],
    "Foot and Mouth": [
        "Isolate infected animal",
        "Disinfect feeding area",
        "Provide soft food and hydration",
    ],
    "Healthy": [
        "No treatment required",
    ],
}


# ---------------- IMAGE PREPROCESS ----------------

def preprocess_image(file_bytes):
    img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    img = img.resize((224, 224))

    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)

    return img


# ---------------- CATTLE DETECTOR ----------------

def contains_cattle(file_bytes):
    img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    img = img.resize((224, 224))

    img_array = np.array(img)
    img_array = preprocess_input(img_array)
    img_array = np.expand_dims(img_array, axis=0)

    preds = cow_detector.predict(img_array, verbose=0)
    decoded = decode_predictions(preds, top=5)[0]

    cattle_keywords = [
        "cow",
        "ox",
        "water_buffalo",
        "bison",
        "bull",
        "calf",
    ]

    for _, label, probability in decoded:
        for keyword in cattle_keywords:
            if keyword in label:
                return True

    return False


# ---------------- SEVERITY ----------------

def detect_severity(symptoms):
    if not symptoms:
        return "Moderate"

    symptoms_lower = symptoms.lower()

    if (
        "high fever" in symptoms_lower
        or "severe swelling" in symptoms_lower
    ):
        return "Severe"

    if "mild" in symptoms_lower:
        return "Mild"

    return "Moderate"


# ---------------- NEARBY VETS ----------------

def get_nearby_vets(lat, lon):
    try:
        query = f"""
        [out:json];
        node["amenity"="veterinary"](around:20000,{lat},{lon});
        out;
        """

        response = requests.post(
            "https://overpass-api.de/api/interpreter",
            data=query,
            timeout=10,
        )
        response.raise_for_status()

        data = response.json()
        vets = []

        for element in data.get("elements", []):
            if "lat" not in element or "lon" not in element:
                continue

            vet_lat = element["lat"]
            vet_lon = element["lon"]

            distance = geodesic(
                (lat, lon),
                (vet_lat, vet_lon),
            ).km

            tags = element.get("tags", {})

            vets.append({
                "name": tags.get("name", "Veterinary Clinic"),
                "distance": f"{round(distance, 2)} km",
                "phone": tags.get("phone", "Not available"),
                "hours": tags.get("opening_hours", "Unknown"),
                "maps_link": (
                    f"https://www.google.com/maps?q={vet_lat},{vet_lon}"
                ),
            })

        vets.sort(
            key=lambda vet: float(vet["distance"].split()[0])
        )

        return vets[:5]

    except Exception as e:
        print("Vet Finder Error:", str(e))
        return []


# ---------------- VET FINDER API ----------------

@app.get("/vets")
async def vets(lat: float, lon: float):
    return {
        "nearby_vets": get_nearby_vets(lat, lon)
    }


# ---------------- CHAT REQUEST MODEL ----------------

class ChatRequest(BaseModel):
    message: str


# ---------------- GEMINI AI VET CHAT ----------------

@app.post("/chat")
async def chat(req: ChatRequest):
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        return {
            "reply": "AI vet assistant is not configured."
        }

    try:
        prompt = f"""
You are CattleCare AI, a livestock veterinary assistant
helping farmers with cattle health.

Help with cattle disease symptoms, prevention, vaccination,
feeding, and basic care.

Instructions:
- Give short, practical answers in simple language.
- Do not claim a definite diagnosis from chat alone.
- Do not prescribe medicines or dosages without veterinary guidance.
- Recommend a qualified veterinarian for serious symptoms,
  suspected contagious diseases, or worsening conditions.
- Explain that your guidance does not replace a veterinarian.

Farmer's question:
{req.message}
"""

        response = requests.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
            params={"key": api_key},
            json={
                "contents": [
                    {
                        "parts": [
                            {"text": prompt}
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.4,
                    "maxOutputTokens": 500,
                },
            },
            timeout=30,
        )

        response.raise_for_status()
        data = response.json()

        candidates = data.get("candidates", [])
        if not candidates:
            return {
                "reply": "AI vet assistant could not generate a response. Please try again."
            }

        parts = candidates[0].get("content", {}).get("parts", [])
        reply = "\n".join(
            part["text"]
            for part in parts
            if "text" in part
        ).strip()

        if not reply:
            reply = "AI vet assistant could not generate a response. Please try again."

        return {"reply": reply}

    except requests.exceptions.Timeout:
        print("Chat Error: Gemini request timed out")
        return {
            "reply": "The AI vet assistant took too long to respond. Please try again."
        }

    except requests.exceptions.HTTPError as e:
        print(
            "Gemini API Error:",
            e.response.status_code,
            e.response.text[:1000],
        )
        return {
            "reply": "AI vet assistant is temporarily unavailable. Please try again."
        }

    except Exception as e:
        print("Chat Error:", str(e))
        return {
            "reply": "AI vet assistant is temporarily unavailable. Please try again."
        }


# ---------------- DISEASE PREDICTION ----------------

@app.post("/predict")
async def predict(
    file: Optional[UploadFile] = File(None),
    symptoms: Optional[str] = Form(None),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
):
    try:
        image_disease = None
        confidence = 0.0
        cattle_detected = False

        if file:
            file_bytes = await file.read()

            cattle_detected = contains_cattle(file_bytes)

            img = preprocess_image(file_bytes)
            prediction = image_model.predict(img, verbose=0)[0]

            class_id = int(np.argmax(prediction))
            confidence = float(np.max(prediction))
            image_disease = classes[class_id]

            if not cattle_detected:
                return {
                    "final_diagnosis": "Image not related to cattle",
                    "image_confidence_percent": round(
                        confidence * 100, 2
                    ),
                    "severity_level": "Unknown",
                    "follow_up_questions": [],
                    "recommended_actions": [
                        "Please upload an image of a cow or cattle disease."
                    ],
                    "nearby_vets": [],
                }

        text_disease = None

        if symptoms and symptoms.strip():
            text_disease = text_model.predict([symptoms])[0]

        # Preserve the existing behavior: image result takes priority.
        final_disease = (
            image_disease
            or text_disease
            or "Insufficient Data"
        )

        severity = detect_severity(symptoms)

        nearby_vets = []

        if latitude is not None and longitude is not None:
            nearby_vets = get_nearby_vets(latitude, longitude)

        return {
            "final_diagnosis": str(final_disease),
            "image_confidence_percent": round(
                confidence * 100, 2
            ),
            "severity_level": severity,
            "follow_up_questions": followups.get(
                str(final_disease), []
            ),
            "recommended_actions": treatment.get(
                str(final_disease), []
            ),
            "nearby_vets": nearby_vets,
        }

    except Exception as e:
        print("Prediction Error:", str(e))

        return {
            "final_diagnosis": "Error",
            "image_confidence_percent": 0,
            "severity_level": "Unknown",
            "follow_up_questions": [],
            "recommended_actions": [],
            "nearby_vets": [],
        }
