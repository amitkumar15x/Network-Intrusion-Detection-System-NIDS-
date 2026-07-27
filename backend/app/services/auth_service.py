from flask import current_app
from app.utils.security import TokenManager
from app.utils.logger import logger

class AuthService:
    @staticmethod
    def authenticate(username, password) -> dict:
        """Validates credentials and issues security token."""
        cfg = current_app.config
        
        if username == cfg["DEFAULT_USER"] and password == cfg["DEFAULT_PASS"]:
            logger.info(f"User {username} authenticated successfully.")
            token = TokenManager.generate_token(username, expiry_seconds=cfg["SESSION_TIMEOUT"])
            return {
                "success": True,
                "token": token,
                "user": {"username": username, "role": "Administrator"}
            }
        
        logger.warning(f"Failed login attempt for username: {username}")
        return {
            "success": False,
            "message": "Invalid username or password"
        }