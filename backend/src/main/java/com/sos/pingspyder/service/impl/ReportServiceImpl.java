package com.sos.pingspyder.service.impl;

import com.mongodb.client.MongoCollection;
import com.sos.pingspyder.client.PythonClient;
import com.sos.pingspyder.dto.ReportDto;
import com.sos.pingspyder.entity.ReportEntity;
import com.sos.pingspyder.exception.MongoFetchException;
import com.sos.pingspyder.mapper.ReportMapper;
import com.sos.pingspyder.service.ReportService;
import com.sos.pingspyder.util.AppConstantsHelper;
import com.sos.pingspyder.util.MongoHelper;
import com.sos.pingspyder.util.ReportFilterHelper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final PythonClient pythonClient;
    private final ReportMapper reportMapper;
    private final MongoHelper mongoHelper;
    private final ReportFilterHelper reportFilterHelper;

    @Override
    public List<ReportEntity> processFile(String project, MultipartFile file, String mode) {

        log.info("Report file processing initiated for project: {} with mode: {}", project, mode);

        try {
            List<ReportDto> response = pythonClient.processFile(project, file, mode);
            log.info("Received {} report records from Python service for project: {}", response.size(), project);

            List<ReportEntity> reportEntities = response.stream()
                    .map(reportMapper::toReport)
                    .toList();
            log.info("Successfully mapped report entities for project: {}", project);
            return reportEntities;

        } catch (Exception ex) {
            log.error("Failed to process report file for project: {}", project, ex);
            throw ex;
        }
    }

    @Override
    public List<ReportEntity> fetchFromMongo(String project) {

        log.info("Fetching report data from MongoDB for project: {}", project);

        try {
            MongoCollection<Document> collection = mongoHelper.getCollection(project);
            List<Document> docs = collection.find().into(new ArrayList<>());
            log.info("Fetched {} MongoDB documents for project: {}", docs.size(), project);

            if (docs.isEmpty()) {
                log.warn("No MongoDB data found for project: {}", project);
                throw new MongoFetchException("No data found in MongoDB");
            }

            String latestRunId = mongoHelper.getLatestRunId(docs);
            log.info("Latest runId identified for project: {}", project);
            List<ReportEntity> reportEntities = docs.stream()
                    .filter(d -> latestRunId.equals(d.getString("runId")))
                    .map(reportMapper::fromMongo)
                    .toList();

            log.info("Successfully mapped {} report entities from MongoDB for project: {}",
                    reportEntities.size(),
                    project);

            return reportEntities;

        } catch (Exception ex) {
            log.error("MongoDB fetch failed for project: {}", project, ex);
            throw new MongoFetchException("Failed to fetch Mongo data");
        }
    }

    @Override
    public List<ReportEntity> applyModeFilter(List<ReportEntity> reportEntities, String mode) {

        log.info("Applying mode filter: {}", mode);

        if (!"lite".equalsIgnoreCase(mode)) {
            log.info("Full mode selected, skipping filtering");
            return reportEntities;
        }

        List<ReportEntity> filteredReports = reportEntities.stream()
                .map(reportFilterHelper::filterLiteDevices)
                .toList();
        log.info("Lite mode filtering applied successfully");

        return filteredReports;
    }

    @Override
    public List<ReportEntity> processCombined(MultipartFile file) {

        log.info("Combined report processing initiated");

        try {
            List<ReportEntity> reportEntities = processFile(
                    AppConstantsHelper.COMBINED,
                    file,
                    "full"
            );
            log.info("Combined report processed successfully with {} report entities", reportEntities.size());
            return reportEntities;

        } catch (Exception ex) {
            log.error("Combined report processing failed", ex);
            throw ex;
        }
    }
}