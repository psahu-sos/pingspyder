from app.utils.logger import get_logger

logger = get_logger(__name__)

logger.info("Loaded module: monitoring_repository.py")


def save_monitoring_results(
    db,
    collection_name: str,
    documents: list
) -> int:

    logger.debug("Entering function: save_monitoring_results")

    try:

        collection = db[collection_name]

        if not documents:

            logger.warning(
                f"No documents to save in collection: {collection_name}"
            )

            return 0

        logger.info(
            f"Saving {len(documents)} documents into "
            f"collection: {collection_name}"
        )

        result = collection.insert_many(documents)

        inserted_count = len(result.inserted_ids)

        logger.info(
            f"{inserted_count} documents inserted into "
            f"{collection_name}"
        )

        return inserted_count

    except Exception as e:

        logger.error(
            f"Failed to save monitoring results: {str(e)}",
            exc_info=True
        )

        raise