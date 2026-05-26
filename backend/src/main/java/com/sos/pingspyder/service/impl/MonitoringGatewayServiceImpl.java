package com.sos.pingspyder.service.impl;

import com.sos.pingspyder.service.MonitoringGatewayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Slf4j
public class MonitoringGatewayServiceImpl implements MonitoringGatewayService {

    private final RestTemplate restTemplate;

    @Value("${python.service.url}")
    private String pythonServiceUrl;

    @Override
    public String processProjectExcel(String project, MultipartFile file) {

        log.info("Excel processing initiated for project: {}", project);

        try {
            String url = pythonServiceUrl + "/api/v1/monitoring/" + project + "/process";
            log.info("Forwarding Excel to Python Gateway URL: {}", url);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {

                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };

            body.add("file", resource);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            log.info("Excel processed successfully for project: {}", project);
            return response.getBody();

        } catch (HttpStatusCodeException ex) {

            log.error(
                    "Python Excel API returned error for project: {} with status: {} and response: {}",
                    project,
                    ex.getStatusCode(),
                    ex.getResponseBodyAsString(),
                    ex
            );
            throw new RuntimeException("Python Excel Gateway rejected request: " + ex.getResponseBodyAsString());

        } catch (Exception ex) {
            log.error("Excel processing failed for project: {}", project, ex);
            throw new RuntimeException("Cannot reach Python gateway or Spring Boot backend while xl file processing");
        }
    }

    @Override
    public String monitorProject(String project) {

        log.info("Monitoring initiated for project: {}", project);

        try {
            String url = pythonServiceUrl + "/api/v1/monitoring/" + project + "/monitor";
            log.info("Forwarding monitoring request to Python Gateway URL: {}", url);
            ResponseEntity<String> response = restTemplate.postForEntity(url, null, String.class);
            log.info("Monitoring completed successfully for project: {}", project);
            return response.getBody();

        } catch (HttpStatusCodeException ex) {

            log.error(
                    "Python Monitor API returned error for project: {} with status: {} and response: {}",
                    project,
                    ex.getStatusCode(),
                    ex.getResponseBodyAsString(),
                    ex
            );
            throw new RuntimeException("Python Run Gateway rejected request: " + ex.getResponseBodyAsString());

        } catch (Exception ex) {
            log.error("Monitoring failed for project: {}", project, ex);
            throw new RuntimeException("Cannot reach Python gateway or Spring Boot backend while autosync");
        }
    }
}