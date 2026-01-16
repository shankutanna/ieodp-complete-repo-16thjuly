from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
import uuid
import logging

class CorrelationIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        correlation_id = request.headers.get(
            "X-Correlation-ID", str(uuid.uuid4())
        )

        logging.LoggerAdapter(
            logging.getLogger(),
            {"correlation_id": correlation_id},
        )

        request.state.correlation_id = correlation_id
        response = await call_next(request)
        response.headers["X-Correlation-ID"] = correlation_id
        return response
