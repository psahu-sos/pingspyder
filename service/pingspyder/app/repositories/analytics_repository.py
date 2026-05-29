from app.utils.logger import get_logger

logger = get_logger(__name__)

logger.info("Loaded module: analytics_repository.py")


def fetch_ping_history(
    collection,
    query
):

    logger.debug("Entering function: fetch_ping_history")

    return list(
        collection.find(query).sort(
            "lastUpdated",
            1
        )
    )