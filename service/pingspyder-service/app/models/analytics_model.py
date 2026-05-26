from typing import Optional
from datetime import datetime

from pydantic import BaseModel

from app.utils.logger import get_logger

logger = get_logger(__name__)

logger.info("Loaded module: analytics_model.py")


class AnalyticsResponse(BaseModel):

    logger.debug("Initializing AnalyticsResponse model")

    tag_id: str

    stretch: str

    device_name: str

    ip: str

    first_report_time: Optional[datetime] = None

    last_down_time: Optional[datetime] = None

    last_up_time: Optional[datetime] = None

    current_status: str

    offline_count: int

    online_count: int