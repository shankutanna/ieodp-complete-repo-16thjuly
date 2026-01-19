package com.enterprisesystemengineering.controller;

import com.enterprisesystemengineering.entity.Approval;
import com.enterprisesystemengineering.service.ApprovalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * Approval Controller - Kubernetes-friendly React Frontend Integration
 * Endpoints for managing approvals workflow
 */
@RestController
@RequestMapping("/approvals")
public class ApprovalController {
    
    private final ApprovalService approvalService;
    
    public ApprovalController(ApprovalService approvalService) {
        this.approvalService = approvalService;
    }
    
    /**
     * GET /approvals - Get all pending approvals
     * Can be called by React frontend with Authorization header
     */
    @GetMapping
    public ResponseEntity<List<Approval>> getApprovals(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        // Authorization header is optional - validate if needed
        List<Approval> approvals = approvalService.getAllApprovals();
        return ResponseEntity.ok(approvals);
    }
    
    /**
     * GET /approvals/pending - Get pending approvals
     */
    @GetMapping("/pending")
    public ResponseEntity<List<Approval>> getPendingApprovals(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        List<Approval> approvals = approvalService.getPendingApprovals();
        return ResponseEntity.ok(approvals);
    }
    
    /**
     * GET /approvals/{id} - Get specific approval
     */
    @GetMapping("/{id}")
    public ResponseEntity<Approval> getApprovalById(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return approvalService.getApprovalById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * PATCH /approvals/{id} - Update approval status
     * Request body: { "status": "APPROVED|REJECTED|ESCALATED", "reason": "optional" }
     */
    @PatchMapping("/{id}")
    public ResponseEntity<Approval> updateApproval(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        String status = body.get("status");
        String reason = body.get("reason");
        
        if (status == null || status.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        try {
            Approval updated = approvalService.updateApproval(id, status, reason);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    /**
     * POST /approvals - Create new approval
     */
    @PostMapping
    public ResponseEntity<Approval> createApproval(
            @Valid @RequestBody Approval approval,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Approval created = approvalService.createApproval(approval);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    /**
     * GET /approvals/workflow/{workflowId} - Get approvals for specific workflow
     */
    @GetMapping("/workflow/{workflowId}")
    public ResponseEntity<List<Approval>> getApprovalsByWorkflow(
            @PathVariable Long workflowId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        List<Approval> approvals = approvalService.getApprovalsByWorkflow(workflowId);
        return ResponseEntity.ok(approvals);
    }
}
