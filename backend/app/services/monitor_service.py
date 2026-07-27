import threading

from app.utils.packet_capture import packet_sniffer
from app.utils.logger import logger
from app.services.packet_service import packet_service


class MonitorService:

    _instance = None
    _lock = threading.Lock()

    def __new__(cls):

        with cls._lock:

            if cls._instance is None:

                cls._instance = super().__new__(cls)
                cls._instance.status = "Stopped"

            return cls._instance

    # ----------------------------------------------------
    # Start Monitoring
    # ----------------------------------------------------

    def start_monitoring(self):

        with self._lock:

            if self.status == "Running":

                return {
                    "status": "success",
                    "message": "Already Running"
                }

            packet_sniffer.start()

            self.status = "Running"

            logger.info("Monitoring Started")

            return {
                "status": "success",
                "message": "Monitoring Started"
            }

    # ----------------------------------------------------
    # Stop Monitoring
    # ----------------------------------------------------

    def stop_monitoring(self):

        with self._lock:

            if self.status == "Stopped":

                return {
                    "status": "success",
                    "message": "Already Stopped"
                }

            packet_sniffer.stop()

            self.status = "Stopped"

            logger.info("Monitoring Stopped")

            return {
                "status": "success",
                "message": "Monitoring Stopped"
            }

    # ----------------------------------------------------
    # Status
    # ----------------------------------------------------

    def get_status(self):

        stats = packet_service.get_stats()

        return {
            "status": self.status,
            "packets_captured": stats["total"]
        }

    # ----------------------------------------------------
    # Current Packets
    # ----------------------------------------------------

    def get_current_packets(self, limit=100):

        return packet_service.get_recent_packets(limit)


monitor_service = MonitorService()