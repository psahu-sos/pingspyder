package com.sos.pingspyder.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "device_details")
public class ReportEntity {

    @Id
    private String id;

    private String project;
    private String tag;
    private String stretch;
    private String location;
    private List<String> failedDevices;
    private String status;
}