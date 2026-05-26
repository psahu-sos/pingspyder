package com.sos.pingspyder.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Slf4j
public class PasswordConfig {

    @Bean
    PasswordEncoder passwordEncoder() {

        log.info("Initializing BCrypt password encoder");

        try {
            PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            log.info("BCrypt password encoder initialized successfully");
            return passwordEncoder;

        } catch (Exception ex) {
            log.error("Failed to initialize password encoder", ex);
            throw ex;
        }
    }
}