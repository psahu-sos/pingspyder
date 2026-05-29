package com.sos.pingspyder.controller;

import com.sos.pingspyder.service.MonitoringGatewayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/monitor")
@RequiredArgsConstructor
@Slf4j
public class MonitoringGatewayController {

    private final MonitoringGatewayService monitoringGatewayService;

    @PostMapping(value = "/{project}/process", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> processProjectExcel(@PathVariable String project,
                                                      @RequestParam("file") MultipartFile file) {

        log.info("Excel processing request received for project: {}", project);

        try {
            String response = monitoringGatewayService.processProjectExcel(project, file);
            log.info("Excel processed successfully for project: {}", project);
            return ResponseEntity.ok(response);

        } catch (Exception ex) {
            log.error("Excel processing failed for project: {}", project, ex);
            throw ex;
        }
    }

    @PostMapping("/{project}/run")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> monitorProject(@PathVariable String project) {

        log.info("Monitoring request received for project: {}", project);

        try {
            String response = monitoringGatewayService.monitorProject(project);
            log.info("Monitoring completed successfully for project: {}", project);
            return ResponseEntity.ok(response);

        } catch (Exception ex) {
            log.error("Monitoring failed for project: {}", project, ex);
            throw ex;
        }
    }
}