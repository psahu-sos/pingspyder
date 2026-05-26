from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

import time

from app.routes.monitoring_routes import (
    router as monitoring_router
)

from app.routes.analytics_routes import (
    router as analytics_router
)

from app.routes.filter_routes import (
    router as filter_router
)

from app.core.exception_handler import (
    global_exception_handler
)

from app.utils.logger import logger
from app.config.settings import APP_NAME

logger.info(
    "Starting PingSpyder application"
)

app = FastAPI(
    title=APP_NAME,
    description="Network Analytics Engine",
    version="1.0.0",
    docs_url="/pingspyder-service/docs",
    redoc_url="/pingspyder-service/redoc",
    openapi_url="/pingspyder-service/openapi.json"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Logging Middleware
@app.middleware("http")
async def log_requests(
    request: Request,
    call_next
):

    start_time = time.time()

    response = await call_next(request)

    process_time = round(
        time.time() - start_time,
        2
    )

    logger.info(
        f"{request.method} "
        f"{request.url.path} "
        f"status={response.status_code} "
        f"time={process_time}s"
    )

    return response


# Routers
app.include_router(monitoring_router)

app.include_router(analytics_router)

app.include_router(filter_router)

logger.info(
    "Routes registered successfully"
)

# Global Exception Handler
app.add_exception_handler(
    Exception,
    global_exception_handler
)

logger.info(
    "Global exception handler registered"
)