package com.sos.pingspyder.config;

import com.sos.pingspyder.entity.UserEntity;
import com.sos.pingspyder.enums.Role;
import com.sos.pingspyder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {

        log.info("Admin seeder initialization started");

        try {

            boolean exists = userRepository
                    .findUserByUsername(adminUsername)
                    .isPresent();

            if (exists) {
                log.info("Default admin already exists");
                return;
            }

            UserEntity admin = new UserEntity();
            admin.setUsername(adminUsername);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(Role.ADMIN);
            admin.setEnabled(true);
            userRepository.save(admin);
            log.warn("Default admin user created successfully. Change credentials in production.");

        } catch (Exception ex) {
            log.error("Failed to initialize default admin user", ex);
            throw ex;
        }
    }
}