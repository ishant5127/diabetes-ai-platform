"""Pydantic schemas for request / response models."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class PatientData(BaseModel):
    """Input schema — patient demographic/identity + 8 physiological features."""

    patient_name: str | None = Field(
        default="Anonymous Patient",
        description="Full name of the patient",
        json_schema_extra={"example": "Sarah Jenkins"},
    )
    patient_email: str | None = Field(
        default="",
        description="Patient email address for notifications and reports",
        json_schema_extra={"example": "sarah.jenkins@example.com"},
    )
    Pregnancies: int = Field(
        ..., ge=0, le=20,
        description="Number of times pregnant",
        json_schema_extra={"example": 2},
    )
    Glucose: float = Field(
        ..., ge=0, le=300,
        description="Plasma glucose concentration (mg/dL)",
        json_schema_extra={"example": 120.0},
    )
    BloodPressure: float = Field(
        ..., ge=0, le=200,
        description="Diastolic blood pressure (mm Hg)",
        json_schema_extra={"example": 70.0},
    )
    SkinThickness: float = Field(
        ..., ge=0, le=120,
        description="Triceps skin fold thickness (mm)",
        json_schema_extra={"example": 25.0},
    )
    Insulin: float = Field(
        ..., ge=0, le=1000,
        description="2-Hour serum insulin (mu U/ml)",
        json_schema_extra={"example": 80.0},
    )
    BMI: float = Field(
        ..., ge=0, le=80,
        description="Body mass index (kg/m²)",
        json_schema_extra={"example": 28.5},
    )
    DiabetesPedigreeFunction: float = Field(
        ..., ge=0.0, le=3.0,
        description="Diabetes pedigree function (genetic risk score)",
        json_schema_extra={"example": 0.5},
    )
    Age: int = Field(
        ..., ge=1, le=120,
        description="Age in years",
        json_schema_extra={"example": 35},
    )


class PredictionResponse(BaseModel):
    """Prediction result returned to the client."""
    model_config = {"protected_namespaces": ()}

    prediction: int = Field(..., description="0 = Non-Diabetic, 1 = Diabetic")
    probability: float = Field(..., description="Probability of diabetes (0-1)")
    risk_level: str = Field(..., description="Low / Moderate / High")
    label: str = Field(..., description="Human-readable label")
    patient_name: str | None = Field(default="Anonymous Patient", description="Full name of patient")
    patient_email: str | None = Field(default="", description="Patient email address")
    patient_data: dict[str, Any] = Field(..., description="Echo of input data")
    model_info: dict[str, Any] = Field(..., description="Model summary")


class PredictionHistoryItem(BaseModel):
    id: str
    timestamp: str
    patient_name: str | None = Field(default="Anonymous Patient", description="Full name of patient")
    patient_email: str | None = Field(default="", description="Patient email address")
    patient_data: dict[str, Any]
    prediction: int
    probability: float
    risk_level: str
    label: str


class ModelInfoResponse(BaseModel):
    """Full model metadata."""
    model_config = {"protected_namespaces": ()}

    model_name: str
    algorithm: str
    best_params: dict[str, Any]
    dataset: dict[str, Any]
    evaluation: dict[str, Any]
    baseline_comparison: list[dict[str, Any]]
    training_date: str
    preprocessing_steps: list[str]
    input_ranges: dict[str, Any]


class HealthResponse(BaseModel):
    model_config = {"protected_namespaces": ()}

    status: str
    model_loaded: bool
    timestamp: str
