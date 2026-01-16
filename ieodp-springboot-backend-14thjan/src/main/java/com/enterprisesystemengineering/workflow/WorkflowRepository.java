package com.enterprisesystemengineering.workflow;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkflowRepository extends JpaRepository<Workflow, String> {
    List<Workflow> findByCreatedBy(String userId);
    List<Workflow> findByStatus(WorkflowStatus status);
}

