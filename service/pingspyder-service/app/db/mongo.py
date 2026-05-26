from pymongo import MongoClient

from app.config.settings import MONGO_URI
from app.utils.logger import get_logger

logger = get_logger(__name__)

logger.info("Loaded module: mongo.py")

logger.debug("Initializing MongoDB client")

client = MongoClient(MONGO_URI)

logger.info("MongoDB client initialized successfully")


def get_database(db_name: str):

    logger.debug(f"Entering function: get_database | db_name={db_name}")

    return client[db_name]