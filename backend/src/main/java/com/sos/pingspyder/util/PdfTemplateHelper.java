package com.sos.pingspyder.util;

import org.springframework.stereotype.Component;

@Component
public class PdfTemplateHelper {

    public String resolveProjectName(String project) {
        switch (project.toLowerCase()) {
            case "deesha_2":
                return "DEESHA 2";
            case "deesha_3":
                return "DEESHA 3";
            default:
                return project.toUpperCase();
        }
    }

    public String resolveTagLabel(String project) {
        switch (project.toLowerCase()) {
            case "deesha_2":
                return "ID";
            case "deesha_3":
                return "Tag";
            default:
                return "Tag";
        }
    }
}
