from app.utils.logger import get_logger

logger = get_logger(__name__)

logger.info("Loaded module: exceptions.py")


class MonitoringException(Exception):

    logger.debug("MonitoringException class initialized")


class InventoryException(Exception):

    logger.debug("InventoryException class initialized")


class DatabaseException(Exception):

    logger.debug("DatabaseException class initialized")


class PingException(Exception):

    logger.debug("PingException class initialized")