# Filter API

## Overview

The Filter API provides dropdown filter options for analytics and monitoring modules.

The API dynamically fetches filter values from MongoDB monitoring data.

---

# Filter Options

## Endpoint

```http
GET /api/v1/filters/{project}/options
```

## Description

Fetches available:
- routes
- stretches
- locations
- device names

for frontend filtering and analytics operations.

---

## Supported Projects

- d2
- d3
- combined

---

## Sample Request

```http
GET /api/v1/filters/d2/options
```

---

## Success Response

```json
{
  "success": true,
  "message": "Filter options fetched successfully",
  "timestamp": "2026-05-23T07:46:10.502939+00:00",
  "data": {
    "routes": [
      "ROUTE1",
      "ROUTE2"
    ],
    "stretches": [
      "Stretch-A",
      "Stretch-B"
    ],
    "locations": [
      "Location-A",
      "Location-B"
    ],
    "devices": [
      "SWITCH_IP",
      "DNS_IP"
    ]
  }
}
```

---

# Filter Categories

| Filter | Description |
|---|---|
| routes | Route-based filtering |
| stretches | Stretch-based filtering |
| locations | Location-based filtering |
| devices | Device-based filtering |

---

# Status Codes

| Status Code | Description |
|---|---|
| 200 | Filter options fetched successfully |
| 400 | Invalid request |
| 404 | Project not found |
| 500 | Internal server error |