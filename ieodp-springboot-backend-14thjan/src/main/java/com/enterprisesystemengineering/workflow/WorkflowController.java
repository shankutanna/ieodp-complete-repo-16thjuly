package com.enterprisesystemengineering.workflow;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workflows")
public class WorkflowController {

    private final WorkflowService service;
    private final WorkflowRepository repository;

    public WorkflowController(WorkflowService service, WorkflowRepository repository) {
        this.service = service;
        this.repository = repository;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGEMENT', 'OPERATIONS')")
    public ResponseEntity<Workflow> createWorkflow(@Valid @RequestBody Workflow workflow) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createWorkflow(workflow));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Workflow>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Workflow> getWorkflowById(@PathVariable String id) {
        Workflow workflow = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workflow not found"));
        return ResponseEntity.ok(workflow);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGEMENT', 'OPERATIONS')")
    public ResponseEntity<Workflow> updateWorkflow(@PathVariable String id, @Valid @RequestBody Workflow workflowDetails) {
        Workflow workflow = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workflow not found"));
        
        workflow.setName(workflowDetails.getName());
        workflow.setType(workflowDetails.getType());
        workflow.setStatus(workflowDetails.getStatus());
        
        return ResponseEntity.ok(repository.save(workflow));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGEMENT', 'OPERATIONS')")
    public ResponseEntity<Workflow> updateStatus(
            @PathVariable String id,
            @RequestParam WorkflowStatus status) {
        return ResponseEntity.ok(service.updateStatus(id, status));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Workflow>> getByStatus(@PathVariable WorkflowStatus status) {
        return ResponseEntity.ok(service.getByStatus(status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGEMENT')")
    public ResponseEntity<Void> deleteWorkflow(@PathVariable String id) {
        service.deleteWorkflow(id);
        return ResponseEntity.noContent().build();
    }
}
