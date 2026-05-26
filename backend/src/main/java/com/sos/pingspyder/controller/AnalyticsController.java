package com.sos.pingspyder.controller;

import com.sos.pingspyder.dto.AnalyticsResponseDto;
import com.sos.pingspyder.dto.PythonApiResponseDto;
import com.sos.pingspyder.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Slf4j
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/{project}/history")
    public PythonApiResponseDto<AnalyticsResponseDto> getAnalytics(@PathVariable String project,
                                                                   @RequestParam(required = false) List<String> routes,
                                                                   @RequestParam(required = false) List<String> stretches,
                                                                   @RequestParam(required = false) List<String> locations,
                                                                   @RequestParam(required = false) List<String> devices,
                                                                   @RequestParam(required = false) String startDate,
                                                                   @RequestParam(required = false) String endDate,
                                                                   @RequestParam(defaultValue = "1") Integer page,
                                                                   @RequestParam(defaultValue = "50") Integer pageSize
    ) {

        log.info("Received analytics request for project: {}", project);
        return analyticsService.getAnalytics(project, routes, stretches, locations, devices, startDate, endDate, page, pageSize);
    }
}
