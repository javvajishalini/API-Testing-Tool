package com.apitester.controller;

import com.apitester.dto.ApiRequestDto;
import com.apitester.service.ApiRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/requests")
public class ApiRequestController {

    private final ApiRequestService requestService;

    public ApiRequestController(ApiRequestService requestService) {
        this.requestService = requestService;
    }

    @GetMapping
    public ResponseEntity<List<ApiRequestDto>> getRequestsByCollectionId(@RequestParam Long collectionId) {
        return ResponseEntity.ok(requestService.getRequestsByCollectionId(collectionId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiRequestDto> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.getRequestById(id));
    }

    @PostMapping
    public ResponseEntity<ApiRequestDto> createRequest(@RequestBody ApiRequestDto requestDto) {
        return new ResponseEntity<>(requestService.createRequest(requestDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiRequestDto> updateRequest(@PathVariable Long id, @RequestBody ApiRequestDto requestDto) {
        return ResponseEntity.ok(requestService.updateRequest(id, requestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        requestService.deleteRequest(id);
        return ResponseEntity.noContent().build();
    }
}
