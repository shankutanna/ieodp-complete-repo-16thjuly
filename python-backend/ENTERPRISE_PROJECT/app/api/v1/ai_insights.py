"""
AI Insights endpoints for Spring Boot integration.
Endpoints are exposed at root level (no /api/v1 prefix) for direct frontend calls.
"""
from fastapi import APIRouter, Header, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.core.security import verify_bearer_token
from typing import Optional

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/aiInsights")
def get_ai_insights(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Get AI insights and recommendations.
    
    Returns: List of AI insights
    
    Used by React frontend:
    GET /aiInsights
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
    
    # Demo data (replace with actual AI service call)
    return [
        {
            "id": "insight-001",
            "title": "High approval queue",
            "description": "There are 15 pending approvals that need attention",
            "riskLevel": "HIGH",
            "recommendation": "Review and approve pending items",
            "createdAt": "2024-01-19T00:00:00Z"
        },
        {
            "id": "insight-002",
            "title": "Unusual workflow pattern",
            "description": "Workflow completion time is 30% slower than average",
            "riskLevel": "MEDIUM",
            "recommendation": "Investigate workflow bottlenecks",
            "createdAt": "2024-01-19T00:00:00Z"
        }
    ]
