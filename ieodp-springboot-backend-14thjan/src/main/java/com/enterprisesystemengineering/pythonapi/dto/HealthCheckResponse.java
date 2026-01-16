package com.enterprisesystemengineering.pythonapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HealthCheckResponse {
    @JsonProperty("status")
    private String status;

    @JsonProperty("service")
    private String service;
}
