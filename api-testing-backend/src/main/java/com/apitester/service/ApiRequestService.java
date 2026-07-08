package com.apitester.service;

import com.apitester.dto.ApiRequestDto;
import java.util.List;

public interface ApiRequestService {
    List<ApiRequestDto> getRequestsByCollectionId(Long collectionId);
    ApiRequestDto getRequestById(Long id);
    ApiRequestDto createRequest(ApiRequestDto requestDto);
    ApiRequestDto updateRequest(Long id, ApiRequestDto requestDto);
    void deleteRequest(Long id);
}
