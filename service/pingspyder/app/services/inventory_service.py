from app.utils.constants import DEVICE_FIELDS

from app.utils.parser import (
    get_valid_ip,
    safe_get
)

from app.utils.validators import is_valid_ip

from app.repositories.inventory_repository import (
    get_locations,
    get_stretches,
    get_mappings,
    get_ip_details,
)

from app.utils.logger import get_logger

logger = get_logger(__name__)

logger.info("Loaded module: inventory_service.py")


def build_tasks_from_excel(df):

    logger.debug("Entering function: build_tasks_from_excel")

    tasks = []

    for _, row in df.iterrows():

        tag = safe_get(
            row,
            ["id", "tag_id", "tag"]
        )

        if not tag:
            continue

        stretch = safe_get(
            row,
            ["stretch"]
        )

        location = safe_get(
            row,
            ["location", "land_mark"]
        )

        for db_field, display_name in DEVICE_FIELDS:

            ip = get_valid_ip(
                row.get(db_field)
            )

            if not ip:
                continue

            tasks.append(
                {
                    "tag": tag,
                    "stretch": stretch,
                    "location": location,
                    "device": display_name,
                    "ip": ip,
                }
            )

    logger.info(
        f"Excel tasks built successfully: {len(tasks)}"
    )

    return tasks


def build_stretch_map(db):

    logger.debug("Entering function: build_stretch_map")

    stretch_map = {}

    for doc in get_stretches(db):

        key = str(
            doc.get("_id", "")
        ).strip().upper()

        value = str(
            doc.get("stretch_name", "")
        ).strip()

        stretch_map[key] = value

    logger.info(
        f"Stretch map created: {len(stretch_map)} entries"
    )

    return stretch_map


def build_location_map(db):

    logger.debug("Entering function: build_location_map")

    location_map = {}

    for doc in get_locations(db):

        key = str(
            doc.get("tag_id_fk")
            or doc.get("tag_id")
            or doc.get("_id")
            or ""
        ).strip().upper()

        value = str(
            doc.get("location")
            or doc.get("land_mark")
            or ""
        ).strip()

        location_map[key] = value

    logger.info(
        f"Location map created: {len(location_map)} entries"
    )

    return location_map


def build_mapping_map(db):

    logger.debug("Entering function: build_mapping_map")

    mapping_map = {}

    for doc in get_mappings(db):

        tag = str(
            doc.get("tag_id_fk")
            or doc.get("tag_id")
            or ""
        ).strip().upper()

        stretch = str(
            doc.get("stretch_id_fk")
            or doc.get("stretch_id")
            or ""
        ).strip().upper()

        mapping_map[tag] = stretch

    logger.info(
        f"Mapping map created: {len(mapping_map)} entries"
    )

    return mapping_map


def get_valid_ips_for_doc(doc):

    logger.debug("Entering function: get_valid_ips_for_doc")

    valid_ips = []

    for db_field, display_name in DEVICE_FIELDS:

        ip = doc.get(db_field)

        if ip is None:
            continue

        ip_str = str(ip).strip()

        if (
            ip_str
            and ip_str.lower() != "nan"
            and is_valid_ip(ip_str)
        ):

            valid_ips.append(
                (
                    display_name,
                    ip_str
                )
            )

    logger.info(
        f"Valid IPs extracted: {len(valid_ips)}"
    )

    return valid_ips


def build_tasks_from_mongo(db):

    logger.debug("Entering function: build_tasks_from_mongo")

    stretch_map = build_stretch_map(db)

    location_map = build_location_map(db)

    mapping_map = build_mapping_map(db)

    tasks = []

    for doc in get_ip_details(db):

        tag = str(
            doc.get("_id", "")
        ).strip().upper()

        if not tag:
            continue

        location = location_map.get(
            tag,
            "UNKNOWN"
        )

        stretch_id = mapping_map.get(
            tag,
            "UNKNOWN"
        )

        stretch_name = stretch_map.get(
            stretch_id,
            stretch_id
        )

        for display_name, ip in get_valid_ips_for_doc(doc):

            tasks.append(
                {
                    "tag": tag,
                    "stretch": stretch_name,
                    "location": location,
                    "device": display_name,
                    "ip": ip,
                }
            )

    logger.info(
        f"Mongo tasks built successfully: {len(tasks)}"
    )

    return tasks