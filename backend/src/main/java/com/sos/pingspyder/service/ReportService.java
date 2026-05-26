package com.sos.pingspyder.service;

import com.sos.pingspyder.entity.ReportEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ReportService {

    List<ReportEntity> processFile(String project, MultipartFile file, String mode);

    List<ReportEntity> fetchFromMongo(String project);

    List<ReportEntity> applyModeFilter(List<ReportEntity> reportEntities, String mode);

    List<ReportEntity> processCombined(MultipartFile file);
}