from datetime import datetime, UTC
import uuid

from fastapi import HTTPException

from app.db.mongo import get_database

from app.services.inventory_service import (
    build_tasks_from_excel,
    build_tasks_from_mongo
)

from app.services.ping_service import ping_all_ips

from app.utils.parser import read_all_excel_sheets

from app.utils.logger import get_logger

logger = get_logger(__name__)

logger.info("Loaded module: monitoring_service.py")


def aggregate_results(tasks, ip_results):

    logger.debug("Entering function: aggregate_results")

    temp = {}

    for task in tasks:

        tag = task["tag"]

        if tag not in temp:

            temp[tag] = {
                "tag": tag,
                "stretch": task["stretch"],
                "location": task["location"],
                "failedDevices": [],
            }

        ip = task["ip"]

        status = ip_results.get(ip, False)

        if not status:

            temp[tag]["failedDevices"].append(
                f'{task["device"]} ({ip})'
            )

    final_results = []

    for value in temp.values():

        value["status"] = (
            "DOWN"
            if value["failedDevices"]
            else "OK"
        )

        final_results.append(value)

    logger.info(
        f"Aggregated monitoring results: {len(final_results)}"
    )

    return final_results


def save_ping_results(
    db,
    collection_name,
    results
):

    logger.debug("Entering function: save_ping_results")

    collection = db[collection_name]

    run_id = str(uuid.uuid4())

    timestamp = datetime.now(UTC)

    docs = []

    for result in results:

        docs.append(
            {
                "runId": run_id,
                "TAG_ID": result["tag"],
                "Stretch": result["stretch"],
                "LOCATION": result["location"],
                "failedDevices": result["failedDevices"],
                "status": result["status"],
                "lastUpdated": timestamp,
            }
        )

    if docs:

        collection.insert_many(docs)

        logger.info(
            f"{len(docs)} monitoring results saved "
            f"to collection: {collection_name}"
        )


def execute_monitoring(
    tasks,
    db,
    collection_name,
    persist_results=True
):

    logger.debug("Entering function: execute_monitoring")

    if not tasks:

        logger.error("No monitoring tasks found")

        raise HTTPException(
            status_code=404,
            detail="No tasks found"
        )

    all_ips = [
        task["ip"]
        for task in tasks
    ]

    logger.info(
        f"Starting ping execution for "
        f"{len(set(all_ips))} unique IPs"
    )

    ip_results = ping_all_ips(
    all_ips,
    enable_logging=persist_results
    )

    final_results = aggregate_results(
        tasks,
        ip_results
    )

    if persist_results:

        save_ping_results(
            db,
            collection_name,
            final_results
        )

        logger.info(
            "Monitoring results persisted to database"
        )

    else:

        logger.info(
                "Excel monitoring mode detected - "
                "Skipping database persistence"
            )

    logger.info(
        "Monitoring execution completed successfully"
    )

    return {
        "totalSites": len(final_results),

        "totalIPs": len(set(all_ips)),

        "results": final_results,
    }


async def process_excel_monitoring(
    file,
    db_name,
    collection_name
):

    logger.debug(
        "Entering async function: process_excel_monitoring"
    )

    logger.info(
        f"Processing Excel monitoring for DB: {db_name}"
    )

    db = get_database(db_name)

    contents = await file.read()

    df = read_all_excel_sheets(contents)

    tasks = build_tasks_from_excel(df)

    logger.info(
        f"Excel tasks generated: {len(tasks)}"
    )

    return execute_monitoring(
    tasks,
    db,
    collection_name,
    persist_results=False
    )


def process_mongo_monitoring(
    db_name,
    collection_name
):

    logger.debug(
        "Entering function: process_mongo_monitoring"
    )

    logger.info(
        f"Processing Mongo monitoring for DB: {db_name}"
    )

    db = get_database(db_name)

    tasks = build_tasks_from_mongo(db)

    logger.info(
        f"Mongo tasks generated: {len(tasks)}"
    )

    return execute_monitoring(
        tasks,
        db,
        collection_name
    )