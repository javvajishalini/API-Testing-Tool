package com.apitester.dto;

import java.util.List;

public class ApiCollectionDto {
    private Long id;
    private String name;
    private String description;
    private List<ApiRequestDto> requests;

    public ApiCollectionDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<ApiRequestDto> getRequests() { return requests; }
    public void setRequests(List<ApiRequestDto> requests) { this.requests = requests; }
}
