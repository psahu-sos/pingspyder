package com.sos.pingspyder.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
@Slf4j
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private Key key;

    @PostConstruct
    public void init() {

        log.info("Initializing JWT utility");
        key = Keys.hmacShaKeyFor(secret.getBytes());
        log.info("JWT signing key initialized successfully");
    }

    public String generateToken(String username, String role) {

        log.info("Generating JWT token for user: {}", username);

        try {
            String token = Jwts.builder()
                    .setSubject(username)
                    .claim("role", role)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + expiration))
                    .signWith(key, SignatureAlgorithm.HS256)
                    .compact();

            log.info("JWT token generated successfully for user: {}", username);
            return token;

        } catch (Exception ex) {
            log.error("Failed to generate JWT token for user: {}", username, ex);
            throw ex;
        }
    }

    public String extractUsername(String token) {

        try {
            String username = getClaims(token).getSubject();
            log.info("Username extracted successfully from JWT token");
            return username;

        } catch (Exception ex) {
            log.error("Failed to extract username from JWT token", ex);
            throw ex;
        }
    }

    public String extractRole(String token) {

        try {
            String role = getClaims(token).get("role", String.class);
            log.info("Role extracted successfully from JWT token");
            return role;

        } catch (Exception ex) {
            log.error("Failed to extract role from JWT token", ex);
            throw ex;
        }
    }

    public boolean isTokenValid(String token) {

        try {
            getClaims(token);
            log.info("JWT token validated successfully");
            return true;

        } catch (Exception ex) {
            log.warn("Invalid JWT token received");
            return false;
        }
    }

    private Claims getClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}