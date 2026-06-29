"""
Why it exists: Provides FastAPI with a clean way to inject database sessions into route endpoints.
Why this architecture is scalable: The generator yields the session and ensures it is safely closed after the request is finished, even if an exception occurs. It centralizes DB connection logic away from the routing layer.
How it can evolve: We can inject read-only replicas or different tenant DBs by simply switching the session generator based on the request headers.
Common mistakes avoided: Leaking connections by forgetting to close the session, tightly coupling the database to the API logic.
"""
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import AsyncSessionLocal

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency to yield an async database session per request.
    Closes the session automatically.
    """
    async with AsyncSessionLocal() as session:
        yield session
