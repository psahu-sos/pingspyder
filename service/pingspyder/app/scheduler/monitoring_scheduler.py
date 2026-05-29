from apscheduler.schedulers.background import BackgroundScheduler

from app.utils.logger import get_logger

logger = get_logger(__name__)

logger.info("Loaded module: monitoring_scheduler.py")

scheduler = BackgroundScheduler()

logger.info("BackgroundScheduler initialized")


def start_scheduler():

    logger.debug("Entering function: start_scheduler")

    logger.info("Starting monitoring scheduler")

    scheduler.start()

    logger.info("Monitoring scheduler started successfully")