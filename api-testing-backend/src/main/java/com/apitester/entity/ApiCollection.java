package com.apitester.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "api_collections")
public class ApiCollection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @OneToMany(mappedBy = "collection", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ApiRequest> requests = new ArrayList<>();

    public ApiCollection() {}

    public ApiCollection(Long id, String name, String description, List<ApiRequest> requests) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.requests = requests;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public List<ApiRequest> getRequests() { return requests; }
    public void setRequests(List<ApiRequest> requests) { this.requests = requests; }
}
