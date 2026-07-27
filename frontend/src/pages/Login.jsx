import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  User,
  Lock,
  AlertCircle,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import BorderGlow from "../components/BorderGlow";
import Background from "../components/Background";

import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!username.trim()) {
      setError("Please enter username.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter password.");
      return;
    }

    setLoading(true);

    const result = await login(username, password);

    setLoading(false);

    if (result.success) {
      navigate("/dashboard", {
        replace: true,
      });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-viewport">
      <Background />

      <motion.div
        className="login-container"
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
      >
        <BorderGlow
          borderRadius={18}
          glowColor="139,92,246"
          glowRadius={180}
          glowIntensity={0.9}
        >
          <div className="login-card">

            <div className="login-header">

              <div className="shield-icon-wrapper">
                <Shield
                  size={38}
                  className="logo-glow"
                />
              </div>

              <h2>SecureTech IDS</h2>

              <p>
                Network Intrusion Detection System
              </p>

            </div>

            {error && (
              <div className="login-error-banner">

                <AlertCircle size={16} />

                <span>{error}</span>

              </div>
            )}

            <form
              className="login-form"
              onSubmit={handleSubmit}
            >

              <div className="form-group">

                <label>Username</label>

                <div className="input-icon-wrapper">

                  <User
                    size={16}
                    className="field-icon"
                  />

                  <input
                    type="text"
                    value={username}
                    placeholder="Administrator"
                    autoComplete="username"
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                  />

                </div>

              </div>

              <div className="form-group">

                <label>Password</label>

                <div className="input-icon-wrapper">

                  <Lock
                    size={16}
                    className="field-icon"
                  />

                  <input
                    type="password"
                    value={password}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                  />

                </div>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="login-submit-btn"
              >
                {loading
                  ? "Authenticating..."
                  : "Login"}
              </button>

            </form>

            <div className="login-footer">
              <small>
                Default Username:
                <strong> admin </strong>
              </small>

              <small>
                Default Password:
                <strong> admin123 </strong>
              </small>
            </div>

          </div>
        </BorderGlow>
      </motion.div>
    </div>
  );
}