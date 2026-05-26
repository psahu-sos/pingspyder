from fastapi import Request
from fastapi.responses import JSONResponse

from app.utils.logger import get_logger

logger = get_logger(__name__)

logger.info(
    "Loaded module: exception_handler.py"
)


def global_exception_handler(
    request: Request,
    exc: Exception
):

    logger.debug(
        "Entering function: global_exception_handler"
    )

    logger.error(
        f"Unhandled exception | "
        f"path={request.url.path} | "
        f"method={request.method} | "
        f"error={str(exc)}",
        exc_info=True
    )

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": str(exc),
            "data": None
        }
    )