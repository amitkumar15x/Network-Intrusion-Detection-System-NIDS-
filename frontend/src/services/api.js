import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  timeout: 10000,
});

// Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("nids_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==============================
// Authentication
// ==============================

export const AuthAPI = {
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  validate: () => api.get("/auth/validate"),
};

// ==============================
// Dashboard
// ==============================

export const DashboardAPI = {
  getDashboard: () => api.get("/dashboard/"),
};

// ==============================
// Packets / Alerts
// ==============================

export const PacketsAPI = {
  getStats: () => api.get("/packets/stats"),
  getAlerts: (limit = 10) =>
    api.get(`/packets/alerts?limit=${limit}`),
  clearAlerts: () => api.delete("/packets/alerts"),
};

// ==============================
// Sniffer
// ==============================

export const SniffAPI = {
  status: () => api.get("/sniff/status"),
  start: () => api.post("/sniff/start"),
  stop: () => api.post("/sniff/stop"),
};

// ==============================
// Monitoring
// ==============================

export const MonitorAPI = {
  status: () => api.get("/monitor/status"),
  start: (uac_confirmed = true) =>
    api.post("/monitor/start", {
      uac_confirmed,
    }),
  stop: () => api.post("/monitor/stop"),
};

// ==============================
// Reports
// ==============================

export const ReportsAPI = {
  summary: () => api.get("/reports/summary"),

  download: () =>
    api.get("/reports/download", {
      responseType: "blob",
    }),
};

// ==============================
// Settings
// ==============================

export const SettingsAPI = {
  get: () => api.get("/settings"),
  save: (data) => api.post("/settings", data),
};

export default api;