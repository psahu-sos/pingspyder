# Project Structure - PingSpyder Backend

# Overview

This document explains the internal package structure and architectural organization of the PingSpyder Backend
application.

The project follows enterprise-level layered architecture using Spring Boot.

---

# Base Package

```text
com.sos.pingspyder
```

---

# High-Level Architecture

```text
Controller Layer
       ↓
Service Layer
       ↓
Repository Layer
       ↓
MongoDB Atlas
```

External Integrations:

```text
Spring Boot
       ↓
Python FastAPI Service
```

---

# Package Structure

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

# Package Descriptions

# 1. client

## Purpose

Handles communication with external Python FastAPI services.

## Responsibilities

- API communication
- Analytics requests
- Monitoring integration
- External service handling

## Example

```text
PythonClient
```

---

# 2. config

## Purpose

Contains application configuration classes.

## Responsibilities

- Security configuration
- MongoDB configuration
- CORS configuration
- RestTemplate configuration
- WebClient configuration
- Password encoder configuration
- Admin seeding

## Example Classes

```text
SecurityConfig
MongoDynamicConfig
CorsConfig
PasswordConfig
RestTemplateConfig
WebClientConfig
AdminSeeder
```

---

# 3. controller

## Purpose

Handles incoming REST API requests.

## Responsibilities

- Request mapping
- API handling
- Request validation
- Response generation

## Example Controllers

```text
AuthController
UserController
ReportController
MonitoringGatewayController
FilterController
```

---

# 4. dto

## Purpose

Contains Data Transfer Objects.

## Responsibilities

- Request models
- Response models
- API payloads
- Validation objects

## Example DTOs

```text
LoginRequestDto
LoginResponseDto
UserResponseDto
AnalyticsResponseDto
ErrorResponseDto
```

---

# 5. entity

## Purpose

Represents MongoDB document entities.

## Responsibilities

- Database mapping
- MongoDB persistence

## Example Entities

```text
UserEntity
SessionEntity
ReportEntity
```

---

# 6. enums

## Purpose

Contains application enums.

## Responsibilities

- Role management
- Constant enumerations

## Example

```text
Role
```

---

# 7. exception

## Purpose

Centralized exception management.

## Responsibilities

- Custom exceptions
- Global exception handling
- Error responses

## Example Classes

```text
GlobalExceptionHandler
MongoFetchException
PdfGenerationException
InvalidProjectException
UserNotFoundException
```

---

# 8. mapper

## Purpose

Converts between DTOs and entities.

## Responsibilities

- DTO mapping
- Entity conversion
- MongoDB document conversion

## Example

```text
UserMapper
ReportMapper
```

---

# 9. repository

## Purpose

Handles MongoDB database access.

## Responsibilities

- CRUD operations
- MongoDB queries
- Session lookup
- User lookup

## Example Repositories

```text
UserRepository
SessionRepository
```

---

# 10. security

## Purpose

Handles authentication and authorization.

## Responsibilities

- JWT generation
- JWT validation
- Authentication filtering
- Security context handling

## Example Classes

```text
JwtUtil
JwtAuthenticationFilter
```

---

# 11. service

## Purpose

Contains business logic implementation.

## Responsibilities

- Business processing
- Report generation
- User management
- Monitoring integration
- Analytics processing

## Sub-Packages

```text
service
service.impl
```

## Example Services

```text
AuthServiceImpl
UserServiceImpl
ReportServiceImpl
AnalyticsServiceImpl
MonitoringGatewayServiceImpl
```

---

# 12. util

## Purpose

Contains utility/helper classes.

## Responsibilities

- MongoDB helpers
- PDF helpers
- Response builders
- Constants management
- Filtering logic

## Example Classes

```text
MongoHelper
PdfTemplateHelper
ResponseBuilderHelper
ReportFilterHelper
AppConstantsHelper
```

---

# Resource Structure

```text
src/main/resources
│
├── static
├── templates
└── application.properties
```

---

# Resource Descriptions

# static

Contains:

- CSS
- Images
- PDF assets

Used during PDF generation.

---

# templates

Contains:

- Thymeleaf HTML templates

Example:

```text
report.html
```

---

# application.properties

Contains:

- MongoDB configuration
- JWT configuration
- Python service URL
- Admin credentials
- Spring configuration

---

# Testing Structure

```text
src/test/java
```

Contains:

- unit tests
- integration tests

---

# Build Structure

Generated during Maven build:

```text
target/
```

Contains:

- compiled classes
- WAR package
- temporary build files

Generated WAR:

```text
target/pingspyder-backend.war
```

---

# Logging Structure

Enterprise logging implemented in:

- Controllers
- Services
- Security
- Exception handlers
- Configuration classes

Logging levels:

- INFO
- WARN
- ERROR

---

# Security Architecture

```text
JWT Token
      ↓
JwtAuthenticationFilter
      ↓
SecurityContextHolder
      ↓
Protected APIs
```

---

# Deployment Architecture

```text
React Frontend
       ↓
Spring Boot Backend
       ↓
Python FastAPI Service
       ↓
MongoDB Atlas
```

---

# Design Principles Used

- Layered Architecture
- Separation of Concerns
- Stateless Authentication
- Modular Structure
- Centralized Exception Handling
- Externalized Configuration

---

# Future Improvements

- Swagger/OpenAPI
- Dockerization
- Kubernetes Deployment
- ELK Logging Stack
- Redis Caching
- CI/CD Pipelines
- API Gateway
- Microservice Expansion

---

# Conclusion

The PingSpyder Backend follows enterprise-level Spring Boot architecture principles with:

- modular package design
- secure authentication
- layered architecture
- external service integration
- scalable deployment structure

```