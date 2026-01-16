from fastapi import APIRouter, Request
from uuid import uuid4
from app.schemas.automation_event import AutomationEvent

router = APIRouter(prefix="/automation", tags=["Automation"])


@router.post("/execute")
def execute_automation(event: AutomationEvent, request: Request):
    correlation_id = request.headers.get(
        "X-Correlation-ID", str(uuid4())
    )

    # lazy import to avoid circular deps
    from app.services.automation_service import AutomationService

    service = AutomationService()

    return service.execute(
        payload=event.model_dump(),
        correlation_id=correlation_id,
    )
