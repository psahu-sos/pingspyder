# Environment Variables

## Overview

PingSpyder Service uses environment variables for:
- database configuration
- application settings
- logging configuration
- performance tuning

Environment variables are stored inside the `.env` file.

---

# Environment File Location

```text
.env
```

---

# Example Configuration

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/

ENV=production

LOG_LEVEL=INFO

APP_HOST=0.0.0.0

APP_PORT=8000

MAX_WORKERS=256

PING_TIMEOUT=2
```

---

# Variable Descriptions

| Variable | Description |
|---|---|
| MONGO_URI | MongoDB connection string |
| ENV | Application environment |
| LOG_LEVEL | Application logging level |
| APP_HOST | Application host |
| APP_PORT | Application port |
| MAX_WORKERS | Concurrent ping workers |
| PING_TIMEOUT | ICMP timeout duration |

---

# Environment Types

| Environment | Purpose |
|---|---|
| development | Local development |
| testing | Testing environment |
| production | Production deployment |

---

# Logging Levels

Supported logging levels:
- DEBUG
- INFO
- WARNING
- ERROR
- CRITICAL

---

# Worker Configuration

## Example

```env
MAX_WORKERS=256
```

Worker configuration affects:
- monitoring speed
- concurrent execution
- infrastructure scalability

---

# Ping Timeout Configuration

## Example

```env
PING_TIMEOUT=2
```

Ping timeout affects:
- monitoring responsiveness
- timeout detection
- execution performance

---

# MongoDB Configuration

## Example

```env
MONGO_URI=your_mongodb_uri
```

The MongoDB URI is used for:
- monitoring data storage
- analytics queries
- inventory management

---

# Security Recommendations

- Do not commit `.env` files to Git
- Store secrets securely
- Use separate environment files for production
- Rotate database credentials periodically

---

# Recommended Git Ignore

Add to `.gitignore`

```gitignore
.env
```

---

# Environment Validation

Verify environment variables before application startup.

---

# Verify Configuration

## Linux

```bash
printenv
```

## Windows

```powershell
Get-ChildItem Env:
```

---

# Best Practices

- Keep production credentials secure
- Use separate production configurations
- Validate variables during deployment
- Monitor worker configuration
- Keep timeout values optimized