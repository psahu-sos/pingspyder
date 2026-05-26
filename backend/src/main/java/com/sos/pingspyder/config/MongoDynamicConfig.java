package com.sos.pingspyder.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class MongoDynamicConfig {

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    @Bean
    public MongoClient mongoClient() {

        log.info("Initializing MongoDB client connection");

        try {
            MongoClient mongoClient = MongoClients.create(mongoUri);
            log.info("MongoDB client initialized successfully");
            return mongoClient;

        } catch (Exception ex) {
            log.error("Failed to initialize MongoDB client", ex);
            throw ex;
        }
    }
}