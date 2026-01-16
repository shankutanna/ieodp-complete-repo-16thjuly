package com.enterprisesystemengineering.audit;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JsonProperty("id")
    private String id;

    @Column(nullable = false)
    @JsonProperty("userId")
    private String userId;

    @Column(nullable = false)
    @JsonProperty("role")
    private String role;

    @Column(nullable = false)
    @JsonProperty("action")
    private String action;

    @Column(nullable = false)
    @JsonProperty("entity")
    private String entity;

    @Column(nullable = false)
    @JsonProperty("entityId")
    private String entityId;

    @Column(columnDefinition = "TEXT")
    @JsonProperty("previousState")
    private String previousState;

    @Column(columnDefinition = "TEXT")
    @JsonProperty("newState")
    private String newState;

    @Column(nullable = false, updatable = false)
    @JsonProperty("timestamp")
    private LocalDateTime timestamp;

    @PrePersist
    public void prePersist() {
        this.timestamp = LocalDateTime.now();
    }
}
