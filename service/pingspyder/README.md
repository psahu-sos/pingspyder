# PingSpyder Service

## Overview

PingSpyder Service is an enterprise-grade network monitoring and analytics platform designed for real-time IP health monitoring, outage detection, infrastructure analytics, and intelligent network visibility.

The system performs concurrent ICMP-based monitoring of infrastructure devices, stores monitoring history in MongoDB, and provides analytics APIs for outage tracking and reporting.

---

## Features

- Real-time IP monitoring
- Concurrent ping execution
- Historical outage analytics
- Route-based filtering
- Stretch and location filtering
- MongoDB integration
- Excel-based monitoring
- Dynamic device analytics
- Enterprise logging
- Health check APIs
- Pagination support

---

## Tech Stack

| Technology | Purpose |
|---|---|
| FastAPI | Backend Framework |
| MongoDB | Database |
| Python | Core Language |
| Uvicorn | ASGI Server |
| Gunicorn | Production Server |
| Pandas | Excel Processing |
| Ping3 | ICMP Monitoring |
| APScheduler | Background Scheduling |

---

## Project Structure

```text
app/
├── config/
├── core/
├── db/
├── models/
├── repositories/
├── routes/
├── scheduler/
├── services/
├── utils/