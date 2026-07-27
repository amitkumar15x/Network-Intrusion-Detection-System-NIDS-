from flask import Blueprint,request,jsonify
from app.utils.security import login_required

settings_bp=Blueprint("settings",__name__)

settings={
    "threshold":0.85,
    "webhookUrl":"",
    "enableEmail":False,
    "slackNotifications":False,
    "retentionDays":30,
    "themeMode":"cyberpunk-dark",
    "interface":"default",
    "auto_start":False,
    "capture_filter":"",
    "confidence_threshold":70,
    "alert_sound":True,
    "desktop_notifications":True
}

@settings_bp.route("",methods=["GET"])
@login_required
def get_settings():
    return jsonify(settings)

@settings_bp.route("/",methods=["GET"])
@login_required
def get_settings_slash():
    return jsonify(settings)

@settings_bp.route("",methods=["POST"])
@login_required
def update_settings():
    data=request.get_json() or {}
    settings.update({
        "threshold":data.get("threshold",settings["threshold"]),
        "webhookUrl":data.get("webhookUrl",settings["webhookUrl"]),
        "enableEmail":data.get("enableEmail",settings["enableEmail"]),
        "slackNotifications":data.get("slackNotifications",settings["slackNotifications"]),
        "retentionDays":data.get("retentionDays",settings["retentionDays"]),
        "themeMode":data.get("themeMode",settings["themeMode"])
    })
    return jsonify({
        "success":True,
        "message":"Settings updated successfully",
        "settings":settings
    })

@settings_bp.route("/",methods=["POST"])
@login_required
def update_settings_slash():
    return update_settings()