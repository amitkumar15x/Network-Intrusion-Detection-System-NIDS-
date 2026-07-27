import React, { useEffect, useState } from "react";

import {
  Shield,
  Download,
  FileText,
  Activity,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import api from "../services/api";

import "./Reports.css";

const COLORS = [
  "#22d3ee",
  "#ef4444",
  "#8b5cf6",
  "#10b981",
];

export default function Reports() {

  const [report, setReport] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadReport();

  }, []);

  const loadReport = async () => {

    try {

      const response =
        await api.get("/reports/summary");

      setReport(response.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  const downloadCSV = async () => {

    try {

      const response =
        await api.get("/reports/download", {
          responseType: "blob",
        });

      const url =
        window.URL.createObjectURL(
          new Blob([response.data])
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "network_report.csv";

      link.click();

    } catch (err) {

      console.log(err);

    }

  };

  if (loading) {

    return (
      <div className="reports-loading">

        Loading Report...

      </div>
    );

  }
    const threatData = [
    {
      name: "Normal",
      value: report.normal_packets,
    },
    {
      name: "Attack",
      value: report.attack_packets,
    },
  ];

  const protocolData = Object.entries(
    report.protocol_distribution || {}
  ).map(([name, value]) => ({
    name,
    value,
  }));

  const timelineData =
    report.timeline || [];

  return (

    <div className="reports-page">

      {/* Header */}

      <div className="reports-header">

        <div>

          <h2>Security Reports</h2>

          <p>
            Generate and analyse network traffic reports
          </p>

        </div>

        <button
          className="download-btn"
          onClick={downloadCSV}
        >

          <Download size={18} />

          Download CSV

        </button>

      </div>

      {/* Statistics */}

      <div className="report-cards">

        <div className="report-card">

          <Activity size={28} />

          <div>

            <h4>Total Packets</h4>

            <h2>{report.total_packets}</h2>

          </div>

        </div>

        <div className="report-card">

          <CheckCircle size={28} />

          <div>

            <h4>Normal</h4>

            <h2>{report.normal_packets}</h2>

          </div>

        </div>

        <div className="report-card danger">

          <AlertTriangle size={28} />

          <div>

            <h4>Attacks</h4>

            <h2>{report.attack_packets}</h2>

          </div>

        </div>

        <div className="report-card">

          <Shield size={28} />

          <div>

            <h4>Threat Ratio</h4>

            <h2>

              {report.attack_ratio.toFixed(2)}%

            </h2>

          </div>

        </div>

      </div>

      {/* Charts */}

      <div className="charts-grid">

        <div className="chart-card">

          <h3>Threat Distribution</h3>

          <ResponsiveContainer
            width="100%"
            height={260}
          >

            <PieChart>

              <Pie
                data={threatData}
                dataKey="value"
                outerRadius={90}
                label
              >

                {threatData.map(
                  (entry, index) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[index]
                      }
                    />

                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

        <div className="chart-card">

          <h3>
            Protocol Distribution
          </h3>

          <ResponsiveContainer
            width="100%"
            height={260}
          >

            <PieChart>

              <Pie
                data={protocolData}
                dataKey="value"
                innerRadius={55}
                outerRadius={90}
                label
              >

                {protocolData.map(
                  (entry, index) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />

                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Timeline */}

      <div className="timeline-card">

        <h3>
          Traffic Activity Timeline
        </h3>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <AreaChart
            data={timelineData}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis dataKey="time" />

            <YAxis />

            <Tooltip />

            <Area
              dataKey="packets"
              stroke="#22d3ee"
              fill="#22d3ee33"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>
            {/* Bottom Section */}

      <div className="reports-bottom">

        {/* Session Summary */}

        <div className="summary-card">

          <h3>Session Summary</h3>

          <div className="summary-row">
            <span>Threat Level</span>
            <strong
              className={
                report.attack_packets > 0
                  ? "danger"
                  : "safe"
              }
            >
              {report.attack_packets > 0
                ? "Threat Detected"
                : "Safe"}
            </strong>
          </div>

          <div className="summary-row">
            <span>Total Packets</span>
            <strong>{report.total_packets}</strong>
          </div>

          <div className="summary-row">
            <span>Normal Packets</span>
            <strong>{report.normal_packets}</strong>
          </div>

          <div className="summary-row">
            <span>Attack Packets</span>
            <strong>{report.attack_packets}</strong>
          </div>

          <div className="summary-row">
            <span>Threat Ratio</span>
            <strong>
              {report.attack_ratio.toFixed(2)}%
            </strong>
          </div>

        </div>

        {/* Recent Alerts */}

        <div className="alerts-card">

          <h3>Recent Alerts</h3>

          {report.recent_alerts &&
          report.recent_alerts.length > 0 ? (

            <table className="alerts-table">

              <thead>

                <tr>

                  <th>Time</th>

                  <th>Source</th>

                  <th>Destination</th>

                  <th>Protocol</th>

                  <th>Confidence</th>

                </tr>

              </thead>

              <tbody>

                {report.recent_alerts.map(
                  (alert, index) => (

                    <tr key={index}>

                      <td>
                        {new Date(
                          alert.timestamp
                        ).toLocaleTimeString()}
                      </td>

                      <td>{alert.src_ip}</td>

                      <td>{alert.dst_ip}</td>

                      <td>{alert.protocol}</td>

                      <td>
                        {Number(
                          alert.confidence
                        ).toFixed(2)}
                        %
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          ) : (

            <div className="no-alerts">

              <Shield size={60} />

              <h4>No Alerts Detected</h4>

              <p>
                No suspicious traffic has been
                detected during this session.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}