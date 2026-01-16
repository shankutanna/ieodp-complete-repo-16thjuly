# IEODP – Python Automation Service Runbook

---

## 1. Purpose

This service:
- Evaluates rules stored in DB
- Triggers async automation tasks
- Stores execution results
- Exposes REST API for Java & frontend

---

## 2. Prerequisites

- Python 3.10+
- MySQL 8+
- Redis
- Git

---

## 3. Project Structure

app/
├── api/          # API routes
├── services/     # Rule engine & orchestration
├── workers/      # Celery background tasks
├── models/       # DB models
├── schemas/      # API schemas
├── db/           # DB session & config

---

## 4. Environment Variables

Create `.env` file in root:

```env
DATABASE_URL=mysql+mysqldb://user:password@localhost/orchestration_db
CELERY_BROKER_URL=redis://localhost:6379/0

Database Setup
CREATE DATABASE orchestration_db;

Install Dependencies
python -m venv env
source env/bin/activate   # Windows: env\Scripts\activate
pip install -r requirements.txt

Run API Server
uvicorn app.main:app --reload
http://localhost:8000/docs
http://localhost:8000/api/v1/health
Run Celery Worker
celery -A app.workers.celery_app worker -l info