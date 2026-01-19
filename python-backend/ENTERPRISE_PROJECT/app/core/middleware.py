from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.cors import CORSMiddleware
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


def setup_cors(app, settings):
    """
    Configure CORS for Spring Boot and Frontend Integration.
    
    Allows direct calls from React frontend (VITE_API_BASE_URL)
    and Spring Boot service mesh communication.
    """
    # Parse CORS origins from settings
    cors_origins = settings.CORS_ORIGINS
    if isinstance(cors_origins, str):
        cors_origins = [origin.strip() for origin in cors_origins.split(",")]
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins if cors_origins and cors_origins[0] != "*" else ["*"],
        allow_origin_regex=r"https?://.*",  # Allow any origin (for Kubernetes service mesh)
        allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
        allow_methods=settings.CORS_ALLOW_METHODS,
        allow_headers=settings.CORS_ALLOW_HEADERS,
        max_age=3600,
        expose_headers=["X-Correlation-ID", "X-Total-Count"],
    )
