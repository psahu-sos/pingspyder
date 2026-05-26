# Local Setup

## Overview

This document explains how to set up and run the PingSpyder Service locally for development and testing.

---

# Prerequisites

The following software must be installed:

- Python 3.11+
- MongoDB
- Git
- VS Code (Recommended)

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
python -m venv .venv
```

---

# Activate Virtual Environment

## Windows

```powershell
.\.venv\Scripts\activate
```

## Linux

```bash
source .venv/bin/activate
```

---

# Install Dependencies

```bash
pip install -r requirements.txt
```

---

# Configure Environment Variables

Create a `.env` file in the project root directory.

## Example

```env
MONGO_URI=your_mongodb_uri

ENV=development

LOG_LEVEL=INFO

APP_HOST=0.0.0.0

APP_PORT=8000

PING_TIMEOUT=2
```

---

# Run Application

## Development Mode

```bash
uvicorn app.main:app --reload
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

# Project Structure

```text
app/
├── config/
├── core/
├── db/
├── repositories/
├── routes/
├── services/
├── utils/
```

---

# Logs

Application logs are stored inside:

```text
logs/application.log
```

---

# Health Check

## Endpoint

```http
GET /api/v1/monitoring/health
```

## Sample Response

```json
{
  "success": true,
  "message": "PingSpyder Running"
}
```

---

# Common Commands

## Freeze Dependencies

```bash
pip freeze > requirements.txt
```

## Deactivate Virtual Environment

```bash
deactivate
```

---

# Troubleshooting

| Issue | Solution |
|---|---|
| ModuleNotFoundError | Verify project root directory |
| Mongo connection issue | Verify MONGO_URI |
| Permission error | Activate virtual environment |
| Port already in use | Change APP_PORT |