package com.enterprisesystemengineering.service;

import com.enterprisesystemengineering.entity.AuditLog;
import com.enterprisesystemengineering.repository.AuditLogRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.Instant;

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

            AuditLog auditLog = new AuditLog();
            auditLog.setUserName(userName);
            auditLog.setRole(role);
            auditLog.setAction(action);
            auditLog.setEntity(entity);
            auditLog.setEntityId(entityId);
            auditLog.setPreviousState(previousState);
            auditLog.setNewState(newState);
            auditLog.setTimestamp(Instant.now());

            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}