package com.enterprisesystemengineering.pythonapi.client;

import com.enterprisesystemengineering.pythonapi.dto.AutomationEvent;
import com.enterprisesystemengineering.pythonapi.dto.AutomationResponse;
import com.enterprisesystemengineering.pythonapi.dto.HealthCheckResponse;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.UUID;

@Service
public class PythonApiClient {

    private final WebClient webClient;

    public PythonApiClient(WebClient pythonApiWebClient) {
        this.webClient = pythonApiWebClient;
    }

    /**
     * Health check endpoint
     * GET /api/v1/health
     */
    public HealthCheckResponse checkHealth() {
        try {
            return webClient.get()
                    .uri("/api/v1/health")
                    .retrieve()
                    .bodyToMono(HealthCheckResponse.class)
                    .block();
        } catch (WebClientResponseException e) {
            throw new RuntimeException("Failed to check Python API health: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Error calling Python API health endpoint", e);
        }
    }

    /**
     * Execute automation endpoint
     * POST /api/v1/automation/execute
     */
    public AutomationResponse executeAutomation(AutomationEvent event) {
        try {
            String correlationId = UUID.randomUUID().toString();

            return webClient.post()
                    .uri("/api/v1/automation/execute")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("X-Correlation-ID", correlationId)
                    .bodyValue(event)
                    .retrieve()
                    .bodyToMono(AutomationResponse.class)
                    .block();
        } catch (WebClientResponseException e) {
            throw new RuntimeException("Failed to execute automation on Python API: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Error calling Python API automation endpoint", e);
        }
    }

    /**
     * Execute automation endpoint with custom correlation ID
     * POST /api/v1/automation/execute
     */
    public AutomationResponse executeAutomation(AutomationEvent event, String correlationId) {
        try {
            return webClient.post()
                    .uri("/api/v1/automation/execute")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("X-Correlation-ID", correlationId)
                    .bodyValue(event)
                    .retrieve()
                    .bodyToMono(AutomationResponse.class)
                    .block();
        } catch (WebClientResponseException e) {
            throw new RuntimeException("Failed to execute automation on Python API: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Error calling Python API automation endpoint", e);
        }
    }
}
