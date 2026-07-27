import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import './LiveTrafficChart.css';

const LiveTrafficChart = ({ data }) => {
  // Safe parsing fallback to prevent empty chart breaks
  const chartData = data && data.length > 0 ? data : Array.from({ length: 10 }, (_, i) => ({
    time: new Date(Date.now() - (10 - i) * 2000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    normal: 0,
    anomalous: 0
  }));

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Real-Time Traffic Throughput</h3>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-dot normal-dot" />
            <span>Normal Traffic</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot anomalous-dot" />
            <span>Anomalous Traffic</span>
          </div>
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="normalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="anomalousGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-danger)" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="var(--color-danger)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="var(--text-muted)" 
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="var(--text-muted)" 
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(17, 24, 39, 0.95)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}
              labelStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey="normal" 
              stroke="var(--accent-cyan)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#normalGrad)" 
            />
            <Area 
              type="monotone" 
              dataKey="anomalous" 
              stroke="var(--color-danger)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#anomalousGrad)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LiveTrafficChart;