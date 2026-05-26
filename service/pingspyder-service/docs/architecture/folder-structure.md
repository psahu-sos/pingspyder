# Folder Structure

## Overview

PingSpyder Service follows a modular and layered folder structure for scalability, maintainability, and enterprise deployment readiness.

---

# Root Structure

```text
pingspyder-service/
│
├── app/
├── docs/
├── logs/
├── requirements.txt
├── .env
├── README.md
```

---

# Application Structure

```text
app/
│
├── config/
├── core/
├── db/
├── repositories/
├── routes/
├── services/
├── utils/
├── scheduler/
├── main.py
```

---

# Folder Responsibilities

| Folder | Responsibility |
|---|---|
| config | Application configuration |
| core | Response and exception handling |
| db | MongoDB connection management |
| repositories | Database operations |
| routes | API endpoint definitions |
| services | Business logic |
| utils | Shared utilities |
| scheduler | Background scheduler configuration |

---

# Config Layer

Location:

```text
app/config/
```

Contains:
- environment variables
- MongoDB configuration
- worker configuration
- timeout configuration

---

# Core Layer

Location:

```text
app/core/
```

Contains:
- response builder
- global exception handling
- enums
- shared response utilities

---

# Database Layer

Location:

```text
app/db/
```

Contains:
- MongoDB client configuration
- database connection handling

---

# Repository Layer

Location:

```text
app/repositories/
```

Contains:
- MongoDB queries
- insert operations
- analytics fetch operations
- inventory queries

---

# Route Layer

Location:

```text
app/routes/
```

Contains:
- monitoring APIs
- analytics APIs
- filter APIs

---

# Service Layer

Location:

```text
app/services/
```

Contains:
- monitoring logic
- analytics generation
- inventory processing
- ping execution
- filter generation

---

# Utility Layer

Location:

```text
app/utils/
```

Contains:
- logging utilities
- validators
- Excel parsers
- constants
- helper methods

---

# Scheduler Layer

Location:

```text
app/scheduler/
```

Contains:
- APScheduler configuration
- background task initialization

---

# Logs Directory

Location:

```text
logs/
```

Contains:
- application logs
- monitoring logs
- production logs

---

# Documentation Directory

Location:

```text
docs/
```

Contains:
- API documentation
- deployment documentation
- architecture documentation
- troubleshooting documentation

---

# Main Entry Point

File:

```text
app/main.py
```

Responsibilities:
- FastAPI initialization
- router registration
- exception handler registration

---

# Benefits of Current Structure

- clean separation of concerns
- scalable architecture
- easier maintenance
- reusable modules
- enterprise deployment readiness
- simplified debugging

---

# Design Approach

PingSpyder Service follows:
- modular architecture
- layered design
- centralized configuration
- reusable utility modules
- service-oriented structure