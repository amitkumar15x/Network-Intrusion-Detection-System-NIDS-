<div align="center">

# 🛡️ SecureTech — Network Intrusion Detection System (NIDS)

**A real-time, ML-powered network monitoring platform with a live security dashboard.**

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.x-000000?logo=flask&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white)
![Socket.IO](https://img.shields.io/badge/WebSocket-Socket.IO-black?logo=socketdotio&logoColor=white)
![Machine Learning](https://img.shields.io/badge/Machine-Learning-success)
![License](https://img.shields.io/badge/License-MIT-green)

[Overview](#-overview) •
[Features](#-features) •
[Architecture](#-architecture) •
[Installation](#-installation) •
[Usage](#-application-workflow) •
[Roadmap](#-roadmap)

</div>

---

## 📌 Overview

**SecureTech NIDS** is a full-stack, machine-learning powered network intrusion detection system that captures live network traffic, classifies packets as **Normal** or **Attack**, and visualizes the results through a modern, real-time security dashboard.

Unlike a basic packet sniffer, SecureTech combines several layers into one cohesive platform:

- 📡 Live packet capture
- 🧠 Machine learning classification
- 📊 Real-time dashboard visualization
- 🚨 Threat alerting
- 📈 Automated, exportable reports
- 🔐 JWT-based authentication
- 🎨 A modern, cyber-security-themed UI

Built on a **React + Flask + Scikit-learn + Socket.IO** architecture, the system streams predictions to the frontend as packets are captured, enabling security analysts to monitor network activity as it happens.

---

## ✨ Features

### 🔐 Authentication
- Secure login system
- JWT token-based authentication
- Protected API routes
- Session validation

### 📊 Dashboard
- Total, safe, and attack packet counts
- Live threat ratio
- Real-time packet statistics
- Recent alerts feed
- Network and protocol distribution overview

### 🌐 Live Monitoring
Real-time packet monitoring console with:
- Start / stop capture controls
- Live packet stream
- Protocol-based filtering
- Packet selection and inspection
- Per-packet ML prediction with confidence score

Each captured packet displays:
`Source IP` · `Destination IP` · `Ports` · `Protocol` · `Timestamp` · `Packet Size` · `ML Prediction` · `Confidence Score`

### 🚨 Threat Alerts
- Dedicated malicious-traffic feed
- Detailed attack logs with packet inspector
- Refresh / delete alerts
- Confidence scores and threat details

### 📈 Reports
Auto-generated session reports including:
- Session summary
- Total packets and attack ratio
- Protocol and threat distribution
- Traffic timeline
- Recent alerts
- CSV export

### ⚙️ Settings
- Configurable detection threshold
- Network interface & capture filter selection
- Auto-start capture
- Notification preferences (email, Slack, webhook)
- Theme selection
- Data retention window

---

## 🧠 Machine Learning

The detection engine classifies every captured packet as **Normal** or **Attack** using a trained Scikit-learn model, returning both a **prediction** and a **confidence score**. Results are propagated instantly across the Monitoring, Dashboard, Alerts, and Reports views via WebSocket.

---

## 🏗 Architecture

```
                         User
                          │
              React Frontend (Vite)
                          │
               Axios REST API Calls
                          │
           Flask Backend + Socket.IO
              │                    │
      Packet Capture         Authentication
              │
   Machine Learning Prediction
              │
          Packet Service
              │
   ┌──────────┼──────────┬──────────┐
Dashboard  Monitoring  Alerts    Reports
```

---

## 📂 Project Structure

```
Network-Intrusion-Detection/
├── backend/
│   ├── app/
│   │   ├── config.py
│   │   ├── __init__.py
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── dashboard.py
│   │   │   ├── monitor.py
│   │   │   ├── packets.py
│   │   │   ├── reports.py
│   │   │   ├── settings.py
│   │   │   └── sniff.py
│   │   ├── services/
│   │   │   ├── auth_service.py
│   │   │   ├── dashboard_service.py
│   │   │   ├── packet_service.py
│   │   │   ├── report_service.py
│   │   │   └── socket_service.py
│   │   ├── utils/
│   │   │   └── security.py
│   │   └── models/
│   ├── model/
│   │   └── model.pkl
│   ├── requirements.txt
│   └── app.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Monitoring.jsx
│   │   │   ├── Alerts.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Login.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── screenshots/
├── docs/
└── README.md
```

---

## 💻 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Axios, React Router DOM, Recharts, Socket.IO Client, Lucide React, CSS3 |
| **Backend** | Python 3.11, Flask, Flask-CORS, Flask-SocketIO, Eventlet/Threading, JWT Authentication |
| **Machine Learning** | Scikit-Learn, Pandas, NumPy, Joblib |
| **Network Analysis** | Scapy, Psutil |

---

## 📦 Dependencies

**Backend** (`backend/requirements.txt`)
```
Flask
Flask-Cors
Flask-SocketIO
PyJWT
Werkzeug
Scapy
Psutil
Pandas
NumPy
Scikit-Learn
Joblib
Eventlet
```

**Frontend** (`frontend/package.json`)
```
react
react-dom
react-router-dom
axios
lucide-react
recharts
socket.io-client
vite
```

---

## ⚙️ Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm

### Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv securetech
securetech\Scripts\activate        # Windows
source securetech/bin/activate     # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Run the backend
python app.py
```

Backend runs at: **http://127.0.0.1:5000**

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run the dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

> ⚠️ Live packet capture (via Scapy) may require administrator/root privileges depending on your OS.

---

## 🔄 Application Workflow

1. User logs in and receives a JWT token.
2. Monitoring page starts live packet capture.
3. Each packet is analyzed in real time.
4. The ML model predicts **Normal** or **Attack**, with a confidence score.
5. Results are stored via the Packet Service.
6. Dashboard, Alerts, and Reports update live via WebSocket.
7. User can export session data as a CSV report.

---

## 📸 Screenshots

Add screenshots to a `screenshots/` folder, then reference them below:

```markdown
## Dashboard
![Dashboard](screenshots/dashboard.png)

## Live Monitoring
![Monitoring](screenshots/monitoring.png)

## Threat Alerts
![Alerts](screenshots/alerts.png)
```

Suggested files: `login.png`, `dashboard.png`, `monitoring.png`, `alerts.png`, `reports.png`, `settings.png`

---

## 🔒 Security Features

- JWT-based authentication
- Protected API endpoints
- Route-level access control
- Real-time packet classification
- Confidence-scored threat detection
- Centralized alert repository
- Downloadable audit reports

---

## 🎯 Roadmap

- [ ] Background/continuous packet capture
- [ ] SQLite / PostgreSQL persistence layer
- [ ] Historical report archive
- [ ] Email alert integration
- [ ] Slack integration
- [ ] SIEM integration
- [ ] Docker deployment
- [ ] Kubernetes support
- [ ] Multi-user authentication & RBAC
- [ ] Dark / light theme toggle
- [ ] Cloud deployment templates

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](../../issues) or open a pull request.

---

## 📄 License ...

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Amit Kumar**
GitHub: [@amitkumar15x](https://github.com/amitkumar15x)

---

<div align="center">

### ⭐ If you find this project useful, consider giving it a star — it helps others discover it!

</div>
