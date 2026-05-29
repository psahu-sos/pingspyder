from enum import Enum
from app.utils.logger import get_logger
logger = get_logger(__name__)
logger.info("Loaded module: enums.py")

class ProjectType(str, Enum):

    d2 = "d2"
    d3 = "d3"
    combined = "combined"