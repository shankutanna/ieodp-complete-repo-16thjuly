package com.enterprisesystemengineering.audit;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.stream.DoubleStream;

@Service
public class AuditService {

    private final AuditRepository repository;

    public AuditService(AuditRepository repository) {
        this.repository = repository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void log(
            String userId,
            String role,
            String action,
            String entity,
            String entityId,
            String oldState,
            String newState
    ) {
        AuditLog audit = AuditLog.builder()
                .userId(userId)
                .role(role)
                .action(action)
                .entity(entity)
                .entityId(entityId)
                .previousState(oldState)
                .newState(newState)
                .timestamp(LocalDateTime.now())
                .build();

        repository.save(audit);
    }
}

