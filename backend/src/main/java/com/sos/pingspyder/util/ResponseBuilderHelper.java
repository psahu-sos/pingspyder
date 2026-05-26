package com.sos.pingspyder.util;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class ResponseBuilderHelper {

    // common PDF response
    @SuppressWarnings("null")
    public ResponseEntity<byte[]> buildPdfResponse(byte[] pdf, String filename) {

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition
                                .attachment()
                                .filename(filename)
                                .build()
                                .toString()
                )
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
