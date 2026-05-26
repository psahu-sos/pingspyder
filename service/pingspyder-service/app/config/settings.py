import multiprocessing
import os

from dotenv import load_dotenv

from app.utils.logger import logger

load_dotenv()

logger.info("Loading application settings")

MONGO_URI = os.getenv("MONGO_URI")

ENV = os.getenv("ENV", "development")

APP_HOST = os.getenv("APP_HOST", "0.0.0.0")

APP_PORT = int(os.getenv("APP_PORT", 8000))

APP_NAME = os.getenv("APP_NAME")

CPU_COUNT = multiprocessing.cpu_count()

MAX_WORKERS = int(os.getenv("MAX_WORKERS",min(256, CPU_COUNT * 32)))

PING_TIMEOUT = int(os.getenv("PING_TIMEOUT",2))

DB_CONFIG = {
    "d2": {
        "db": "Deesha",
        "collection": "ping_results"
    },
    "d3": {
        "db": "Deesha",
        "collection": "ping_results"
    },
    "combined": {
        "db": "Deesha",
        "collection": "ping_results"
    }
}

logger.info(f"Environment loaded | env={ENV}")