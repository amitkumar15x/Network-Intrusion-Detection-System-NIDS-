import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  ShieldCheck,
  ShieldAlert,
  Radio,
  Power,
  Terminal,
  Volume2,
  VolumeX,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

import api from "../services/api";

import UacModal from "../components/UacModal";
import LiveTrafficChart from "../components/LiveTrafficChart";

import "./Dashboard.css";

const Dashboard = () => {
  const { token } = useAuth();

  const socket = useSocket();

  const [stats, setStats] = useState({
    total: 0,
    normal: 0,
    anomalous: 0,
    ratio: 0,
    protocols: {
      TCP: 0,
      UDP: 0,
      ICMP: 0,
      OTHER: 0,
    },
  });

  const [chartHistory, setChartHistory] = useState([]);

  const [recentAlerts, setRecentAlerts] = useState([]);

  const [isCapturing, setIsCapturing] = useState(false);

  const [uacOpen, setUacOpen] = useState(false);

  const [soundEnabled, setSoundEnabled] = useState(true);

  //--------------------------------------------------
  // Initial Dashboard Loading
  //--------------------------------------------------

  useEffect(() => {
    loadDashboard();
    loadCaptureStatus();
    loadAlerts();
  }, []);

  //--------------------------------------------------
  // Socket Events
  //--------------------------------------------------

  useEffect(() => {
    if (!socket) return;

    const packetListener = (packet) => {
      updateStatistics(packet);

      if (packet.prediction === "Attack") {
        setRecentAlerts((prev) => {
          const updated = [packet, ...prev];
          return updated.slice(0, 5);
        });

        if (soundEnabled && window.speechSynthesis) {
          const speech = new SpeechSynthesisUtterance(
            "Warning. Intrusion detected."
          );

          speech.rate = 1;

          window.speechSynthesis.speak(speech);
        }
      }
    };

    socket.subscribe("packet", packetListener);

    return () => {
      socket.unsubscribe("packet", packetListener);
    };
  }, [socket, soundEnabled]);

  //--------------------------------------------------
  // API
  //--------------------------------------------------

  const loadDashboard = async () => {
    try {
      const response = await api.get("/dashboard");

      if (response.data) {
        setStats({
          total: response.data.total_packets,
          normal: response.data.normal_packets,
          anomalous: response.data.attack_packets,
          ratio: response.data.attack_ratio,
          protocols: response.data.protocols,
        });

        if (response.data.chart) {
          setChartHistory(response.data.chart);
        }

        if (response.data.recent_alerts) {
          setRecentAlerts(response.data.recent_alerts);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //--------------------------------------------------
  // Capture Status
  //--------------------------------------------------

  const loadCaptureStatus = async () => {
    try {
      const response = await api.get("/sniff/status");

      setIsCapturing(response.data.capturing);
    } catch (error) {
      console.log(error);
    }
  };

  //--------------------------------------------------
  // Alerts
  //--------------------------------------------------

  const loadAlerts = async () => {
    try {
      const response = await api.get(
        "/packets/alerts?limit=5"
      );

      setRecentAlerts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  //--------------------------------------------------
  // Statistics updater
  //--------------------------------------------------

  const updateStatistics = (packet) => {
    setStats((previous) => {
      const total = previous.total + 1;

      const normal =
        packet.prediction === "Normal"
          ? previous.normal + 1
          : previous.normal;

      const anomalous =
        packet.prediction === "Attack"
          ? previous.anomalous + 1
          : previous.anomalous;

      const ratio =
        total === 0
          ? 0
          : Number(
              ((anomalous / total) * 100).toFixed(2)
            );

      return {
        ...previous,
        total,
        normal,
        anomalous,
        ratio,
      };
    });

    const now = new Date().toLocaleTimeString();

    setChartHistory((previous) => {
      const updated = [
        ...previous,
        {
          time: now,
          normal:
            packet.prediction === "Normal"
              ? 1
              : 0,
          anomalous:
            packet.prediction === "Attack"
              ? 1
              : 0,
        },
      ];

      return updated.slice(-20);
    });
  };

  //--------------------------------------------------
  // Start Capture
  //--------------------------------------------------

  const startCapture = async () => {
    setUacOpen(false);

    try {
      const response = await api.post("/sniff/start");

      if (response.data.success) {
        setIsCapturing(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //--------------------------------------------------
  // Stop Capture
  //--------------------------------------------------

  const stopCapture = async () => {
    try {
      const response = await api.post("/sniff/stop");

      if (response.data.success) {
        setIsCapturing(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //--------------------------------------------------
  // Button
  //--------------------------------------------------

  const toggleCapture = () => {
    if (isCapturing) {
      stopCapture();
    } else {
      setUacOpen(true);
    }
  };
    return (
    <div className="dashboard-view">

      <div className="dashboard-action-row">

        <div className="view-title-block">
          <h2>SecureTech IDS Dashboard</h2>
          <p>Real-time Network Intrusion Detection Console</p>
        </div>

        <div className="action-buttons">

          <button
            className={`sound-toggle ${
              soundEnabled ? "enabled" : "disabled"
            }`}
            onClick={() =>
              setSoundEnabled(!soundEnabled)
            }
          >
            {soundEnabled ? (
              <Volume2 size={18} />
            ) : (
              <VolumeX size={18} />
            )}
          </button>

          <button
            className={`capture-toggle-btn ${
              isCapturing ? "running" : ""
            }`}
            onClick={toggleCapture}
          >
            <Power size={16} />

            {isCapturing
              ? "Stop Monitoring"
              : "Start Monitoring"}
          </button>

        </div>

      </div>

      <div className="metrics-grid">

        <div className="metric-card">

          <div className="metric-icon blue">
            <Radio size={20} />
          </div>

          <div className="metric-content">
            <span>Total Packets</span>
            <h2>{stats.total}</h2>
          </div>

        </div>

        <div className="metric-card">

          <div className="metric-icon green">
            <ShieldCheck size={20} />
          </div>

          <div className="metric-content">
            <span>Normal Traffic</span>
            <h2>{stats.normal}</h2>
          </div>

        </div>

        <div className="metric-card">

          <div className="metric-icon red">
            <ShieldAlert size={20} />
          </div>

          <div className="metric-content">
            <span>Attacks</span>
            <h2>{stats.anomalous}</h2>
          </div>

        </div>

        <div className="metric-card">

          <div className="metric-icon purple">
            <Terminal size={20} />
          </div>

          <div className="metric-content">
            <span>Attack Ratio</span>
            <h2>{stats.ratio}%</h2>
          </div>

        </div>

      </div>

      <div className="dashboard-main-grid">

        <div className="chart-section">

          <div className="section-header">
            <h3>Live Traffic</h3>
          </div>

          <LiveTrafficChart
            data={chartHistory}
          />

        </div>

        <div className="alerts-section">

          <div className="section-header">
            <h3>Recent Alerts</h3>
          </div>

          {recentAlerts.length === 0 ? (

            <div className="no-alerts">

              <ShieldCheck size={48} />

              <p>
                No attacks detected.
              </p>

            </div>

          ) : (

            <div className="alerts-list">

              {recentAlerts.map(
                (alert, index) => (

                  <div
                    key={
                      alert.id || index
                    }
                    className="alert-card"
                  >

                    <div className="alert-header">

                      <span className="attack-label">
                        ATTACK
                      </span>

                      <span>
                        {new Date(
                          alert.timestamp
                        ).toLocaleTimeString()}
                      </span>

                    </div>

                    <div className="alert-body">

                      <p>

                        <strong>
                          Source:
                        </strong>{" "}

                        {alert.src_ip}

                        :

                        {alert.src_port}

                      </p>

                      <p>

                        <strong>
                          Destination:
                        </strong>{" "}

                        {alert.dst_ip}

                        :

                        {alert.dst_port}

                      </p>

                      <p>

                        <strong>
                          Protocol:
                        </strong>{" "}

                        {alert.protocol}

                      </p>

                      <p>

                        <strong>
                          Confidence:
                        </strong>{" "}

                        {Number(
                          alert.confidence
                        ).toFixed(2)}
                        %

                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

      <UacModal
        isOpen={uacOpen}
        onClose={() =>
          setUacOpen(false)
        }
        onConfirm={startCapture}
      />

    </div>
  );
};

export default Dashboard;