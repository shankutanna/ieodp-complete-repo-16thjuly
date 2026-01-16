from app.workers.tasks import process_automation
from app.db.session import SessionLocal
from app.models.task import TaskExecution

def test_process_automation_creates_task_record():
    payload = {"amount": 2000}

    # Inject task_id explicitly
    process_automation.run(payload, task_id="test-task-id")

    db = SessionLocal()
    record = (
        db.query(TaskExecution)
        .filter(TaskExecution.task_id == "test-task-id")
        .first()
    )

    assert record is not None
    assert record.status == "COMPLETED"
    assert record.payload["amount"] == 2000

    db.close()
