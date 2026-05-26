# API Documentation - PingSpyder Backend

# Base URL

```text
http://localhost:8080
```

---

# Authentication

The application uses JWT-based authentication.

Protected APIs require:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# Authentication APIs

# 1. Login

## Endpoint

```http
POST /api/auth/login
```

## Description

Authenticates user and generates JWT token.

## Request Body

```json
{
  "username": "admin",
  "password": "adminscope505"
}
```

## Response

```json
{
  "username": "admin",
  "role": "ADMIN",
  "token": "JWT_TOKEN",
  "message": "Login Successful"
}
```

---

# 2. Logout

## Endpoint

```http
POST /api/auth/logout
```

## Headers

```http
Authorization: Bearer JWT_TOKEN
```

## Response

```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

# User Management APIs

# 1. Create User

## Endpoint

```http
POST /api/users
```

## Description

Creates a new user.

## Request Body

```json
{
  "username": "testuser",
  "password": "password123",
  "role": "ADMIN"
}
```

## Response

```json
{
  "success": true,
  "message": "User created successfully"
}
```

---

# 2. Get All Users

## Endpoint

```http
GET /api/users
```

## Response

```json
[
  {
    "id": "USER_ID",
    "username": "admin",
    "role": "ADMIN",
    "enabled": true
  }
]
```

---

# 3. Get User By ID

## Endpoint

```http
GET /api/users/{id}
```

## Path Variable

| Variable | Description |
|----------|-------------|
| id       | User ID     |

---

# 4. Update User

## Endpoint

```http
PUT /api/users/{id}
```

## Request Body

```json
{
  "username": "updateduser",
  "password": "newpassword",
  "role": "ADMIN",
  "enabled": true
}
```

---

# 5. Delete User

## Endpoint

```http
DELETE /api/users/{id}
```

---

# Monitoring APIs

# 1. Process Monitoring Excel

## Endpoint

```http
POST /api/monitor/{project}/process
```

## Description

Uploads monitoring Excel file to Python service.

## Request Type

```text
multipart/form-data
```

## Parameters

| Parameter | Type          |
|-----------|---------------|
| file      | MultipartFile |

---

# 2. Run Monitoring

## Endpoint

```http
POST /api/monitor/{project}/run
```

## Description

Triggers monitoring execution through Python service.

---

# Report APIs

# 1. Upload Report and Generate PDF

## Endpoint

```http
POST /api/reports/upload/{project}
```

## Request Type

```text
multipart/form-data
```

## Parameters

| Parameter | Type          |
|-----------|---------------|
| file      | MultipartFile |
| mode      | String        |

## Modes

| Mode | Description     |
|------|-----------------|
| full | Full report     |
| lite | Filtered report |

---

# 2. Generate Report from MongoDB

## Endpoint

```http
GET /api/reports/{project}/from-db
```

## Parameters

| Parameter | Description |
|-----------|-------------|
| mode      | full / lite |

---

# 3. Upload Combined Report

## Endpoint

```http
POST /api/reports/upload/combined
```

---

# 4. Generate Combined Mongo Report

## Endpoint

```http
GET /api/reports/combined/from-db
```

---

# Filter APIs

# 1. Get Devices

## Endpoint

```http
GET /api/filters/{project}/devices
```

## Description

Fetches device filter options from Python service.

## Response

```json
[
  "DEVICE_1",
  "DEVICE_2"
]
```

---

# Analytics APIs

# 1. Fetch Analytics

## Endpoint

```http
GET /api/analytics/{project}
```

## Query Parameters

| Parameter | Description      |
|-----------|------------------|
| routes    | Route filters    |
| stretches | Stretch filters  |
| locations | Location filters |
| devices   | Device filters   |
| startDate | Start date       |
| endDate   | End date         |
| page      | Page number      |
| pageSize  | Records per page |

---

# Security

## Authentication Type

```text
JWT Authentication
```

## Authorization

```text
Role Based Access Control
```

## Protected Roles

| Role  | Access      |
|-------|-------------|
| ADMIN | Full Access |

---

# HTTP Status Codes

| Status Code | Meaning                |
|-------------|------------------------|
| 200         | Success                |
| 400         | Bad Request            |
| 401         | Unauthorized           |
| 403         | Forbidden              |
| 404         | Not Found              |
| 500         | Internal Server Error  |
| 502         | Python Gateway Failure |

---

# Exception Handling

Global exception handling implemented using:

```text
@RestControllerAdvice
```

Custom exceptions:

- InvalidProjectException
- MongoFetchException
- PdfGenerationException
- PythonServiceException
- UserNotFoundException

---

# Logging

Logging implemented for:

- API Requests
- Authentication
- MongoDB Operations
- PDF Generation
- Python Gateway Calls
- Exception Handling

---

# Notes

- All protected APIs require JWT token.
- Python FastAPI service must be running for monitoring and analytics APIs.
- MongoDB Atlas connectivity is required.
- WAR deployment supported for JBoss/WildFly.