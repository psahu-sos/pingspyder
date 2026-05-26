package com.sos.pingspyder.service.impl;

import com.sos.pingspyder.client.PythonClient;
import com.sos.pingspyder.dto.FilterOptionsDto;
import com.sos.pingspyder.dto.PythonApiResponseDto;
import com.sos.pingspyder.service.FilterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FilterServiceImpl implements FilterService {

    private final PythonClient pythonClient;

    @Override
    public List<String> getDevices(String project) {

        log.info("Fetching device filters for project: {}", project);

        try {
            PythonApiResponseDto<FilterOptionsDto> response = pythonClient.fetchFilterOptions(project);
            List<String> devices = response.getData().getDevices();
            log.info("Successfully fetched {} devices for project: {}", devices.size(), project);
            return devices;

        } catch (Exception ex) {
            log.error("Failed to fetch device filters for project: {}", project, ex);
            throw ex;
        }
    }
}