package com.sos.pingspyder.dto;

import lombok.Data;

import java.util.List;

@Data
public class ReportDto {

    private String tag;
    private String id;
    private String stretch;
    private String location;
    private List<String> failedDevices;
}