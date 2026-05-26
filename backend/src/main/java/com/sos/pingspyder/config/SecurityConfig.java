package com.sos.pingspyder.config;

import com.sos.pingspyder.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
@Slf4j
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        log.info("Initializing Spring Security configuration");

        try {

            http
                    .cors(Customizer.withDefaults())
                    .csrf(csrf -> csrf.disable())
                    .sessionManagement(
                            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                    )
                    .authorizeHttpRequests(
                            auth -> auth
                                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                    .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll()
                                    .requestMatchers("/api/auth/**").permitAll()
                                    .requestMatchers("/api/analytics/**").hasRole("ADMIN")
                                    .requestMatchers("/api/reports/**").hasRole("ADMIN")
                                    .anyRequest().authenticated()
                    )
                    .addFilterBefore(
                            jwtAuthenticationFilter,
                            UsernamePasswordAuthenticationFilter.class
                    );
            log.info("Spring Security configuration initialized successfully");
            return http.build();

        } catch (Exception ex) {
            log.error("Failed to initialize Spring Security configuration", ex);
            throw ex;
        }
    }

    @Bean
    public CorsFilter corsFilter() {

        log.info("Initializing security CORS filter configuration");

        try {

            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

            CorsConfiguration config = new CorsConfiguration();
            config.setAllowCredentials(true);
            config.addAllowedOrigin("http://localhost:5173");
            config.addAllowedHeader("*");
            config.addAllowedMethod("*");
            source.registerCorsConfiguration("/**", config);
            log.info("Security CORS filter configuration initialized successfully");
            return new CorsFilter(source);

        } catch (Exception ex) {
            log.error("Failed to initialize security CORS filter configuration", ex);
            throw ex;
        }
    }
}