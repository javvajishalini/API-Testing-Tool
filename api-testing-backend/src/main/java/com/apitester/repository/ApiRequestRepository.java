package com.apitester.repository;

import com.apitester.entity.ApiRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApiRequestRepository extends JpaRepository<ApiRequest, Long> {
    List<ApiRequest> findByCollectionId(Long collectionId);
}
