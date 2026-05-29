import io

import pandas as pd

from fastapi import HTTPException

from app.utils.validators import is_valid_ip

from app.utils.logger import get_logger

logger = get_logger(__name__)

logger.info("Loaded module: parser.py")

def safe_get(row, keys):

    logger.debug("Entering function: safe_get")

    for key in keys:

        value = row.get(key)

        if value is None:
            continue

        value = str(value).strip()

        if not value or value.lower() == "nan":
            continue

        logger.debug(
            f"Valid value found for key: {key}"
        )

        return value

    logger.warning(
        f"No valid value found for keys: {keys}"
    )

    return ""


def get_valid_ip(ip):

    logger.debug("Entering function: get_valid_ip")

    if ip is None:

        logger.warning("Received None IP value")

        return ""

    ip = str(ip).strip()

    if not ip or ip.lower() == "nan":

        logger.warning("Received empty or invalid IP")

        return ""

    if is_valid_ip(ip):

        logger.debug(f"Valid IP detected: {ip}")

        return ip

    logger.warning(f"Invalid IP format: {ip}")

    return ""


def read_all_excel_sheets(contents):

    logger.debug("Entering function: read_all_excel_sheets")

    try:

        excel_data = pd.read_excel(
            io.BytesIO(contents),
            sheet_name=None
        )

        logger.info(
            f"Excel sheets detected: {len(excel_data)}"
        )

        all_dfs = []

        for sheet_name, sheet_df in excel_data.items():

            logger.info(
                f"Processing sheet: {sheet_name}"
            )

            if sheet_df.empty:

                logger.warning(
                    f"Skipping empty sheet: {sheet_name}"
                )

                continue

            sheet_df.columns = [
                str(column).strip().lower()
                for column in sheet_df.columns
            ]

            all_dfs.append(sheet_df)

        if not all_dfs:

            logger.error("No valid sheets found in Excel")

            raise HTTPException(
                status_code=400,
                detail="No valid sheets found"
            )

        final_df = pd.concat(
            all_dfs,
            ignore_index=True
        )

        final_df.columns = [
            str(column).strip().lower()
            for column in final_df.columns
        ]

        logger.info(f"Final dataframe rows: {len(final_df)}")

        return final_df

    except Exception as e:
        logger.error(f"Failed to read Excel sheets: {str(e)}",exc_info=True)

        raise