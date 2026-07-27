import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  NavLink,
  useLocation,
} from "react-router-dom";

import {
  Shield,
  LayoutDashboard,
  Activity,
  AlertTriangle,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Monitoring from "./pages/Monitoring";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/Settings";

import "./App.css";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="global-loader">
        <Shield size={50} />
        <p>Loading Secure Console...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function Sidebar() {
  const { logout, user } = useAuth();

  const menu = [
    { path: "/dashboard", title: "Dashboard", icon: LayoutDashboard },
    { path: "/monitoring", title: "Monitoring", icon: Activity },
    { path: "/alerts", title: "Alerts", icon: AlertTriangle },
    { path: "/reports", title: "Reports", icon: FileText },
    { path: "/settings", title: "Settings", icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Shield className="brand-logo" size={34} />

        <div className="brand-text">
          <h1>SecureTech IDS</h1>
          <span>INTRUSION DETECTION SYSTEM</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <Icon size={18} />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            {user?.username?.charAt(0)?.toUpperCase() || "A"}
          </div>

          <div className="user-info">
            <span className="user-name">
              {user?.username || "Administrator"}
            </span>

            <span className="user-role">
              ADMINISTRATOR
            </span>
          </div>
        </div>

        <button className="logout-btn" onClick={logout}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}

function Layout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content-wrapper">
        <header className="top-bar">
          <div className="status-indicator">
            <div className="status-dot pulsing"></div>
            <span>SECURE CONNECTION</span>
          </div>
          <div className="top-bar-stats">
            <strong>SecureTech IDS</strong>
          </div>
        </header>

        <main className="content-viewport">
          {children}
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/monitoring"
        element={
          <ProtectedRoute>
            <Layout>
              <Monitoring />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/alerts"
        element={
          <ProtectedRoute>
            <Layout>
              <Alerts />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Layout>
              <Reports />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <AppRoutes />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}