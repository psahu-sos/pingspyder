# Systemd Service Configuration

## Overview

PingSpyder Service can be managed as a Linux systemd service for:
- automatic startup
- process management
- service monitoring
- restart handling

---

# Service File Location

```text
/etc/systemd/system/pingspyder-service.service
```

---

# Service Configuration

```ini
[Unit]
Description=PingSpyder Service
After=network.target

[Service]

User=root

WorkingDirectory=/opt/pingspyder-service

ExecStart=/opt/pingspyder-service/venv/bin/gunicorn \
          app.main:app \
          -k uvicorn.workers.UvicornWorker \
          --workers 4 \
          --bind 0.0.0.0:8000

Restart=always

[Install]
WantedBy=multi-user.target
```

---

# Reload Systemd

```bash
sudo systemctl daemon-reload
```

---

# Enable Service

```bash
sudo systemctl enable pingspyder-service
```

---

# Start Service

```bash
sudo systemctl start pingspyder-service
```

---

# Stop Service

```bash
sudo systemctl stop pingspyder-service
```

---

# Restart Service

```bash
sudo systemctl restart pingspyder-service
```

---

# Service Status

```bash
sudo systemctl status pingspyder-service
```

---

# Service Logs

```bash
journalctl -u pingspyder-service -f
```

---

# Verify Gunicorn Process

```bash
ps -ef | grep gunicorn
```

---

# Verify Port

```bash
netstat -tulnp | grep 8000
```

---

# Health Check Verification

```bash
curl http://localhost:8000/api/v1/monitoring/health
```

---

# Benefits of systemd

- automatic restart
- process monitoring
- startup automation
- centralized service management
- production reliability

---

# Best Practices

- use virtual environments
- verify service logs regularly
- monitor Gunicorn workers
- validate health endpoint after restart
- use Nginx reverse proxy in production