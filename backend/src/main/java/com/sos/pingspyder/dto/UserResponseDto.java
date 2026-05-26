package com.sos.pingspyder.dto;

import com.sos.pingspyder.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {

    private String id;
    private String username;
    private Role role;
    private boolean enabled;
    private boolean success;
    private String message;
}