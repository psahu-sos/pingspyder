from typing import Any

from pydantic import BaseModel

from app.utils.logger import get_logger

logger = get_logger(__name__)

logger.info("Loaded module: response_model.py")


class ApiResponse(BaseModel):

    logger.debug("Initializing ApiResponse model")

    success: bool

    message: str

    data: Any