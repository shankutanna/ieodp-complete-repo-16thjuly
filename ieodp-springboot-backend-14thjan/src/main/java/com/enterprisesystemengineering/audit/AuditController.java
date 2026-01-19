package com.enterprisesystemengineering.audit;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auditLogs")
public class AuditController {

    private final AuditRepository repository;

    public AuditController(AuditRepository repository) {
        this.repository = repository;
    }

    /**
     * POST /auditLogs - Create new audit log
     * Request body: { "entity": "...", "entityId": "...", "action": "...", "details": "..." }
     */
    @PostMapping
    public ResponseEntity<AuditLog> createAudit(
            @Valid @RequestBody AuditLog auditLog,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(auditLog));
    }

    /**
     * GET /auditLogs - Get all audit logs
     */
    @GetMapping
    public ResponseEntity<Page<AuditLog>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ResponseEntity.ok(repository.findByEntityContainingIgnoreCase(
                search,
                PageRequest.of(page, size)
        ));
    }

    /**
     * GET /auditLogs/{id} - Get specific audit log
     */
    @GetMapping("/{id}")
    public ResponseEntity<AuditLog> getAuditById(
            @PathVariable String id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        AuditLog auditLog = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Audit log not found"));
        return ResponseEntity.ok(auditLog);
    }

    /**
     * DELETE /auditLogs/{id} - Delete audit log
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAudit(
            @PathVariable String id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        AuditLog auditLog = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Audit log not found"));
        repository.delete(auditLog);
        return ResponseEntity.noContent().build();
    }
}
