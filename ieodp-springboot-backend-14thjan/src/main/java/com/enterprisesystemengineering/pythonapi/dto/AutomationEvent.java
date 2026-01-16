package com.enterprisesystemengineering.pythonapi.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AutomationEvent {
    @JsonProperty("request_id")
    private String requestId;

    @JsonProperty("workflow_id")
    private String workflowId;

    @JsonProperty("workflow_type")
    private String workflowType;

    @JsonProperty("transaction")
    private Transaction transaction;

    @JsonProperty("risk_score")
    private Double riskScore;

    @JsonProperty("priority")
    private Priority priority;

    @JsonProperty("source_system")
    private String sourceSystem;

    @JsonProperty("created_at")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
}
