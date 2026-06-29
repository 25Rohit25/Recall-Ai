"""
Why it exists: Consolidates search logic across the entire database to enable the Global Search / Command Palette feature.
Why this architecture is scalable: Instead of putting search logic in each repository (which makes global search a nightmare), we centralize it. It currently uses `ILIKE` (or SQLite `LIKE`) for simplicity, but defines the exact abstraction needed to drop in PostgreSQL FTS (Full Text Search) or Elasticsearch later without changing the Service Layer.
"""
from typing import List, Dict, Any
from sqlalchemy import select, or_, String, cast
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.meeting import Meeting
from app.models.transcript import TranscriptSegment
from app.models.intelligence import ActionItem, Decision, Chapter
from app.models.summary import MeetingSummary
from app.models.productivity import SearchHistory

class SearchRepository:
    
    async def global_search(self, db: AsyncSession, query: str, limit_per_entity: int = 5) -> Dict[str, List[Any]]:
        """
        Executes a parallelized global search across core entities.
        For production with millions of rows, we would use PostgreSQL `to_tsquery` or Elasticsearch.
        """
        search_term = f"%{query}%"
        
        # We run these sequentially here for SQLite compatibility, but could use asyncio.gather for Postgres/MySQL.
        
        # 1. Search Meetings (Titles)
        meetings = await db.execute(
            select(Meeting)
            .filter(Meeting.title.ilike(search_term), Meeting.deleted_at == None)
            .limit(limit_per_entity)
        )
        
        # 2. Search Transcripts
        transcripts = await db.execute(
            select(TranscriptSegment)
            .filter(TranscriptSegment.search_text.ilike(search_term), TranscriptSegment.deleted_at == None)
            .limit(limit_per_entity)
        )
        
        # 3. Search Action Items
        action_items = await db.execute(
            select(ActionItem)
            .filter(
                or_(
                    ActionItem.description.ilike(search_term),
                    ActionItem.owner_name.ilike(search_term)
                ),
                ActionItem.deleted_at == None
            )
            .limit(limit_per_entity)
        )
        
        # 4. Search Decisions
        decisions = await db.execute(
            select(Decision)
            .filter(Decision.description.ilike(search_term), Decision.deleted_at == None)
            .limit(limit_per_entity)
        )

        return {
            "meetings": list(meetings.scalars().all()),
            "transcripts": list(transcripts.scalars().all()),
            "action_items": list(action_items.scalars().all()),
            "decisions": list(decisions.scalars().all())
        }

    async def save_search_history(self, db: AsyncSession, query: str, user_id: str = "default_user") -> SearchHistory:
        """Stores a recent search query."""
        history = SearchHistory(query=query, user_id=user_id)
        db.add(history)
        await db.commit()
        await db.refresh(history)
        return history
        
    async def get_recent_searches(self, db: AsyncSession, user_id: str = "default_user", limit: int = 5) -> List[SearchHistory]:
        result = await db.execute(
            select(SearchHistory)
            .filter(SearchHistory.user_id == user_id, SearchHistory.deleted_at == None)
            .order_by(SearchHistory.created_at.desc())
            .limit(limit)
        )
        return list(result.scalars().all())

search_repo = SearchRepository()
