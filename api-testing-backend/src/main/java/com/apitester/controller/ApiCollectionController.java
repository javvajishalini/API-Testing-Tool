package com.apitester.controller;

import com.apitester.dto.ApiCollectionDto;
import com.apitester.service.ApiCollectionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/collections")
@CrossOrigin("*")
public class ApiCollectionController {

    private final ApiCollectionService collectionService;

    public ApiCollectionController(ApiCollectionService collectionService) {
        this.collectionService = collectionService;
    }

    @GetMapping
    public ResponseEntity<List<ApiCollectionDto>> getAllCollections() {
        return ResponseEntity.ok(collectionService.getAllCollections());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiCollectionDto> getCollectionById(@PathVariable Long id) {
        return ResponseEntity.ok(collectionService.getCollectionById(id));
    }

    @PostMapping
    public ResponseEntity<ApiCollectionDto> createCollection(@RequestBody ApiCollectionDto collectionDto) {
        return new ResponseEntity<>(collectionService.createCollection(collectionDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiCollectionDto> updateCollection(@PathVariable Long id, @RequestBody ApiCollectionDto collectionDto) {
        return ResponseEntity.ok(collectionService.updateCollection(id, collectionDto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiCollectionDto> patchCollection(@PathVariable Long id, @RequestBody ApiCollectionDto collectionDto) {
        // For now, treat PATCH the same as PUT – service updates fields that are present.
        return ResponseEntity.ok(collectionService.updateCollection(id, collectionDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCollection(@PathVariable Long id) {
        collectionService.deleteCollection(id);
        return ResponseEntity.noContent().build();
    }
}
