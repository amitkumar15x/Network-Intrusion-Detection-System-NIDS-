from app.utils.logger import logger
from app.services.packet_service import packet_service


class SocketService:

    socketio=None

    connected_clients=0

    @classmethod
    def init_app(cls,socketio):

        cls.socketio=socketio

        @socketio.on("connect")
        def handle_connect():

            cls.connected_clients+=1

            logger.info(f"Client Connected ({cls.connected_clients})")

            socketio.emit(
                "connection_ack",
                {
                    "status":"connected",
                    "clients":cls.connected_clients,
                    "message":"Connected to SecureNet IDS"
                }
            )

            socketio.emit(
                "metrics_update",
                {
                    "active_conns":cls.connected_clients,
                    "threat_alerts_count":len(packet_service.get_recent_alerts(1000))
                }
            )

        @socketio.on("disconnect")
        def handle_disconnect():

            cls.connected_clients=max(cls.connected_clients-1,0)

            logger.info(f"Client Disconnected ({cls.connected_clients})")

            socketio.emit(
                "metrics_update",
                {
                    "active_conns":cls.connected_clients,
                    "threat_alerts_count":len(packet_service.get_recent_alerts(1000))
                }
            )

    @classmethod
    def emit(cls,event,data):
        try:
            if cls.socketio:
                cls.socketio.emit(event,data)
        except Exception as e:
            logger.error(f"Socket Error : {e}")

    @classmethod
    def emit_packet(cls,packet):

        cls.emit("packet",packet)

        stats=packet_service.get_stats()

        cls.emit(
            "telemetry_update",
            {
                "total":stats["total"],
                "normal":stats["normal"],
                "anomalous":stats["anomalous"],
                "ratio":stats["ratio"]
            }
        )

        cls.emit(
            "metrics_update",
            {
                "active_conns":cls.connected_clients,
                "threat_alerts_count":len(packet_service.get_recent_alerts(1000))
            }
        )

    @classmethod
    def emit_alert(cls,packet):

        cls.emit("alert",packet)

        cls.emit("intrusion_alert",packet)

        cls.emit(
            "metrics_update",
            {
                "active_conns":cls.connected_clients,
                "threat_alerts_count":len(packet_service.get_recent_alerts(1000))
            }
        )

    @classmethod
    def emit_dashboard(cls,dashboard):
        cls.emit("dashboard",dashboard)

    @classmethod
    def emit_status(cls,status):
        cls.emit("status_change",status)

    @classmethod
    def emit_log(cls,log):
        cls.emit("log",log)


socket_service=SocketService()