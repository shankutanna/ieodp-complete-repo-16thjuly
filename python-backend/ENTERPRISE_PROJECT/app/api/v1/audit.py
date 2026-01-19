"""
Audit logs endpoints for Spring Boot integration.
Endpoints are exposed at root level (no /api/v1 prefix) for direct frontend calls.
"""
from fastapi import APIRouter, Header, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.core.security import verify_bearer_token
from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from uuid import uuid4

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class AuditLogCreate(BaseModel):
    entity: str  # e.g., "approval", "workflow", "user"
    entityId: str
    action: str  # e.g., "CREATE", "UPDATE", "DELETE", "APPROVE", "REJECT"
    details: Optional[dict] = None


@router.get("/auditLogs")
def get_audit_logs(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Get all audit logs.
    
    Returns: List of audit log entries
    
    Used by React frontend:
    GET /auditLogs
    Authorization: Bearer <token>
    """
    # Extract and validate token
    if authorization and authorization.startswith("Bearer "):
        token = authorization[7:]
        try:
            verify_bearer_token(token)
        except Exception:
            raise HTTPException(status_code=401, detail="Invalid authorization token")
    else:
        raise HTTPException(status_code=401, detail="Authorization header required")
    
    # Demo data (replace with actual DB query)
    return [
        {
            "id": "audit-001",
            "entity": "approval",
            "entityId": "approval-001",
            "action": "APPROVED",
            "userId": "user-001",
            "timestamp": "2024-01-19T00:00:00Z",
            "details": {"reason": "Approved by admin"}
        }
    ]


@router.post("/auditLogs")
def create_audit_log(
    log_data: AuditLogCreate,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Create an audit log entry.
    
    Request Body:
    - entity: Entity type (approval, workflow, user, etc.)
    - entityId: ID of the entity
    - action: Action performed (CREATE, UPDATE, DELETE, APPROVE, REJECT, etc.)
    - details: Optional additional details
    
    Returns: Created audit log entry
    
    Used by React frontend:
    POST /auditLogs
    Authorization: Bearer <token>
    Content-Type: application/json
    
    {
        "entity": "approval",
        "entityId": "approval-001",
        "action": "APPROVED",
        "details": {"reason": "Approved by admin"}
    }
    """
    # Extract and validate token
    if authorization and authorization.startswith("Bearer "):
        token = authorization[7:]
        try:
            verify_bearer_token(token)
        except Exception:
            raise HTTPException(status_code=401, detail="Invalid authorization token")
    else:
        raise HTTPException(status_code=401, detail="Authorization header required")
    
    # Create audit log entry (replace with actual DB insert)
    audit_log_id = str(uuid4())
    
    return {
        "id": audit_log_id,
        "entity": log_data.entity,
        "entityId": log_data.entityId,
        "action": log_data.action,
        "userId": "user-001",  # Extract from token in production
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "details": log_data.details
    }
