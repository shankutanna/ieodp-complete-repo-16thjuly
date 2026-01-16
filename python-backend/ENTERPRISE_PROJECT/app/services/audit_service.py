from datetime import datetime
from app.db.session import SessionLocal
from app.models.audit import AuditLog


class AuditService:
    @staticmethod
    def _serialize(obj):
        """
        Convert non-JSON-safe objects (datetime) into strings
        """
        if isinstance(obj, datetime):
            return obj.isoformat()
        if isinstance(obj, dict):
            return {k: AuditService._serialize(v) for k, v in obj.items()}
        if isinstance(obj, list):
            return [AuditService._serialize(v) for v in obj]
        return obj

    @staticmethod
    def log(actor: str, action: str, entity: str, details: dict):
        db = SessionLocal()

        try:
            safe_details = AuditService._serialize(details)

            log = AuditLog(
                actor=actor,
                action=action,
                entity=entity,
                details=safe_details,
            )

            db.add(log)
            db.commit()

        finally:
            db.close()
