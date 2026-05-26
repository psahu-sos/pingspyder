package com.sos.pingspyder.service;

import com.sos.pingspyder.dto.LoginRequestDto;
import com.sos.pingspyder.dto.LoginResponseDto;
import com.sos.pingspyder.dto.LogoutResponseDto;

public interface AuthService {

    LoginResponseDto login(LoginRequestDto requestDto);

    LogoutResponseDto logout(
            String token
    );

}
