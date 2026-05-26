# Architecture Overview - PingSpyder Backend

# Overview

PingSpyder Backend follows an enterprise-level layered architecture using Spring Boot, MongoDB Atlas, JWT Security, and
Python FastAPI integration.

The application acts as a middleware gateway between:

- React Frontend
- Python Monitoring Services
- MongoDB Atlas Database

---

# High-Level Architecture

```text
+----------------------+
|   React Frontend     |
+----------------------+
           |
           |
           v
+----------------------+
| Spring Boot Backend  |
|  PingSpyder Backend  |
+----------------------+
           |
           |
  -------------------
  |                 |
  v                 v
+---------+   +----------------+
| MongoDB |   | Python FastAPI |
| Atlas   |   |   Service      |
+---------+   +----------------+
```

---

# Architectural Layers

The backend follows layered architecture:

```text
Controller Layer
       ↓
Service Layer
       ↓
Repository Layer
       ↓
MongoDB Atlas
```

External communication:

```text
Service Layer
       ↓
Python FastAPI Service
```

---

# Technology Stack

| Layer            | Technology                |
|------------------|---------------------------|
| Frontend         | React JS                  |
| Backend          | Spring Boot               |
| Security         | Spring Security + JWT     |
| Database         | MongoDB Atlas             |
| PDF Engine       | Thymeleaf + OpenHTMLToPDF |
| External Service | FastAPI                   |
| Deployment       | WAR on JBoss/WildFly      |

---

# Backend Responsibilities

The Spring Boot backend is responsible for:

- JWT authentication
- user management
- report generation
- PDF generation
- MongoDB operations
- Python service integration
- request validation
- centralized exception handling
- enterprise logging

---

# Frontend Integration

Frontend communicates using REST APIs.

Communication type:

```text
HTTP REST APIs
```

Authentication:

```text
JWT Bearer Token
```

Frontend responsibilities:

- UI rendering
- authentication handling
- API invocation
- report download
- analytics visualization

---

# Python FastAPI Integration

Python service handles:

- monitoring logic
- analytics processing
- Excel processing
- network operations

Spring Boot acts as:

- secure gateway
- orchestration layer

---

# Python Communication Flow

```text
React Frontend
       ↓
Spring Boot API
       ↓
Python FastAPI API
       ↓
Processed Response
       ↓
Spring Boot
       ↓
Frontend
```

---

# MongoDB Architecture

MongoDB Atlas used as:

- primary database
- session storage
- report storage

Stored entities:

- UserEntity
- SessionEntity
- ReportEntity

---

# Security Architecture

Security implementation uses:

- JWT Authentication
- Stateless Sessions
- Role-based Authorization
- BCrypt Password Encryption

---

# Security Flow

```text
Login Request
      ↓
JWT Generation
      ↓
Token Validation
      ↓
Security Filter
      ↓
Protected API Access
```

---

# Authentication Components

| Component               | Responsibility   |
|-------------------------|------------------|
| JwtUtil                 | Token management |
| JwtAuthenticationFilter | Token validation |
| SecurityConfig          | API protection   |
| SessionRepository       | Session tracking |

---

# Report Generation Architecture

PDF generation flow:

```text
Excel Upload / Mongo Fetch
            ↓
Report Processing
            ↓
Thymeleaf Template Rendering
            ↓
OpenHTMLToPDF
            ↓
Generated PDF
```

---

# Analytics Architecture

Analytics flow:

```text
Frontend Request
       ↓
Analytics Controller
       ↓
Analytics Service
       ↓
Python FastAPI Analytics
       ↓
Response Processing
       ↓
Frontend
```

---

# Monitoring Architecture

Monitoring workflow:

```text
Excel Upload
      ↓
Spring Boot Gateway
      ↓
Python Monitoring Engine
      ↓
MongoDB Storage
      ↓
PDF Reporting
```

---

# Deployment Architecture

Deployment type:

```text
WAR Deployment
```

Application server:

```text
JBoss / WildFly
```

Deployment flow:

```text
WAR Build
      ↓
Deploy to JBoss
      ↓
Server Startup
      ↓
API Availability
```

---

# Project Structure

```text
com.sos.pingspyder
│
├── client
├── config
├── controller
├── dto
├── entity
├── enums
├── exception
├── mapper
├── repository
├── security
├── service
└── util
```

---

# Logging Architecture

Logging implemented across:

- Controllers
- Services
- Security
- Configurations
- Exception Handlers
- External Integrations

Log levels:

- INFO
- WARN
- ERROR

---

# Exception Handling Architecture

Centralized exception handling implemented using:

```text
@RestControllerAdvice
```

Benefits:

- standardized error responses
- centralized logging
- consistent API behavior

---

# Validation Architecture

Validation implemented using:

```text
jakarta.validation
```

Annotations:

- @Valid
- @NotBlank
- @NotNull
- @Size

---

# Scalability Considerations

Current architecture supports:

- modular expansion
- service separation
- external integrations
- future microservice migration

---

# Future Architectural Improvements

Planned improvements:

- Docker deployment
- Kubernetes orchestration
- API Gateway
- Redis caching
- ELK logging
- CI/CD pipelines
- Distributed tracing
- Refresh token mechanism

---

# Enterprise Design Principles Used

- Layered Architecture
- Separation of Concerns
- Stateless Authentication
- Centralized Exception Handling
- Externalized Configuration
- Modular Package Structure

---

# Deployment Readiness

The application is production-ready with:

- WAR packaging
- JBoss compatibility
- JWT security
- MongoDB Atlas support
- enterprise logging
- validation support

---

# Conclusion

PingSpyder Backend is designed as a scalable enterprise backend platform integrating:

- Spring Boot
- MongoDB Atlas
- JWT Security
- FastAPI Services
- PDF Reporting
- JBoss Deployment

The architecture supports maintainability, scalability, modularity, and enterprise deployment standards.