import logging
import sys
from logging.config import dictConfig


def setup_logging() -> None:
    """
    Central logging configuration for the enterprise platform.
    Structured, correlation-aware, production-safe.
    """

    LOGGING_CONFIG = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {
                "()": "logging.Formatter",
                "fmt": (
                    "%(asctime)s | %(levelname)s | %(name)s | "
                    "correlation_id=%(correlation_id)s | %(message)s"
                ),
            }
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "formatter": "default",
                "stream": sys.stdout,
            }
        },
        "root": {
            "level": "INFO",
            "handlers": ["console"],
        },
    }

    dictConfig(LOGGING_CONFIG)
