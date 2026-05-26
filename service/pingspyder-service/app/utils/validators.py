import socket

from app.utils.logger import get_logger

logger = get_logger(__name__)

logger.info("Loaded module: validators.py")


def is_valid_ip(ip: str) -> bool:

    logger.debug("Entering function: is_valid_ip")

    try:

        socket.inet_aton(ip)

        logger.debug(f"Valid IP address: {ip}")

        return True

    except OSError:

        logger.warning(f"Invalid IP address: {ip}")

        return False