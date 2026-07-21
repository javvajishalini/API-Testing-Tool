package com.apitester.service;

import com.apitester.dto.ExecutionRequestDto;
import com.apitester.dto.ExecutionResponseDto;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
public class ApiExecutionServiceImpl implements ApiExecutionService {

    private final HttpClient httpClient;

    public ApiExecutionServiceImpl() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(30))
                .followRedirects(HttpClient.Redirect.ALWAYS)
                .build();
    }

    @Override
    public ExecutionResponseDto execute(ExecutionRequestDto requestDto) {
        ExecutionResponseDto responseDto = new ExecutionResponseDto();
        long startTime = System.currentTimeMillis();

        // 1. Validate URL
        String rawUrl = requestDto.getUrl();
        if (rawUrl == null || rawUrl.trim().isEmpty()) {
            responseDto.setStatusCode(0);
            responseDto.setStatusText("INVALID URL");
            responseDto.setBody("URL cannot be empty.");
            responseDto.setTimeMs(0);
            responseDto.setSizeBytes(0);
            return responseDto;
        }

        if (!rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) {
            responseDto.setStatusCode(0);
            responseDto.setStatusText("INVALID URL");
            responseDto.setBody("URL must start with http:// or https://");
            responseDto.setTimeMs(0);
            responseDto.setSizeBytes(0);
            return responseDto;
        }

        try {
            // Build URL with Query Params
            UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(requestDto.getUrl());
            if (requestDto.getQueryParams() != null) {
                for (Map.Entry<String, String> entry : requestDto.getQueryParams().entrySet()) {
                    uriBuilder.queryParam(entry.getKey(), entry.getValue());
                }
            }
            String finalUrl = uriBuilder.toUriString();

            // Prepare Request Builder
            HttpRequest.Builder builder = HttpRequest.newBuilder()
                    .uri(URI.create(finalUrl))
                    .timeout(Duration.ofSeconds(60));

            // Set Headers
            boolean hasUserAgent = false;
            if (requestDto.getHeaders() != null) {
                for (Map.Entry<String, String> entry : requestDto.getHeaders().entrySet()) {
                    if (entry.getKey() != null && !entry.getKey().trim().isEmpty() && entry.getValue() != null) {
                        String keyLower = entry.getKey().toLowerCase().trim();
                        // Restricted headers managed directly by Java HttpClient runtime
                        if (keyLower.equals("host") || keyLower.equals("content-length")) {
                            continue;
                        }
                        builder.header(entry.getKey().trim(), entry.getValue());
                        if (keyLower.equals("user-agent")) {
                            hasUserAgent = true;
                        }
                    }
                }
            }

            if (!hasUserAgent) {
                builder.header("User-Agent", "APIFlow/1.0");
            }

            // Method & Body
            String method = requestDto.getMethod() != null ? requestDto.getMethod().toUpperCase() : "GET";
            String bodyStr = requestDto.getBody() != null ? requestDto.getBody() : "";

            HttpRequest.BodyPublisher publisher;
            if (method.equals("GET") || method.equals("HEAD")) {
                publisher = HttpRequest.BodyPublishers.noBody();
            } else if (method.equals("DELETE")) {
                publisher = bodyStr.trim().isEmpty() 
                    ? HttpRequest.BodyPublishers.noBody() 
                    : HttpRequest.BodyPublishers.ofString(bodyStr, StandardCharsets.UTF_8);
            } else {
                publisher = HttpRequest.BodyPublishers.ofString(bodyStr, StandardCharsets.UTF_8);
            }

            builder.method(method, publisher);

            // Execute Request via Java 11+ HttpClient (Native PATCH support)
            HttpResponse<String> response = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());

            long timeMs = System.currentTimeMillis() - startTime;
            responseDto.setStatusCode(response.statusCode());
            responseDto.setStatusText(response.statusCode() >= 200 && response.statusCode() < 300 ? "OK" : "Status " + response.statusCode());
            responseDto.setBody(response.body() != null ? response.body() : "");
            responseDto.setTimeMs(timeMs);
            responseDto.setSizeBytes(response.body() != null ? response.body().getBytes(StandardCharsets.UTF_8).length : 0);

            // Extract Headers
            Map<String, String> responseHeaders = new HashMap<>();
            response.headers().map().forEach((key, list) -> responseHeaders.put(key, String.join(", ", list)));
            responseDto.setHeaders(responseHeaders);

        } catch (Exception e) {
            responseDto.setStatusCode(0);
            responseDto.setStatusText("ERROR");
            responseDto.setBody("Execution error: " + e.getMessage());
            responseDto.setTimeMs(System.currentTimeMillis() - startTime);
            responseDto.setSizeBytes(0);
        }

        return responseDto;
    }
}
