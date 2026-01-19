from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from app.core.config import settings

def verify_bearer_token(token: str) -> Dict[str, Any]:
    """
    Verify JWT Bearer token from Authorization header.
    
    Args:
        token: JWT token string (without "Bearer " prefix)
    
    Returns:
        Decoded token payload
    
    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        # If JWT_PUBLIC_KEY is set, verify signature
        if settings.JWT_PUBLIC_KEY:
            payload = jwt.decode(
                token,
                settings.JWT_PUBLIC_KEY,
                algorithms=[settings.JWT_ALGORITHM]
            )
        else:
            # For demo/testing, accept token without verification
            payload = jwt.decode(token, options={"verify_signature": False})
        
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )


def create_bearer_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT Bearer token.
    
    Args:
        data: Data to encode in the token
        expires_delta: Token expiration time delta
    
    Returns:
        Encoded JWT token
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(seconds=settings.JWT_EXPIRATION)
    
    to_encode.update({"exp": expire})
    
    if settings.JWT_PUBLIC_KEY:
        encoded_jwt = jwt.encode(
            to_encode,
            settings.JWT_PUBLIC_KEY,
            algorithm=settings.JWT_ALGORITHM
        )
    else:
        # For demo/testing, encode without secret
        encoded_jwt = jwt.encode(to_encode, "secret", algorithm="HS256")
    
    return encoded_jwt


async def get_current_user(token: str) -> Dict[str, Any]:
    """
    Dependency to get current authenticated user from token.
    
    Usage in FastAPI endpoints:
    @app.get("/protected")
    async def protected_route(user = Depends(get_current_user)):
        return user
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = verify_bearer_token(token)
        return payload
    except HTTPException:
        raise credentials_exception
