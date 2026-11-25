"""API route definitions."""

from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from app.schemas.prediction import (
    HealthResponse,
    ModelInfoResponse,
    PatientData,
    PredictionHistoryItem,
    PredictionResponse,
)
from app.services.prediction_service import prediction_service

router = APIRouter(prefix="/api", tags=["Diabetes Prediction"])


# --------------------------------------------------------------------------
# Health
# --------------------------------------------------------------------------
@router.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        model_loaded=prediction_service.model_loaded,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


# --------------------------------------------------------------------------
# Model info
# --------------------------------------------------------------------------
@router.get("/model-info", response_model=ModelInfoResponse)
async def model_info():
    try:
        info = prediction_service.get_model_info()
        return ModelInfoResponse(**info)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))


# --------------------------------------------------------------------------
# Predict
# --------------------------------------------------------------------------
@router.post("/predict", response_model=PredictionResponse)
async def predict(patient: PatientData):
    try:
        result = prediction_service.predict(patient.model_dump())
        return PredictionResponse(**result)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}")


# --------------------------------------------------------------------------
# Prediction history
# --------------------------------------------------------------------------
@router.get("/prediction-history", response_model=list[PredictionHistoryItem])
async def get_prediction_history():
    return prediction_service.get_history()


@router.delete("/prediction-history/{item_id}")
async def delete_prediction(item_id: str):
    if prediction_service.delete_history_item(item_id):
        return {"detail": "Deleted"}
    raise HTTPException(status_code=404, detail="Prediction not found")
