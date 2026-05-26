package com.sos.pingspyder.controller;

import com.sos.pingspyder.entity.ReportEntity;
import com.sos.pingspyder.service.PdfService;
import com.sos.pingspyder.service.ReportService;
import com.sos.pingspyder.util.ResponseBuilderHelper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Slf4j
public class ReportController {

    private final ReportService reportService;
    private final PdfService pdfService;
    private final ResponseBuilderHelper responseBuilderHelper;

    @PostMapping(value = "/upload/{project}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<byte[]> uploadAndGeneratePdf(@PathVariable String project,
                                                       @RequestParam(value = "mode", defaultValue = "full") String mode,
                                                       @RequestParam("file") MultipartFile file) throws Exception {

        log.info("Report upload request received for project: {} with mode: {}", project, mode);

        try {
            if (file.isEmpty()) {
                log.warn("Uploaded file is empty for project: {}", project);
                throw new IllegalArgumentException("Uploaded file is empty");
            }

            List<ReportEntity> reportEntities = reportService.processFile(project, file, mode);
            log.info("Processed {} report entries for project: {}", reportEntities.size(), project);
            byte[] pdf = pdfService.generatePdf(project, reportEntities);
            log.info("PDF generated successfully for project: {}", project);
            return responseBuilderHelper.buildPdfResponse(pdf, project + "-report.pdf");

        } catch (Exception ex) {
            log.error("Failed to generate upload PDF for project: {}", project, ex);
            throw ex;
        }
    }

    @GetMapping("/{project}/from-db")
    public ResponseEntity<byte[]> generateFromMongo(@PathVariable String project,
                                                    @RequestParam(defaultValue = "full") String mode) throws Exception {

        log.info("Mongo PDF generation request received for project: {} with mode: {}", project, mode);

        try {

            List<ReportEntity> reportEntities = reportService.fetchFromMongo(project);
            log.info("Fetched {} report entries from MongoDB for project: {}", reportEntities.size(), project);
            reportEntities = reportService.applyModeFilter(reportEntities, mode);

            if (reportEntities.isEmpty()) {
                log.warn("No report data available after filtering for project: {}", project);
                throw new RuntimeException("No data available after filtering");
            }

            byte[] pdf = pdfService.generatePdf(project, reportEntities);
            log.info("Mongo PDF generated successfully for project: {}", project);
            return responseBuilderHelper.buildPdfResponse(pdf, project + "-report.pdf");

        } catch (Exception ex) {
            log.error("Failed to generate Mongo PDF for project: {}", project, ex);
            throw ex;
        }
    }

//    @PostMapping(value = "/upload/combined", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ResponseEntity<byte[]> uploadCombined(@RequestParam("file") MultipartFile file) throws Exception {
//
//        log.info("Combined report upload request received");
//
//        try {
//            if (file.isEmpty()) {
//                log.warn("Uploaded combined file is empty");
//                throw new IllegalArgumentException("Uploaded file is empty");
//            }
//
//            List<ReportEntity> reportEntities = reportService.processCombined(file);
//
//            log.info("Processed {} combined report entries", reportEntities.size());
//
//            byte[] pdf = pdfService.generatePdf(AppConstantsHelper.COMBINED, reportEntities);
//
//            log.info("Combined PDF generated successfully");
//
//            return responseBuilderHelper.buildPdfResponse(pdf, "combined-report.pdf");
//
//        } catch (Exception ex) {
//            log.error("Failed to generate combined upload PDF", ex);
//            throw ex;
//        }
//    }
//
//    @GetMapping("/combined/from-db")
//    public ResponseEntity<byte[]> generateCombinedReport() throws Exception {
//
//        log.info("Combined Mongo PDF generation request received");
//
//        try {
//            List<ReportEntity> reportEntities = reportService.fetchFromMongo(AppConstantsHelper.COMBINED);
//
//            log.info("Fetched {} combined report entries from MongoDB", reportEntities.size());
//
//            if (reportEntities.isEmpty()) {
//                log.warn("No combined report data found in MongoDB");
//                throw new RuntimeException("No combined data found");
//            }
//
//            byte[] pdf = pdfService.generatePdf(AppConstantsHelper.COMBINED, reportEntities);
//
//            log.info("Combined Mongo PDF generated successfully");
//
//            return responseBuilderHelper.buildPdfResponse(pdf, "combined-report.pdf");
//
//        } catch (Exception ex) {
//            log.error("Failed to generate combined Mongo PDF", ex);
//            throw ex;
//        }
//    }
}