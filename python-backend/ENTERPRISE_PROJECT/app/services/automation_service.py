from app.services.rule_engine import RuleEngine
from app.services.audit_service import AuditService
from app.workers.tasks import process_automation
from app.db.session import SessionLocal

from copy import deepcopy
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class AutomationService:
    """
    Enterprise Automation Orchestrator

    Responsibilities:
    - Rule evaluation
    - Audit logging
    - Payload enrichment
    - Background task dispatch
    """

    def execute(self, payload: dict, correlation_id: str):
        db = SessionLocal()

        try:
            engine = RuleEngine()

            # 🔑 RULE ENGINE CONTRACT
            # allowed: bool
            # reason: str (human / audit reason)
            # rule_version: int
            # outcome: str (APPROVED / REJECTED / ESCALATED)
            allowed, reason, rule_version, outcome = engine.evaluate(payload, db)

            logger.info(
                "Rule evaluated",
                extra={
                    "correlation_id": correlation_id,
                    "rule_version": rule_version,
                    "allowed": allowed,
                    "outcome": outcome,
                },
            )

            # -----------------------------
            # Make payload JSON-safe
            # -----------------------------
            safe_payload = deepcopy(payload)
            if isinstance(safe_payload.get("created_at"), datetime):
                safe_payload["created_at"] = safe_payload["created_at"].isoformat()

            # -----------------------------
            # Rule rejected
            # -----------------------------
            if not allowed:
                AuditService.log(
                    actor="system",
                    action="RULE_REJECTED",
                    entity="Rule",
                    details={
                        "reason": reason,
                        "outcome": outcome,
                        "rule_version": rule_version,
                        "payload": safe_payload,
                        "correlation_id": correlation_id,
                    },
                )

                return {
                    "status": "SKIPPED",
                    "reason": reason,
                    "outcome": outcome,
                    "rule_version": rule_version,
                    "correlation_id": correlation_id,
                }

            # -----------------------------
            # Rule approved
            # -----------------------------
            AuditService.log(
                actor="system",
                action="RULE_APPROVED",
                entity="Rule",
                details={
                    "outcome": outcome,
                    "rule_version": rule_version,
                    "payload": safe_payload,
                    "correlation_id": correlation_id,
                },
            )

            # -----------------------------
            # INTERNAL TASK PAYLOAD
            # -----------------------------
            task_payload = {
                **safe_payload,
                "rule_version_used": rule_version,
                "outcome": outcome,
                "correlation_id": correlation_id,
            }

            task = process_automation.delay(task_payload)

            return {
                "status": "TRIGGERED",
                "task_id": task.id,
                "outcome": outcome,
                "rule_version": rule_version,
                "correlation_id": correlation_id,
            }

        finally:
            db.close()
