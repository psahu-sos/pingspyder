import logging
import os

LOG_DIR = "logs"

os.makedirs(LOG_DIR,exist_ok=True)

LOG_FILE = os.path.join(LOG_DIR,"application.log")

logging.basicConfig(
    level=logging.INFO,
    format=(
        "%(asctime)s - "
        "%(name)s - "
        "%(levelname)s - "
        "%(message)s"
    ),
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler()
    ]
)

# Reduce noisy third-party logs
logging.getLogger("pymongo").setLevel(logging.WARNING)
logging.getLogger("urllib3").setLevel(logging.WARNING)

logger = logging.getLogger(__name__)

logger.info("Logger module initialized")

logger.info(f"Application logs will be stored at: {LOG_FILE}")

def get_logger(name: str):

    return logging.getLogger(name)