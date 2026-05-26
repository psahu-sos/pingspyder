# Deployment Guide - PingSpyder Backend

# Overview

This document explains the deployment process for the PingSpyder Backend application.

The backend is deployed as a WAR package on JBoss/WildFly application server.

---

# Deployment Architecture

```text
React Frontend
       ↓
Spring Boot WAR Application
       ↓
Python FastAPI Service
       ↓
MongoDB Atlas
```

---

# System Requirements

## Required Software

| Software        | Version       |
|-----------------|---------------|
| Java JDK        | 17            |
| Maven           | 3.9+          |
| JBoss / WildFly | Latest Stable |
| MongoDB Atlas   | Cloud         |
| Python          | 3.10+         |

---

# Java Configuration

## Verify Java Version

```powershell
java -version
```

Expected:

```text
Java 17
```

Important:

- Java 17 is strongly recommended.
- Avoid Java 24 for enterprise deployment compatibility.

---

# Maven Build Process

## Clean Existing Build

```powershell
.\mvnw clean
```

## Generate WAR File

```powershell
.\mvnw clean package
```

---

# Generated WAR File

WAR file location:

```text
target/pingspyder-backend.war
```

---

# JBoss / WildFly Deployment

## Deployment Location

Copy WAR file to:

```text
JBOSS_HOME/standalone/deployments
```

Example:

```text
C:\wildfly\standalone\deployments
```

---

# Deployment Steps

## Step 1

Start JBoss/WildFly server.

## Step 2

Generate WAR file using Maven.

## Step 3

Copy:

```text
pingspyder-backend.war
```

into:

```text
standalone/deployments
```

## Step 4

Wait for automatic deployment.

JBoss will create:

```text
pingspyder-backend.war.deployed
```

if deployment is successful.

---

# Application URLs

## Spring Boot Backend

```text
http://localhost:8080
```

## Python FastAPI Service

```text
http://localhost:8000
```

---

# MongoDB Configuration

MongoDB configuration exists in:

```text
src/main/resources/application.properties
```

Properties:

```properties
spring.data.mongodb.uri=
spring.data.mongodb.database=
```

---

# JWT Configuration

JWT configuration:

```properties
jwt.secret=
jwt.expiration=
```

Important:

- Use strong JWT secret in production.
- Never expose production secrets publicly.

---

# Admin Seeder Configuration

Default admin configuration:

```properties
app.admin.username=
app.admin.password=
```

Important:

- Change credentials in production.
- Prefer environment variables.

---

# Python Service Configuration

Python service URL:

```properties
python.service.url=http://localhost:8000
```

Ensure FastAPI service is running before:

- monitoring APIs
- analytics APIs
- report processing APIs

---

# WAR Packaging Configuration

Application packaging:

```xml

<packaging>war</packaging>
```

Tomcat dependency:

```xml

<scope>provided</scope>
```

Required for JBoss/WildFly deployment.

---

# Logging

Logging is enabled for:

- Controllers
- Services
- Security
- MongoDB Operations
- Python Gateway Calls
- Exception Handling

Log levels:

- INFO
- WARN
- ERROR

---

# Security Features

- JWT Authentication
- Role-based Authorization
- BCrypt Password Encoding
- Stateless Session Management
- CORS Configuration

---

# Common Deployment Issues

## 1. Jakarta Servlet Exception

Cause:

- Missing servlet dependency
- Incorrect WAR setup

Fix:

- Ensure servlet dependency exists
- Ensure Tomcat scope is provided

---

## 2. MongoDB Connection Timeout

Cause:

- Network interruption
- MongoDB Atlas connectivity

Fix:

- Verify internet access
- Verify MongoDB URI
- Check Atlas IP whitelist

---

## 3. Python Gateway Connection Failure

Cause:

- FastAPI service not running

Fix:

- Start Python service
- Verify configured URL

---

## 4. Port Already In Use

Cause:

- Another application using port 8080

Fix:

- Stop conflicting application
- Change server port

---

# Production Recommendations

## Recommended Improvements

- Use HTTPS
- Move secrets to environment variables
- Enable centralized logging
- Configure monitoring
- Enable API documentation
- Use Docker containers
- Configure CI/CD pipelines

---

# Verification Checklist

| Check                  | Status   |
|------------------------|----------|
| Java 17 Installed      | Required |
| Maven Installed        | Required |
| MongoDB Connected      | Required |
| Python Service Running | Required |
| WAR Generated          | Required |
| WAR Deployed           | Required |
| APIs Accessible        | Required |

---

# Deployment Success Indicators

Successful deployment indicators:

```text
Started PingReportAppApplication
Tomcat started on port 8080
```

JBoss deployment marker:

```text
pingspyder-backend.war.deployed
```

---

# Conclusion

The PingSpyder Backend application is designed for enterprise deployment using:

- Spring Boot
- WAR Packaging
- JBoss/WildFly
- MongoDB Atlas
- Python FastAPI Integration

The deployment architecture supports scalability, modularity, and secure API communication.