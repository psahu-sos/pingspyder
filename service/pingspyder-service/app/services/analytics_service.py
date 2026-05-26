from collections import defaultdict

from app.db.mongo import get_database

from app.repositories.analytics_repository import (
    fetch_ping_history
)

from app.config.settings import DB_CONFIG

from app.utils.logger import get_logger

logger = get_logger(__name__)

logger.info(
    "Loaded module: analytics_service.py"
)


def build_query(
    start_date=None,
    end_date=None,
    routes=None,
    stretches=None,
    locations=None,
):

    query = {}

    if start_date or end_date:

        query["lastUpdated"] = {}

        if start_date:
            query["lastUpdated"]["$gte"] = start_date

        if end_date:
            query["lastUpdated"]["$lte"] = end_date

    if routes:

        regex_pattern = "^(" + "|".join(
            f"{route}(\\.|-|$)"
            for route in routes
        ) + ")"

        query["TAG_ID"] = {
            "$regex": regex_pattern
        }

    if stretches:

        query["Stretch"] = {
            "$in": stretches
        }

    if locations:

        query["LOCATION"] = {
            "$in": locations
        }

    logger.info(
        f"Mongo query built: {query}"
    )

    return query


def extract_failed_devices(failed_devices):

    devices = []

    for item in failed_devices:

        item = item.strip()

        if "(" in item:

            device_name, ip = item.split("(")

            devices.append(
                {
                    "device_name": device_name.strip(),
                    "ip": ip.replace(")", "").strip()
                }
            )

        else:

            devices.append(
                {
                    "device_name": item.strip(),
                    "ip": ""
                }
            )

    return devices


def process_document(
    doc,
    grouped,
    devices_filter
):

    tag = str(
        doc.get("TAG_ID", "")
    ).strip().upper()

    stretch = doc.get("Stretch", "")

    location = doc.get("LOCATION", "")

    status = doc.get(
        "status",
        "UNKNOWN"
    )

    timestamp = doc.get("lastUpdated")

    failed_devices = extract_failed_devices(
        doc.get("failedDevices", [])
    )

    if not failed_devices:

        grouped[(tag, "SITE")].append(
            {
                "tag_id": tag,
                "stretch": stretch,
                "location": location,
                "device_name": "SITE",
                "ip": "",
                "status": status,
                "timestamp": timestamp,
            }
        )

        return

    for failed in failed_devices:

        device_name = failed["device_name"]

        if (
            devices_filter
            and device_name not in devices_filter
        ):
            continue

        grouped[
            (
                tag,
                device_name,
                failed["ip"]
            )
        ].append(
            {
                "tag_id": tag,
                "stretch": stretch,
                "location": location,
                "device_name": device_name,
                "ip": failed["ip"],
                "status": "DOWN",
                "timestamp": timestamp,
            }
        )


def build_result(items):

    items = sorted(
        items,
        key=lambda x: x["timestamp"]
    )

    latest = items[-1]

    offline_count = sum(
        1 for x in items
        if x["status"] == "DOWN"
    )

    online_count = sum(
        1 for x in items
        if x["status"] == "UP"
    )

    last_down = next(
        (
            item["timestamp"]
            for item in reversed(items)
            if item["status"] == "DOWN"
        ),
        None
    )

    last_up = next(
        (
            item["timestamp"]
            for item in reversed(items)
            if item["status"] == "UP"
        ),
        None
    )

    return {
        "tagId": latest["tag_id"],

        "route": latest["tag_id"]
        .split(".")[0]
        .split("-")[0],

        "stretch": latest["stretch"],

        "location": latest["location"],

        "deviceName": latest["device_name"],

        "ip": latest["ip"],

        "currentStatus": latest["status"],

        "offlineCount": offline_count,

        "onlineCount": online_count,

        "firstReportTime": items[0]["timestamp"],

        "lastDownTime": last_down,

        "lastUpTime": last_up,
    }


def paginate_results(
    results,
    page,
    page_size
):

    start_index = (
        (page - 1)
        * page_size
    )

    end_index = (
        start_index
        + page_size
    )

    return results[
        start_index:end_index
    ]


def generate_historical_analytics(
    project,
    start_date=None,
    end_date=None,
    routes=None,
    stretches=None,
    locations=None,
    devices=None,
    page=1,
    page_size=50
):

    logger.info(
        f"Generating analytics | project={project}"
    )

    config = DB_CONFIG[project]

    db = get_database(config["db"])

    collection = db[config["collection"]]

    query = build_query(
        start_date=start_date,
        end_date=end_date,
        routes=routes,
        stretches=stretches,
        locations=locations
    )

    docs = fetch_ping_history(
        collection,
        query
    )

    logger.info(
        f"Mongo documents fetched: {len(docs)}"
    )

    grouped = defaultdict(list)

    for doc in docs:

        process_document(
            doc,
            grouped,
            devices
        )

    results = [
        build_result(items)
        for items in grouped.values()
    ]

    paginated_results = paginate_results(
        results,
        page,
        page_size
    )

    logger.info(
        f"Analytics generated successfully | "
        f"results={len(results)}"
    )

    return {
        "totalRecords": len(results),
        "page": page,
        "pageSize": page_size,
        "results": paginated_results
    }