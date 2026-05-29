from app.db.mongo import get_database
from app.config.settings import DB_CONFIG
from app.utils.logger import get_logger

logger = get_logger(__name__)

logger.info("Loaded module: indexes.py")


def create_indexes():

    logger.debug("Entering function: create_indexes")

    for config in DB_CONFIG.values():

        logger.info(
            f"Creating indexes for database: {config['db']} | "
            f"collection: {config['collection']}"
        )

        db = get_database(config["db"])

        collection = db[config["collection"]]

        collection.create_index("TAG_ID")
        collection.create_index("status")
        collection.create_index("lastUpdated")
        collection.create_index("Stretch")
        collection.create_index("LOCATION")

        logger.info(
            f"Indexes created successfully for collection: "
            f"{config['collection']}"
        )