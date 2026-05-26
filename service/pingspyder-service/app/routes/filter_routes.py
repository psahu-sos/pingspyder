from fastapi import APIRouter

from app.core.enums import ProjectType

from app.core.response_builder import success_response

from app.services.filter_service import (
    get_filter_options
)

from app.utils.logger import get_logger

logger = get_logger(__name__)

logger.info("Loaded module: filter_routes.py")

router = APIRouter(
    prefix="/api/v1/filters",
    tags=["Filters"]
)


@router.get(
    "/{project}/options",
    summary="Filter dropdown options"
)
def filter_options(
    project: ProjectType
):

    logger.debug("Entering function: filter_options")

    logger.info(
        f"Fetching filter options for project: {project.value}"
    )

    result = get_filter_options(
        project.value
    )

    logger.info(
        "Filter options fetched successfully"
    )

    return success_response(
        "Filter options fetched successfully",
        result
    )