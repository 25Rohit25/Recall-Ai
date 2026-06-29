"""
Why it exists: The central entrypoint of the FastAPI application.
Why this architecture is scalable: It strictly delegates concerns (logging, middleware, exception handling, routers) to their respective modules rather than dumping everything in one massive file.
How it can evolve: Can seamlessly attach new API versions (v2, v3) by mounting different API routers.
Common mistakes avoided: God-class anti-pattern where main.py becomes thousands of lines long.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError

from app.core.settings import settings
from app.config.logging import setup_logging
from app.middleware.setup import setup_middleware
from app.core.exceptions import (
    AppError,
    app_error_handler,
    validation_exception_handler,
    sqlalchemy_exception_handler,
    global_exception_handler
)
from app.api.routers import health, meetings, transcripts, workspace, search

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize logging
    setup_logging()
    
    # We can also initialize Redis connections or ML models here
    
    yield
    # Shutdown logic (e.g. closing DB pools gracefully)

# Initialize application
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None, # Disable swagger in prod
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None
)

# 1. Setup Middleware
setup_middleware(app)

# 2. Register Exception Handlers
app.add_exception_handler(AppError, app_error_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# 3. Include Routers
app.include_router(health.router)
app.include_router(meetings.router, prefix="/api/v1")
app.include_router(transcripts.router, prefix="/api/v1")
app.include_router(workspace.router, prefix="/api/v1")
app.include_router(search.router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    # DO NOT run reload=True in production!
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
