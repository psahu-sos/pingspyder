from datetime import datetime, UTC
from app.utils.logger import get_logger

logger = get_logger(__name__)

logger.info("Loaded module: response_builder.py")


def success_response(message: str, data=None):

    logger.debug("Entering function: success_response")

    return {
        "success": True,
        "message": message,
        "timestamp": datetime.now(UTC),
        "data": data
    }


def error_response(message: str):

    logger.debug("Entering function: error_response")

    return {
        "success": False,
        "message": message,
        "timestamp": datetime.now(UTC),
        "data": None
    }