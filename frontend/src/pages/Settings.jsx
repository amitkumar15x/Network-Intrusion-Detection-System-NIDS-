import React, { useState, useEffect } from "react";
import { Cpu, Bell, Palette, Save, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { SettingsAPI } from "../services/api";
import "./Settings.css";

const Settings = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    threshold: 70,
    interface: "default",
    capture_filter: "",
    auto_start: false,
    alert_sound: true,
    desktop_notifications: true,
    themeMode: "cyberpunk-dark",
    webhookUrl: "",
    enableEmail: false,
    slackNotifications: false,
    retentionDays: 30
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await SettingsAPI.get();
      const data = res.data;

      setSettings(prev => ({
        ...prev,
        threshold: data.confidence_threshold ?? 70,
        interface: data.interface ?? "default",
        capture_filter: data.capture_filter ?? "",
        auto_start: data.auto_start ?? false,
        alert_sound: data.alert_sound ?? true,
        desktop_notifications: data.desktop_notifications ?? true,
        themeMode: data.themeMode ?? "cyberpunk-dark",
        webhookUrl: data.webhookUrl ?? "",
        enableEmail: data.enableEmail ?? false,
        slackNotifications: data.slackNotifications ?? false,
        retentionDays: data.retentionDays ?? 30
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const saveSettings = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      await SettingsAPI.save({
        interface: settings.interface,
        auto_start: settings.auto_start,
        capture_filter: settings.capture_filter,
        confidence_threshold: Number(settings.threshold),
        alert_sound: settings.alert_sound,
        desktop_notifications: settings.desktop_notifications,
        themeMode: settings.themeMode,
        webhookUrl: settings.webhookUrl,
        enableEmail: settings.enableEmail,
        slackNotifications: settings.slackNotifications,
        retentionDays: Number(settings.retentionDays)
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = () => {
    setSettings({
      threshold: 70,
      interface: "default",
      capture_filter: "",
      auto_start: false,
      alert_sound: true,
      desktop_notifications: true,
      themeMode: "cyberpunk-dark",
      webhookUrl: "",
      enableEmail: false,
      slackNotifications: false,
      retentionDays: 30
    });
  };

  return (
    <div className="settings-view">
      <div className="settings-header">
        <h2>Security Console Configuration</h2>
        <p>Configure packet inspection behaviour and notification settings.</p>
      </div>

      {saved && (
        <div className="settings-toast">
          <ShieldCheck size={18} />
          <span>Settings Saved Successfully</span>
        </div>
      )}

      <form className="settings-form" onSubmit={saveSettings}>
        <div className="settings-grid">
          <div className="settings-card">
            <div className="card-title">
              <Cpu size={18} />
              <span>Detection Engine</span>
            </div>
            <div className="card-body">
              <label>Confidence Threshold</label>
              <div className="slider-wrapper">
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="1"
                  name="threshold"
                  value={settings.threshold}
                  onChange={handleChange}
                />
                <span>{settings.threshold}%</span>
              </div>

              <label>Network Interface</label>
              <select
                className="settings-input"
                name="interface"
                value={settings.interface}
                onChange={handleChange}
              >
                <option value="default">Default Interface</option>
                <option value="Ethernet">Ethernet</option>
                <option value="Wi-Fi">Wi-Fi</option>
              </select>

              <label>Capture Filter</label>
              <input
                className="settings-input"
                name="capture_filter"
                value={settings.capture_filter}
                onChange={handleChange}
                placeholder="tcp or udp"
              />

              <label>Auto Start Monitoring</label>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="auto_start"
                  checked={settings.auto_start}
                  onChange={handleChange}
                />
                <span>Automatically start monitoring after login</span>
              </label>
            </div>
          </div>

          <div className="settings-card">
            <div className="card-title">
              <Bell size={18} />
              <span>Notifications</span>
            </div>
            <div className="card-body">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="alert_sound"
                  checked={settings.alert_sound}
                  onChange={handleChange}
                />
                <span>Play Alert Sound</span>
              </label>

              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="desktop_notifications"
                  checked={settings.desktop_notifications}
                  onChange={handleChange}
                />
                <span>Desktop Notifications</span>
              </label>

              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="enableEmail"
                  checked={settings.enableEmail}
                  onChange={handleChange}
                />
                <span>Email Notifications</span>
              </label>

              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="slackNotifications"
                  checked={settings.slackNotifications}
                  onChange={handleChange}
                />
                <span>Slack Notifications</span>
              </label>

              <label>Webhook URL</label>
              <input
                className="settings-input"
                name="webhookUrl"
                value={settings.webhookUrl}
                onChange={handleChange}
                placeholder="https://hooks.slack.com/..."
              />

              <label>Retention Days</label>
              <select
                className="settings-input"
                name="retentionDays"
                value={settings.retentionDays}
                onChange={handleChange}
              >
                <option value={7}>7 Days</option>
                <option value={30}>30 Days</option>
                <option value={90}>90 Days</option>
                <option value={365}>365 Days</option>
              </select>
            </div>
          </div>

          <div className="settings-card full-width">
            <div className="card-title">
              <Palette size={18} />
              <span>Appearance</span>
            </div>
            <div className="card-body">
              <div className="theme-selectors">
                <div
                  className={`theme-chip ${settings.themeMode === "cyberpunk-dark" ? "active" : ""}`}
                  onClick={() => setSettings(prev => ({ ...prev, themeMode: "cyberpunk-dark" }))}
                >
                  <div className="chip-preview dark"></div>
                  <span>Cyberpunk Dark</span>
                </div>

                <div
                  className={`theme-chip ${settings.themeMode === "monochrome-terminal" ? "active" : ""}`}
                  onClick={() => setSettings(prev => ({ ...prev, themeMode: "monochrome-terminal" }))}
                >
                  <div className="chip-preview terminal"></div>
                  <span>Matrix Green</span>
                </div>

                <div
                  className={`theme-chip ${settings.themeMode === "stealth-grey" ? "active" : ""}`}
                  onClick={() => setSettings(prev => ({ ...prev, themeMode: "stealth-grey" }))}
                >
                  <div className="chip-preview stealth"></div>
                  <span>Stealth Grey</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button type="submit" className="save-btn" disabled={loading}>
            <Save size={18} />
            <span>{loading ? "Saving..." : "Save Settings"}</span>
          </button>
          
          <button type="button" className="reset-btn" onClick={resetSettings}>
            <span>Restore Defaults</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;