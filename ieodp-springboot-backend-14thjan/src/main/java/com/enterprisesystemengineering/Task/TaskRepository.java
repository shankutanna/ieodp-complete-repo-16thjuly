package com.enterprisesystemengineering.Task;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, String> {
    List<Task> findByAssignedTo(String userId);
    List<Task> findByWorkflowId(String workflowId);
    List<Task> findByStatus(TaskStatus status);
}
