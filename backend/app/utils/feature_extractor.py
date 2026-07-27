from scapy.all import IP, TCP, UDP, ICMP


class FeatureExtractor:
    """
    Extracts numerical features from captured packets.

    IMPORTANT:
    The returned feature order MUST match the order used during
    model training.
    """

    @staticmethod
    def extract_features(packet):

        features = []

        # ------------------------------------------------
        # Packet Length
        # ------------------------------------------------

        features.append(len(packet))

        # ------------------------------------------------
        # TTL
        # ------------------------------------------------

        if packet.haslayer(IP):
            features.append(packet[IP].ttl)
        else:
            features.append(0)

        # ------------------------------------------------
        # Protocol
        # ------------------------------------------------

        protocol = 0

        if packet.haslayer(TCP):
            protocol = 6

        elif packet.haslayer(UDP):
            protocol = 17

        elif packet.haslayer(ICMP):
            protocol = 1

        features.append(protocol)

        # ------------------------------------------------
        # Source Port
        # ------------------------------------------------

        if packet.haslayer(TCP):
            features.append(packet[TCP].sport)

        elif packet.haslayer(UDP):
            features.append(packet[UDP].sport)

        else:
            features.append(0)

        # ------------------------------------------------
        # Destination Port
        # ------------------------------------------------

        if packet.haslayer(TCP):
            features.append(packet[TCP].dport)

        elif packet.haslayer(UDP):
            features.append(packet[UDP].dport)

        else:
            features.append(0)

        # ------------------------------------------------
        # TCP Flags
        # ------------------------------------------------

        if packet.haslayer(TCP):
            features.append(int(packet[TCP].flags))
        else:
            features.append(0)

        # ------------------------------------------------
        # Payload Length
        # ------------------------------------------------

        payload = bytes(packet.payload)

        features.append(len(payload))

        # ------------------------------------------------
        # Header Length
        # ------------------------------------------------

        if packet.haslayer(IP):
            features.append(packet[IP].ihl)
        else:
            features.append(0)

        # ------------------------------------------------
        # Total Length
        # ------------------------------------------------

        if packet.haslayer(IP):
            features.append(packet[IP].len)
        else:
            features.append(len(packet))

        return features