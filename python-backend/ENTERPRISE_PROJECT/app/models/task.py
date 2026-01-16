# from sqlalchemy import Column, String, Numeric, JSON, TIMESTAMP
# from sqlalchemy.sql import func
# from app.models.base import Base


# class TaskExecution(Base):
#     __tablename__ = "task_executions"

#     request_id = Column(String(64), primary_key=True)
#     workflow_id = Column(String(64), nullable=False)

#     transaction_value = Column(Numeric(15, 2), nullable=False)
#     transaction_currency = Column(String(3), nullable=False)

#     risk_score = Column(Numeric(3, 2), nullable=False)
#     priority = Column(String(16), nullable=False)
#     source_system = Column(String(32))

#     status = Column(String(32), nullable=False)
#     result = Column(JSON)

#     created_at = Column(TIMESTAMP, server_default=func.now())
#     completed_at = Column(TIMESTAMP)
from sqlalchemy import (
    Column,
    String,
    Integer,
    DECIMAL,
    JSON,
    TIMESTAMP,
)
from app.models.base import Base
from datetime import datetime


class TaskExecution(Base):
    __tablename__ = "task_executions"

    id = Column(Integer, primary_key=True, index=True)

    request_id = Column(String(64), nullable=False, unique=True)
    workflow_id = Column(String(64), nullable=False)

    transaction_value = Column(DECIMAL(15, 2), nullable=False)
    transaction_currency = Column(String(3), nullable=False)

    risk_score = Column(DECIMAL(3, 2), nullable=False)
    priority = Column(String(16), nullable=False)
    source_system = Column(String(32))

    status = Column(String(32), nullable=False)
    result = Column(JSON)

    rule_version_used = Column(Integer, nullable=False)

    created_at = Column(
        TIMESTAMP, nullable=False, default=datetime.utcnow
    )
    completed_at = Column(TIMESTAMP)
