import time
from threading import Lock

from app.utils.flow import Flow


class FlowTracker:

    FLOW_TIMEOUT = 5

    def __init__(self):
        self.flows = {}
        self.lock = Lock()

    def _make_key(self, packet):

        ip = packet["IP"]

        protocol = ip.proto

        src_ip = ip.src
        dst_ip = ip.dst

        src_port = 0
        dst_port = 0

        if packet.haslayer("TCP"):
            src_port = packet["TCP"].sport
            dst_port = packet["TCP"].dport

        elif packet.haslayer("UDP"):
            src_port = packet["UDP"].sport
            dst_port = packet["UDP"].dport

        forward = (
            src_ip,
            dst_ip,
            src_port,
            dst_port,
            protocol
        )

        reverse = (
            dst_ip,
            src_ip,
            dst_port,
            src_port,
            protocol
        )

        if reverse in self.flows:
            return reverse

        return forward

    def get_flow(self, packet):

        with self.lock:

            key = self._make_key(packet)

            if key not in self.flows:

                self.flows[key] = Flow(
                    src_ip=key[0],
                    dst_ip=key[1],
                    src_port=key[2],
                    dst_port=key[3],
                    protocol=key[4]
                )

            flow = self.flows[key]

            flow.last_seen = time.time()

            return flow

    def get_completed_flows(self):

        with self.lock:

            now = time.time()

            completed = []

            expired = []

            for key, flow in self.flows.items():

                if now - flow.last_seen >= self.FLOW_TIMEOUT:

                    completed.append(flow)

                    expired.append(key)

            for key in expired:

                del self.flows[key]

            return completed

    def clear(self):

        with self.lock:

            self.flows.clear()


flow_tracker = FlowTracker()