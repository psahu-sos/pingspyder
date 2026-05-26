package com.sos.pingspyder.service.impl;

import com.sos.pingspyder.client.PythonClient;
import com.sos.pingspyder.dto.AnalyticsResponseDto;
import com.sos.pingspyder.dto.PythonApiResponseDto;
import com.sos.pingspyder.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsServiceImpl implements AnalyticsService {

    private final PythonClient pythonClient;

    @Override
    public PythonApiResponseDto<AnalyticsResponseDto> getAnalytics(String project,
                                                                   List<String> routes,
                                                                   List<String> stretches,
                                                                   List<String> locations,
                                                                   List<String> devices,
                                                                   String startDate,
                                                                   String endDate,
                                                                   Integer page,
                                                                   Integer pageSize) {

        log.info("Fetching analytics for project: {} with page: {} and pageSize: {}", project, page, pageSize);

        try {
            PythonApiResponseDto<AnalyticsResponseDto> response = pythonClient.fetchAnalytics(
                    project,
                    routes,
                    stretches,
                    locations,
                    devices,
                    startDate,
                    endDate,
                    page,
                    pageSize
            );
            log.info("Analytics fetched successfully for project: {}", project);
            return response;

        } catch (Exception ex) {
            log.error("Failed to fetch analytics for project: {}", project, ex);
            throw ex;
        }
    }
}