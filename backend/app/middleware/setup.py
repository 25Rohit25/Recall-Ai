"""
Why it exists: Adds important middleware like Request Timing, Trusted Hosts, Security Headers, and CORS setup to the application.
Why this architecture is scalable: By extracting middleware setup into a distinct module, the main.py file remains clean.
How it can evolve: We can easily add OpenTelemetry distributed tracing, Prometheus metrics, or advanced bot protection middleware here.
Common mistakes avoided: Cluttered main.py, missing basic security headers in production.
"""
import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from loguru import logger
from app.core.settings import settings

def setup_middleware(app: FastAPI) -> None:
    # 1. CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 2. Trusted Host
    app.add_middleware(
        TrustedHostMiddleware, 
        allowed_hosts=["*"] # Restrict this in production
    )

    # 3. GZip Compression
    app.add_middleware(GZipMiddleware, minimum_size=1000)

    # 4. Request Timing & Security Headers Middleware
    @app.middleware("http")
    async def custom_middleware(request: Request, call_next):
        start_time = time.time()
        
        response = await call_next(request)
        
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        
        # Security Headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        
        logger.info(f"{request.method} {request.url.path} - Status: {response.status_code} - Time: {process_time:.4f}s")
        
        return response
