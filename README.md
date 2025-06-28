# 📝 Internal Feedback Sharing Tool

A simple, secure, and structured platform for ongoing feedback between managers and employees.

---

## 🚀 Overview

This application allows team managers to provide regular feedback to their employees, track performance trends, and maintain a history of interactions. Employees can view, acknowledge, and respond to the feedback in a secure and focused environment.

---

## ✅ Core Features (MVP)

### 🔐 Authentication & Roles
- Two roles: `Manager` and `Employee`
- Login-based access
- Managers can only view their direct team members

### ✍️ Feedback Submission
- Managers can submit multiple feedback entries for team members
- Feedback includes:
  - Strengths
  - Areas to Improve
  - Sentiment (`Positive` / `Neutral` / `Negative`)

### 👀 Feedback Visibility
- Employees can only see feedback they’ve received
- Managers can update feedback
- Employees can acknowledge feedback once seen

### 📊 Dashboards
- **Manager Dashboard**: View feedback history, count, and sentiment trends for the team
- **Employee Dashboard**: Feedback timeline and sentiment view

---
## ⚙️ Tech Stack

| Layer     | Technology        |
|-----------|-------------------|
| Frontend  | React + Vite      |
| Backend   | Flask (Python)    |
| Database  | PostgreSQL        |
| Auth      | JWT-based         |
| Styling   | Tailwind CSS      |
| Container | Docker            |

---

## 📦 Getting Started

### 🔧 Backend Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/internal-feedback-app.git
   cd internal-feedback-app/backend
docker build -t feedback-backend .
docker run -p 5000:5000 --env-file .env feedback-backend


python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py

## 🐳 Docker Setup

### 📦 Prerequisites

- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Ensure Docker Engine is running
- Free ports `5000` (backend) and `5433` (PostgreSQL)

---

### 🚀 Run the App (Backend + PostgreSQL)

```bash
docker-compose up --build
