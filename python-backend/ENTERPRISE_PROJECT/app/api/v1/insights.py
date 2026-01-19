"""
Workflows management endpoints for Spring Boot integration.
Endpoints are exposed at root level (no /api/v1 prefix) for direct frontend calls.
"""
from fastapi import APIRouter, Path, Header, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.core.security import verify_bearer_token
from typing import Optional
from pydantic import BaseModel

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class WorkflowUpdate(BaseModel):
    status: str  # ACTIVE, INACTIVE, COMPLETED, FAILED


@router.get("/workflows")
def get_workflows(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Get all workflows.
    
    Returns: List of workflows
    
    Used by React frontend:
    GET /workflows
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
            "id": "workflow-001",
            "name": "Approval Workflow",
            "status": "ACTIVE",
            "createdAt": "2024-01-01T00:00:00Z",
            "updatedAt": "2024-01-01T00:00:00Z"
        }
    ]


@router.patch("/workflows/{workflow_id}")
def update_workflow(
    workflow_id: str = Path(...),
    update_data: WorkflowUpdate = None,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Update workflow status.
    
    Path Parameters:
    - workflow_id: ID of the workflow
    
    Request Body:
    - status: ACTIVE, INACTIVE, COMPLETED, FAILED
    
    Returns: Updated workflow object
    
    Used by React frontend:
    PATCH /workflows/workflow-001
    Authorization: Bearer <token>
    Content-Type: application/json
    
    {
        "status": "COMPLETED"
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
        "id": workflow_id,
        "name": "Approval Workflow",
        "status": update_data.status,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-19T00:00:00Z"
    }
