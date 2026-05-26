package com.sos.pingspyder.util;

import com.sos.pingspyder.exception.InvalidProjectException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ProjectResolverHelper {

    @Value("${python.service.url}")
    private String pythonServiceUrl;

    // python URL
    public String resolvePythonUrl(String project) {

        return pythonServiceUrl + switch (project.toLowerCase()) {
            case AppConstantsHelper.D2 -> "/d2/process";
            case AppConstantsHelper.D3 -> "/d3/process";
            case AppConstantsHelper.COMBINED -> "/combined/process";

            default -> throw new InvalidProjectException("Invalid project: " + project);
        };
    }

    // DB name
    public String resolveDatabase(String project) {

        return switch (project.toLowerCase()) {

            case AppConstantsHelper.D2 -> "Deesha_2";
            case AppConstantsHelper.D3 -> "Deesha_3";
            case AppConstantsHelper.COMBINED, "deesha_2_3" -> "Deesha_2_3";

            default -> throw new InvalidProjectException("Invalid project: " + project);
        };
    }

    // collection name
    public String resolveCollection(String project) {

        return switch (project.toLowerCase()) {

            case AppConstantsHelper.D2 -> "new_ping_data_2";
            case AppConstantsHelper.D3 -> "new_ping_data_3";
            case AppConstantsHelper.COMBINED, "deesha_2_3" -> "new_ping_data_2_3";

            default -> throw new InvalidProjectException("Invalid project: " + project);
        };
    }

    // display name
    public String resolveDisplayName(String project) {

        return switch (project.toLowerCase()) {

            case AppConstantsHelper.D2 -> "DEESHA 2";
            case AppConstantsHelper.D3 -> "DEESHA 3";
            case AppConstantsHelper.COMBINED -> "DEESHA 2 + DEESHA 3";

            default -> project.toUpperCase();
        };
    }
}