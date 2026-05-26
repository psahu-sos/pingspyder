package com.sos.pingspyder.service;

import com.sos.pingspyder.entity.ReportEntity;

import java.util.List;

public interface PdfService {

    byte[] generatePdf(String project, List<ReportEntity> reportEntities) throws Exception;
}