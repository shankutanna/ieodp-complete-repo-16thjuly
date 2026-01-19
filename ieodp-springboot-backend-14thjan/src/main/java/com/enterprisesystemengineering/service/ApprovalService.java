package com.enterprisesystemengineering.service;

import com.enterprisesystemengineering.entity.Approval;
import com.enterprisesystemengineering.repository.ApprovalRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ApprovalService {
    
    private final ApprovalRepository approvalRepository;
    
    public ApprovalService(ApprovalRepository approvalRepository) {
        this.approvalRepository = approvalRepository;
    }
    
    public List<Approval> getAllApprovals() {
        return approvalRepository.findAll();
    }
    
    public List<Approval> getPendingApprovals() {
        return approvalRepository.findByStatus("PENDING");
    }
    
    public Optional<Approval> getApprovalById(Long id) {
        return approvalRepository.findById(id);
    }
    
    public Approval updateApproval(Long id, String status, String reason) {
        Optional<Approval> optional = approvalRepository.findById(id);
        if (optional.isPresent()) {
            Approval approval = optional.get();
            approval.setStatus(status);
            if (reason != null && !reason.isEmpty()) {
                approval.setRejectionReason(reason);
            }
            approval.setUpdatedAt(LocalDateTime.now());
            return approvalRepository.save(approval);
        }
        throw new RuntimeException("Approval not found with id: " + id);
    }
    
    public Approval createApproval(Approval approval) {
        approval.setCreatedAt(LocalDateTime.now());
        approval.setUpdatedAt(LocalDateTime.now());
        if (approval.getStatus() == null) {
            approval.setStatus("PENDING");
        }
        return approvalRepository.save(approval);
    }
    
    public List<Approval> getApprovalsByWorkflow(Long workflowId) {
        return approvalRepository.findByWorkflowId(workflowId);
    }
}
