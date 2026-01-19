"""
User management endpoints for Spring Boot integration.
Endpoints are exposed at root level (no /api/v1 prefix) for direct frontend calls.
"""
from fastapi import APIRouter, Query, Header, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.core.security import verify_bearer_token
from typing import List, Optional
from uuid import uuid4

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/users")
def get_users(
    email: Optional[str] = Query(None),
    password: Optional[str] = Query(None),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Get users - used for login flow.
    
    Query Parameters:
    - email: User email
    - password: User password
    
    Returns: List of matching users
    
    Used by React frontend for authentication:
    GET /users?email=john@example.com&password=password123
    """
    # Extract and validate token if provided
    if authorization and authorization.startswith("Bearer "):
        token = authorization[7:]
        try:
            verify_bearer_token(token)
        except Exception:
            raise HTTPException(status_code=401, detail="Invalid authorization token")
    
    # Demo user for testing (replace with actual DB query)
    if email and password:
        return [
            {
                "id": "user-001",
                "email": email,
                "name": "Demo User",
                "role": "ADMIN",
                "createdAt": "2024-01-01T00:00:00Z"
            }
        ]
    
    # Return empty list if no credentials provided
    return []


@router.post("/auth/logout")
def logout(authorization: Optional[str] = Header(None)):
    """
    Logout endpoint.
    
    Returns: Success response
    
    Used by React frontend to logout:
    POST /auth/logout
    Authorization: Bearer <token>
    """
    return {"success": True, "message": "Successfully logged out"}
