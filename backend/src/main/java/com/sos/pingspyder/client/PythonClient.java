package com.sos.pingspyder.client;

import com.sos.pingspyder.dto.AnalyticsResponseDto;
import com.sos.pingspyder.dto.FilterOptionsDto;
import com.sos.pingspyder.dto.PythonApiResponseDto;
import com.sos.pingspyder.dto.ReportDto;
import com.sos.pingspyder.exception.PythonServiceException;
import com.sos.pingspyder.util.AppConstantsHelper;
import com.sos.pingspyder.util.ProjectResolverHelper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class PythonClient {

    private final ProjectResolverHelper projectResolverHelper;
    private final WebClient.Builder webClientBuilder;
    @Value("${python.service.url}")
    private String pythonServiceUrl;

    // process file
    @SuppressWarnings("null")
    public List<ReportDto> processFile(String project, MultipartFile file, String mode) {

        try {
            String url = projectResolverHelper.resolvePythonUrl(project);
            LinkedMultiValueMap<String, Object> body =
                    buildMultipartBody(file, project, mode);
            log.info("Calling Python API [{}] -> {}", project, url);
            List<ReportDto> response = webClientBuilder
                    .build()
                    .post()
                    .uri(url)
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToFlux(ReportDto.class)
                    .collectList()
                    .block();

            if (response == null || response.isEmpty()) {
                throw new PythonServiceException("No data returned from Python service");
            }
            return response;

        } catch (Exception ex) {
            log.error("Python API call failed", ex);
            throw new PythonServiceException("Failed to call Python service");
        }
    }


    // build multipart body
    @SuppressWarnings("null")
    private LinkedMultiValueMap<String, Object> buildMultipartBody(MultipartFile file, String project, String mode) {

        LinkedMultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new ByteArrayResource(getBytes(file)) {
                    @Override
                    public String getFilename() {
                        return file.getOriginalFilename();
                    }
                }
        );

        // D3 supports lite/full
        if (AppConstantsHelper.D3.equalsIgnoreCase(project)) {
            body.add("mode", mode);
        }
        return body;
    }

    // file bytes
    private byte[] getBytes(MultipartFile file) {

        try {
            return file.getBytes();
        } catch (Exception ex) {
            throw new PythonServiceException("Failed to read uploaded file");
        }
    }

    public PythonApiResponseDto<AnalyticsResponseDto> fetchAnalytics(String project, List<String> routes,
                                                                     List<String> stretches, List<String> locations,
                                                                     List<String> devices, String startDate,
                                                                     String endDate, Integer page, Integer pageSize) {

        String url = pythonServiceUrl + "/api/v1/analytics/" + project + "/history";
        log.info("Calling Python URL: {}", url);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url);

        if (routes != null) routes.forEach(route -> builder.queryParam("routes", route));
        if (stretches != null) stretches.forEach(stretch -> builder.queryParam("stretches", stretch));
        if (locations != null) locations.forEach(location -> builder.queryParam("locations", location));
        if (devices != null) devices.forEach(device -> builder.queryParam("devices", device));
        if (startDate != null) builder.queryParam("start_date", startDate);
        if (endDate != null) builder.queryParam("end_date", endDate);
        if (page != null) builder.queryParam("page", page);
        if (pageSize != null) builder.queryParam("page_size", pageSize);

        String finalUrl = builder.build().toUriString();
        log.info("FINAL URL: {}", finalUrl);

        return webClientBuilder.build()
                .get()
                .uri(finalUrl)
                .retrieve()
                .bodyToMono(
                        new ParameterizedTypeReference<
                                PythonApiResponseDto<AnalyticsResponseDto>
                                >() {
                        }).block();
    }

    public PythonApiResponseDto<FilterOptionsDto> fetchFilterOptions(String project) {
        String url = pythonServiceUrl + "/api/v1/filters/" + project + "/options";
        log.info("Calling Python URL: {}", url);

        return webClientBuilder.build()
                .get()
                .uri(url)
                .retrieve()
                .bodyToMono(
                        new ParameterizedTypeReference<
                                PythonApiResponseDto<FilterOptionsDto>
                                >() {
                        }).block();
    }
}