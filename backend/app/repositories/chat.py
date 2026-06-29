"""
Why it exists: Handles CRUD for the native AI Chat experience.
"""
from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import CRUDBase
from app.models.chat import AIConversation, AIMessage

class CRUDConversation(CRUDBase[AIConversation]):
    async def get_by_meeting(self, db: AsyncSession, meeting_id: str) -> Optional[AIConversation]:
        # We eagerly load messages so we don't have N+1 issues when feeding history to the LLM
        result = await db.execute(
            select(AIConversation)
            .options(selectinload(AIConversation.messages))
            .filter(AIConversation.meeting_id == meeting_id, AIConversation.deleted_at == None)
        )
        return result.scalars().first()

class CRUDMessage(CRUDBase[AIMessage]):
    pass

conversation_repo = CRUDConversation(AIConversation)
message_repo = CRUDMessage(AIMessage)
