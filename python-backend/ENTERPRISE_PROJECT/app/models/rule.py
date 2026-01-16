from sqlalchemy import Column, Integer, String, Boolean, JSON, DateTime
from app.models.base import Base
from datetime import datetime


class Rule(Base):
    __tablename__ = "rules"

    id = Column(Integer, primary_key=True)

    name = Column(String(128), nullable=False)
    description = Column(String(255))

    workflow_type = Column(String(64), nullable=False)
    version = Column(Integer, nullable=False)

    conditions = Column(JSON, nullable=False)
    outcome = Column(String(64), nullable=False)

    is_active = Column(Boolean, default=False)

    created_by = Column(String(64))
    created_at = Column(DateTime, default=datetime.utcnow)
