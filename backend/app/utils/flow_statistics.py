import numpy as np


class FlowStatistics:

    @staticmethod
    def build(flow):

        fwd_lengths=np.asarray(flow.fwd_lengths,dtype=float)
        bwd_lengths=np.asarray(flow.bwd_lengths,dtype=float)
        packet_lengths=np.asarray(flow.packet_lengths,dtype=float)
        fwd_iat=np.asarray(flow.fwd_iat,dtype=float)

        if fwd_lengths.size==0:
            fwd_lengths=np.array([0.0])

        if bwd_lengths.size==0:
            bwd_lengths=np.array([0.0])

        if packet_lengths.size==0:
            packet_lengths=np.array([0.0])

        if fwd_iat.size==0:
            fwd_iat=np.array([0.0])

        duration=max(flow.duration(),1e-6)

        features={

            "Bwd Packet Length Std":float(np.std(bwd_lengths,ddof=1)) if bwd_lengths.size>1 else 0.0,

            "Bwd Packet Length Mean":float(np.mean(bwd_lengths)),

            "Avg Bwd Segment Size":float(np.mean(bwd_lengths)),

            "Packet Length Variance":float(np.var(packet_lengths)),

            "Bwd Packets Length Total":float(np.sum(bwd_lengths)),

            "Bwd Packet Length Max":float(np.max(bwd_lengths)),

            "Packet Length Std":float(np.std(packet_lengths,ddof=1)) if packet_lengths.size>1 else 0.0,

            "Subflow Bwd Bytes":float(flow.backward_bytes),

            "Fwd IAT Std":float(np.std(fwd_iat,ddof=1)) if fwd_iat.size>1 else 0.0,

            "Fwd Packets Length Total":float(np.sum(fwd_lengths)),

            "Avg Packet Size":float(np.mean(packet_lengths)),

            "Subflow Fwd Bytes":float(flow.forward_bytes),

            "Packet Length Mean":float(np.mean(packet_lengths)),

            "Packet Length Max":float(np.max(packet_lengths)),

            "Fwd Packet Length Std":float(np.std(fwd_lengths,ddof=1)) if fwd_lengths.size>1 else 0.0,

            "Fwd Act Data Packets":float(flow.forward_packets),

            "Fwd Packet Length Max":float(np.max(fwd_lengths)),

            "Flow IAT Max":float(np.max(fwd_iat)),

            "Flow Packets/s":float((flow.forward_packets+flow.backward_packets)/duration),

            "Total Fwd Packets":float(flow.forward_packets)

        }

        for key,value in features.items():

            if np.isnan(value) or np.isinf(value):
                features[key]=0.0

        return features