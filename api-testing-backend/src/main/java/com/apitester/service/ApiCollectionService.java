package com.apitester.service;

import com.apitester.dto.ApiCollectionDto;
import java.util.List;

public interface ApiCollectionService {
    List<ApiCollectionDto> getAllCollections();
    ApiCollectionDto getCollectionById(Long id);
    ApiCollectionDto createCollection(ApiCollectionDto collectionDto);
    ApiCollectionDto updateCollection(Long id, ApiCollectionDto collectionDto);
    void deleteCollection(Long id);
}
