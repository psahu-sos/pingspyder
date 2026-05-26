#!/bin/bash

echo "Starting PulseGrid Monitoring Engine"

source venv/bin/activate

gunicorn app.main:app \
  -k uvicorn.workers.UvicornWorker \
  --workers 4 \
  --bind 0.0.0.0:8000