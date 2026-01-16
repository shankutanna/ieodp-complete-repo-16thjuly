package com.enterprisesystemengineering.pythonapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AutomationResponse {
    @JsonProperty("status")
    private String status;

    @JsonProperty("reason")
    private String reason;

    @JsonProperty("outcome")
    private String outcome;

    @JsonProperty("rule_version")
    private Integer ruleVersion;

    @JsonProperty("correlation_id")
    private String correlationId;

    @JsonProperty("task_id")
    private String taskId;
}
