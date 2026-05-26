package com.sos.pingspyder.dto;

import com.sos.pingspyder.enums.Role;
import lombok.Data;

@Data
public class CreateUserRequestDto {

    private String username;
    private String password;
    private Role role;

}
