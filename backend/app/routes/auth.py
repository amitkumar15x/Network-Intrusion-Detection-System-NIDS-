from flask import Blueprint, request, jsonify

from app.services.auth_service import AuthService
from app.utils.security import login_required, TokenManager

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json() or {}

    username = data.get("username", "").strip()
    password = data.get("password", "")

    if not username or not password:

        return jsonify({
            "status": "error",
            "message": "Username and password required"
        }), 400

    result = AuthService.authenticate(
        username,
        password
    )

    if result["success"]:

        return jsonify({
            "status": "success",
            "token": result["token"],
            "user": result["user"]
        }), 200

    return jsonify({
        "status": "error",
        "message": result["message"]
    }), 401


@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():

    return jsonify({
        "status": "success",
        "message": "Logged out successfully"
    }), 200


@auth_bp.route("/validate", methods=["GET"])
@login_required
def validate():

    return jsonify({
        "valid": True,
        "username": request.current_user
    }), 200