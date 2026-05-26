package com.sos.pingspyder.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.codec.ClientCodecConfigurer;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@Slf4j
public class WebClientConfig {

    @Bean
    public WebClient.Builder webClientBuilder() {

        log.info("Initializing WebClient builder configuration");

        try {

            ExchangeStrategies strategies = ExchangeStrategies.builder()
                    .codecs(
                            (ClientCodecConfigurer configurer) ->
                                    configurer.defaultCodecs()
                                            .maxInMemorySize(16 * 1024 * 1024)
                    )
                    .build();

            WebClient.Builder builder = WebClient.builder().exchangeStrategies(strategies);

            log.info("WebClient builder initialized successfully");
            return builder;

        } catch (Exception ex) {
            log.error("Failed to initialize WebClient builder", ex);
            throw ex;
        }
    }
}