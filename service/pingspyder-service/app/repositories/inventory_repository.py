from app.utils.constants import (
    LOCATIONS_COLLECTION,
    STRETCH_COLLECTION,
    MAPPING_COLLECTION,
    IP_DETAILS_COLLECTION,
)

from app.utils.logger import get_logger

logger = get_logger(__name__)

logger.info("Loaded module: inventory_repository.py")


def get_locations(db):

    logger.debug("Entering function: get_locations")

    return list(db[LOCATIONS_COLLECTION].find())


def get_stretches(db):

    logger.debug("Entering function: get_stretches")

    return list(db[STRETCH_COLLECTION].find())


def get_mappings(db):

    logger.debug("Entering function: get_mappings")

    return list(db[MAPPING_COLLECTION].find())


def get_ip_details(db):

    logger.debug("Entering function: get_ip_details")

    return list(db[IP_DETAILS_COLLECTION].find())