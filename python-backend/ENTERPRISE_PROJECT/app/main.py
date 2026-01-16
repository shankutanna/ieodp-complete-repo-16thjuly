from fastapi import FastAPI
from app.api.v1.router import router
from app.core.logging import setup_logging
from app.core.middleware import CorrelationIdMiddleware

setup_logging()

app = FastAPI(title="Enterprise Automation Engine")
app.add_middleware(CorrelationIdMiddleware)
app.include_router(router, prefix="/api/v1")

@app.get("/")
def root():
    return {"service": "Enterprise Automation Engine", "status": "running"}
