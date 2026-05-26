# PingSpyder Backend

## Project Overview

PingSpyder Backend is an enterprise-grade Spring Boot application designed for network monitoring, analytics processing,
report generation, and Python microservice integration.

The application acts as a secure backend gateway between the React frontend, FastAPI Python services, and MongoDB Atlas
database.

It supports:

- JWT Authentication
- Role-based Authorization
- Monitoring Automation
- Excel Processing
- Analytics APIs
- PDF Report Generation
- MongoDB Data Management
- JBoss/WildFly WAR Deployment

---

# Tech Stack

## Backend

- Java 17
- Spring Boot 3
- Spring Security
- Spring Web
- Spring WebFlux
- Spring Validation

## Database

- MongoDB Atlas

## Authentication

- JWT Authentication

## PDF Generation

- Thymeleaf
- OpenHTMLToPDF

## Deployment

- Maven
- WAR Packaging
- JBoss / WildFly

## External Integration

- Python FastAPI Service

---

# Project Architecture

```text
React Frontend
       ↓
Spring Boot Backend (PingSpyder)
       ↓
Python FastAPI Service
       ↓
MongoDB Atlas
```

---

# Features

## Authentication Module

- JWT Login
- Logout
- Session Tracking
- Role-based Access Control

## User Management

- Create User
- Update User
- Delete User
- Fetch Users

## Monitoring Gateway

- Excel Upload Processing
- Monitoring Trigger APIs
- Python Service Communication

## Report Management

- PDF Report Generation
- MongoDB Report Fetching
- Combined Reports
- Lite / Full Mode Filtering

## Analytics

- Analytics Data APIs
- Device Filtering
- Pagination Support

## Security

- JWT Authentication Filter
- Secure API Endpoints
- Stateless Session Management

## Logging

- Enterprise-level INFO/WARN/ERROR logging
- Exception logging
- API request tracking

---

# Folder Structure

```text
src/main/java/com/sos/pingspyder
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
├── util
```

---

# Application Configuration

Application properties are configured inside:

```text
src/main/resources/application.properties
```

Configuration includes:

- MongoDB URI
- JWT Secret
- Python Service URL
- Admin Seeder Credentials
- PDF Static Path

---

# Build Instructions

## Clean Project

```powershell
.\mvnw clean
```

## Build WAR File

```powershell
.\mvnw clean package
```

Generated WAR file location:

```text
target/pingspyder-backend.war
```

---

# Running Application Locally

## Start Spring Boot Backend

```powershell
.\mvnw spring-boot:run
```

Default Backend URL:

```text
http://localhost:8080
```

---

# Python Service

Ensure Python FastAPI service is running before executing monitoring or analytics APIs.

Default Python URL:

```text
http://localhost:8000
```

---

# Default Admin Credentials

```text
Username: admin
Password: adminscope505
```

Important:

- Change credentials in production environments.
- Move credentials to environment variables for production deployment.

---

# Deployment

Application is packaged as:

```text
WAR
```

Compatible with:

- JBoss
- WildFly

Deployment WAR:

```text
target/pingspyder-backend.war
```

Deploy inside:

```text
JBOSS_HOME/standalone/deployments
```

---

# Security Features

- JWT-based Authentication
- Role-based Authorization
- Stateless Sessions
- Password Encryption using BCrypt
- Protected APIs

---

# Logging

Enterprise logging implemented for:

- Controllers
- Services
- Security
- Exceptions
- External Integrations

Logging Levels:

- INFO
- WARN
- ERROR

---

# Future Improvements

- Swagger/OpenAPI Documentation
- Docker Deployment
- Kubernetes Support
- ELK Stack Logging
- Refresh Tokens
- API Rate Limiting
- CI/CD Pipeline
- Redis Caching

---

# Author

SOS Infotech

Project: PingSpyder Backend