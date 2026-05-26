# System Architecture

## Overview

PingSpyder Service follows a layered architecture pattern designed for scalability, maintainability, and enterprise deployment readiness.

The application performs concurrent network monitoring, stores monitoring history in MongoDB, and provides analytics APIs for infrastructure visibility.

---

## Architecture Layers

| Layer | Responsibility |
|---|---|
| Routes | API endpoint handling |
| Services | Business logic |
| Repositories | Database interaction |
| Utils | Shared utilities |
| Config | Environment and settings |
| Core | Exception handling and response formatting |

---

## Request Flow

Client Request
↓
FastAPI Route
↓
Service Layer
↓
Repository Layer
↓
MongoDB
↓
Response Builder
↓
Client Response

---

## Monitoring Flow

Excel/Mongo Source
↓
Task Generation
↓
Concurrent Ping Execution
↓
Result Aggregation
↓
MongoDB Storage
↓
Analytics APIs

---

## Concurrency Model

PingSpyder uses:
- ThreadPoolExecutor
- concurrent ICMP execution
- configurable worker pool
- parallel task execution

---

## Logging Architecture

The system implements centralized logging with:
- INFO logs
- DEBUG logs
- WARNING logs
- ERROR logs
- CRITICAL logs

Application logs are stored inside:
```text
logs/application.log