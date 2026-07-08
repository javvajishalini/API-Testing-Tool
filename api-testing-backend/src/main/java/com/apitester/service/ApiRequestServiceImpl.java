package com.apitester.service;

import com.apitester.dto.ApiRequestDto;
import com.apitester.entity.ApiCollection;
import com.apitester.entity.ApiRequest;
import com.apitester.exception.ResourceNotFoundException;
import com.apitester.repository.ApiCollectionRepository;
import com.apitester.repository.ApiRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApiRequestServiceImpl implements ApiRequestService {

    private final ApiRequestRepository requestRepository;
    private final ApiCollectionRepository collectionRepository;

    public ApiRequestServiceImpl(ApiRequestRepository requestRepository, ApiCollectionRepository collectionRepository) {
        this.requestRepository = requestRepository;
        this.collectionRepository = collectionRepository;
    }

    @Override
    public List<ApiRequestDto> getRequestsByCollectionId(Long collectionId) {
        if (!collectionRepository.existsById(collectionId)) {
            throw new ResourceNotFoundException("Collection not found with id: " + collectionId);
        }
        return requestRepository.findByCollectionId(collectionId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ApiRequestDto getRequestById(Long id) {
        ApiRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + id));
        return mapToDto(request);
    }

    @Override
    public ApiRequestDto createRequest(ApiRequestDto requestDto) {
        ApiRequest request = new ApiRequest();
        mapToEntity(requestDto, request);
        
        if (requestDto.getCollectionId() != null) {
            ApiCollection collection = collectionRepository.findById(requestDto.getCollectionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Collection not found with id: " + requestDto.getCollectionId()));
            request.setCollection(collection);
        }
        
        ApiRequest savedRequest = requestRepository.save(request);
        return mapToDto(savedRequest);
    }

    @Override
    public ApiRequestDto updateRequest(Long id, ApiRequestDto requestDto) {
        ApiRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + id));
        
        mapToEntity(requestDto, request);
        
        if (requestDto.getCollectionId() != null && 
            (request.getCollection() == null || !request.getCollection().getId().equals(requestDto.getCollectionId()))) {
            ApiCollection collection = collectionRepository.findById(requestDto.getCollectionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Collection not found with id: " + requestDto.getCollectionId()));
            request.setCollection(collection);
        }
        
        ApiRequest updatedRequest = requestRepository.save(request);
        return mapToDto(updatedRequest);
    }

    @Override
    public void deleteRequest(Long id) {
        if (!requestRepository.existsById(id)) {
            throw new ResourceNotFoundException("Request not found with id: " + id);
        }
        requestRepository.deleteById(id);
    }

    private void mapToEntity(ApiRequestDto dto, ApiRequest entity) {
        entity.setName(dto.getName());
        entity.setMethod(dto.getMethod());
        entity.setUrl(dto.getUrl());
        entity.setHeaders(dto.getHeaders());
        entity.setQueryParams(dto.getQueryParams());
        entity.setBody(dto.getBody());
    }

    private ApiRequestDto mapToDto(ApiRequest entity) {
        ApiRequestDto dto = new ApiRequestDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setMethod(entity.getMethod());
        dto.setUrl(entity.getUrl());
        dto.setHeaders(entity.getHeaders());
        dto.setQueryParams(entity.getQueryParams());
        dto.setBody(entity.getBody());
        if (entity.getCollection() != null) {
            dto.setCollectionId(entity.getCollection().getId());
        }
        return dto;
    }
}
