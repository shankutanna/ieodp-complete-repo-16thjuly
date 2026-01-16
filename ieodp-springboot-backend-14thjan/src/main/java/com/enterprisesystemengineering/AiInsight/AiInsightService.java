package com.enterprisesystemengineering.AiInsight;

import com.enterprisesystemengineering.audit.AuditService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AiInsightService {

    private final AiInsightRepository repository;
    private final AuditService auditService;

    public AiInsightService(AiInsightRepository repository, AuditService auditService) {
        this.repository = repository;
        this.auditService = auditService;
    }

    public AiInsight createInsight(AiInsight insight) {
        AiInsight savedInsight = repository.save(insight);

        String userId = getCurrentUserId();
        String role = getCurrentUserRole();
        try {
            auditService.log(userId, role, "CREATE_AI_INSIGHT", "AiInsight", savedInsight.getId(), null, savedInsight.toString());
        } catch (Exception e) {
            System.err.println("Failed to log audit: " + e.getMessage());
        }

        return savedInsight;
    }

    @Transactional(readOnly = true)
    public List<AiInsight> getHighRisk(double threshold) {
        return repository.findByRiskScoreGreaterThanEqual(threshold);
    }

    @Transactional(readOnly = true)
    public List<AiInsight> getByWorkflow(String workflowId) {
        return repository.findByWorkflowId(workflowId);
    }

    public void deleteInsight(String id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("AiInsight not found with id: " + id);
        }
        
        String userId = getCurrentUserId();
        String role = getCurrentUserRole();
        try {
            auditService.log(userId, role, "DELETE_AI_INSIGHT", "AiInsight", id, "EXISTING", "DELETED");
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
