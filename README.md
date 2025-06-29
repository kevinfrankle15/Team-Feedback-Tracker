# 📝 Internal Feedback Sharing Tool

A simple, secure, and structured platform for ongoing feedback between managers and employees.

---

## 🚀 Overview

This application enables team managers to provide structured feedback to employees, track team sentiment, and maintain a performance history. Employees can view, acknowledge, and learn from the feedback shared with them — all in a focused, secure environment.

---

## ✅ Core Features

- 🔐 **Authentication & Roles**  
  Two roles: Manager and Employee with JWT-based login. Managers can only access their team’s feedback.

- ✍️ **Feedback Submission**  
  Managers can submit multiple feedback entries including:
  - Strengths
  - Areas to Improve
  - Sentiment (`Positive`, `Neutral`, `Negative`)

- 👀 **Feedback Visibility**  
  Employees can view only their received feedback. They can acknowledge it once seen. Managers can edit feedback.

- 📊 **Dashboards**  
  - **Manager Dashboard**: Feedback history, count, sentiment trends  
  - **Employee Dashboard**: Feedback timeline and breakdown

---

## ⚙️ Tech Stack

| Layer     | Technology                         |
|-----------|-------------------------------------|
| Frontend  | React + Vite, Tailwind CSS, ShadCN UI |
| Backend   | Flask (Python)                      |
| Database  | PostgreSQL                          |
| Auth      | JWT-based authentication            |
| DevOps    | Docker, Docker Compose              |

---

## 📐 Design Decisions

- **Role-based access** using JWT to restrict manager vs. employee capabilities.
- **Modular backend** using Flask Blueprints (`auth`, `feedback`, `team`) for clean separation.
- **PostgreSQL** used for structured feedback records and team-user relationships.
- **Dockerized backend** to simplify setup across environments.
- **AI-assisted backend development**: Used ChatGPT for clean architecture, resolving errors, and rapid feature iteration.

---

## 📦 Getting Started

### 🔧 Manual Setup (Backend)

```bash
# 1. Clone the repository
git clone https://github.com/your-username/internal-feedback-app.git
cd internal-feedback-app/backend

# 2. Set up virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the backend server
python app.py
Backend will be available at: http://localhost:5000
```
###  🐳 Docker Setup (Backend + PostgreSQL)
## 📋 Prerequisites

Install Docker Desktop

Ensure Docker Engine is running

Free ports:

5000 → Flask backend

5433 → PostgreSQL (mapped from container's 5432)

### 🚀 Run via Docker Compose

cd backend
docker-compose up --build
Backend API: http://localhost:5000/api

PostgreSQL: localhost:5433

### 🐳 Dockerfile (Backend)
dockerfile

FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
### 🧪 Demo Credentials (Seed Data)
Manager: sarah@company.com / password

Employees: mike@company.com, john@company.com / password

## 🤖 Built With AI Support

This project was developed with the help of a **lovable AI assistant – ChatGPT**, which contributed to both backend and frontend development:

- ✅ Backend planning and modularization  
- 🛠️ Error resolution and bug fixing  
- 🐳 Docker configuration and optimization  
- ⚡ Fast-tracking API development and feature building  
- 🎨 Frontend scaffolding, component logic, and UI ideas

