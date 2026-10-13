from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input, decode_predictions
import joblib
import numpy as np
from PIL import Image
import io
import requests
from typing import Optional
from geopy.distance import geodesic

# ---------------- INIT ----------------

app = FastAPI()

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
        "Is there swelling in legs?"
    ],
    "Foot and Mouth": [
        "Are there mouth blisters?",
        "Is the cow drooling?",
        "Is there limping?"
    ],
    "Healthy": []
}

# ---------------- TREATMENT ----------------

treatment = {
    "Lumpy Skin": [
        "Isolate infected animal",
        "Control flies and mosquitoes",
        "Consult veterinarian"
    ],
    "Foot and Mouth": [
        "Isolate infected animal",
        "Disinfect feeding area",
        "Provide soft food and hydration"
    ],
    "Healthy": [
        "No treatment required"
    ]
}

# ---------------- IMAGE PREPROCESS ----------------

def preprocess_image(file_bytes):

    img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    img = img.resize((224,224))

    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)

    return img


# ---------------- CATTLE DETECTOR ----------------

def contains_cattle(file_bytes):

    img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    img = img.resize((224,224))

    img_array = np.array(img)
    img_array = preprocess_input(img_array)
    img_array = np.expand_dims(img_array, axis=0)

    preds = cow_detector.predict(img_array)
    decoded = decode_predictions(preds, top=5)[0]

    cattle_keywords = ["cow","ox","water_buffalo","bison","bull","calf"]

    for _, label, prob in decoded:
        for key in cattle_keywords:
            if key in label:
                return True

    return False


# ---------------- SEVERITY ----------------

def detect_severity(symptoms):

    if not symptoms:
        return "Moderate"

    s = symptoms.lower()

    if "high fever" in s or "severe swelling" in s:
        return "Severe"

    if "mild" in s:
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
            timeout=10
        )

        data = response.json()

        vets = []

        for element in data.get("elements", []):

            vet_lat = element["lat"]
            vet_lon = element["lon"]

            distance = geodesic((lat, lon), (vet_lat, vet_lon)).km

            vets.append({
                "name": element["tags"].get("name", "Veterinary Clinic"),
                "distance": f"{round(distance,2)} km",
                "phone": element["tags"].get("phone", "Not available"),
                "hours": element["tags"].get("opening_hours", "Unknown"),
                "maps_link": f"https://www.google.com/maps?q={vet_lat},{vet_lon}"
            })

        vets = sorted(vets, key=lambda x: float(x["distance"].split()[0]))

        return vets[:5]

    except:
        return []


# ---------------- VET FINDER API ----------------

@app.get("/vets")
async def vets(lat: float, lon: float):

    return {
        "nearby_vets": get_nearby_vets(lat, lon)
    }

# ---------------- CHAT MODEL ----------------

class ChatRequest(BaseModel):
    message: str


# ---------------- AI VET CHAT ----------------

@app.post("/chat")
async def chat(req: ChatRequest):

    try:

        prompt = f"""
You are an experienced livestock veterinarian assistant.
Help farmers with cattle diseases, treatment, vaccination and feeding.
Question: {req.message}
Give a short practical answer.
"""

        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3",
                "prompt": prompt,
                "stream": False
            }
        )

        data = response.json()

        return {"reply": data.get("response","AI vet unavailable")}

    except:
        return {"reply": "AI vet assistant unavailable."}


# ---------------- DISEASE PREDICTION ----------------

@app.post("/predict")
async def predict(
    file: Optional[UploadFile] = File(None),
    symptoms: Optional[str] = Form(None),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None)
):

    try:

        image_disease = None
        confidence = 0

        if file:

            file_bytes = await file.read()

            cattle_detected = contains_cattle(file_bytes)

            img = preprocess_image(file_bytes)

            prediction = image_model.predict(img)[0]

            class_id = int(np.argmax(prediction))

            confidence = float(np.max(prediction))

            image_disease = classes[class_id]

            if image_disease == "Healthy" and not cattle_detected:

                return {
                    "final_diagnosis": "Image not related to cattle",
                    "image_confidence_percent": round(confidence*100,2),
                    "severity_level": "Unknown",
                    "follow_up_questions": [],
                    "recommended_actions": [
                        "Please upload an image of a cow or cattle disease."
                    ],
                    "nearby_vets": []
                }

        text_disease = None

        if symptoms:
            text_disease = text_model.predict([symptoms])[0]

        final_disease = image_disease or text_disease or "Insufficient Data"

        severity = detect_severity(symptoms)

        nearby_vets = []

        if latitude and longitude:
            nearby_vets = get_nearby_vets(latitude, longitude)

        return {
            "final_diagnosis": final_disease,
            "image_confidence_percent": round(confidence*100,2),
            "severity_level": severity,
            "follow_up_questions": followups.get(final_disease,[]),
            "recommended_actions": treatment.get(final_disease,[]),
            "nearby_vets": nearby_vets
        }

    except Exception as e:

        print("Prediction Error:", e)

        return {
            "final_diagnosis": "Error",
            "image_confidence_percent": 0,
            "severity_level": "Unknown",
            "follow_up_questions": [],
            "recommended_actions": [],
            "nearby_vets": []
        }