package com.sos.pingspyder.dto;

import lombok.Data;

import java.util.List;

@Data
public class AnalyticsResponseDto {

    private String totalRecords;
    private Integer page;
    private Integer pageSize;
    private List<AnalyticsRecordDto> results;
}
