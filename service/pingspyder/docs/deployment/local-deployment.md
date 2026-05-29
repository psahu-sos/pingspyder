# PingSpyder Windows Deployment Guide

**Date:** 27 May 2026

---

# 1. Objective

Configure and validate a complete Windows-based production deployment for the **PingSpyder FastAPI Monitoring Service** using:

* FastAPI
* Uvicorn
* Nginx
* NSSM
* Windows Services

---

# 2. Final Deployment Architecture

```text
Browser
   ↓
Nginx :80
   ↓
FastAPI Windows Service (NSSM)
   ↓
MongoDB
```

---

# 3. Initial Development Architecture

```text
React :5173
        ↓
Spring Boot :8080
        ↓
FastAPI :8000
```

---

# 4. Project Location

```text
D:\SOS Infotech\pingspyder\service\pingspyder
```

---

# 5. Problem 1 — Broken Virtual Environment

## Error

```text
Fatal error in launcher:
Unable to create process using old python.exe path
```

## Root Cause

The project directory was renamed:

```text
SOS Technical
→
SOS Infotech
```

The existing `.venv` still referenced the old Python executable path.

## Resolution

### Remove Existing Virtual Environment

```powershell
service/.venv
```

### Create New Virtual Environment

```powershell
py -3.13 -m venv .venv
```

### Activate Environment

```powershell
.\.venv\Scripts\Activate.ps1
```

### Install Dependencies

```powershell
python -m pip install -r requirements.txt
```

---

# 6. FastAPI Runtime Validation

## Uvicorn Startup Command

```powershell
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Swagger Validation URL

```text
http://localhost:8000/pingspyder/docs
```

Result:

* Swagger loaded successfully.

---

# 7. Production Startup Script Creation

## PowerShell Script — `run-production.ps1`

```powershell
cd $PSScriptRoot

..\ .venv\Scripts\Activate.ps1

python -m uvicorn app.main:app `
--host 0.0.0.0 `
--port 8000 `
--workers 4
```

---

## Batch Script — `start-server.bat`

```bat
@echo off

cd /d %~dp0

call ..\.venv\Scripts\activate

python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

# 8. Independent Runtime Validation

## Validation Steps

* Closed VS Code completely
* Started application using batch file
* Opened Swagger URL

## Result

* FastAPI started successfully
* Application worked independently from IDE

---

# 9. Problem 2 — Port 8000 Conflict

## Error

```text
WinError 10013
```

## Root Cause

Port `8000` was already occupied by another Uvicorn process.

## Resolution

### Check Active Process

```powershell
netstat -ano | findstr :8000
```

### Kill Conflicting Process

```powershell
taskkill /PID <PID> /F
```

Result:

* FastAPI restarted successfully.

---

# 10. Nginx Reverse Proxy Setup

## Objective

Simulate enterprise-grade reverse proxy deployment locally.

---

## Nginx Installation

Installed Nginx at:

```text
D:\nginx-1.30.2
```

---

## Initial Reverse Proxy Configuration

```nginx
proxy_pass http://127.0.0.1:8000;
```

---

# 11. Problem 3 — Invalid Nginx Configuration

## Error

```text
"events" directive is not allowed here
```

## Root Cause

The `events {}` block was incorrectly nested inside another configuration section.

## Resolution

Replaced the entire `nginx.conf` with a valid configuration.

---

# 12. Final Nginx Configuration

```nginx
worker_processes 1;

events {
    worker_connections 1024;
}

http {

    include mime.types;

    default_type application/octet-stream;

    sendfile on;

    keepalive_timeout 65;

    server {

        listen 80;

        server_name localhost;

        location / {

            proxy_pass http://127.0.0.1:8000;

            proxy_set_header Host $host;

            proxy_set_header X-Real-IP $remote_addr;

            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

---

# 13. Nginx Startup

## Start Nginx

```powershell
D:
cd nginx-1.30.2
nginx.exe
```

---

# 14. Nginx Validation

## Swagger URL

```text
http://localhost/pingspyder/docs
```

Result:

* Swagger loaded successfully through Nginx reverse proxy.

---

# 15. Reverse Proxy Architecture

```text
Browser
   ↓
Nginx :80
   ↓
FastAPI :8000
```

---

# 16. Problem 4 — Spring Boot Port Conflict

## Error

```text
Port 8080 already in use
```

## Root Cause

Nginx was previously configured to use port `8080`, which conflicted with Spring Boot.

## Resolution

### Stop Nginx Processes

```powershell
taskkill /IM nginx.exe /F
```

### Verify Shutdown

```powershell
tasklist | findstr nginx
```

Result:

* No active Nginx processes remained.

---

# 17. NSSM Windows Service Deployment

## Objective

Run FastAPI as a permanent Windows Service.

---

## NSSM Installation

Installed NSSM at:

```text
D:\nssm
```

---

## Service Creation

### Open NSSM UI

```powershell
D:
cd nssm\win64

nssm install PingSpyderFastAPI
```

---

# 18. NSSM Service Configuration

| Configuration     | Value                                                            |
| ----------------- | ---------------------------------------------------------------- |
| Path              | `D:\SOS Infotech\pingspyder\service\.venv\Scripts\python.exe`    |
| Startup Directory | `D:\SOS Infotech\pingspyder\service\pingspyder`          |
| Arguments         | `-m uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4` |

---

# 19. Problem 5 — NSSM Service Not Starting

## Issue

Swagger URL failed after installing the service.

## Root Cause

* FastAPI service was not running correctly
* Nginx was not started
* Runtime validation was incomplete

## Resolution

### Check Service Status

```powershell
nssm status PingSpyderFastAPI
```

### Restart Service

```powershell
nssm restart PingSpyderFastAPI
```

### Restart Nginx

```powershell
nginx.exe
```

Result:

* Swagger loaded successfully.

---

# 20. Final NSSM Validation

Validated successfully using:

```text
http://localhost/pingspyder/docs
```

The application worked successfully **without**:

* VS Code
* Terminal
* Batch file
* Manual Uvicorn execution

---

# 21. Final Windows Deployment Flow

## Start FastAPI Service

```powershell
nssm start PingSpyderFastAPI
```

---

## Start Nginx

```powershell
D:
cd nginx-1.30.2
nginx.exe
```

---

## Open Swagger

```text
http://localhost/pingspyder/docs
```

---

## Stop FastAPI Service

```powershell
nssm stop PingSpyderFastAPI
```

---

## Stop Nginx

```powershell
taskkill /IM nginx.exe /F
```

---

# 22. Final Deployment Architecture

```text
Browser
   ↓
Nginx :80
   ↓
FastAPI Windows Service (NSSM)
   ↓
MongoDB
```

---

# 23. Final Validation Status

| Component                   | Status  |
| --------------------------- | ------- |
| FastAPI Runtime             | SUCCESS |
| Uvicorn Workers             | SUCCESS |
| MongoDB Integration         | SUCCESS |
| Swagger                     | SUCCESS |
| Logging                     | SUCCESS |
| Batch Startup               | SUCCESS |
| PowerShell Startup          | SUCCESS |
| Nginx Reverse Proxy         | SUCCESS |
| Portless Routing            | SUCCESS |
| NSSM Windows Service        | SUCCESS |
| Windows Service Startup     | SUCCESS |
| Local Production Simulation | SUCCESS |

---

# 24. Final Conclusion

The PingSpyder FastAPI service was successfully deployed locally on Windows using an enterprise-style production architecture including:

* FastAPI
* Uvicorn
* Nginx reverse proxy
* NSSM Windows services
* Portless localhost routing
* Production-style startup management

The deployment was fully validated and confirmed to operate independently from the development environment.
