package com.sos.pingspyder.dto;

import lombok.Data;

@Data
public class AnalyticsRecordDto {

    private String tagId;
    private String route;
    private String stretch;
    private String location;
    private String deviceName;
    private String ip;
    private String currentStatus;
    private Integer offlineCount;
    private String onlineCount;
    private String firstReportTime;
    private String lastDownTime;
    private String lastUpTime;

}
