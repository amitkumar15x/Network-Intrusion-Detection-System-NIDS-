from flask import Blueprint, jsonify, request
from app.services.monitor_service import MonitorService
from app.utils.security import login_required

monitor_bp = Blueprint("monitor", __name__)
monitor_service = MonitorService()

@monitor_bp.route("/start", methods=["POST"])
@login_required
def start_capture():
    data = request.get_json() or {}
    uac_confirmed = data.get("uac_confirmed", False)
    
    if not uac_confirmed:
        return jsonify({
            "status": "error", 
            "message": "Administrator permission required. Windows UAC confirmation missing."
        }), 403

    result = monitor_service.start_monitoring()
    return jsonify(result), 200

@monitor_bp.route("/stop", methods=["POST"])
@login_required
def stop_capture():
    result = monitor_service.stop_monitoring()
    return jsonify(result), 200

@monitor_bp.route("/status", methods=["GET"])
@login_required
def get_capture_status():
    status_data = monitor_service.get_status()
    return jsonify(status_data), 200