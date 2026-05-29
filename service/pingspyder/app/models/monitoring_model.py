from typing import List

from pydantic import BaseModel

from app.utils.logger import get_logger

logger = get_logger(__name__)

logger.info("Loaded module: monitoring_model.py")


class MonitoringResult(BaseModel):

    logger.debug("Initializing MonitoringResult model")

    tag: str

    stretch: str

    location: str

    failedDevices: List[str]

    status: str