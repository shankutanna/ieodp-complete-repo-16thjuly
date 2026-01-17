package com.enterprisesystemengineering.service;

import com.enterprisesystemengineering.audit.AuditLog;
import com.enterprisesystemengineering.repository.AuditLogRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void logAction(String action, String entity, String entityId, String previousState, String newState) {
        try {
            String userName = SecurityContextHolder.getContext().getAuthentication().getName();
            String role = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                    .findFirst()
                    .map(auth -> auth.getAuthority().replace("ROLE_", ""))
                    .orElse("UNKNOWN");

            AuditLog auditLog = AuditLog.builder()
                    .userId(userName)
                    .role(role)
                    .action(action)
                    .entity(entity)
                    .entityId(entityId)
                    .previousState(previousState)
                    .newState(newState)
                    .timestamp(LocalDateTime.now())
                    .build();

            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}