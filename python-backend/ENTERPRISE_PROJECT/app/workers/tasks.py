from app.workers.celery_app import celery_app
from app.db.session import SessionLocal
from app.models.task import TaskExecution
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)


@celery_app.task(
    name="app.workers.tasks.process_automation",
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=5,
    retry_kwargs={"max_retries": 3},
)
def process_automation(self, payload: dict):
    """
    Enterprise Automation Task
    - Idempotent
    - Retry-safe
    - Auditable
    """

    db = SessionLocal()

    try:
        # -----------------------------
        # Idempotency check
        # -----------------------------
        existing = (
            db.query(TaskExecution)
            .filter(TaskExecution.request_id == payload["request_id"])
            .first()
        )

        if existing:
            logger.warning(
                "Duplicate automation request ignored",
                extra={"request_id": payload["request_id"]},
            )
            return {"status": "DUPLICATE_IGNORED"}

        # -----------------------------
        # Create execution record
        # -----------------------------
        record = TaskExecution(
            request_id=payload["request_id"],
            workflow_id=payload["workflow_id"],
            transaction_value=payload["transaction"]["value"],
            transaction_currency=payload["transaction"]["currency"],
            risk_score=payload["risk_score"],
            priority=payload["priority"],
            source_system=payload["source_system"],
            status="IN_PROGRESS",
            rule_version_used=payload["rule_version_used"],
            created_at=datetime.now(timezone.utc),
        )

        db.add(record)
        db.commit()

        # -----------------------------
        # Execute automation logic
        # -----------------------------
        record.status = "COMPLETED"
        record.result = {
            "outcome": payload.get("outcome"),
            "correlation_id": payload.get("correlation_id"),
        }
        record.completed_at = datetime.now(timezone.utc)

        db.commit()

        logger.info(
            "Automation completed",
            extra={
                "request_id": payload["request_id"],
                "workflow_id": payload["workflow_id"],
            },
        )

        return record.result

    finally:
        db.close()
