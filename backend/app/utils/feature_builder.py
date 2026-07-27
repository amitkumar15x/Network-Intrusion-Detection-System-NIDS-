FEATURE_ORDER = [
    "Bwd Packet Length Std",
    "Bwd Packet Length Mean",
    "Avg Bwd Segment Size",
    "Packet Length Variance",
    "Bwd Packets Length Total",
    "Bwd Packet Length Max",
    "Packet Length Std",
    "Subflow Bwd Bytes",
    "Fwd IAT Std",
    "Fwd Packets Length Total",
    "Avg Packet Size",
    "Subflow Fwd Bytes",
    "Packet Length Mean",
    "Packet Length Max",
    "Fwd Packet Length Std",
    "Fwd Act Data Packets",
    "Fwd Packet Length Max",
    "Flow IAT Max",
    "Flow Packets/s",
    "Total Fwd Packets",
]


class FeatureBuilder:

    @staticmethod
    def build(feature_dict):
        return [
            float(feature_dict.get(feature, 0.0))
            for feature in FEATURE_ORDER
        ]