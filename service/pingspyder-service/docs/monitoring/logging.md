# Logging Architecture

## Overview

PingSpyder Service uses centralized logging for:
- request tracking
- error monitoring
- debugging
- analytics tracing
- production monitoring

The application uses Python logging with module-level loggers.

---

# Logging Levels

| Level | Purpose |
|---|---|
| DEBUG | Internal debugging information |
| INFO | Normal application flow |
| WARNING | Recoverable issues |
| ERROR | Application errors |
| CRITICAL | Critical system failures |

---

# Logger Configuration

Logging is configured using:
- centralized logger utility
- module-level loggers
- formatted log messages
- file-based logging

---

# Log File Location

Application logs are stored inside:

```text
logs/application.log
```

---

# Log Format

```text
timestamp | log_level | module_name | message
```

## Example

```text
2026-05-23 07:46:10 | INFO | analytics_service | Analytics generated successfully
```

---

# Logging Strategy

The application logs:
- API requests
- monitoring execution
- MongoDB operations
- analytics generation
- exception handling
- ping execution
- startup events

---

# Request Logging

All incoming API requests are logged with:
- HTTP method
- API path
- response status
- execution duration

---

# Error Logging

Application exceptions are logged using:
- error messages
- stack traces
- request metadata
- module information

---

# Module-Level Logging

Each module initializes its own logger.

## Example

```python
from app.utils.logger import get_logger

logger = get_logger(__name__)
```

---

# Monitoring Events

The following events are logged:
- monitoring started
- monitoring completed
- analytics generated
- MongoDB fetch operations
- MongoDB insert operations
- invalid requests
- system errors

---

# Production Logging

Production logging includes:
- request tracing
- operational visibility
- error diagnostics
- monitoring history

---

# Best Practices

- Use INFO for application flow
- Use DEBUG for internal diagnostics
- Use WARNING for recoverable issues
- Use ERROR for failures
- Use CRITICAL for application-level failures

---

# Troubleshooting Logs

## View Logs

```bash
tail -f logs/application.log
```

---

# Linux Service Logs

```bash
journalctl -u pingspyder-service -f
```

---

# Log Retention

Log rotation and retention policies can be configured based on deployment requirements.