package com.sos.pingspyder.util;

import com.sos.pingspyder.entity.ReportEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ReportFilterHelper {

    public ReportEntity filterLiteDevices(ReportEntity reportEntity) {

        List<String> failed = reportEntity.getFailedDevices();
        if (failed == null || failed.isEmpty()) {
            reportEntity.setFailedDevices(new ArrayList<>());
            reportEntity.setStatus("OK");
            return reportEntity;
        }

        List<String> filtered = failed.stream()
                .filter(f ->
                        f.contains("LPU_LHS") || f.contains("LPU_RHS") ||
                                f.contains("RADAR_LHS") || f.contains("RADAR_RHS") ||
                                f.contains("SVD_LHS") || f.contains("SVD_RHS") ||
                                f.contains("VIDS_LHS_1") || f.contains("VIDS_LHS_2") ||
                                f.contains("VIDS_RHS_1") || f.contains("VIDS_RHS_2"))
                .toList();
        reportEntity.setFailedDevices(filtered);
        reportEntity.setStatus(filtered.isEmpty() ? "OK" : "DOWN");

        return reportEntity;
    }
}
