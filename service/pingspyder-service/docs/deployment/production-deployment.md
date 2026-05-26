# Production Deployment

## Overview

This document explains the production deployment process for PingSpyder Service.

The production stack includes:
- FastAPI
- Gunicorn
- Uvicorn Workers
- Nginx
- MongoDB

---

# Production Architecture

Nginx
↓
Gunicorn
↓
Uvicorn Workers
↓
FastAPI Application
↓
MongoDB

---

# Prerequisites

The following software must be installed on the server:

- Python 3.11+
- pip
- virtualenv
- Nginx
- Git

---

# Create Project Directory

```bash
mkdir -p /opt/pingspyder-service
```

---

# Clone Repository

```bash
git clone <repository-url>
```

---

# Navigate to Project

```bash
cd pingspyder-service
```

---

# Create Virtual Environment

```bash
python3 -m venv venv
```

---

# Activate Virtual Environment

```bash
source venv/bin/activate
```

---

# Install Dependencies

```bash
pip install -r requirements.txt
```

---

# Configure Environment Variables

Create `.env`

## Example

```env
MONGO_URI=your_mongodb_uri

ENV=production

LOG_LEVEL=INFO

APP_HOST=0.0.0.0

APP_PORT=8000

PING_TIMEOUT=2
```

---

# Start Application

## Gunicorn Production Command

```bash
gunicorn app.main:app \
-k uvicorn.workers.UvicornWorker \
--workers 4 \
--bind 0.0.0.0:8000
```

---

# Nginx Reverse Proxy

## Example Configuration

```nginx
server {

    listen 80;

    server_name localhost;

    location / {

        proxy_pass http://127.0.0.1:8000;

        proxy_set_header Host $host;

        proxy_set_header X-Real-IP $remote_addr;

        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

# Enable Nginx Configuration

```bash
sudo ln -s \
/etc/nginx/sites-available/pingspyder-service \
/etc/nginx/sites-enabled/
```

---

# Restart Nginx

```bash
sudo systemctl restart nginx
```

---

# Linux Service Management

## Reload Services

```bash
sudo systemctl daemon-reload
```

## Enable Service

```bash
sudo systemctl enable pingspyder-service
```

## Start Service

```bash
sudo systemctl start pingspyder-service
```

## Service Status

```bash
sudo systemctl status pingspyder-service
```

---

# Logs

## Application Logs

```text
logs/application.log
```

## Linux Service Logs

```bash
journalctl -u pingspyder-service -f
```

---

# Health Check

## Endpoint

```http
GET /api/v1/monitoring/health
```

## Example

```bash
curl http://localhost:8000/api/v1/monitoring/health
```

---

# Swagger Documentation

## Swagger UI

```text
http://localhost:8000/pingspyder-service/docs
```

## ReDoc

```text
http://localhost:8000/pingspyder-service/redoc
```

---

# Deployment Checklist

- Environment variables configured
- MongoDB connection verified
- Gunicorn running
- Nginx configured
- Logs verified
- Health check verified
- Swagger verified

---

# Recommended Production Stack

| Component | Technology |
|---|---|
| API Framework | FastAPI |
| Production Server | Gunicorn |
| Reverse Proxy | Nginx |
| Database | MongoDB |
| Process Manager | systemd |
| Logging | Python Logging |