"""Prediction service — loads the pipeline once and serves predictions."""

import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

from app.core.config import settings

ZERO_REPLACE_COLS = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
FEATURE_ORDER = [
    "Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
    "Insulin", "BMI", "DiabetesPedigreeFunction", "Age",
]


class PredictionService:
    """Singleton-ish service initialised at app startup."""

    def __init__(self) -> None:
        self.pipeline = None
        self.metadata: dict | None = None
        self.model_loaded = False

    # ------------------------------------------------------------------
    def load(self) -> None:
        """Load model artefacts from disk."""
        try:
            self.pipeline = joblib.load(settings.MODEL_PATH)
            with open(settings.METADATA_PATH, "r") as f:
                self.metadata = json.load(f)
            self.model_loaded = True
            print(f"✓ Model loaded from {settings.MODEL_PATH}")
        except Exception as exc:
            print(f"✗ Failed to load model: {exc}")
            self.model_loaded = False

    # ------------------------------------------------------------------
    def predict(self, patient_data: dict) -> dict:
        """Run inference and return structured result."""
        if not self.model_loaded:
            raise RuntimeError("Model is not loaded")

        # Build a single-row DataFrame in the correct column order
        row = {feat: patient_data[feat] for feat in FEATURE_ORDER}
        df = pd.DataFrame([row], columns=FEATURE_ORDER)

        # Apply the same zero→NaN replacement used during training
        df[ZERO_REPLACE_COLS] = df[ZERO_REPLACE_COLS].replace(0, np.nan)

        # Predict
        proba = float(self.pipeline.predict_proba(df)[0, 1])
        prediction = int(proba >= 0.5)

        # Risk level
        if proba < 0.3:
            risk_level = "Low"
        elif proba < 0.6:
            risk_level = "Moderate"
        else:
            risk_level = "High"

        label = "Diabetic" if prediction == 1 else "Non-Diabetic"
        patient_name = patient_data.get("patient_name") or "Anonymous Patient"
        patient_email = patient_data.get("patient_email") or ""

        result = {
            "prediction": prediction,
            "probability": round(proba, 4),
            "risk_level": risk_level,
            "label": label,
            "patient_name": patient_name,
            "patient_email": patient_email,
            "patient_data": patient_data,
            "model_info": {
                "model_name": self.metadata["model_name"],
                "algorithm": self.metadata["algorithm"],
                "accuracy": self.metadata["evaluation"]["accuracy"],
                "roc_auc": self.metadata["evaluation"]["roc_auc"],
            },
        }

        # Persist to history
        self._save_to_history(result)

        return result

    # ------------------------------------------------------------------
    def get_model_info(self) -> dict:
        if not self.metadata:
            raise RuntimeError("Model metadata not loaded")
        return self.metadata

    # ------------------------------------------------------------------
    # Prediction history (simple JSON file store)
    # ------------------------------------------------------------------
    def _history_path(self) -> Path:
        return settings.HISTORY_PATH

    def _load_history(self) -> list[dict]:
        path = self._history_path()
        if path.exists():
            with open(path, "r") as f:
                return json.load(f)
        return []

    def _write_history(self, history: list[dict]) -> None:
        path = self._history_path()
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w") as f:
            json.dump(history, f, indent=2)

    def _save_to_history(self, result: dict) -> None:
        history = self._load_history()
        patient_data = result["patient_data"]
        entry = {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "patient_name": result.get("patient_name") or patient_data.get("patient_name") or "Anonymous Patient",
            "patient_email": result.get("patient_email") or patient_data.get("patient_email") or "",
            "patient_data": patient_data,
            "prediction": result["prediction"],
            "probability": result["probability"],
            "risk_level": result["risk_level"],
            "label": result["label"],
        }
        history.insert(0, entry)  # newest first
        # Keep only last 100 entries
        history = history[:100]
        self._write_history(history)

    def get_history(self) -> list[dict]:
        return self._load_history()

    def delete_history_item(self, item_id: str) -> bool:
        history = self._load_history()
        new_history = [h for h in history if h["id"] != item_id]
        if len(new_history) == len(history):
            return False
        self._write_history(new_history)
        return True


# Module-level singleton
prediction_service = PredictionService()
