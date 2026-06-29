"""
Why it exists: Handles CRUD for AI intelligence objects like Chapters, Decisions, Risks, FollowUps, Insights, and ActionItems.
Why this architecture is scalable: Instead of fetching the entire DB for a workspace load, we fetch only what the user clicks on (e.g. they open the "Risks" panel, we fetch Risks).
"""
from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import CRUDBase
from app.models.intelligence import Chapter, Decision, Risk, FollowUp, Insight
from app.models.action_item import ActionItem

class CRUDChapter(CRUDBase[Chapter]):
    async def get_by_meeting(self, db: AsyncSession, meeting_id: str) -> List[Chapter]:
        result = await db.execute(select(Chapter).filter(Chapter.meeting_id == meeting_id, Chapter.deleted_at == None).order_by(Chapter.start_time.asc()))
        return list(result.scalars().all())

class CRUDDecision(CRUDBase[Decision]):
    async def get_by_meeting(self, db: AsyncSession, meeting_id: str) -> List[Decision]:
        result = await db.execute(select(Decision).filter(Decision.meeting_id == meeting_id, Decision.deleted_at == None))
        return list(result.scalars().all())

class CRUDRisk(CRUDBase[Risk]):
    async def get_by_meeting(self, db: AsyncSession, meeting_id: str) -> List[Risk]:
        result = await db.execute(select(Risk).filter(Risk.meeting_id == meeting_id, Risk.deleted_at == None))
        return list(result.scalars().all())

class CRUDFollowUp(CRUDBase[FollowUp]):
    async def get_by_meeting(self, db: AsyncSession, meeting_id: str) -> List[FollowUp]:
        result = await db.execute(select(FollowUp).filter(FollowUp.meeting_id == meeting_id, FollowUp.deleted_at == None))
        return list(result.scalars().all())

class CRUDInsight(CRUDBase[Insight]):
    async def get_by_meeting(self, db: AsyncSession, meeting_id: str) -> List[Insight]:
        result = await db.execute(select(Insight).filter(Insight.meeting_id == meeting_id, Insight.deleted_at == None))
        return list(result.scalars().all())

class CRUDActionItem(CRUDBase[ActionItem]):
    async def get_by_meeting(self, db: AsyncSession, meeting_id: str) -> List[ActionItem]:
        result = await db.execute(select(ActionItem).filter(ActionItem.meeting_id == meeting_id, ActionItem.deleted_at == None))
        return list(result.scalars().all())

chapter_repo = CRUDChapter(Chapter)
decision_repo = CRUDDecision(Decision)
risk_repo = CRUDRisk(Risk)
follow_up_repo = CRUDFollowUp(FollowUp)
insight_repo = CRUDInsight(Insight)
action_item_repo = CRUDActionItem(ActionItem)
