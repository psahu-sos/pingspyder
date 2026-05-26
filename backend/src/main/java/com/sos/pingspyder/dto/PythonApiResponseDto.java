package com.sos.pingspyder.dto;

import lombok.Data;

@Data
public class PythonApiResponseDto<T> {

    private Boolean success;
    private String message;
    private String timestamp;
    private T data;
}
