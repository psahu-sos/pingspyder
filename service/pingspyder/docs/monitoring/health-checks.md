# Health Checks

## Overview

PingSpyder Service provides health check endpoints for verifying:
- application availability
- API responsiveness
- deployment status
- monitoring engine status

Health checks are used for:
- deployment validation
- uptime monitoring
- load balancer verification
- production monitoring

---

# Health Check Endpoint

## Endpoint

```http
GET /api/v1/monitoring/health
```

---

# Description

The endpoint verifies whether the PingSpyder Service is running successfully.

---

# Success Response

```json
{
  "success": true,
  "message": "PingSpyder Running"
}
```

---

# Status Codes

| Status Code | Description |
|---|---|
| 200 | Service running successfully |
| 500 | Internal server error |

---

# Local Verification

## Browser

```text
http://localhost:8000/api/v1/monitoring/health
```

---

# CURL Verification

```bash
curl http://localhost:8000/api/v1/monitoring/health
```

---

# Production Verification

```bash
curl http://server-ip/api/v1/monitoring/health
```

---

# Deployment Validation

The health endpoint should be verified after:
- local setup
- production deployment
- server restart
- application update
- infrastructure migration

---

# Monitoring Usage

Health checks can be integrated with:
- Nginx
- load balancers
- monitoring dashboards
- Kubernetes probes
- uptime monitoring systems

---

# Recommended Monitoring Frequency

| Environment | Frequency |
|---|---|
| Development | Manual |
| Production | Every 30 seconds |
| Enterprise Monitoring | Every 10 seconds |

---

# Troubleshooting

## Endpoint Not Responding

Possible causes:
- application not running
- incorrect port
- server issue
- deployment failure

---

# Verification Steps

1. Verify application status
2. Verify Gunicorn process
3. Verify Nginx configuration
4. Verify server port
5. Verify application logs

---

# Verify Logs

## Application Logs

```bash
tail -f logs/application.log
```

---

# Linux Service Logs

```bash
journalctl -u pingspyder -f
```

---

# Best Practices

- Always verify health endpoint after deployment
- Use automated uptime monitoring
- Monitor response time
- Monitor server resources
- Validate health checks during CI/CD deployment