from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum


class Priority(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class Transaction(BaseModel):
    value: float = Field(gt=0, description="Transaction monetary value")
    currency: str = Field(
        min_length=3,
        max_length=3,
        description="ISO 4217 currency code (e.g., USD, INR)",
    )


class AutomationEvent(BaseModel):
    """
    Canonical Automation Event
    Shared contract between:
    - Frontend
    - Java Workflow Engine
    - Python Processing Engine
    """

    request_id: str
    workflow_id: str
    workflow_type: str

    transaction: Transaction
    risk_score: float = Field(ge=0.0, le=1.0)
    priority: Priority
    source_system: str

    created_at: datetime
