package com.enterprisesystemengineering.Task;

import com.enterprisesystemengineering.audit.AuditService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TaskService {

    private final TaskRepository repository;
    private final AuditService auditService;

    public TaskService(TaskRepository repository, AuditService auditService) {
        this.repository = repository;
        this.auditService = auditService;
    }

    public Task createTask(Task task) {
        if (task.getStatus() == null) {
            task.setStatus(TaskStatus.PENDING);
        }
        Task savedTask = repository.save(task);
        
        String userId = getCurrentUserId();
        String role = getCurrentUserRole();
        
        try {
            auditService.log(userId, role, "CREATE_TASK", "Task", savedTask.getId(), null, savedTask.toString());
        } catch (Exception e) {
            System.err.println("Failed to log audit: " + e.getMessage());
        }
        
        return savedTask;
    }

    public Task updateStatus(String id, TaskStatus status) {
        Task task = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
        
        String oldState = task.toString();
        task.setStatus(status);
        Task savedTask = repository.save(task);

        String userId = getCurrentUserId();
        String role = getCurrentUserRole();

        try {
            auditService.log(userId, role, "UPDATE_TASK_STATUS", "Task", savedTask.getId(), oldState, savedTask.toString());
        } catch (Exception e) {
            System.err.println("Failed to log audit: " + e.getMessage());
        }

        return savedTask;
    }

    @Transactional(readOnly = true)
    public List<Task> getByUser(String userId) {
        return repository.findByAssignedTo(userId);
    }

    @Transactional(readOnly = true)
    public List<Task> getByWorkflow(String workflowId) {
        return repository.findByWorkflowId(workflowId);
    }

    public void deleteTask(String id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Task not found with id: " + id);
        }
        
        String userId = getCurrentUserId();
        String role = getCurrentUserRole();
        try {
            auditService.log(userId, role, "DELETE_TASK", "Task", id, "EXISTING", "DELETED");
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
