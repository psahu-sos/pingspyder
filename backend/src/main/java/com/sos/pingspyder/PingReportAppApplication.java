package com.sos.pingspyder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class PingReportAppApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(PingReportAppApplication.class, args);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(PingReportAppApplication.class);
    }
}