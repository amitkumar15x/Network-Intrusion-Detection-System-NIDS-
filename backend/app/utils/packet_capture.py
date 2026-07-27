import threading
import time

from scapy.all import sniff, IP, TCP, UDP, ICMP

from app.utils.predictor import IntrusionPredictor
from app.utils.logger import logger
from app.utils.flow_tracker import flow_tracker
from app.utils.flow_statistics import FlowStatistics
from app.utils.feature_builder import FeatureBuilder

from app.services.packet_service import packet_service
from app.services.socket_service import SocketService


class PacketSniffer:

    def __init__(self):
        self.predictor = IntrusionPredictor()
        self.running = False
        self.thread = None
        self.session_packets = []

    def _protocol_name(self, flow):
        protocol_map = {
            6: "TCP",
            17: "UDP",
            1: "ICMP",
        }
        return protocol_map.get(getattr(flow, "protocol", 0), "OTHER")

    def _emit_completed_flow(self, flow):
        try:
            feature_dict = FlowStatistics.build(flow)
            features = FeatureBuilder.build(feature_dict)
            prediction = self.predictor.predict(features)

            packet_info = {
                "id": int(time.time() * 1000),
                "timestamp": int(time.time() * 1000),
                "src_ip": flow.src_ip,
                "dst_ip": flow.dst_ip,
                "src_port": flow.src_port,
                "dst_port": flow.dst_port,
                "protocol": self._protocol_name(flow),
                "length": int(getattr(flow, "forward_bytes", 0) + getattr(flow, "backward_bytes", 0)),
                "prediction": prediction["label"],
                "confidence": prediction["confidence"],
            }

            self.session_packets.append(packet_info)
            packet_service.add_packet(packet_info)
            SocketService.emit_packet(packet_info)

            if prediction["label"] == "Attack":
                SocketService.emit_alert(packet_info)

        except Exception as e:
            logger.exception(e)

    def _process_completed_flows(self):
        completed_flows = flow_tracker.get_completed_flows()

        for flow in completed_flows:
            self._emit_completed_flow(flow)

    def process_packet(self, packet):

        if not self.running:
            return

        try:

            if not packet.haslayer(IP):
                return

            ip = packet[IP]
            flow = flow_tracker.get_flow(packet)

            packet_length = len(packet)
            now = time.time()

            flow.last_seen = now

            is_forward = (
                ip.src == flow.src_ip and
                ip.dst == flow.dst_ip
            )

            if is_forward:
                flow.forward_packets += 1
                flow.forward_bytes += packet_length
                flow.fwd_lengths.append(packet_length)

                if flow.last_fwd_time is not None:
                    flow.fwd_iat.append(now - flow.last_fwd_time)

                flow.last_fwd_time = now

            else:
                flow.backward_packets += 1
                flow.backward_bytes += packet_length
                flow.bwd_lengths.append(packet_length)

                if flow.last_bwd_time is not None:
                    flow.bwd_iat.append(now - flow.last_bwd_time)

                flow.last_bwd_time = now

            flow.packet_lengths.append(packet_length)

            if packet.haslayer(TCP):
                flags = int(packet[TCP].flags)

                if flags & 0x02:
                    flow.syn_count += 1

                if flags & 0x01:
                    flow.fin_count += 1

                if flags & 0x04:
                    flow.rst_count += 1

                if flags & 0x10:
                    flow.ack_count += 1

                if flags & 0x08:
                    flow.psh_count += 1

        except Exception as e:
            logger.exception(e)

    def capture_loop(self):
        logger.info("Packet Capture Started")

        while self.running:
            try:
                sniff(
                    prn=self.process_packet,
                    store=False,
                    timeout=2
                )
                self._process_completed_flows()
            except Exception as e:
                logger.exception(e)

        self._process_completed_flows()
        logger.info("Packet Capture Stopped")

    def start(self):
        if self.running:
            return

        self.running = True
        self.session_packets = []

        self.thread = threading.Thread(
            target=self.capture_loop,
            daemon=True
        )
        self.thread.start()

        logger.info("Background Sniffer Thread Started")

    def stop(self):
        self.running = False

        if self.thread:
            self.thread.join(timeout=3)

        logger.info("Sniffer Stopped")


packet_sniffer = PacketSniffer()