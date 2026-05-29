# PingSpyder Deployment Process Documentation

## Overview

This document contains the complete deployment setup process for the PingSpyder platform, including:

* Spring Boot WAR deployment on WildFly
* FastAPI service setup
* NSSM background service configuration
* Monorepo Git setup
* Common issues faced during deployment
* Solutions and fixes applied

---

# Project Structure

```text
pingspyder/
├── backend/      # Spring Boot backend
├── frontend/     # React frontend
├── service/      # FastAPI monitoring service
└── README.md
```

---

# Backend Deployment (Spring Boot + WildFly)

## 1. Convert Spring Boot JAR to WAR

### pom.xml changes

Packaging changed from:

```xml
<packaging>jar</packaging>
```

to:

```xml
<packaging>war</packaging>
```

---

## 2. Add SpringBootServletInitializer

Main class updated:

```java
@SpringBootApplication
public class PingReportAppApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(PingReportAppApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(PingReportAppApplication.class, args);
    }
}
```

---

## 3. Build WAR

Run:

```bash
mvn clean package
```

Generated WAR:

```text
target/pingspyder-backend.war
```

---

## 4. Deploy WAR to WildFly

Copy WAR into:

```text
D:\wildfly-39.0.1.Final\standalone\deployments
```

WildFly auto-deploys the WAR.

---

# Swagger URL in WildFly

Since the application is deployed as:

```text
pingspyder-backend.war
```

WildFly creates this context path:

```text
/pingspyder-backend
```

Therefore Swagger URL becomes:

```text
http://localhost:8080/pingspyder-backend/swagger-ui/index.html
```

NOT:

```text
http://localhost:8080/swagger-ui/index.html
```

---

# Running Local Spring Boot and WildFly Together

## Problem

Spring Boot local server and WildFly both attempted to use port 8080.

Error:

```text
Web server failed to start. Port 8080 was already in use.
```

---

## Solution

Changed local Spring Boot port:

```properties
server.port=8081
```

Now:

| Service           | Port |
| ----------------- | ---- |
| WildFly WAR       | 8080 |
| Local Spring Boot | 8081 |

---

# FastAPI Deployment

## Run FastAPI locally

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

Swagger:

```text
http://localhost:8000/docs
```

---

# NSSM Background Service Setup

## Purpose

NSSM (Non-Sucking Service Manager) allows:

* WildFly
* FastAPI

to run as Windows background services even after closing terminals.

---

# WildFly NSSM Setup

## Install Service

```bash
nssm install PingSpyderWildFly
```

### Configuration

#### Path

```text
D:\wildfly-39.0.1.Final\bin\standalone.bat
```

#### Startup Directory

```text
D:\wildfly-39.0.1.Final\bin
```

#### Startup Type

```text
Automatic
```

---

# FastAPI NSSM Setup

## Install Service

```bash
nssm install PingSpyderFastApi
```

### Configuration

#### Path

```text
<venv>\Scripts\python.exe
```

#### Startup Directory

```text
D:\SOS Infotech\pingspyder\service
```

#### Arguments

```text
-m uvicorn main:app --host 0.0.0.0 --port 8000
```

---

# JAVA_HOME Configuration

## Problem

WildFly service failed with:

```text
JAVA_HOME is not set.
```

---

## Solution

Added system environment variable:

### Variable Name

```text
JAVA_HOME
```

### Variable Value

```text
C:\Program Files\Java\jdk-21
```

Added to PATH:

```text
%JAVA_HOME%\bin
```

Restarted Windows after configuration.

---

# Git Monorepo Setup

## Final Structure

```text
pingspyder/
├── backend/
├── frontend/
└── service/
```

---

# Git Remote Setup

## Remove old remote

```bash
git remote remove origin
```

---

## Add new remote

```bash
git remote add origin https://github.com/psahu-sos/pingspyder.git
```

---

# Push Main Branch

```bash
git push -u origin main
```

---

# Working with Dev Branch

## Pull latest dev changes

```bash
git checkout Dev
git pull origin Dev
```

---

## Push changes to dev

```bash
git add .
git commit -m "Your commit message"
git push origin Dev
```

---

# Common Problems Faced and Solutions

---

## 1. Swagger 404 in WildFly

### Problem

```text
http://localhost:8080/swagger-ui/index.html
```

returned 404.

### Solution

Use:

```text
http://localhost:8080/pingspyder-backend/swagger-ui/index.html
```

because WAR name becomes context path.

---

## 2. Port 8080 Already in Use

### Error

```text
Port 8080 was already in use
```

### Solution

Changed local Spring Boot port to 8081.

---

## 3. NSSM Service Stops Immediately

### Cause

* Incorrect JAVA_HOME
* Incorrect startup directory
* Broken deployment

### Solution

* Set JAVA_HOME
* Reconfigured NSSM
* Restarted WildFly
* Cleaned deployment cache

---

## 4. FastAPI Stops After Closing Terminal

### Cause

FastAPI was running manually instead of through NSSM service.

### Solution

Configured FastAPI using NSSM service.

---

## 5. Git Push Rejected

### Error

```text
Updates were rejected because the remote contains work that you do not have locally
```

### Solution

Used force push after resetting repository history:

```bash
git push origin main --force
```

---

## 6. MongoDB Credentials Leaked in Public Repository

### Problem

GitHub secret scanning detected MongoDB URI.

### Solution

* Removed credentials
* Rewrote repository history
* Force pushed clean repository
* Future recommendation: use environment variables

---

# Final Working URLs

## Backend Swagger

```text
http://localhost:8080/pingspyder-backend/swagger-ui/index.html
```

---

## FastAPI Swagger

```text
http://localhost:8000/docs
```

---

# Final Architecture

| Component | Technology                |
| --------- | ------------------------- |
| Backend   | Spring Boot + WildFly     |
| Frontend  | React                     |
| Service   | FastAPI                   |
| Database  | MongoDB                   |
| Hosting   | Windows Services via NSSM |
| API Docs  | Swagger / OpenAPI         |

---

# Deployment Status

| Service      | Status                     |
| ------------ | -------------------------- |
| WildFly      | Running as Windows Service |
| FastAPI      | Running as Windows Service |
| Backend WAR  | Successfully deployed      |
| Swagger      | Accessible                 |
| Git Monorepo | Configured                 |
| Dev Workflow | Working                    |

---
