from fastapi import FastAPI

from app.routes.monitoring_routes import (router)

from app.core.exception_handler import (global_exception_handler)

from app.utils.logger import get_logger

logger = get_logger(__name__)

logger.info("Loaded module: run.py")

logger.info("Initializing FastAPI application")

app = FastAPI(title="PingSpyder")

logger.info("Registering monitoring routes")

app.include_router(
    router
)

logger.info("Registering global exception handler")

app.add_exception_handler(Exception,global_exception_handler)

logger.info(
    "FastAPI application initialized successfully"
)

# python -m uvicorn app.main:app --reload