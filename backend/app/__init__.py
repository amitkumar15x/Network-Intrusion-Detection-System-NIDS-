from flask import Flask,jsonify
from flask_cors import CORS
from flask_socketio import SocketIO

from app.config import Config

socketio=SocketIO(
    cors_allowed_origins="*",
    async_mode="threading",
    logger=False,
    engineio_logger=False
)


def create_app():

    app=Flask(__name__)

    app.config.from_object(Config)

    app.config["JSON_AS_ASCII"]=False

    CORS(
        app,
        supports_credentials=True,
        origins=[
            "http://localhost:5173",
            "http://127.0.0.1:5173"
        ]
    )

    socketio.init_app(app)

    from app.services.socket_service import SocketService
    SocketService.init_app(socketio)

    from app.routes.auth import auth_bp
    from app.routes.monitor import monitor_bp
    from app.routes.dashboard import dashboard_bp
    from app.routes.reports import report_bp
    from app.routes.settings import settings_bp
    from app.routes.sniff import sniff_bp
    from app.routes.packets import packets_bp

    app.register_blueprint(auth_bp,url_prefix="/api/auth")
    app.register_blueprint(monitor_bp,url_prefix="/api/monitor")
    app.register_blueprint(dashboard_bp,url_prefix="/api/dashboard")
    app.register_blueprint(report_bp,url_prefix="/api/reports")
    app.register_blueprint(settings_bp,url_prefix="/api")
    app.register_blueprint(sniff_bp,url_prefix="/api/sniff")
    app.register_blueprint(packets_bp,url_prefix="/api/packets")

    @app.route("/")
    def index():
        return jsonify({
            "application":"SecureTech NIDS",
            "status":"Running",
            "version":"1.0.0"
        })

    @app.route("/health")
    def health():
        return jsonify({
            "status":"healthy"
        })

    return app