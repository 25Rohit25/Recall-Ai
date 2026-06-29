"""
Why it exists: Standardizes logging across the entire application using Loguru.
Why this architecture is scalable: Replaces standard library logging (which is notoriously tricky to configure uniformly across all modules like uvicorn/fastapi) with Loguru's robust async, rotating, and structured JSON logs.
How it can evolve: Can easily route logs to external aggregation services (DataDog, ELK, Splunk) by adding a new Loguru sink for production environments.
Common mistakes avoided: Losing error context, writing logs to stdout only in production causing disk fills, having mismatched log formats between Uvicorn and FastAPI.
"""
import sys
import logging
from loguru import logger
from app.core.settings import settings

class InterceptHandler(logging.Handler):
    """
    Default logging handler to intercept standard logging messages
    and route them to Loguru.
    """
    def emit(self, record):
        # Get corresponding Loguru level if it exists
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        # Find caller from where originated the logged message
        frame, depth = logging.currentframe(), 2
        while frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(
            level, record.getMessage()
        )

def setup_logging():
    """
    Configures Loguru and intercepts all standard library logs.
    """
    # Remove default Loguru handler
    logger.remove()
    
    # Add Console Handler
    log_format = (
        "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>"
    )
    
    logger.add(sys.stdout, format=log_format, level="DEBUG" if settings.ENVIRONMENT == "development" else "INFO", colorize=True)
    
    # Add File Handler for Production
    logger.add(
        "logs/app.log",
        rotation="10 MB",
        retention="10 days",
        level="INFO",
        format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} | {name}:{function}:{line} - {message}",
        serialize=False # Set to True in production for JSON structured logs
    )

    # Intercept Uvicorn & FastAPI Logs
    logging.getLogger("uvicorn").handlers = [InterceptHandler()]
    logging.getLogger("uvicorn.access").handlers = [InterceptHandler()]
    logging.getLogger("fastapi").handlers = [InterceptHandler()]
    
    logger.info(f"Logging configured. Environment: {settings.ENVIRONMENT}")
