package com.sos.pingspyder.controller;

import com.sos.pingspyder.dto.CreateUserRequestDto;
import com.sos.pingspyder.dto.UpdateUserRequestDto;
import com.sos.pingspyder.dto.UserResponseDto;
import com.sos.pingspyder.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponseDto> createUser(@RequestBody CreateUserRequestDto request) {

        log.info("Create user request received for username: {}", request.getUsername());

        try {
            UserResponseDto response = userService.createUser(request);
            log.info("User created successfully with username: {}", request.getUsername());
            return ResponseEntity.ok(response);

        } catch (Exception ex) {
            log.error("Failed to create user with username: {}", request.getUsername(), ex);
            throw ex;
        }
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {

        log.info("Fetch all users request received");

        try {
            List<UserResponseDto> users = userService.getAllUsers();
            log.info("Successfully fetched {} users", users.size());
            return ResponseEntity.ok(users);

        } catch (Exception ex) {
            log.error("Failed to fetch all users", ex);
            throw ex;
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable String id) {

        log.info("Fetch user request received for id: {}", id);

        try {
            UserResponseDto response = userService.getUserById(id);
            log.info("Successfully fetched user with id: {}", id);
            return ResponseEntity.ok(response);

        } catch (Exception ex) {
            log.error("Failed to fetch user with id: {}", id, ex);
            throw ex;
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDto> updateUser(@PathVariable String id,
                                                      @RequestBody UpdateUserRequestDto request) {

        log.info("Update user request received for id: {}", id);

        try {
            UserResponseDto response = userService.updateUser(id, request);
            log.info("User updated successfully with id: {}", id);
            return ResponseEntity.ok(response);

        } catch (Exception ex) {
            log.error("Failed to update user with id: {}", id, ex);
            throw ex;
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<UserResponseDto> deleteUser(@PathVariable String id) {

        log.info("Delete user request received for id: {}", id);

        try {
            UserResponseDto response = userService.deleteUser(id);
            log.info("User deleted successfully with id: {}", id);
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            log.error("Failed to delete user with id: {}", id, ex);
            throw ex;
        }
    }
}