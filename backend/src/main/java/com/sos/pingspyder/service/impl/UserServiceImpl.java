package com.sos.pingspyder.service.impl;

import com.sos.pingspyder.dto.CreateUserRequestDto;
import com.sos.pingspyder.dto.UpdateUserRequestDto;
import com.sos.pingspyder.dto.UserResponseDto;
import com.sos.pingspyder.entity.UserEntity;
import com.sos.pingspyder.exception.UserNotFoundException;
import com.sos.pingspyder.mapper.UserMapper;
import com.sos.pingspyder.repository.UserRepository;
import com.sos.pingspyder.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Override
    public UserResponseDto createUser(CreateUserRequestDto request) {

        log.info("User creation initiated for username: {}", request.getUsername());

        try {
            UserEntity user = userMapper.toEntity(request);
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setEnabled(true);
            UserEntity savedUser = userRepository.save(user);

            log.info("User created successfully with id: {}", savedUser.getId());

            UserResponseDto response = userMapper.toResponse(savedUser);
            response.setSuccess(true);
            response.setMessage("User created successfully");

            return response;

        } catch (Exception ex) {
            log.error("Failed to create user with username: {}", request.getUsername(), ex);
            throw ex;
        }
    }

    @Override
    public List<UserResponseDto> getAllUsers() {

        log.info("Fetching all users");

        try {
            List<UserResponseDto> users = userRepository.findAll()
                    .stream()
                    .map(user -> {
                        UserResponseDto response = userMapper.toResponse(user);
                        response.setSuccess(true);
                        return response;
                    })
                    .toList();

            log.info("Successfully fetched {} users", users.size());

            return users;

        } catch (Exception ex) {
            log.error("Failed to fetch users", ex);
            throw ex;
        }
    }

    @Override
    public UserResponseDto getUserById(String id) {

        log.info("Fetching user by id: {}", id);

        try {
            UserEntity user = userRepository.findById(id)
                    .orElseThrow(() -> new UserNotFoundException("User not found"));

            UserResponseDto response = userMapper.toResponse(user);
            response.setSuccess(true);
            log.info("Successfully fetched user with id: {}", id);

            return response;

        } catch (Exception ex) {
            log.error("Failed to fetch user with id: {}", id, ex);
            throw ex;
        }
    }

    @Override
    public UserResponseDto updateUser(String id, UpdateUserRequestDto request) {

        log.info("User update initiated for id: {}", id);

        try {
            UserEntity user = userRepository.findById(id)
                    .orElseThrow(() -> new UserNotFoundException("User not found"));

            user.setUsername(request.getUsername());
            user.setRole(request.getRole());
            user.setEnabled(request.isEnabled());

            if (request.getPassword() != null && !request.getPassword().isBlank()) {
                log.info("Updating password for user id: {}", id);
                user.setPassword(passwordEncoder.encode(request.getPassword()));
            }

            UserEntity updatedUser = userRepository.save(user);
            log.info("User updated successfully with id: {}", id);
            UserResponseDto response = userMapper.toResponse(updatedUser);
            response.setSuccess(true);
            response.setMessage("User updated successfully");

            return response;

        } catch (Exception ex) {
            log.error("Failed to update user with id: {}", id, ex);
            throw ex;
        }
    }

    @Override
    public UserResponseDto deleteUser(String id) {

        log.info("User deletion initiated for id: {}", id);

        try {
            UserEntity user = userRepository.findById(id)
                    .orElseThrow(() -> new UserNotFoundException("User not found"));

            userRepository.delete(user);
            log.info("User deleted successfully with id: {}", id);

            return UserResponseDto.builder()
                    .success(true)
                    .message("User deleted successfully")
                    .build();

        } catch (Exception ex) {
            log.error("Failed to delete user with id: {}", id, ex);
            throw ex;
        }
    }
}