package com.enterprisesystemengineering.config;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

/**
 * Health Check Controller for Kubernetes
 * Provides endpoints for liveness and readiness probes
 */
@RestController
@RequestMapping("/health")
public class HealthCheckController {
    
    /**
     * GET /health - Basic health check (compatible with Kubernetes readiness probe)
     */
    @GetMapping
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Enterprise System Engineering API");
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /health/live - Kubernetes liveness probe endpoint
     * Indicates if the service is running
     */
    @GetMapping("/live")
    public ResponseEntity<Map<String, String>> live() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        return ResponseEntity.ok(response);
    }
    
    /**
     * GET /health/ready - Kubernetes readiness probe endpoint
     * Indicates if the service is ready to accept traffic
     */
    @GetMapping("/ready")
    public ResponseEntity<Map<String, String>> ready() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("ready", "true");
        return ResponseEntity.ok(response);
    }
}
