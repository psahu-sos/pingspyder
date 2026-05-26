package com.sos.pingspyder.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
@Slf4j
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate() {

        log.info("Initializing RestTemplate bean");

        try {
            RestTemplate restTemplate = new RestTemplate();
            log.info("RestTemplate bean initialized successfully");
            return restTemplate;

        } catch (Exception ex) {
            log.error("Failed to initialize RestTemplate bean", ex);
            throw ex;
        }
    }
}