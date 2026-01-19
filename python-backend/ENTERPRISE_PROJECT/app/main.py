from fastapi import FastAPI
from contextlib import asynccontextmanager
import signal
import logging
from app.api.v1.router import router as v1_router
from app.api.v1.health import router as health_router
from app.api.v1.automation import router as automation_router
from app.api.v1.users import router as users_router
from app.api.v1.approvals import router as approvals_router
from app.api.v1.insights import router as workflows_router
from app.api.v1.audit import router as audit_router
from app.api.v1.ai_insights import router as ai_insights_router
from app.core.logging import setup_logging
from app.core.middleware import CorrelationIdMiddleware, setup_cors
from app.core.config import settings

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage application lifecycle.
    Handles startup and shutdown events for Kubernetes integration.
    """
    # Startup
    logger.info(f"Starting Enterprise Automation Engine in {settings.ENVIRONMENT} mode")
    logger.info(f"API listening on {settings.API_HOST}:{settings.API_PORT}")
    logger.info(f"Database: {settings.DATABASE_HOST}:{settings.DATABASE_PORT}/{settings.DATABASE_NAME}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Enterprise Automation Engine")
    logger.info("Cleaning up connections...")


# Create FastAPI application
app = FastAPI(
    title="Enterprise Automation Engine",
    description="Python backend for IEODP with Spring Boot integration",
    version="2.0.0",
    lifespan=lifespan
)

# Add middleware for correlation IDs
app.add_middleware(CorrelationIdMiddleware)

# Setup CORS for Spring Boot and Frontend integration
setup_cors(app, settings)

# ============================================================================
# ROOT LEVEL ENDPOINTS (for Spring Boot/Frontend direct calls)
# ============================================================================
# These endpoints are exposed without /api/v1 prefix for direct frontend calls
app.include_router(health_router, prefix="", tags=["Health"])
app.include_router(users_router, prefix="", tags=["Users"])
app.include_router(approvals_router, prefix="", tags=["Approvals"])
app.include_router(workflows_router, prefix="", tags=["Workflows"])
app.include_router(audit_router, prefix="", tags=["Audit"])
app.include_router(ai_insights_router, prefix="", tags=["AI Insights"])

# ============================================================================
# VERSIONED API ENDPOINTS (v1)
# ============================================================================
# These are exposed under /api/v1 for internal service-to-service communication
app.include_router(v1_router, prefix="/api/v1")
app.include_router(automation_router, prefix="/api/v1")


@app.get("/")
def root():
    """
    Root endpoint. Returns service information.
    """
    return {
        "service": "Enterprise Automation Engine",
        "status": "running",
        "version": "2.0.0",
        "environment": settings.ENVIRONMENT,
        "docs": "/docs",
        "openapi": "/openapi.json"
    }


# Graceful shutdown signal handler for Kubernetes
def handle_shutdown(signum, frame):
    logger.info(f"Received signal {signum}, initiating graceful shutdown...")
    exit(0)


signal.signal(signal.SIGTERM, handle_shutdown)
signal.signal(signal.SIGINT, handle_shutdown)
