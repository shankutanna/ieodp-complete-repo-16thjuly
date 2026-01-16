package com.enterprisesystemengineering.audit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditRepository extends JpaRepository<AuditLog, String> {

    Page<AuditLog> findByEntityContainingIgnoreCase(
            String entity,
            Pageable pageable
    );

    Page<AuditLog> findByUserId(
            String userId,
            Pageable pageable
    );
}

