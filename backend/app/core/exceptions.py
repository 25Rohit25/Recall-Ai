"""
Why it exists: Standardizes the error responses returned to the client and catches common backend exceptions (like DB errors or validation failures) globally.
Why this architecture is scalable: Avoids having to try/except DB errors or generic errors in every single endpoint. Ensures a unified 500 or 400 JSON response format (utilizing our ErrorResponse model).
How it can evolve: Custom application exceptions (e.g. RateLimitExceeded, TenantNotFound) can be added here with specific status codes.
Common mistakes avoided: Leaking sensitive database error messages to the client, inconsistent error structures across different endpoints.
"""
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
from loguru import logger
from app.schemas.response import ErrorResponse

class AppError(Exception):
    """Base class for custom application exceptions."""
    def __init__(self, message: str, code: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        self.message = message
        self.code = code
        self.status_code = status_code

async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
    logger.warning(f"AppError: {exc.message} (code: {exc.code}) on {request.url}")
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            message=exc.message,
            code=exc.code
        ).model_dump()
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    logger.warning(f"Validation error on {request.url}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=ErrorResponse(
            message="Input validation failed",
            code="VALIDATION_ERROR",
            details=exc.errors()
        ).model_dump()
    )

async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError) -> JSONResponse:
    logger.error(f"Database error on {request.url}: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse(
            message="An internal database error occurred",
            code="DATABASE_ERROR"
        ).model_dump()
    )

async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception(f"Unhandled exception on {request.url}: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=ErrorResponse(
            message="An unexpected server error occurred",
            code="INTERNAL_SERVER_ERROR"
        ).model_dump()
    )
