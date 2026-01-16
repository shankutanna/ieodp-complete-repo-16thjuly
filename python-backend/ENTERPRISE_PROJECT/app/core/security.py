from jose import jwt
from fastapi import Depends, HTTPException, status

def verify_jwt(token: str):
    try:
        payload = jwt.decode(token, key=None, options={"verify_signature": False})
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
