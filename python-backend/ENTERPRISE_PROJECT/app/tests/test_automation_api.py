from fastapi.testclient import TestClient
from unittest.mock import patch
from app.main import app

client = TestClient(app)

@patch("app.services.automation_service.process_automation.delay")
def test_automation_endpoint_triggers_task(mock_delay):
    mock_delay.return_value.id = "test-task-id"

    response = client.post(
        "/api/v1/automation/execute",
        json={"amount": 2000}
    )

    assert response.status_code == 200
    data = response.json()

    assert data["status"] == "TRIGGERED"
    assert data["task_id"] == "test-task-id"
