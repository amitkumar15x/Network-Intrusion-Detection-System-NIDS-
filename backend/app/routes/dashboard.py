from flask import Blueprint,jsonify
import psutil

from app.services.monitor_service import monitor_service
from app.services.packet_service import packet_service
from app.utils.security import login_required

dashboard_bp=Blueprint("dashboard",__name__)

@dashboard_bp.route("/",methods=["GET"])
@login_required
def dashboard():

    stats=packet_service.get_stats()

    chart=packet_service.get_chart_data()

    alerts=packet_service.get_recent_alerts(5)

    ratio=stats["ratio"]

    if ratio==0:
        threat_level="Safe"
    elif ratio<5:
        threat_level="Low"
    elif ratio<20:
        threat_level="Guarded"
    elif ratio<50:
        threat_level="Elevated"
    else:
        threat_level="Severe"

    return jsonify({
        "cpu_usage":round(psutil.cpu_percent(interval=0.1),1),
        "memory_usage":round(psutil.virtual_memory().percent,1),
        "monitoring_status":monitor_service.get_status()["status"],
        "total_packets":stats["total"],
        "normal_packets":stats["normal"],
        "attack_packets":stats["anomalous"],
        "attack_ratio":stats["ratio"],
        "threat_level":threat_level,
        "protocols":stats["protocols"],
        "recent_alerts":alerts,
        "chart":chart
    })