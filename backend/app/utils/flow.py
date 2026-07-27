from dataclasses import dataclass,field
from typing import List,Optional
import time


@dataclass
class Flow:

    src_ip:str
    dst_ip:str
    src_port:int
    dst_port:int
    protocol:int

    start_time:float=field(default_factory=time.time)
    last_seen:float=field(default_factory=time.time)

    forward_packets:int=0
    backward_packets:int=0

    forward_bytes:float=0.0
    backward_bytes:float=0.0

    fwd_lengths:List[int]=field(default_factory=list)
    bwd_lengths:List[int]=field(default_factory=list)

    packet_lengths:List[int]=field(default_factory=list)

    fwd_iat:List[float]=field(default_factory=list)
    bwd_iat:List[float]=field(default_factory=list)

    last_fwd_time:Optional[float]=None
    last_bwd_time:Optional[float]=None

    syn_count:int=0
    fin_count:int=0
    rst_count:int=0
    ack_count:int=0
    psh_count:int=0

    def duration(self)->float:
        return max(self.last_seen-self.start_time,1e-6)

    def total_packets(self)->int:
        return self.forward_packets+self.backward_packets

    def total_bytes(self)->float:
        return self.forward_bytes+self.backward_bytes

    def reset(self):

        self.forward_packets=0
        self.backward_packets=0

        self.forward_bytes=0.0
        self.backward_bytes=0.0

        self.fwd_lengths.clear()
        self.bwd_lengths.clear()
        self.packet_lengths.clear()

        self.fwd_iat.clear()
        self.bwd_iat.clear()

        self.last_fwd_time=None
        self.last_bwd_time=None

        self.syn_count=0
        self.fin_count=0
        self.rst_count=0
        self.ack_count=0
        self.psh_count=0

        self.start_time=time.time()
        self.last_seen=self.start_time