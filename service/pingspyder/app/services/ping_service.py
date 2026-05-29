from concurrent.futures import (
    ThreadPoolExecutor,
    as_completed
)

from ping3 import ping

from app.config.settings import (
    MAX_WORKERS,
    PING_TIMEOUT
)

from app.utils.logger import get_logger

logger = get_logger(__name__)

logger.info("Loaded module: ping_service.py")


def ping_ip(
    ip: str,
    enable_logging=True
) -> bool:

    logger.debug("Entering function: ping_ip")

    try:

        if not ip:

            logger.warning("Empty IP received")

            return False

        ip = str(ip).strip()

        if not ip:

            logger.warning("Blank IP after strip")

            return False

        logger.debug(f"Pinging IP: {ip}")

        response = ping(
            ip,
            timeout=PING_TIMEOUT
        )

        status = response is not None

        if enable_logging:

            logger.info(
                f"Ping result for {ip}: "
                f"{'SUCCESS' if status else 'FAILED'}"
                )

        return status

    except Exception as e:

        if enable_logging:

            logger.error(
                f"Ping failed for IP: {ip} | Error: {str(e)}",
                exc_info=True
            )

        return False


def ping_all_ips(
    ip_list,
    enable_logging=True
):

    logger.debug("Entering function: ping_all_ips")

    unique_ips = list(set(ip_list))

    if enable_logging:

        logger.info(
            f"Starting ping for {len(unique_ips)} unique IPs"
        )

    results = {}

    with ThreadPoolExecutor(
        max_workers=MAX_WORKERS
    ) as executor:

        future_map = {
            executor.submit(
                ping_ip,
                ip,
                enable_logging
            ): ip
            for ip in unique_ips
        }

        for future in as_completed(future_map):

            ip = future_map[future]

            try:

                results[ip] = future.result()

            except Exception as e:

                logger.error(
                    f"Error processing future for IP: {ip} "
                    f"| Error: {str(e)}",
                    exc_info=True
                )

                results[ip] = False

    if enable_logging:

        logger.info(
            "Completed ping execution for all IPs"
        )

    return results