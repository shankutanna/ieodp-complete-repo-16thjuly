package com.enterprisesystemengineering.Task;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JsonProperty("id")
    private String id;

    @Column(nullable = false)
    @JsonProperty("title")
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @JsonProperty("status")
    private TaskStatus status;

    @Column(nullable = false)
    @JsonProperty("assignedTo")
    private String assignedTo;

    @Column(nullable = false)
    @JsonProperty("workflowId")
    private String workflowId;
}
