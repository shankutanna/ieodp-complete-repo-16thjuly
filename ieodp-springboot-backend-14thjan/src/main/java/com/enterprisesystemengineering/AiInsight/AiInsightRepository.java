package com.enterprisesystemengineering.AiInsight;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
public interface AiInsightRepository extends JpaRepository<AiInsight, String> {
    List<AiInsight> findByWorkflowId(String workflowId);
    List<AiInsight> findByRiskScoreGreaterThanEqual(double threshold);
}

