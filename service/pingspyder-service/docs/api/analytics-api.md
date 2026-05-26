# Analytics API

## Overview

The Analytics API provides historical outage analytics, monitoring statistics, and infrastructure reporting.

---

# Historical Analytics

## Endpoint

```http
GET /api/v1/analytics/{project}/history
```

## Description

Fetches historical outage analytics and monitoring history from MongoDB.

Supports:
- route filtering
- stretch filtering
- location filtering
- device filtering
- date filtering
- pagination

---

## Supported Projects

- d2
- d3
- combined

---

## Query Parameters

| Parameter | Type | Description |
|---|---|---|
| start_date | datetime | Start date filter |
| end_date | datetime | End date filter |
| routes | list | Route filtering |
| stretches | list | Stretch filtering |
| locations | list | Location filtering |
| devices | list | Device filtering |
| page | int | Pagination page number |
| page_size | int | Records per page |

---

## Sample Request

```http
GET /api/v1/analytics/d2/history?page=1&page_size=10
```

---

## Success Response

```json
{
  "success": true,
  "message": "Analytics generated successfully",
  "timestamp": "2026-05-23T07:46:10.502939+00:00",
  "data": {
    "totalRecords": 100,
    "page": 1,
    "pageSize": 10,
    "results": [
      {
        "tagId": "SITE001",
        "route": "ROUTE1",
        "stretch": "Stretch-A",
        "location": "Location-A",
        "deviceName": "SWITCH_IP",
        "ip": "192.168.1.1",
        "currentStatus": "DOWN",
        "offlineCount": 10,
        "onlineCount": 25,
        "firstReportTime": "2026-05-23T07:46:10.502939+00:00",
        "lastDownTime": "2026-05-23T07:46:10.502939+00:00",
        "lastUpTime": "2026-05-23T07:46:10.502939+00:00"
      }
    ]
  }
}
```

---

# Pagination

Pagination is supported using:
- page
- page_size

---

# Status Codes

| Status Code | Description |
|---|---|
| 200 | Analytics generated successfully |
| 400 | Invalid request |
| 404 | Project not found |
| 500 | Internal server error |