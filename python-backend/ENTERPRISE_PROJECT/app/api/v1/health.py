from fastapi import APIRouter, HTTPException, status
from sqlalchemy import text
from app.db.session import SessionLocal
import redis
from app.core.config import settings

router = APIRouter()


@router.get("/health")
def health_check():
    """
    Kubernetes liveness probe endpoint.
    
    Returns 200 if service is running.
    Use in Kubernetes manifests:
    livenessProbe:
      httpGet:
        path: /health
        port: 8000
      initialDelaySeconds: 10
      periodSeconds: 10
    """
    return {
        "status": "UP",
        "service": "Enterprise Automation Engine",
        "environment": settings.ENVIRONMENT
    }


@router.get("/readiness")
def readiness_check():
    """
    Kubernetes readiness probe endpoint.
    
    Returns 200 only if service is ready to accept traffic.
    Checks database and cache connectivity.
    
    Use in Kubernetes manifests:
    readinessProbe:
      httpGet:
        path: /readiness
        port: 8000
      initialDelaySeconds: 5
      periodSeconds: 5
      timeoutSeconds: 3
    """
    checks = {
        "status": "UP",
        "service": "Enterprise Automation Engine",
        "timestamp": None,
        "checks": {}
    }
    
    # Check Database
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        checks["checks"]["database"] = "UP"
    except Exception as e:
        checks["checks"]["database"] = f"DOWN: {str(e)}"
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection failed"
        )
    
    # Check Redis/Cache
    try:
        redis_url = settings.CELERY_BROKER_URL
        if redis_url.startswith("redis://"):
            # Parse redis URL
            host_port = redis_url.replace("redis://", "").split("/")[0]
            host, port = host_port.split(":") if ":" in host_port else (host_port, 6379)
            
            r = redis.Redis(
                host=host,
                port=int(port),
                db=0,
                socket_connect_timeout=settings.READINESS_CHECK_TIMEOUT
            )
            r.ping()
            checks["checks"]["cache"] = "UP"
    except Exception as e:
        checks["checks"]["cache"] = f"DOWN: {str(e)}"
        # Don't fail readiness if cache is down, but log it
    
    return checks


@router.get("/metrics/ready")
def metrics_ready():
    """
    Alternative readiness probe endpoint for Prometheus-style monitoring.
    """
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        return {"ready": True}
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service not ready"
        )
