import os
from celery import Celery
from dotenv import load_dotenv

load_dotenv()

celery_app = Celery(
    "enterprise_worker",
    broker=os.getenv("CELERY_BROKER_URL"),
    backend=os.getenv("CELERY_BROKER_URL"),
)

# 🔴 THIS IS THE KEY LINE
celery_app.autodiscover_tasks(["app.workers"])
