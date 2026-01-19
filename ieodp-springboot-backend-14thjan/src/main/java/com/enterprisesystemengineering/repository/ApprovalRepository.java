package com.enterprisesystemengineering.repository;

import com.enterprisesystemengineering.entity.Approval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ApprovalRepository extends JpaRepository<Approval, Long> {
    List<Approval> findByStatus(String status);
    List<Approval> findByWorkflowId(Long workflowId);
    List<Approval> findByAssignedTo(String assignedTo);
}
