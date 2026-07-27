from flask import Blueprint, jsonify

from app.utils.security import login_required
from app.services.sniff_service import sniff_service

sniff_bp = Blueprint("sniff", __name__)


@sniff_bp.route("/status", methods=["GET"])
@login_required
def status():

    return jsonify(sniff_service.status())


@sniff_bp.route("/start", methods=["POST"])
@login_required
def start():

    sniff_service.start()

    return jsonify({
        "success": True
    })


@sniff_bp.route("/stop", methods=["POST"])
@login_required
def stop():

    sniff_service.stop()

    return jsonify({
        "success": True
    })