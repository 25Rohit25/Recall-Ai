"""
Why it exists: Handles CRUD for the MeetingSummary object.
"""
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import CRUDBase
from app.models.summary import MeetingSummary

class CRUDSummary(CRUDBase[MeetingSummary]):
    async def get_by_meeting(self, db: AsyncSession, meeting_id: str) -> Optional[MeetingSummary]:
        result = await db.execute(select(MeetingSummary).filter(MeetingSummary.meeting_id == meeting_id, MeetingSummary.deleted_at == None))
        return result.scalars().first()

summary_repo = CRUDSummary(MeetingSummary)
