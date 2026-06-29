"""
Why it exists: Manages the lifecycle of database connections and async sessions.
Why this architecture is scalable: Utilizes async engine and connection pooling. `expire_on_commit=False` prevents lazy-loading issues common in async SQLAlchemy after transactions commit.
How it can evolve: We can easily inject different `DATABASE_URL`s (e.g. PostgreSQL) via settings without changing application code. We can also tweak pool size dynamically based on environment.
Common mistakes avoided: Synchronous blocking DB calls in FastAPI, leaking connections due to improper session teardown.
"""
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.settings import settings

# Create async engine for SQLite (or PostgreSQL later)
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.ENVIRONMENT == "development",
    # SQLite requires check_same_thread=False, ignored by PostgreSQL
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
    pool_pre_ping=True
)

# Create a sessionmaker
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False
)
