import React, { useState, useEffect } from 'react';
import { Shield, Bell, Network, Server } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Topbar.css';

const Topbar = ({ socketConnected }) => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="branding-node">
          <Shield className="brand-logo" size={24} />
          <span className="brand-name">SENTRY <span className="brand-sub font-mono">IO</span></span>
        </div>
      </div>

      <div className="topbar-right">
        {/* Real-time Status Indicators */}
        <div className="system-indicator">
          <Server className="indicator-icon" size={16} />
          <span className="indicator-label font-mono">NODE: LOCALHOST</span>
        </div>

        <div className={`status-badge ${socketConnected ? 'online' : 'offline'}`}>
          <Network size={14} />
          <span className="font-mono">{socketConnected ? 'STREAM_ACTIVE' : 'DISCONNECTED'}</span>
        </div>

        <div className="clock-container font-mono">
          {currentTime.toLocaleTimeString()}
        </div>

        <div className="user-profile">
          <div className="avatar">A</div>
          <div className="user-info">
            <span className="user-name">{user?.username || 'Admin'}</span>
            <span className="user-role">{user?.role || 'SecOps Agent'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;