package com.apitester;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the API Testing Tool backend application.
 * This Spring Boot application acts as a backend proxy for API testing,
 * similar to Postman but self-hosted.
 */
@SpringBootApplication
public class ApiTestingApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiTestingApplication.class, args);
    }
}
