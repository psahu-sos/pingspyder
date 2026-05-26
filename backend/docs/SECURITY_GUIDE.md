# Security Guide - PingSpyder Backend

# Overview

This document explains the security architecture and authentication flow implemented in the PingSpyder Backend
application.

The application uses JWT-based stateless authentication with role-based authorization.

---

# Security Architecture

```text
Client Request
      ↓
JWT Authentication Filter
      ↓
JWT Validation
      ↓
Session Validation
      ↓
Security Context Authentication
      ↓
Protected API Access
```

---

# Authentication Mechanism

Authentication is implemented using:

- JWT Tokens
- Spring Security
- Stateless Session Management

---

# Authentication Flow

# Step 1 - Login Request

Client sends login request:

```http
POST /api/auth/login
```

Request Body:

```json
{
  "username": "admin",
  "password": "adminscope505"
}
```

---

# Step 2 - Credential Validation

Backend validates:

- username
- password
- account status

Password validation uses:

```text
BCryptPasswordEncoder
```

---

# Step 3 - JWT Token Generation

If authentication succeeds:

- JWT token generated
- user role added inside token
- token returned to client

---

# Step 4 - Session Storage

Active session stored in MongoDB:

```text
SessionEntity
```

Stored data:

- username
- token
- active status
- login time

---

# Step 5 - Authenticated API Access

Client sends:

```http
Authorization: Bearer JWT_TOKEN
```

JWT filter validates:

- token validity
- session activity
- user status

---

# JWT Security

# JWT Utility

Implemented in:

```text
JwtUtil
```

Responsibilities:

- token generation
- token validation
- username extraction
- role extraction

---

# JWT Claims

Stored claims:

| Claim | Description |
|-------|-------------|
| sub   | Username    |
| role  | User role   |

---

# JWT Configuration

Configured in:

```properties
jwt.secret=
jwt.expiration=
```

---

# JWT Expiration

Configured as:

```text
86400000 ms
```

Equivalent:

```text
24 Hours
```

---

# Security Filter

Implemented using:

```text
JwtAuthenticationFilter
```

Extends:

```text
OncePerRequestFilter
```

Responsibilities:

- token extraction
- token validation
- session validation
- authentication context setup

---

# Authorization

Authorization implemented using:

```text
Role Based Access Control (RBAC)
```

---

# Supported Roles

| Role  | Access      |
|-------|-------------|
| ADMIN | Full Access |

---

# Protected APIs

Protected endpoints:

```text
/api/analytics/**
/api/reports/**
```

Require:

```text
ROLE_ADMIN
```

---

# Public APIs

Public endpoints:

```text
/api/auth/**
```

Accessible without token.

---

# Spring Security Configuration

Configured inside:

```text
SecurityConfig
```

Key configurations:

- Stateless Sessions
- JWT Filter
- CORS
- Endpoint Authorization
- Disabled CSRF

---

# Session Management

Session policy:

```text
STATELESS
```

Meaning:

- no server-side HTTP session storage
- authentication entirely token-based

---

# Password Security

Passwords encrypted using:

```text
BCryptPasswordEncoder
```

Features:

- password hashing
- irreversible encryption
- secure authentication

---

# Admin Seeder

Default admin generated during startup.

Configured inside:

```text
AdminSeeder
```

Configuration moved to:

```properties
app.admin.username=
app.admin.password=
```

---

# Production Security Recommendations

# 1. Use Environment Variables

Recommended:

```properties
app.admin.username=${ADMIN_USERNAME}
app.admin.password=${ADMIN_PASSWORD}
```

---

# 2. Use Strong JWT Secret

Avoid weak secrets.

Use:

- long random secret
- secure key management

---

# 3. Enable HTTPS

Production deployment should use:

- SSL
- HTTPS
- secure transport

---

# 4. Restrict CORS

Current development setup:

```text
allowedOrigins("*")
```

Production should specify frontend domain only.

Example:

```text
https://your-frontend-domain.com
```

---

# 5. Rotate Credentials

Regularly rotate:

- admin passwords
- JWT secrets
- MongoDB credentials

---

# 6. Hide Sensitive Logs

Never log:

- passwords
- JWT tokens
- secrets
- database credentials

---

# Validation Security

Request validation implemented using:

```text
jakarta.validation
```

Annotations:

- @Valid
- @NotBlank
- @NotNull
- @Size

---

# Exception Handling Security

Centralized exception handling prevents:

- stack trace leakage
- internal implementation exposure

Implemented using:

```text
@RestControllerAdvice
```

---

# MongoDB Security

Database:

- MongoDB Atlas

Recommended:

- IP whitelisting
- strong DB credentials
- TLS encryption

---

# Python Service Security

Backend communicates with:

- Python FastAPI service

Configured via:

```properties
python.service.url=
```

Ensure:

- service reachable only internally
- protected deployment network

---

# Logging Security

Logging implemented for:

- authentication attempts
- invalid tokens
- authorization failures
- session validation

Sensitive data is excluded from logs.

---

# Common Security Errors

# Invalid JWT Token

Cause:

- expired token
- malformed token
- invalid signature

Response:

```text
401 Unauthorized
```

---

# Session Not Found

Cause:

- logout performed
- inactive session
- invalid token

Response:

```text
401 Unauthorized
```

---

# Access Denied

Cause:

- insufficient role permissions

Response:

```text
403 Forbidden
```

---

# Security Components

| Component               | Responsibility          |
|-------------------------|-------------------------|
| JwtUtil                 | Token management        |
| JwtAuthenticationFilter | Request authentication  |
| SecurityConfig          | Endpoint security       |
| BCryptPasswordEncoder   | Password encryption     |
| SessionRepository       | Active session tracking |

---

# Future Security Improvements

- Refresh Tokens
- OAuth2 Integration
- API Rate Limiting
- MFA Authentication
- Redis Session Blacklisting
- Key Rotation
- Security Monitoring
- Audit Logging

---

# Conclusion

The PingSpyder Backend implements enterprise-level security architecture using:

- JWT Authentication
- Role-based Authorization
- Stateless Sessions
- Password Encryption
- Centralized Security Configuration

The architecture is scalable, modular, and suitable for enterprise deployment.