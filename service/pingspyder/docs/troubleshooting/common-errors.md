# Common Errors

## Overview

This document contains common issues, error messages, and troubleshooting steps for PingSpyder Service.

---

# ModuleNotFoundError: No module named 'app'

## Error

```text
ModuleNotFoundError: No module named 'app'
```

## Cause

Application started from incorrect project directory.

## Solution

Navigate to the project root directory before starting the application.

## Example

```bash
cd pingspyder
```

Run:

```bash
uvicorn app.main:app --reload
```

---

# MongoDB Connection Error

## Error

```text
ServerSelectionTimeoutError
```

## Cause

- Invalid MongoDB URI
- Database unreachable
- Network issue

## Solution

Verify:
- MongoDB connection string
- internet connection
- database accessibility

Check `.env`

```env
MONGO_URI=your_mongodb_uri
```

---

# Port Already In Use

## Error

```text
Address already in use
```

## Cause

Another process is already using the configured port.

## Solution

Change application port.

## Example

```env
APP_PORT=8001
```

---

# Virtual Environment Activation Error

## Error

```text
ExecutionPolicy error
```

## Cause

Windows PowerShell execution policy restriction.

## Solution

Run:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

# Slow Monitoring Execution

## Cause

Low worker configuration or network latency.

## Solution

Use optimized worker configuration.

## Recommended

```python
MAX_WORKERS = min(256, CPU_COUNT * 32)
```

---

# Ping Timeout Issues

## Cause

- network latency
- unreachable devices
- firewall restrictions

## Solution

Increase ping timeout value.

## Example

```python
PING_TIMEOUT = 2
```

---

# Swagger Not Loading

## Cause

Application not running or incorrect URL.

## Solution

Verify application startup.

## Swagger URL

```text
http://localhost:8000/pingspyder/docs
```

---

# Missing Environment Variables

## Error

```text
MONGO_URI environment variable not found
```

## Cause

`.env` file missing or improperly configured.

## Solution

Create `.env`

## Example

```env
MONGO_URI=your_mongodb_uri
```

---

# Gunicorn Command Not Found

## Cause

Gunicorn not installed.

## Solution

Install Gunicorn.

```bash
pip install gunicorn
```

---

# MongoDB Query Performance Issues

## Cause

Missing indexes or large unoptimized queries.

## Solution

Verify MongoDB indexes.

Indexes used:
- TAG_ID
- status
- lastUpdated
- Stretch
- LOCATION

---

# Logging Issues

## Cause

Missing logs directory or permission issue.

## Solution

Create logs directory.

```bash
mkdir logs
```

---

# Health Check Failure

## Endpoint

```http
GET /api/v1/monitoring/health
```

## Cause

Application startup failure or server issue.

## Solution

Verify:
- application logs
- MongoDB connection
- service status
- server configuration

---

# Verify Logs

## Application Logs

```bash
tail -f logs/application.log
```

## Linux Service Logs

```bash
journalctl -u pingspyder -f
```

---

# Recommended Troubleshooting Steps

1. Verify virtual environment
2. Verify dependencies
3. Verify environment variables
4. Verify MongoDB connection
5. Verify logs
6. Verify API health endpoint
7. Verify server port