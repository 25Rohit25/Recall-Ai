"""
Why it exists: Exposes endpoints for infrastructure (like Kubernetes, AWS ELB, or Docker) to monitor the application's health.
Why this architecture is scalable: Decouples simple liveness checks from deep readiness checks (which might query the DB or Redis).
- `GET /` and `GET /health` provide quick liveness (Liveness Probe).
- `GET /ready` should be expanded to ping the DB and Redis (Readiness Probe).
- `GET /version` returns the deployed git commit or version tag for debugging.
Common mistakes avoided: Putting DB checks in the root `/` endpoint, causing the load balancer to kill the pod during a transient DB slowdown.
"""
from fastapi import APIRouter
from app.core.settings import settings

router = APIRouter(tags=["Health"])

@router.get("/")
@router.get("/health")
async def health_check():
    """Liveness probe. Responds instantly if the FastAPI event loop is running."""
    return {"status": "ok"}

@router.get("/ready")
async def readiness_check():
    """
    Readiness probe.
    Placeholder: Should query the DB (SELECT 1) and Redis (PING) to ensure dependencies are up.
    """
    return {"status": "ready"}

@router.get("/version")
async def get_version():
    """Returns the current application version from settings."""
    return {"version": settings.VERSION}
