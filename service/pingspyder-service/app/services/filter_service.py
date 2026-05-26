from app.db.mongo import get_database

from app.config.settings import DB_CONFIG

from app.utils.logger import get_logger

logger = get_logger(__name__)

logger.info("Loaded module: filter_service.py")


def get_filter_options(project):

    logger.debug("Entering function: get_filter_options")

    logger.info(
        f"Fetching filter options for project: {project}"
    )

    config = DB_CONFIG[project]

    db = get_database(
        config["db"]
    )

    collection = db[
        config["collection"]
    ]

    docs = list(
        collection.find()
    )

    logger.info(
        f"Documents fetched from MongoDB: {len(docs)}"
    )

    routes = set()

    stretches = set()

    locations = set()

    devices = set()

    for doc in docs:

        tag = doc.get(
            "TAG_ID",
            ""
        )

        if tag:

            route = (
                tag
                .split(".")[0]
                .split("-")[0]
            )

            routes.add(route)

        stretch = doc.get(
            "Stretch",
            ""
        )

        if stretch:

            stretches.add(stretch)

        location = doc.get(
            "LOCATION",
            ""
        )

        if location:

            locations.add(location)

        for device in doc.get(
            "failedDevices",
            []
        ):

            device_name = (
                device
                .split("(")[0]
                .strip()
            )

            devices.add(device_name)

    logger.info(
        "Filter options generated successfully"
    )

    return {

        "routes": sorted(routes),

        "stretches": sorted(stretches),

        "locations": sorted(locations),

        "devices": sorted(devices),
    }