# Logging Guide - PingSpyder Backend

# Overview

This document explains the logging architecture and logging standards implemented in the PingSpyder Backend application.

The application uses:

- SLF4J
- Lombok @Slf4j
- Spring Boot Logging

Enterprise-level logging has been implemented across:

- Controllers
- Services
- Security
- Exception Handlers
- Configuration Classes
- External Integrations

---

# Logging Objectives

The logging system is designed to:

- monitor application flow
- track API activity
- capture failures
- simplify debugging
- support production troubleshooting

---

# Logging Framework

Logging implementation:

```text
SLF4J + Logback
```

Logging annotation:

```java
@Slf4j
```

---

# Logging Levels

# INFO

Used for:

- successful operations
- application startup
- API requests
- business flow tracking

Example:

```java
log.info("User created successfully with id: {}",userId);
```

---

# WARN

Used for:

- recoverable issues
- invalid requests
- unauthorized attempts
- missing optional data

Example:

```java
log.warn("Invalid JWT token received");
```

---

# ERROR

Used for:

- application failures
- external integration failures
- unhandled exceptions
- database failures

Example:

```java
log.error("MongoDB fetch failed",ex);
```

---

# Logging Architecture

```text
Controller Logs
       ↓
Service Logs
       ↓
Security Logs
       ↓
Exception Logs
       ↓
External Integration Logs
```

---

# Controller Logging

Controllers log:

- incoming requests
- successful responses
- request failures

Example:

```java
log.info("Login request received for user: {}",username);
```

---

# Service Layer Logging

Services log:

- business logic execution
- processing stages
- external service calls
- processing failures

Example:

```java
log.info("PDF generation initiated for project: {}",project);
```

---

# Security Logging

Security logs:

- authentication success
- invalid tokens
- authorization failures
- session validation

Example:

```java
log.info("JWT authentication successful for user: {}",username);
```

---

# Exception Logging

Global exception handler logs:

- handled exceptions
- unexpected failures
- stack traces

Implemented using:

```text
GlobalExceptionHandler
```

---

# MongoDB Logging

Mongo-related logs:

- connection initialization
- fetch operations
- save operations
- query failures

Example:

```java
log.info("Fetching report data from MongoDB");
```

---

# Python Gateway Logging

Python integration logs:

- outgoing requests
- response handling
- gateway failures
- timeout errors

Example:

```java
log.info("Forwarding monitoring request to Python Gateway URL: {}",url);
```

---

# PDF Generation Logging

PDF service logs:

- template processing
- PDF generation
- generation failures

Example:

```java
log.info("PDF generated successfully for project: {}",project);
```

---

# Configuration Logging

Configuration classes log:

- bean initialization
- startup configuration
- security initialization
- MongoDB initialization

---

# Security Logging Rules

Sensitive information is NOT logged.

Never log:

- passwords
- JWT tokens
- MongoDB credentials
- secret keys

---

# Logging Best Practices Used

# 1. Structured Logging

Parameterized logging used:

```java
log.info("Fetching user with id: {}",id);
```

Avoid:

```java
log.info("Fetching user with id: "+id);
```

---

# 2. Exception Logging

Exceptions logged with stack traces:

```java
log.error("Failed to process report",ex);
```

---

# 3. Meaningful Messages

Logs include:

- operation details
- identifiers
- processing status
- failure context

---

# 4. No Overlogging

Avoided:

- excessive debug logs
- entity dumps
- unnecessary repository logs

---

# Current Logging Coverage

| Layer              | Logging Status |
|--------------------|----------------|
| Controllers        | Implemented    |
| Services           | Implemented    |
| Security           | Implemented    |
| Exception Handler  | Implemented    |
| Configurations     | Implemented    |
| MongoDB Operations | Implemented    |
| Python Gateway     | Implemented    |

---

# Example Log Flow

```text
INFO  - Login request received
INFO  - JWT token generated
INFO  - Session created successfully
INFO  - JWT authentication successful
INFO  - Report generation initiated
INFO  - PDF generated successfully
```

---

# Error Log Example

```text
ERROR - MongoDB fetch failed
ERROR - PDF generation failed
ERROR - Python Gateway request failed
```

---

# Startup Logs

Application startup logs include:

- Spring Boot initialization
- MongoDB connection
- Security initialization
- Bean creation
- Tomcat startup

Successful startup indicator:

```text
Started PingReportAppApplication
Tomcat started on port 8080
```

---

# Future Logging Improvements

Recommended future improvements:

- Centralized Logging
- ELK Stack Integration
- Splunk Integration
- Correlation IDs
- Audit Logs
- Log Rotation
- Distributed Tracing
- Structured JSON Logs

---

# Production Recommendations

# 1. Configure Log Rotation

Prevent oversized log files.

---

# 2. Separate Error Logs

Use dedicated error log files.

---

# 3. Enable Centralized Monitoring

Recommended:

- ELK Stack
- Grafana Loki
- Splunk

---

# 4. Avoid Sensitive Logging

Do not expose:

- secrets
- tokens
- passwords
- credentials

---

# 5. Monitor WARN/ERROR Trends

Track:

- authentication failures
- MongoDB failures
- Python service downtime
- report generation failures

---

# Logging Dependencies

Logging support provided by:

- Spring Boot Logging
- SLF4J
- Logback
- Lombok

---

# Conclusion

The PingSpyder Backend implements enterprise-level logging practices using:

- structured logging
- layered logging
- centralized exception logging
- security-aware logging
- external integration tracking

The logging architecture supports:

- debugging
- monitoring
- production support
- operational visibility