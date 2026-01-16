package com.enterprisesystemengineering.AiInsight;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ai_insights")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiInsight {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JsonProperty("id")
    private String id;

    @Column(nullable = false)
    @JsonProperty("title")
    private String title;

    @Column(columnDefinition = "TEXT")
    @JsonProperty("description")
    private String description;

    @Column(nullable = false)
    @JsonProperty("riskScore")
    private double riskScore;

    @Column(columnDefinition = "TEXT")
    @JsonProperty("recommendation")
    private String recommendation;

    @Column(nullable = false)
    @JsonProperty("workflowId")
    private String workflowId;
}
