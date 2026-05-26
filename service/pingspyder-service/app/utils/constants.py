from app.utils.logger import get_logger

logger = get_logger(__name__)

logger.info("Loaded module: constants.py")

DEVICE_FIELDS = [
    ("gateway_ip", "GATEWAY_IP"),
    ("gateway", "GATEWAY"),
    ("dns_ip", "DNS_IP"),
    ("alternate_dns", "ALTERNATE_DNS"),
    ("ups1_snmp_ip", "UPS1_SNMP_IP"),
    ("ups2_snmp_ip", "UPS2_SNMP_IP"),
    ("smart_pdu_ip", "SMART_PDU_IP"),
    ("smart_pdu2_ip", "SMART_PDU2_IP"),
    ("switch_ip", "SWITCH_IP"),
    ("switch_lhs", "SWITCH_LHS"),
    ("svd_lhs", "SVD_LHS"),
    ("vids_lhs_1", "VIDS_LHS_1"),
    ("vids_lhs_2", "VIDS_LHS_2"),
    ("vids_lhs_3", "VIDS_LHS_3"),
    ("ovc_lhs", "OVC_LHS"),
    ("security_cam", "SECURITY_CAM"),
    ("radar_lhs", "RADAR_LHS"),
    ("mini_pc_lhs", "MINI_PC_LHS"),
    ("mini_pv_lhs", "MINI_PC_LHS"),
    ("lpu_lhs", "LPU_LHS"),
    ("switch_rhs", "SWITCH_RHS"),
    ("svd_rhs", "SVD_RHS"),
    ("vids_rhs_1", "VIDS_RHS_1"),
    ("vids_rhs_2", "VIDS_RHS_2"),
    ("vids_rhs_3", "VIDS_RHS_3"),
    ("ovc_rhs", "OVC_RHS"),
    ("radar_rhs", "RADAR_RHS"),
    ("mini_pc_rhs", "MINI_PC_RHS"),
    ("mini_pv_rhs", "MINI_PC_RHS"),
    ("lpu_rhs", "LPU_RHS"),
]

logger.info(
    f"Loaded DEVICE_FIELDS count: {len(DEVICE_FIELDS)}"
)

LOCATIONS_COLLECTION = "locations"

STRETCH_COLLECTION = "stretches"

MAPPING_COLLECTION = "stretch_mappings"

IP_DETAILS_COLLECTION = "ip_details"

logger.info(
    "Mongo collection constants initialized successfully"
)