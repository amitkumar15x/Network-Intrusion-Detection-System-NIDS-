from app.utils.packet_capture import packet_sniffer


class SniffService:

    def start(self):
        packet_sniffer.start()

        return {
            "success": True,
            "capturing": True
        }

    def stop(self):
        packet_sniffer.stop()

        return {
            "success": True,
            "capturing": False
        }

    def status(self):
        return {
            "capturing": packet_sniffer.running,
            "packets": len(packet_sniffer.session_packets)
        }


sniff_service = SniffService()