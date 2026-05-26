package com.sos.pingspyder.controller;

import com.sos.pingspyder.dto.LoginRequestDto;
import com.sos.pingspyder.dto.LoginResponseDto;
import com.sos.pingspyder.dto.LogoutResponseDto;
import com.sos.pingspyder.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponseDto login(@Valid @RequestBody LoginRequestDto requestDto) {

        log.info("Login request received for user: {}", requestDto.getUsername());

        try {
            LoginResponseDto response = authService.login(requestDto);
            log.info("User logged in successfully: {}", requestDto.getUsername());
            return response;
        } catch (Exception ex) {
            log.error("Login failed for user: {}", requestDto.getUsername(), ex);
            throw ex;
        }
    }

    @PostMapping("/logout")
    public LogoutResponseDto logout(@RequestHeader("Authorization") String authHeader) {

        log.info("Logout request received");

        try {
            String token = authHeader.substring(7);
            LogoutResponseDto response = authService.logout(token);
            log.info("User logged out successfully");
            return response;

        } catch (Exception ex) {
            log.error("Logout failed", ex);
            throw ex;
        }
    }
}