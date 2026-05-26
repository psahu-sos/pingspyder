package com.sos.pingspyder.service.impl;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.sos.pingspyder.entity.ReportEntity;
import com.sos.pingspyder.service.PdfService;
import com.sos.pingspyder.util.PdfTemplateHelper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class PdfServiceImpl implements PdfService {

    private final TemplateEngine templateEngine;
    private final PdfTemplateHelper pdfTemplateHelper;

    @Override
    public byte[] generatePdf(String project, List<ReportEntity> reportEntities) throws Exception {

        log.info("PDF generation initiated for project: {}", project);

        try {
            Context context = new Context();
            context.setVariable("reportEntities", reportEntities);
            String time = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy hh:mm:ss a"));

            context.setVariable("generatedTime", time);
            context.setVariable("projectName", pdfTemplateHelper.resolveProjectName(project));
            context.setVariable("tagLabel", pdfTemplateHelper.resolveTagLabel(project));

            log.info("Preparing HTML template for project: {}", project);

            String html = templateEngine.process("report", context);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            String baseUrl = Objects.requireNonNull(getClass().getResource("/static/")).toExternalForm();

            builder.withHtmlContent(html, baseUrl);
            builder.toStream(out);
            builder.run();

            log.info("PDF generated successfully for project: {}", project);
            return out.toByteArray();

        } catch (Exception ex) {
            log.error("PDF generation failed for project: {}", project, ex);
            throw ex;
        }
    }
}