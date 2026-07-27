import os
import joblib
import numpy as np
import pandas as pd

from app.config import Config
from app.utils.logger import logger


class IntrusionPredictor:

    def __init__(self):
        self.model = None
        self.scaler = None
        self.feature_names = []
        self.load_models()

    def load_models(self):
        try:
            if not os.path.exists(Config.MODEL_PATH):
                logger.error(f"Model not found: {Config.MODEL_PATH}")
                return

            if not os.path.exists(Config.SCALER_PATH):
                logger.error(f"Scaler not found: {Config.SCALER_PATH}")
                return

            self.model = joblib.load(Config.MODEL_PATH)
            self.scaler = joblib.load(Config.SCALER_PATH)

            if hasattr(self.scaler, "feature_names_in_"):
                self.feature_names = list(self.scaler.feature_names_in_)
            else:
                feature_count = getattr(self.scaler, "n_features_in_", 20)
                self.feature_names = [
                    f"feature_{i}"
                    for i in range(feature_count)
                ]

            logger.info("Intrusion Detection Model Loaded Successfully")

        except Exception as e:
            logger.exception(e)
            self.model = None
            self.scaler = None

    def predict(self, feature_list):

        if self.model is None or self.scaler is None:
            return {
                "label": "Normal",
                "confidence": 0.0
            }

        try:

            expected = len(self.feature_names)

            if len(feature_list) != expected:
                raise ValueError(
                    f"Expected {expected} features but received {len(feature_list)}"
                )

            df = pd.DataFrame(
                [feature_list],
                columns=self.feature_names
            )

            scaled = self.scaler.transform(df)

            prediction = int(self.model.predict(scaled)[0])

            if hasattr(self.model, "predict_proba"):
                probability = self.model.predict_proba(scaled)[0]
                confidence = float(np.max(probability) * 100)
            else:
                confidence = 100.0

            return {
                "label": "Attack" if prediction == 1 else "Normal",
                "confidence": round(confidence, 2)
            }

        except Exception as e:
            logger.exception(e)

            return {
                "label": "Normal",
                "confidence": 0.0
            }