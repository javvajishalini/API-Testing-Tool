package com.apitester.controller;

import com.apitester.dto.ExecutionRequestDto;
import com.apitester.dto.ExecutionResponseDto;
import com.apitester.service.ApiExecutionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/execute")
@CrossOrigin("*")
public class ApiExecutionController {

    private final ApiExecutionService executionService;

    public ApiExecutionController(ApiExecutionService executionService) {
        this.executionService = executionService;
    }

    @PostMapping
    public ResponseEntity<ExecutionResponseDto> executeRequest(@RequestBody ExecutionRequestDto requestDto) {
        return ResponseEntity.ok(executionService.execute(requestDto));
    }
}
