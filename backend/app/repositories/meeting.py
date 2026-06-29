"""
Why it exists: Handles meeting-specific database queries, extending standard CRUD with advanced search, filtering, and pagination.
Why this architecture is scalable: Complex SQLAlchemy 2.0 query construction (dynamic WHERE clauses) is isolated here. The API router just calls `paginate()`.
"""
from typing import Optional, List, Tuple
from sqlalchemy import select, or_, and_, func, String
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.meeting import Meeting
from app.repositories.base import CRUDBase

class CRUDMeeting(CRUDBase[Meeting]):
    async def get_with_details(self, db: AsyncSession, meeting_id: str) -> Optional[Meeting]:
        """Fetches a meeting with all its related entities (Participants, Summary, Tags)."""
        query = (
            select(Meeting)
            .where(Meeting.id == meeting_id, Meeting.deleted_at.is_(None))
            .options(
                selectinload(Meeting.participants),
                selectinload(Meeting.summary),
                selectinload(Meeting.tags)
            )
        )
        result = await db.execute(query)
        return result.scalars().first()
        
    async def get_paginated(
        self, 
        db: AsyncSession, 
        *, 
        skip: int = 0, 
        limit: int = 20, 
        search: Optional[str] = None,
        is_pinned: Optional[bool] = None,
        is_archived: Optional[bool] = False, # default hide archived
        status: Optional[str] = None
    ) -> Tuple[List[Meeting], int]:
        """Returns paginated meetings with dynamic filtering and total count."""
        
        # Base query for active records
        base_filters = [Meeting.deleted_at.is_(None)]
        
        if is_archived is not None:
            base_filters.append(Meeting.is_archived == is_archived)
        if is_pinned is not None:
            base_filters.append(Meeting.is_pinned == is_pinned)
        if status:
            base_filters.append(Meeting.transcript_status == status)
            
        if search:
            # Case insensitive search on Title
            search_term = f"%{search.lower()}%"
            # Using cast to String to ensure ILIKE works reliably in all SQL dialects
            base_filters.append(func.lower(Meeting.title).like(search_term))
            
        query = (
            select(Meeting)
            .where(and_(*base_filters))
            .order_by(Meeting.is_pinned.desc(), Meeting.meeting_date.desc()) # Pinned first, then newest
            .offset(skip)
            .limit(limit)
            .options(
                selectinload(Meeting.participants),
                selectinload(Meeting.summary),
                selectinload(Meeting.tags)
            )
        )
        
        count_query = select(func.count()).where(and_(*base_filters)).select_from(Meeting)
        
        results = await db.execute(query)
        count_result = await db.execute(count_query)
        
        return list(results.scalars().all()), count_result.scalar() or 0

meeting = CRUDMeeting(Meeting)
