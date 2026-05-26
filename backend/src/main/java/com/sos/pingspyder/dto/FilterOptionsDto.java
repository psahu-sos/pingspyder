package com.sos.pingspyder.dto;

import lombok.Data;

import java.util.List;

@Data
public class FilterOptionsDto {

    private List<String> routes;
    private List<String> stretches;
    private List<String> locations;
    private List<String> devices;
}
