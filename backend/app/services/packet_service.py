from collections import deque
from datetime import datetime
from threading import Lock


class PacketService:

    def __init__(self):
        self.lock = Lock()
        self.max_packets = 5000
        self.packets = deque(maxlen=self.max_packets)
        self.alerts = deque(maxlen=1000)

    def add_packet(self, packet):
        with self.lock:

            packet["received_at"] = datetime.now().strftime("%H:%M:%S")

            self.packets.append(packet)

            if packet["prediction"] == "Attack":
                self.alerts.append(packet)

    def get_packets(self):
        with self.lock:
            return list(self.packets)

    def get_recent_packets(self, limit=100):
        with self.lock:
            return list(self.packets)[-limit:]

    def get_monitor_packets(self):
        with self.lock:
            return list(self.packets)

    def get_recent_alerts(self, limit=10):
        with self.lock:
            return list(self.alerts)[-limit:]

    def clear_alerts(self):
        with self.lock:
            self.alerts.clear()

    def clear(self):
        with self.lock:
            self.packets.clear()
            self.alerts.clear()

    def get_stats(self):
        with self.lock:

            total = len(self.packets)

            attack = sum(
                1
                for packet in self.packets
                if packet["prediction"] == "Attack"
            )

            normal = total - attack

            tcp = sum(
                1
                for packet in self.packets
                if packet["protocol"] == "TCP"
            )

            udp = sum(
                1
                for packet in self.packets
                if packet["protocol"] == "UDP"
            )

            icmp = sum(
                1
                for packet in self.packets
                if packet["protocol"] == "ICMP"
            )

            other = total - tcp - udp - icmp

            return {
                "total": total,
                "normal": normal,
                "anomalous": attack,
                "ratio": round((attack / total) * 100, 2) if total else 0,
                "protocols": {
                    "TCP": tcp,
                    "UDP": udp,
                    "ICMP": icmp,
                    "OTHER": other
                }
            }

    def get_chart_data(self):
        with self.lock:

            chart = []

            recent = list(self.packets)[-20:]

            for packet in recent:

                chart.append({
                    "time": packet["received_at"],
                    "normal": 1 if packet["prediction"] == "Normal" else 0,
                    "anomalous": 1 if packet["prediction"] == "Attack" else 0
                })

            return chart


packet_service = PacketService()