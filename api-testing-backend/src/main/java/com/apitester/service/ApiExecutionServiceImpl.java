package com.apitester.service;

import com.apitester.dto.ExecutionRequestDto;
import com.apitester.dto.ExecutionResponseDto;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

@Service
public class ApiExecutionServiceImpl implements ApiExecutionService {

    private final RestTemplate restTemplate;

    public ApiExecutionServiceImpl() {
        this.restTemplate = new RestTemplate();
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

        // 2. Validate JSON Body if it's not empty
        String body = requestDto.getBody();
        if (body != null && !body.trim().isEmpty()) {
            try {
                new com.fasterxml.jackson.databind.ObjectMapper().readTree(body);
            } catch (Exception e) {
                responseDto.setStatusCode(0);
                responseDto.setStatusText("INVALID JSON");
                responseDto.setBody("Request body is not valid JSON:\n" + e.getMessage());
                responseDto.setTimeMs(0);
                responseDto.setSizeBytes(0);
                return responseDto;
            }
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

            // Prepare Headers
            HttpHeaders headers = new HttpHeaders();
            if (requestDto.getHeaders() != null) {
                for (Map.Entry<String, String> entry : requestDto.getHeaders().entrySet()) {
                    headers.add(entry.getKey(), entry.getValue());
                }
            }

            // Create Entity
            HttpEntity<String> entity = new HttpEntity<>(requestDto.getBody(), headers);

            // Execute Request
            HttpMethod method = HttpMethod.valueOf(requestDto.getMethod().toUpperCase());
            ResponseEntity<String> responseEntity = restTemplate.exchange(finalUrl, method, entity, String.class);

            populateResponse(responseDto, responseEntity, startTime);

        } catch (HttpStatusCodeException e) {
            // Handle error responses (4xx, 5xx)
            responseDto.setStatusCode(e.getStatusCode().value());
            responseDto.setStatusText(e.getStatusCode().toString());
            responseDto.setBody(e.getResponseBodyAsString());
            
            Map<String, String> headers = new HashMap<>();
            e.getResponseHeaders().forEach((key, value) -> headers.put(key, String.join(", ", value)));
            responseDto.setHeaders(headers);
            
            responseDto.setTimeMs(System.currentTimeMillis() - startTime);
            responseDto.setSizeBytes(e.getResponseBodyAsByteArray() != null ? e.getResponseBodyAsByteArray().length : 0);
            
        } catch (Exception e) {
            // Handle network errors or invalid URLs
            responseDto.setStatusCode(0);
            responseDto.setStatusText("ERROR");
            responseDto.setBody(e.getMessage());
            responseDto.setTimeMs(System.currentTimeMillis() - startTime);
            responseDto.setSizeBytes(0);
        }

        return responseDto;
    }

    private void populateResponse(ExecutionResponseDto responseDto, ResponseEntity<String> responseEntity, long startTime) {
        responseDto.setStatusCode(responseEntity.getStatusCode().value());
        responseDto.setStatusText(responseEntity.getStatusCode().toString());
        responseDto.setBody(responseEntity.getBody());
        
        Map<String, String> headers = new HashMap<>();
        responseEntity.getHeaders().forEach((key, value) -> headers.put(key, String.join(", ", value)));
        responseDto.setHeaders(headers);
        
        responseDto.setTimeMs(System.currentTimeMillis() - startTime);
        
        long size = 0;
        if (responseEntity.getBody() != null) {
            size = responseEntity.getBody().getBytes().length;
        }
        responseDto.setSizeBytes(size);
    }
}
