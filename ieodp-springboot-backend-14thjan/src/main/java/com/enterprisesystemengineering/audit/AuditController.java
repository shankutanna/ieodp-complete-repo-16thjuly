package com.enterprisesystemengineering.audit;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/audits")
public class AuditController {

    private final AuditRepository repository;

    public AuditController(AuditRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AuditLog> createAudit(@Valid @RequestBody AuditLog auditLog) {
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(auditLog));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUDITORS', 'MANAGEMENT')")
    public ResponseEntity<AuditLog> getAuditById(@PathVariable String id) {
        AuditLog auditLog = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Audit log not found"));
        return ResponseEntity.ok(auditLog);
    }

    @GetMapping("/logs")
    @PreAuthorize("hasAnyRole('ADMIN', 'AUDITORS', 'MANAGEMENT')")
    public ResponseEntity<Page<AuditLog>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search
    ) {
        return ResponseEntity.ok(repository.findByEntityContainingIgnoreCase(
                search,
                PageRequest.of(page, size)
        ));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAudit(@PathVariable String id) {
        AuditLog auditLog = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Audit log not found"));
        repository.delete(auditLog);
        return ResponseEntity.noContent().build();
    }
}
