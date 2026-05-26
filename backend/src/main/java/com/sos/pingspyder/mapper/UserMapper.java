package com.sos.pingspyder.mapper;

import com.sos.pingspyder.dto.CreateUserRequestDto;
import com.sos.pingspyder.dto.UserResponseDto;

import com.sos.pingspyder.entity.UserEntity;

import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    // DTO -> ENTITY
    public UserEntity toEntity(
            CreateUserRequestDto dto
    ) {

        return UserEntity.builder()
                .username(dto.getUsername())
                .role(dto.getRole())
                .build();
    }

    // ENTITY -> RESPONSE DTO
    public UserResponseDto toResponse(
            UserEntity entity
    ) {

        return UserResponseDto.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .role(entity.getRole())
                .enabled(entity.isEnabled())
                .success(true)
                .build();
    }
}