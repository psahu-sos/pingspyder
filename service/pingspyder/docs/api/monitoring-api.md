# Monitoring API

## Overview

The Monitoring API provides endpoints for:
- health checks
- Excel-based monitoring
- MongoDB-based monitoring

---

# Health Check API

## Endpoint

```http
GET /api/v1/monitoring/health
```

## Description

Verifies whether the PingSpyder monitoring service is running successfully.

## Response

```json
{
  "success": true,
  "message": "PingSpyder Running"
}
```

---

# Process Excel Monitoring

## Endpoint

```http
POST /api/v1/monitoring/{project}/process
```

## Description

Processes uploaded Excel inventory files and performs concurrent IP monitoring.

## Supported Projects

- d2
- d3
- combined

## Request Type

```text
multipart/form-data
```

## Request Parameter

| Parameter | Type | Required |
|---|---|---|
| file | UploadFile | Yes |

## Success Response

```json
{
  "success": true,
  "message": "Excel monitoring completed",
  "timestamp": "2026-05-23T07:46:10.502939+00:00",
  "data": {
    "totalSites": 221,
    "totalIPs": 3079
  }
}
```

---

# Mongo Monitoring

## Endpoint

```http
POST /api/v1/monitoring/{project}/monitor
```

## Description

Fetches inventory data from MongoDB and performs concurrent IP monitoring.

## Supported Projects

- d2
- d3
- combined

## Success Response

```json
{
  "success": true,
  "message": "Mongo monitoring completed"
}
```

---

# Status Codes

| Status Code | Description |
|---|---|
| 200 | Request processed successfully |
| 400 | Invalid request |
| 404 | Project not found |
| 500 | Internal server error |