package com.sos.pingspyder.security;

import com.sos.pingspyder.entity.SessionEntity;
import com.sos.pingspyder.entity.UserEntity;
import com.sos.pingspyder.repository.SessionRepository;
import com.sos.pingspyder.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        String token = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            log.info("JWT token detected for request: {}", request.getRequestURI());
        }

        try {

            if (token != null && jwtUtil.isTokenValid(token)) {

                SessionEntity session = sessionRepository
                        .findByToken(token)
                        .orElse(null);

                if (session != null && session.isActive()) {
                    String username = jwtUtil.extractUsername(token);
                    UserEntity user = userRepository
                            .findUserByUsername(username)
                            .orElse(null);

                    if (user != null && user.isEnabled()) {

                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        username,
                                        null,
                                        List.of(
                                                new SimpleGrantedAuthority(
                                                        "ROLE_" + user.getRole().name()
                                                )
                                        )
                                );

                        authentication.setDetails(
                                new WebAuthenticationDetailsSource()
                                        .buildDetails(request)
                        );

                        SecurityContextHolder
                                .getContext()
                                .setAuthentication(authentication);
                        log.info("JWT authentication successful for user: {}", username);

                    } else {
                        log.warn("JWT authentication failed because user is disabled or not found");
                    }

                } else {
                    log.warn("JWT authentication failed because session is inactive or not found");
                }

            } else if (token != null) {
                log.warn("Invalid JWT token received");
            }

        } catch (Exception ex) {
            log.error("JWT authentication processing failed", ex);
        }

        filterChain.doFilter(request, response);
    }
}