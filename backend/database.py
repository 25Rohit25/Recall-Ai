import os
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import Session, create_engine, SQLModel
from sqlalchemy import text

# Support both async and sync engines depending on the route
sqlite_url = os.getenv("DATABASE_URL", "sqlite:///firenotes.db")
async_sqlite_url = sqlite_url.replace("sqlite:///", "sqlite+aiosqlite:///")

async_engine = create_async_engine(async_sqlite_url, echo=False, future=True)
sync_engine = create_engine(sqlite_url, echo=False)

async def create_tables():
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
        await conn.execute(text("""
            CREATE VIRTUAL TABLE IF NOT EXISTS fts_transcript_segments USING fts5(
                id UNINDEXED,
                meeting_id UNINDEXED,
                text,
                speaker
            )
        """))

async def get_session() -> AsyncSession:
    async_session = sessionmaker(
        async_engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session

def get_sync_session() -> Session:
    with Session(sync_engine) as session:
        yield session


