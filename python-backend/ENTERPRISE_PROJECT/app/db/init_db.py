from app.db.session import engine
from app.models.base import Base
# Import ALL models so SQLAlchemy registers them
from app.models.task import TaskExecution
from app.models.audit import AuditLog
from app.models.rule import Rule


def init_db():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()
