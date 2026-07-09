package com.apitester.service;

import com.apitester.dto.ExecutionRequestDto;
import com.apitester.dto.ExecutionResponseDto;

public interface ApiExecutionService {
    ExecutionResponseDto execute(ExecutionRequestDto requestDto);
}
