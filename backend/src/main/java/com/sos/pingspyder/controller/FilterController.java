package com.sos.pingspyder.controller;

import com.sos.pingspyder.service.FilterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/filters")
@RequiredArgsConstructor
@Slf4j
public class FilterController {

    private final FilterService filterService;

    @GetMapping("/{project}/devices")
    public ResponseEntity<List<String>> getDevices(@PathVariable String project) {

        log.info("Received request to fetch devices for project: {}", project);

        try {
            List<String> devices = filterService.getDevices(project);
            log.info("Successfully fetched {} devices for project: {}", devices.size(), project);

            return ResponseEntity.ok(devices);

        } catch (Exception ex) {
            log.error("Failed to fetch devices for project: {}", project, ex);
            throw ex;
        }
    }
}