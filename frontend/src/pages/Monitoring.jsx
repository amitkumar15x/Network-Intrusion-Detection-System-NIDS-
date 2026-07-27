import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Play,
  Square,
  Shield,
  Network,
  Terminal,
  Filter,
  Trash2,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

import api from "../services/api";

import "./Monitoring.css";

export default function Monitoring() {
  const { token } = useAuth();
  const socket = useSocket();

  const bottomRef = useRef(null);

  const [packets, setPackets] = useState([]);
  const [selectedPacket, setSelectedPacket] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [filter, setFilter] = useState("ALL");

  //----------------------------------------------------------
  // Load Current Capture Status
  //----------------------------------------------------------
  const loadStatus = async () => {
    try {
      const response = await api.get("/sniff/status");
      setCapturing(response.data.capturing);
    } catch (err) {
      console.error(err);
    }
  };

  //----------------------------------------------------------
  // Initial Load
  //----------------------------------------------------------
  useEffect(() => {
    loadStatus();
  }, []);

  //----------------------------------------------------------
  // Socket Packet Listener
  //----------------------------------------------------------
  useEffect(() => {
    if (!socket) return;

    const onPacket = (packet) => {
      setPackets((previous) => {
        const updated = [packet, ...previous];
        return updated.slice(0, 300);
      });
    };

    socket.subscribe("packet", onPacket);

    return () => {
      socket.unsubscribe("packet", onPacket);
    };
  }, [socket]);

  //----------------------------------------------------------
  // Auto Scroll
  //----------------------------------------------------------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [packets]);

  //----------------------------------------------------------
  // Start Capture
  //----------------------------------------------------------
  const startCapture = async () => {
    try {
      const response = await api.post("/sniff/start");
      if (response.data.success) {
        setCapturing(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  //----------------------------------------------------------
  // Stop Capture
  //----------------------------------------------------------
  const stopCapture = async () => {
    try {
      const response = await api.post("/sniff/stop");
      if (response.data.success) {
        setCapturing(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  //----------------------------------------------------------
  // Clear Packets
  //----------------------------------------------------------
  const clearPackets = () => {
    setPackets([]);
    setSelectedPacket(null);
  };

  //----------------------------------------------------------
  // Filtered Packets
  //----------------------------------------------------------
  const filteredPackets = useMemo(() => {
    if (filter === "ALL") return packets;
    return packets.filter((packet) => packet.protocol === filter);
  }, [packets, filter]);

  return (
    <div className="monitoring-view">
      {/* Header */}
      <div className="view-header">
        <div className="header-title">
          <h2>Live Packet Monitoring</h2>
          <p>Real-time Network Traffic Inspection</p>
        </div>

        <div className="header-controls">
          <div className="filter-group">
            <Filter className="filter-icon" size={16} />
            <select
              className="protocol-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">ALL</option>
              <option value="TCP">TCP</option>
              <option value="UDP">UDP</option>
              <option value="ICMP">ICMP</option>
            </select>
          </div>

          <button className="control-btn" onClick={clearPackets}>
            <Trash2 size={16} />
            Clear
          </button>

          {!capturing ? (
            <button className="control-btn start" onClick={startCapture}>
              <Play size={16} />
              Start Capture
            </button>
          ) : (
            <button className="control-btn stop" onClick={stopCapture}>
              <Square size={16} />
              Stop Capture
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="monitoring-grid">
        {/* Packet Stream */}
        <div className="console-pane">
          <div className="console-title">
            <Terminal size={16} />
            <span>Live Packet Stream</span>
            <span className={`status-tag ${capturing ? "active" : "idle"}`}>
              {capturing ? "CAPTURING" : "IDLE"}
            </span>
          </div>

          <div className="console-terminal">
            {filteredPackets.length === 0 ? (
              <div className="console-empty">
                <Network className="net-pulse" size={60} />
                <h3>No Packets Available</h3>
                <p>Start packet capture to monitor live traffic.</p>
              </div>
            ) : (
              <table className="terminal-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Protocol</th>
                    <th>Source</th>
                    <th>Destination</th>
                    <th>Bytes</th>
                    <th>Status</th>
                    <th>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPackets.map((packet, index) => (
                    <tr
                      key={packet.id ?? index}
                      className={`pkt-row ${
                        selectedPacket?.id === packet.id ? "selected" : ""
                      } ${packet.prediction === "Attack" ? "threat" : ""}`}
                      onClick={() => setSelectedPacket(packet)}
                    >
                      <td>
                        {new Date(packet.timestamp).toLocaleTimeString()}
                      </td>
                      <td>
                        <span className={`proto-tag ${packet.protocol.toLowerCase()}`}>
                          {packet.protocol}
                        </span>
                      </td>
                      <td>{packet.src_ip}</td>
                      <td>{packet.dst_ip}</td>
                      <td>{packet.length}</td>
                      <td>
                        <span
                          className={`class-tag ${
                            packet.prediction === "Attack" ? "mal" : "safe"
                          }`}
                        >
                          {packet.prediction}
                        </span>
                      </td>
                      <td>
                        {Number(packet.confidence).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div ref={bottomRef}></div>
          </div>
        </div>

        {/* Packet Inspector */}
        <div className="inspector-pane">
          <div className="inspector-title">
            <Shield size={16} />
            Packet Details
          </div>

          <div className="inspector-body">
            {!selectedPacket ? (
              <div className="inspector-empty">
                <div>
                  <Shield size={60} />
                  <h3>No Packet Selected</h3>
                  <p>Select a packet from the console to inspect it.</p>
                </div>
              </div>
            ) : (
              <div className="packet-card">
                {/* General Information */}
                <div className="card-section">
                  <h4>GENERAL</h4>
                  <div className="meta-pair">
                    <span>Timestamp</span>
                    <span>
                      {new Date(selectedPacket.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="meta-pair">
                    <span>Protocol</span>
                    <span>{selectedPacket.protocol}</span>
                  </div>
                  <div className="meta-pair">
                    <span>Packet Size</span>
                    <span>{selectedPacket.length} Bytes</span>
                  </div>
                </div>

                {/* Source */}
                <div className="card-section">
                  <h4>SOURCE</h4>
                  <div className="meta-pair">
                    <span>IP Address</span>
                    <span>{selectedPacket.src_ip}</span>
                  </div>
                  <div className="meta-pair">
                    <span>Port</span>
                    <span>{selectedPacket.src_port}</span>
                  </div>
                </div>

                {/* Destination */}
                <div className="card-section">
                  <h4>DESTINATION</h4>
                  <div className="meta-pair">
                    <span>IP Address</span>
                    <span>{selectedPacket.dst_ip}</span>
                  </div>
                  <div className="meta-pair">
                    <span>Port</span>
                    <span>{selectedPacket.dst_port}</span>
                  </div>
                </div>

                {/* Detection */}
                <div
                  className={`score-block ${
                    selectedPacket.prediction === "Attack" ? "threat" : "safe"
                  }`}
                >
                  <div className="meta-pair">
                    <span>Classification</span>
                    <span
                      className={
                        selectedPacket.prediction === "Attack"
                          ? "class-tag mal"
                          : "class-tag safe"
                      }
                    >
                      {selectedPacket.prediction}
                    </span>
                  </div>
                  <div className="meta-pair">
                    <span>Confidence</span>
                    <span>
                      {Number(selectedPacket.confidence).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}