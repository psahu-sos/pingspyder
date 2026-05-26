package com.sos.pingspyder.exception;

import com.sos.pingspyder.dto.ErrorResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    private ResponseEntity<ErrorResponseDto> buildError(@NonNull HttpStatus status, String message) {

        return ResponseEntity.status(status)
                .body(ErrorResponseDto.builder()
                        .timeStamp(LocalDateTime.now())
                        .status(status.value())
                        .message(message)
                        .build());
    }

    @ExceptionHandler(InvalidProjectException.class)
    public ResponseEntity<ErrorResponseDto> handleInvalidProject(InvalidProjectException ex) {

        log.warn("Invalid project exception occurred: {}", ex.getMessage());

        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(PythonServiceException.class)
    public ResponseEntity<ErrorResponseDto> handlePython(PythonServiceException ex) {

        log.error("Python service exception occurred: {}", ex.getMessage(), ex);

        return buildError(HttpStatus.BAD_GATEWAY, ex.getMessage());
    }

    @ExceptionHandler(MongoFetchException.class)
    public ResponseEntity<ErrorResponseDto> handleMongo(MongoFetchException ex) {

        log.error("Mongo fetch exception occurred: {}", ex.getMessage(), ex);

        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    @ExceptionHandler(PdfGenerationException.class)
    public ResponseEntity<ErrorResponseDto> handlePdf(PdfGenerationException ex) {

        log.error("PDF generation exception occurred: {}", ex.getMessage(), ex);

        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponseDto> handleIllegal(IllegalArgumentException ex) {

        log.warn("Illegal argument exception occurred: {}", ex.getMessage());

        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDto> handleAll(Exception ex) {

        log.error("Unhandled exception occurred: {}", ex.getMessage(), ex);

        return buildError(
                HttpStatus.INTERNAL_SERVER_ERROR,
                ex.getMessage() != null ? ex.getMessage() : "Unexpected server error"
        );
    }
}