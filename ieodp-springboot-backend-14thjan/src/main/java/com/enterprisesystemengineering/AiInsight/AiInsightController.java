package com.enterprisesystemengineering.AiInsight;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ai-insights")
public class AiInsightController {

    private final AiInsightService service;
    private final AiInsightRepository repository;

    public AiInsightController(AiInsightService service, AiInsightRepository repository) {
        this.service = service;
        this.repository = repository;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGEMENT')")
    public ResponseEntity<AiInsight> createInsight(@Valid @RequestBody AiInsight insight) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createInsight(insight));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGEMENT', 'LEADERSHIP', 'AUDITORS')")
    public ResponseEntity<List<AiInsight>> getAllInsights() {
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGEMENT', 'LEADERSHIP', 'AUDITORS')")
    public ResponseEntity<AiInsight> getInsightById(@PathVariable String id) {
        AiInsight insight = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Insight not found"));
        return ResponseEntity.ok(insight);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGEMENT')")
    public ResponseEntity<AiInsight> updateInsight(@PathVariable String id, @Valid @RequestBody AiInsight insightDetails) {
        AiInsight insight = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Insight not found"));
        
        insight.setTitle(insightDetails.getTitle());
        insight.setDescription(insightDetails.getDescription());
        insight.setRiskScore(insightDetails.getRiskScore());
        insight.setRecommendation(insightDetails.getRecommendation());
        insight.setWorkflowId(insightDetails.getWorkflowId());
        
        return ResponseEntity.ok(repository.save(insight));
    }

    @GetMapping("/high-risk")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGEMENT', 'LEADERSHIP')")
    public ResponseEntity<List<AiInsight>> getHighRisk(
            @RequestParam(defaultValue = "0.7") double threshold) {
        return ResponseEntity.ok(service.getHighRisk(threshold));
    }

    @GetMapping("/workflow/{workflowId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGEMENT', 'LEADERSHIP')")
    public ResponseEntity<List<AiInsight>> byWorkflow(
            @PathVariable String workflowId) {
        return ResponseEntity.ok(service.getByWorkflow(workflowId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGEMENT')")
    public ResponseEntity<Void> deleteInsight(@PathVariable String id) {
        service.deleteInsight(id);
        return ResponseEntity.noContent().build();
    }
}
