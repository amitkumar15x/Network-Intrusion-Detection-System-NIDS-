from flask import Blueprint,jsonify
from app.services.packet_service import packet_service
from app.utils.security import login_required

packets_bp=Blueprint("packets",__name__)

@packets_bp.route("/stats",methods=["GET"])
@login_required
def stats():
    return jsonify(packet_service.get_stats())

@packets_bp.route("/recent",methods=["GET"])
@login_required
def recent():
    return jsonify(packet_service.get_packets())

@packets_bp.route("/alerts",methods=["GET"])
@login_required
def alerts():
    return jsonify(packet_service.get_recent_alerts(50))

@packets_bp.route("/alerts",methods=["DELETE"])
@login_required
def clear_alerts():
    packet_service.clear_alerts()
    return jsonify({
        "success":True,
        "message":"Alerts cleared"
    })