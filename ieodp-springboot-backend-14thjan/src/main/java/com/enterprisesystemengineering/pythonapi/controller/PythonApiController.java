package com.enterprisesystemengineering.pythonapi.controller;

import com.enterprisesystemengineering.pythonapi.client.PythonApiClient;
import com.enterprisesystemengineering.pythonapi.dto.AutomationEvent;
import com.enterprisesystemengineering.pythonapi.dto.AutomationResponse;
import com.enterprisesystemengineering.pythonapi.dto.HealthCheckResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/python-api")
public class PythonApiController {

    private final PythonApiClient pythonApiClient;

    public PythonApiController(PythonApiClient pythonApiClient) {
        this.pythonApiClient = pythonApiClient;
    }

    /**
     * Health check endpoint
     * GET /python-api/health
     */
    @GetMapping("/health")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGEMENT')")
    public ResponseEntity<HealthCheckResponse> checkHealth() {
        HealthCheckResponse response = pythonApiClient.checkHealth();
        return ResponseEntity.ok(response);
    }

    /**
     * Execute automation endpoint
     * POST /python-api/execute
     */
    @PostMapping("/execute")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATIONS')")
    public ResponseEntity<AutomationResponse> executeAutomation(@Valid @RequestBody AutomationEvent event) {
        AutomationResponse response = pythonApiClient.executeAutomation(event);
        return ResponseEntity.ok(response);
    }
}
