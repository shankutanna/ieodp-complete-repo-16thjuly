"""
Approvals management endpoints for Spring Boot integration.
Endpoints are exposed at root level (no /api/v1 prefix) for direct frontend calls.
"""
from fastapi import APIRouter, Path, Header, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.core.security import verify_bearer_token
from typing import Optional, List
from pydantic import BaseModel

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class ApprovalUpdate(BaseModel):
    status: str  # APPROVED, REJECTED, PENDING
    reason: Optional[str] = None


@router.get("/approvals")
def get_approvals(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Get all pending approvals.
    
    Returns: List of approvals
    
    Used by React frontend:
    GET /approvals
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
            "id": "approval-001",
            "workflowId": "workflow-001",
            "status": "PENDING",
            "requester": "user-001",
            "createdAt": "2024-01-01T00:00:00Z",
            "updatedAt": "2024-01-01T00:00:00Z"
        }
    ]


@router.patch("/approvals/{approval_id}")
def update_approval(
    approval_id: str = Path(...),
    update_data: ApprovalUpdate = None,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Update approval status.
    
    Path Parameters:
    - approval_id: ID of the approval
    
    Request Body:
    - status: APPROVED, REJECTED, PENDING
    - reason: Optional reason for the update
    
    Returns: Updated approval object
    
    Used by React frontend:
    PATCH /approvals/approval-001
    Authorization: Bearer <token>
    Content-Type: application/json
    
    {
        "status": "APPROVED",
        "reason": "Approved by admin"
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
    
    if not update_data:
        raise HTTPException(status_code=400, detail="Request body required")
    
    # Demo response (replace with actual DB update)
    return {
        "id": approval_id,
        "workflowId": "workflow-001",
        "status": update_data.status,
        "reason": update_data.reason,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-19T00:00:00Z"
    }
