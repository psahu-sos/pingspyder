package com.sos.pingspyder.service;

import com.sos.pingspyder.dto.CreateUserRequestDto;
import com.sos.pingspyder.dto.UpdateUserRequestDto;
import com.sos.pingspyder.dto.UserResponseDto;

import java.util.List;

public interface UserService {

    // CREATE USER
    UserResponseDto createUser(
            CreateUserRequestDto request
    );

    // GET ALL USERS
    List<UserResponseDto> getAllUsers();

    // GET USER BY ID
    UserResponseDto getUserById(
            String id
    );

    // UPDATE USER
    UserResponseDto updateUser(
            String id,
            UpdateUserRequestDto request
    );

    // DELETE USER
    UserResponseDto deleteUser(
            String id
    );
}