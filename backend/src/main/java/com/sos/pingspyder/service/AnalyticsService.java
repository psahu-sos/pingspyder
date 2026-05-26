package com.sos.pingspyder.service;

import com.sos.pingspyder.dto.AnalyticsResponseDto;
import com.sos.pingspyder.dto.PythonApiResponseDto;

import java.util.List;

public interface AnalyticsService {

    PythonApiResponseDto<AnalyticsResponseDto> getAnalytics(String project, List<String> routes,
                                                            List<String> stretches, List<String> locations,
                                                            List<String> devices, String startDate,
                                                            String endDate, Integer page, Integer pageSize);
}
