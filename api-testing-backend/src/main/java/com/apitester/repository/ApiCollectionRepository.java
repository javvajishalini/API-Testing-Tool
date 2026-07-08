package com.apitester.repository;

import com.apitester.entity.ApiCollection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApiCollectionRepository extends JpaRepository<ApiCollection, Long> {
}
