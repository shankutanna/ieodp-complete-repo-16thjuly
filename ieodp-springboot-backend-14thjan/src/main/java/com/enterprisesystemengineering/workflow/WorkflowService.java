package com.enterprisesystemengineering.workflow;

import com.enterprisesystemengineering.audit.AuditService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class WorkflowService {

    private final WorkflowRepository repository;
    private final AuditService auditService;

    public WorkflowService(WorkflowRepository repository, AuditService auditService) {
        this.repository = repository;
        this.auditService = auditService;
    }

    public Workflow createWorkflow(Workflow workflow) {
        String userId = getCurrentUserId();
        workflow.setCreatedBy(userId);
        if (workflow.getStatus() == null) {
            workflow.setStatus(WorkflowStatus.CREATED);
        }
        Workflow savedWorkflow = repository.save(workflow);

        String role = getCurrentUserRole();
        try {
            auditService.log(userId, role, "CREATE_WORKFLOW", "Workflow", savedWorkflow.getId(), null, savedWorkflow.toString());
        } catch (Exception e) {
            // Log error but don't fail the transaction
            System.err.println("Failed to log audit: " + e.getMessage());
        }

        return savedWorkflow;
    }

    @Transactional(readOnly = true)
    public List<Workflow> getAll() {
        return repository.findAll();
    }

    public Workflow updateStatus(String id, WorkflowStatus status) {
        Workflow wf = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workflow not found with id: " + id));
        
        String oldState = wf.toString();
        wf.setStatus(status);
        Workflow savedWorkflow = repository.save(wf);

        String userId = getCurrentUserId();
        String role = getCurrentUserRole();
        try {
            auditService.log(userId, role, "UPDATE_WORKFLOW_STATUS", "Workflow", savedWorkflow.getId(), oldState, savedWorkflow.toString());
        } catch (Exception e) {
             // Log error but don't fail the transaction
             System.err.println("Failed to log audit: " + e.getMessage());
        }

        return savedWorkflow;
    }

    @Transactional(readOnly = true)
    public List<Workflow> getByStatus(WorkflowStatus status) {
        return repository.findByStatus(status);
    }

    public void deleteWorkflow(String id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Workflow not found with id: " + id);
        }
        
        // Log deletion before actual delete to capture state if needed, or just log the action
        String userId = getCurrentUserId();
        String role = getCurrentUserRole();
        try {
            auditService.log(userId, role, "DELETE_WORKFLOW", "Workflow", id, "EXISTING", "DELETED");
        } catch (Exception e) {
            System.err.println("Failed to log audit: " + e.getMessage());
        }

        repository.deleteById(id);
    }

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() != null) {
             if (authentication.getPrincipal() instanceof String) {
                 return (String) authentication.getPrincipal();
             } else if (authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails) {
                 return ((org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal()).getUsername();
             }
             return authentication.getName();
        }
        return "SYSTEM";
    }

    private String getCurrentUserRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && !authentication.getAuthorities().isEmpty()) {
            return authentication.getAuthorities().iterator().next().getAuthority();
        }
        return "UNKNOWN";
    }
}
