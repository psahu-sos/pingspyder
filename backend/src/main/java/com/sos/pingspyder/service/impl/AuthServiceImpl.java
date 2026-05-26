package com.sos.pingspyder.service.impl;

import com.sos.pingspyder.dto.LoginRequestDto;
import com.sos.pingspyder.dto.LoginResponseDto;
import com.sos.pingspyder.dto.LogoutResponseDto;
import com.sos.pingspyder.entity.SessionEntity;
import com.sos.pingspyder.entity.UserEntity;
import com.sos.pingspyder.repository.SessionRepository;
import com.sos.pingspyder.repository.UserRepository;
import com.sos.pingspyder.security.JwtUtil;
import com.sos.pingspyder.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public LoginResponseDto login(LoginRequestDto requestDto) {

        log.info("Login attempt initiated for username: {}", requestDto.getUsername());

        try {
            UserEntity user = userRepository.findUserByUsername(requestDto.getUsername())
                    .orElseThrow(() -> new RuntimeException("Invalid username"));

            boolean matches = passwordEncoder.matches(
                    requestDto.getPassword(),
                    user.getPassword()
            );

            if (!matches) {
                log.warn("Invalid password attempt for username: {}", requestDto.getUsername());
                throw new RuntimeException("Invalid password");
            }

            if (!user.isEnabled()) {
                log.warn("Disabled user attempted login: {}", requestDto.getUsername());
                throw new RuntimeException("User disabled");
            }

            log.info("Login successful for username: {}", user.getUsername());

            String token = jwtUtil.generateToken(
                    user.getUsername(),
                    user.getRole().name()
            );

            SessionEntity session = SessionEntity.builder()
                    .username(user.getUsername())
                    .token(token)
                    .active(true)
                    .loginTime(LocalDateTime.now())
                    .build();

            sessionRepository.save(session);
            log.info("Session created successfully for username: {}", user.getUsername());

            return new LoginResponseDto(
                    user.getUsername(),
                    user.getRole(),
                    token,
                    "Login Successful"
            );

        } catch (Exception ex) {
            log.error("Login failed for username: {}", requestDto.getUsername(), ex);
            throw ex;
        }
    }

    @Override
    public LogoutResponseDto logout(String token) {

        log.info("Logout request initiated");

        try {
            SessionEntity session = sessionRepository.findByToken(token)
                    .orElseThrow(() -> new RuntimeException("Session not found"));
            session.setActive(false);
            sessionRepository.save(session);
            log.info("Logout successful for username: {}", session.getUsername());

            return LogoutResponseDto.builder()
                    .success(true)
                    .message("Logout successful")
                    .build();

        } catch (Exception ex) {
            log.error("Logout failed", ex);
            throw ex;
        }
    }
}