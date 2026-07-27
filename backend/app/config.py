import os
from pathlib import Path


class Config:

    BASE_DIR = Path(__file__).resolve().parent.parent

    LOG_DIR = BASE_DIR / "logs"
    ML_DIR = BASE_DIR / "ml"
    MODEL_DIR = ML_DIR / "model"
    REPORT_DIR = BASE_DIR / "reports"

    LOG_DIR.mkdir(parents=True, exist_ok=True)
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    REPORT_DIR.mkdir(parents=True, exist_ok=True)

    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "7b9d750fb4e5c83214a1db3022194a2b9eb02075b22591"
    )

    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY",
        "c8d0e5fc57904ba6cf6a09ffdaef3ee2118dbb9ff27e1d"
    )

    DEFAULT_USER = os.getenv("DEFAULT_USER", "admin")
    DEFAULT_PASS = os.getenv("DEFAULT_PASS", "admin123")

    MODEL_PATH = MODEL_DIR / "intrusion_model.pkl"
    SCALER_PATH = MODEL_DIR / "scaler.pkl"

    PACKET_LIMIT = int(
        os.getenv("PACKET_LIMIT", 5000)
    )

    SESSION_TIMEOUT = int(
        os.getenv("SESSION_TIMEOUT", 1800)
    )

    HOST = os.getenv("HOST", "127.0.0.1")
    PORT = int(
        os.getenv("PORT", 5000)
    )

    DEBUG = os.getenv(
        "DEBUG",
        "True"
    ).lower() == "true"

    CORS_ORIGINS = [
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]