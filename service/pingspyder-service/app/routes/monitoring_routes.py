from typing import Annotated

from fastapi import (
    APIRouter,
    File,
    UploadFile,
    HTTPException
)

from app.config.settings import DB_CONFIG

from app.core.enums import ProjectType

from app.core.response_builder import (
    success_response
)

from app.services.monitoring_service import (
    process_excel_monitoring,
    process_mongo_monitoring,
)

from app.utils.logger import get_logger

logger = get_logger(__name__)

logger.info("Loaded module: monitoring_routes.py")

router = APIRouter(
    prefix="/api/v1/monitoring",
    tags=["Monitoring"]
)


@router.get("/health")
def health():

    logger.debug("Entering function: health")

    logger.info("Health check endpoint called")

    return {
        "success": True,
        "message": "PingSpyder Engine Running"
    }


@router.post("/{project}/process", responses={404: {"description": "Invalid project"}})
async def process_project_excel(
    project: ProjectType,
    file: Annotated[UploadFile, File(...)]
):

    logger.debug("Entering async function: process_project_excel")

    logger.info(
        f"Excel monitoring request received for project: {project}"
    )

    config = DB_CONFIG.get(project)

    if not config:

        logger.error(
            f"Invalid project received: {project}"
        )

        raise HTTPException(
            status_code=404,
            detail="Invalid project"
        )

    result = await process_excel_monitoring(
        file,
        config["db"],
        config["collection"]
    )

    logger.info(
        f"Excel monitoring completed for project: {project}"
    )

    return success_response(
        "Excel monitoring completed",
        result
    )


@router.post("/{project}/monitor", responses={404: {"description": "Invalid project"}})
def monitor_project(
    project: ProjectType
):

    logger.debug("Entering function: monitor_project")

    logger.info(
        f"Mongo monitoring request received for project: {project}"
    )

    config = DB_CONFIG.get(project)

    if not config:

        logger.error(
            f"Invalid project received: {project}"
        )

        raise HTTPException(
            status_code=404,
            detail="Invalid project"
        )

    result = process_mongo_monitoring(
        config["db"],
        config["collection"]
    )

    logger.info(
        f"Mongo monitoring completed for project: {project}"
    )

    return success_response(
        "Mongo monitoring completed",
        result
    )