package com.sos.pingspyder.service;

import org.springframework.web.multipart.MultipartFile;

public interface MonitoringGatewayService {

    String processProjectExcel(
            String project,
            MultipartFile file
    );

    String monitorProject(
            String project
    );
}