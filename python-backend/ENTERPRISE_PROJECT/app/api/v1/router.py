from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.automation import router as automation_router

router = APIRouter()

router.include_router(health_router, tags=["Health"])
router.include_router(automation_router, prefix="/automation", tags=["Automation"])
# from fastapi import APIRouter
# from app.api.v1.automation import router as automation_router

# router = APIRouter()
# router.include_router(automation_router)
