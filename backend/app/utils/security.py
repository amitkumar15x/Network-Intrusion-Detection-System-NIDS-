import time
import hmac
import hashlib
import base64
import json
from functools import wraps

from flask import request, jsonify, current_app

from app.utils.logger import logger


class TokenManager:

    @staticmethod
    def _b64_encode(data):
        return base64.urlsafe_b64encode(
            json.dumps(data, separators=(",", ":")).encode("utf-8")
        ).decode("utf-8").rstrip("=")

    @staticmethod
    def _b64_decode(data):
        padding = "=" * (-len(data) % 4)
        return json.loads(
            base64.urlsafe_b64decode(data + padding).decode("utf-8")
        )

    @staticmethod
    def generate_token(username, expiry_seconds=1800):

        header = {
            "alg": "HS256",
            "typ": "JWT"
        }

        payload = {
            "sub": username,
            "iat": int(time.time()),
            "exp": int(time.time()) + expiry_seconds
        }

        header_b64 = TokenManager._b64_encode(header)
        payload_b64 = TokenManager._b64_encode(payload)

        message = f"{header_b64}.{payload_b64}".encode()

        signature = hmac.new(
            current_app.config["JWT_SECRET_KEY"].encode(),
            message,
            hashlib.sha256
        ).digest()

        signature_b64 = base64.urlsafe_b64encode(
            signature
        ).decode().rstrip("=")

        return f"{header_b64}.{payload_b64}.{signature_b64}"

    @staticmethod
    def verify_token(token):

        try:

            parts = token.split(".")

            if len(parts) != 3:
                return {
                    "valid": False,
                    "reason": "Malformed token"
                }

            header_b64, payload_b64, signature_b64 = parts

            message = f"{header_b64}.{payload_b64}".encode()

            expected_signature = hmac.new(
                current_app.config["JWT_SECRET_KEY"].encode(),
                message,
                hashlib.sha256
            ).digest()

            expected_signature = base64.urlsafe_b64encode(
                expected_signature
            ).decode().rstrip("=")

            if not hmac.compare_digest(
                expected_signature,
                signature_b64
            ):
                return {
                    "valid": False,
                    "reason": "Invalid signature"
                }

            payload = TokenManager._b64_decode(payload_b64)

            if time.time() > payload["exp"]:
                return {
                    "valid": False,
                    "reason": "Token expired"
                }

            return {
                "valid": True,
                "username": payload["sub"]
            }

        except Exception as e:

            logger.exception(e)

            return {
                "valid": False,
                "reason": "Invalid token"
            }


def login_required(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        auth = request.headers.get("Authorization")

        if not auth:

            return jsonify({
                "status": "error",
                "message": "Authorization header missing"
            }), 401

        if not auth.startswith("Bearer "):

            return jsonify({
                "status": "error",
                "message": "Invalid authorization header"
            }), 401

        token = auth.split(" ", 1)[1]

        result = TokenManager.verify_token(token)

        if not result["valid"]:

            return jsonify({
                "status": "error",
                "message": result["reason"]
            }), 401

        request.current_user = result["username"]

        return function(*args, **kwargs)

    return wrapper