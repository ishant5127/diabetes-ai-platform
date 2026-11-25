"""Application configuration."""

import os
from pathlib import Path


class Settings:
    APP_NAME: str = "Diabetes Prediction API"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = (
        "ML-powered API for diabetes risk prediction "
        "using the Pima Indians Diabetes Dataset."
    )

    # Paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent  # backend/
    MODEL_PATH: Path = Path(os.getenv("MODEL_PATH", str(BASE_DIR / "models" / "diabetes_pipeline.joblib")))
    METADATA_PATH: Path = Path(os.getenv("METADATA_PATH", str(BASE_DIR / "models" / "model_metadata.json")))
    HISTORY_PATH: Path = Path(os.getenv("HISTORY_PATH", str(BASE_DIR / "models" / "prediction_history.json")))
    
    # Optional static assets directory (for single-container/monolithic deployments)
    _default_static = BASE_DIR / "static"
    if not _default_static.exists():
        _default_static = BASE_DIR.parent / "frontend" / "dist"
    STATIC_DIR: Path | None = Path(os.getenv("STATIC_DIR", str(_default_static)))

    # CORS configuration — supports wildcard or comma-separated origins via env
    _cors_env: str = os.getenv("CORS_ORIGINS", "*")
    if _cors_env.strip() == "*":
        CORS_ORIGINS: list[str] = ["*"]
    else:
        CORS_ORIGINS: list[str] = [
            origin.strip()
            for origin in _cors_env.split(",")
            if origin.strip()
        ]


settings = Settings()
