from datetime import datetime
from typing import Optional, List, Annotated

from fastapi import APIRouter, Query

from app.core.enums import ProjectType

from app.core.response_builder import (
    success_response
)

from app.services.analytics_service import (
    generate_historical_analytics
)

from app.utils.logger import get_logger

logger = get_logger(__name__)

logger.info(
    "Loaded module: analytics_routes.py"
)

router = APIRouter(
    prefix="/api/v1/analytics",
    tags=["Analytics"]
)


@router.get(
    "/{project}/history",
    summary="Historical outage analytics",
    description="""
Historical monitoring analytics.

Supports:
- route filtering
- stretch filtering
- location filtering
- device filtering
- status filtering
- date filtering
"""
)
def historical_analytics(

    project: ProjectType,

    start_date: Annotated[
        Optional[datetime],
        Query(description="Start date filter")
    ] = None,

    end_date: Annotated[
        Optional[datetime],
        Query(description="End date filter")
    ] = None,

    routes: Annotated[
        Optional[List[str]],
        Query(description="Route filters")
    ] = None,

    stretches: Annotated[
        Optional[List[str]],
        Query(description="Stretch filters")
    ] = None,

    locations: Annotated[
        Optional[List[str]],
        Query(description="Location filters")
    ] = None,

    devices: Annotated[
        Optional[List[str]],
        Query(description="Device filters")
    ] = None,

    page: Annotated[
        int,
        Query(
            ge=1,
            description="Page number"
        )
    ] = 1,

    page_size: Annotated[
        int,
        Query(
            ge=1,
            le=100,
            description="Records per page"
        )
    ] = 10
):

    logger.debug(
        "Entering function: historical_analytics"
    )

    logger.info(
        f"Generating analytics | project={project.value}"
    )

    result = generate_historical_analytics(
        project=project.value,
        start_date=start_date,
        end_date=end_date,
        routes=routes,
        stretches=stretches,
        locations=locations,
        devices=devices,
        page=page,
        page_size=page_size
    )

    logger.info(
        "Historical analytics generated successfully"
    )

    return success_response(
        "Analytics generated successfully",
        result
    )