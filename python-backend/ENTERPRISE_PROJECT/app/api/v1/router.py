from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.automation import router as automation_router
from app.api.v1.rules import router as rules_router

router = APIRouter()

# Include all v1 routers
router.include_router(health_router, tags=["Health"])
router.include_router(automation_router, tags=["Automation"])
router.include_router(rules_router, tags=["Rules"])

