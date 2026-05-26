# MongoDB Schema

## Overview

PingSpyder Service uses MongoDB for storing:
- monitoring history
- outage analytics
- inventory mappings
- device information

---

# Database Collections

| Collection | Purpose |
|---|---|
| new_ping_data_2 | Deesha 2 monitoring history |
| new_ping_data_3 | Deesha 3 monitoring history |
| new_ping_data_2_3 | Combined monitoring history |
| ip_details | Device inventory |
| stretches | Stretch information |
| locations | Location information |
| stretch_mappings | Stretch mapping configuration |

---

# Monitoring Collection Structure

## Sample Document

```json
{
  "runId": "uuid",
  "TAG_ID": "SITE001",
  "Stretch": "Stretch-A",
  "LOCATION": "Location-A",
  "failedDevices": [
    "SWITCH_IP (192.168.1.1)"
  ],
  "status": "DOWN",
  "lastUpdated": "2026-05-23T07:46:10.502939+00:00"
}
```

---

# Monitoring Fields

| Field | Type | Description |
|---|---|---|
| runId | string | Unique monitoring execution ID |
| TAG_ID | string | Site or route identifier |
| Stretch | string | Stretch name |
| LOCATION | string | Site location |
| failedDevices | list | Failed device list |
| status | string | Current monitoring status |
| lastUpdated | datetime | Monitoring timestamp |

---

# Inventory Collection Structure

## Sample Document

```json
{
  "_id": "SITE001",
  "gateway_ip": "192.168.1.1",
  "dns_ip": "192.168.1.2",
  "switch_ip": "192.168.1.3"
}
```

---

# Indexes

The following indexes are created for analytics optimization:

| Field | Purpose |
|---|---|
| TAG_ID | Site search |
| status | Status filtering |
| lastUpdated | Date filtering |
| Stretch | Stretch filtering |
| LOCATION | Location filtering |

---

# Analytics Usage

MongoDB data is used for:
- historical outage analytics
- route analytics
- device analytics
- monitoring history
- dashboard filtering

---

# Database Relationships

| Collection | Related Collection |
|---|---|
| ip_details | locations |
| ip_details | stretch_mappings |
| stretch_mappings | stretches |

---

# MongoDB Connection

Connection is configured using:

```env
MONGO_URI=your_mongodb_uri
```

---

# Data Retention

Monitoring history is stored for analytics and reporting purposes.

Retention policies can be configured based on deployment requirements.