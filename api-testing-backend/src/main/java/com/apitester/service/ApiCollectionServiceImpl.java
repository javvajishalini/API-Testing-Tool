package com.apitester.service;

import com.apitester.dto.ApiCollectionDto;
import com.apitester.dto.ApiRequestDto;
import com.apitester.entity.ApiCollection;
import com.apitester.entity.ApiRequest;
import com.apitester.exception.ResourceNotFoundException;
import com.apitester.repository.ApiCollectionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApiCollectionServiceImpl implements ApiCollectionService {

    private final ApiCollectionRepository collectionRepository;

    public ApiCollectionServiceImpl(ApiCollectionRepository collectionRepository) {
        this.collectionRepository = collectionRepository;
    }

    @Override
    public List<ApiCollectionDto> getAllCollections() {
        return collectionRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ApiCollectionDto getCollectionById(Long id) {
        ApiCollection collection = collectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Collection not found with id: " + id));
        return mapToDto(collection);
    }

    @Override
    public ApiCollectionDto createCollection(ApiCollectionDto collectionDto) {
        ApiCollection collection = new ApiCollection();
        collection.setName(collectionDto.getName());
        collection.setDescription(collectionDto.getDescription());
        
        ApiCollection savedCollection = collectionRepository.save(collection);
        return mapToDto(savedCollection);
    }

    @Override
    public ApiCollectionDto updateCollection(Long id, ApiCollectionDto collectionDto) {
        ApiCollection collection = collectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Collection not found with id: " + id));
        
        collection.setName(collectionDto.getName());
        collection.setDescription(collectionDto.getDescription());
        
        ApiCollection updatedCollection = collectionRepository.save(collection);
        return mapToDto(updatedCollection);
    }

    @Override
    public void deleteCollection(Long id) {
        if (!collectionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Collection not found with id: " + id);
        }
        collectionRepository.deleteById(id);
    }

    private ApiCollectionDto mapToDto(ApiCollection collection) {
        ApiCollectionDto dto = new ApiCollectionDto();
        dto.setId(collection.getId());
        dto.setName(collection.getName());
        dto.setDescription(collection.getDescription());
        
        if (collection.getRequests() != null) {
            List<ApiRequestDto> requestDtos = collection.getRequests().stream().map(req -> {
                ApiRequestDto reqDto = new ApiRequestDto();
                reqDto.setId(req.getId());
                reqDto.setName(req.getName());
                reqDto.setMethod(req.getMethod());
                reqDto.setUrl(req.getUrl());
                reqDto.setCollectionId(collection.getId());
                return reqDto;
            }).collect(Collectors.toList());
            dto.setRequests(requestDtos);
        }
        return dto;
    }
}
