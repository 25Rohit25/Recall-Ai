"""
Why it exists: Configures the pytest environment, providing reusable testing fixtures.
Why this architecture is scalable: It creates an isolated async database session (`db_session`) and an async HTTP client (`async_client`) for testing, ensuring tests do not mutate the production database.
How it can evolve: We can add fixtures for mock users, authentication tokens, and mocked third-party APIs (like the transcript provider).
"""
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from app.main import app
from app.database.base import Base
from app.dependencies.database import get_db

# Use an in-memory SQLite database specifically for testing
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

@pytest_asyncio.fixture(scope="function")
async def db_session() -> AsyncSession: # type: ignore
    """
    Creates a fresh database schema for every test, yields a session, and then drops all tables.
    Guarantees test isolation.
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with TestingSessionLocal() as session:
        yield session

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest_asyncio.fixture(scope="function")
async def async_client(db_session: AsyncSession) -> AsyncClient: # type: ignore
    """
    Returns an async HTTP client with the dependency injected test database.
    """
    # Override the get_db dependency to use the test database
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client
        
    # Clear overrides after the test
    app.dependency_overrides.clear()
