import csv
import io
from collections import defaultdict
from datetime import datetime

from app.services.packet_service import packet_service


class ReportService:

    @staticmethod
    def generate_summary():
        packets = packet_service.get_monitor_packets()

        total_packets = len(packets)

        attack_packets = len([
            packet for packet in packets
            if packet.get("prediction") == "Attack"
        ])

        normal_packets = total_packets - attack_packets

        attack_ratio = (
            (attack_packets / total_packets) * 100
            if total_packets > 0
            else 0
        )

        protocol_distribution = defaultdict(int)

        for packet in packets:
            protocol = packet.get("protocol", "OTHER")
            protocol_distribution[protocol] += 1

        recent_alerts = sorted(
            [
                packet
                for packet in packets
                if packet.get("prediction") == "Attack"
            ],
            key=lambda x: x.get("timestamp", ""),
            reverse=True,
        )[:10]

        timeline_map = defaultdict(int)

        for packet in packets:
            timestamp = packet.get("timestamp")

            if not timestamp:
                continue

            try:
                if isinstance(timestamp, str):
                    dt = datetime.fromisoformat(
                        timestamp.replace("Z", "")
                    )
                else:
                    dt = timestamp

                label = dt.strftime("%H:%M")
                timeline_map[label] += 1

            except Exception:
                continue

        timeline = [
            {
                "time": key,
                "packets": value
            }
            for key, value in sorted(timeline_map.items())
        ]

        return {
            "total_packets": total_packets,
            "normal_packets": normal_packets,
            "attack_packets": attack_packets,
            "attack_ratio": attack_ratio,
            "protocol_distribution": dict(protocol_distribution),
            "recent_alerts": recent_alerts,
            "timeline": timeline
        }

    @staticmethod
    def generate_csv_report():

        packets = packet_service.get_monitor_packets()

        output = io.StringIO()

        writer = csv.writer(output)

        writer.writerow([
            "ID",
            "Timestamp",
            "Source IP",
            "Source Port",
            "Destination IP",
            "Destination Port",
            "Protocol",
            "Packet Size",
            "Prediction",
            "Confidence (%)"
        ])

        for packet in packets:

            writer.writerow([
                packet.get("id", ""),
                packet.get("timestamp", ""),
                packet.get("src_ip", ""),
                packet.get("src_port", ""),
                packet.get("dst_ip", ""),
                packet.get("dst_port", ""),
                packet.get("protocol", ""),
                packet.get("length", ""),
                packet.get("prediction", ""),
                packet.get("confidence", "")
            ])

        return output.getvalue()