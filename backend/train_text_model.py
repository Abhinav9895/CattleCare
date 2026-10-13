import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.pipeline import Pipeline
from sklearn.svm import LinearSVC
from sklearn.metrics import accuracy_score, classification_report

# =========================
# 1. LOAD DATASET
# =========================

df = pd.read_csv("animal_disease_dataset.csv")

print("Dataset Loaded Successfully")
print(df.head())

# =========================
# 2. CREATE TEXT FEATURES
# =========================

df["Symptoms"] = (
    df["Animal"].astype(str) + " " +
    df["Symptom 1"].astype(str) + " " +
    df["Symptom 2"].astype(str) + " " +
    df["Symptom 3"].astype(str) +
    " temperature_" + df["Temperature"].astype(str)
)

# =========================
# 3. FEATURES & LABEL
# =========================

X = df["Symptoms"]
y = df["Disease"]

# Encode disease labels
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# =========================
# 4. TRAIN TEST SPLIT
# =========================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.2,
    random_state=42,
    stratify=y_encoded
)

# =========================
# 5. MODEL PIPELINE
# =========================

model = Pipeline([
    ("tfidf", TfidfVectorizer(
        ngram_range=(1,3),
        max_features=10000,
        stop_words="english"
    )),
    ("clf", LinearSVC())
])

# =========================
# 6. TRAIN MODEL
# =========================

print("\nTraining model...")

model.fit(X_train, y_train)

# =========================
# 7. PREDICT
# =========================

predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print("\nModel Accuracy:", accuracy)

print("\nClassification Report:\n")
print(classification_report(y_test, predictions))

# =========================
# 8. SAVE MODEL
# =========================

joblib.dump(model, "symptom_model.pkl")
joblib.dump(label_encoder, "label_encoder.pkl")

print("\nModel saved successfully!")