"""
Why it exists: Handles optimized database queries for retrieving and searching transcript segments.
Why this architecture is scalable: Transcripts can have thousands of rows. We rely on the composite index (meeting_id, sequence_number) for fast sequential retrieval, avoiding expensive sorts. Text search uses the pre-normalized `search_text` column.
"""
from typing import List, Optional
from sqlalchemy import select, and_, func
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.transcript import TranscriptSegment
from app.repositories.base import CRUDBase

class CRUDTranscript(CRUDBase[TranscriptSegment]):
    
    async def get_by_meeting(
        self, 
        db: AsyncSession, 
        meeting_id: str, 
        skip: int = 0, 
        limit: int = 5000
    ) -> List[TranscriptSegment]:
        """
        Retrieves transcript segments for a meeting in perfect chronological order.
        Uses the ix_transcript_meeting_sequence index.
        """
        query = (
            select(TranscriptSegment)
            .where(TranscriptSegment.meeting_id == meeting_id)
            .order_by(TranscriptSegment.sequence_number.asc())
            .offset(skip)
            .limit(limit)
            .options(selectinload(TranscriptSegment.speaker)) # Eager load speaker details
        )
        result = await db.execute(query)
        return list(result.scalars().all())

    async def search_in_meeting(
        self, 
        db: AsyncSession, 
        meeting_id: str, 
        search_query: str
    ) -> List[TranscriptSegment]:
        """
        Searches the transcript for specific keywords.
        Uses the normalized `search_text` for case-insensitive matching.
        """
        search_term = f"%{search_query.lower()}%"
        query = (
            select(TranscriptSegment)
            .where(
                and_(
                    TranscriptSegment.meeting_id == meeting_id,
                    TranscriptSegment.search_text.like(search_term)
                )
            )
            .order_by(TranscriptSegment.sequence_number.asc())
            .options(selectinload(TranscriptSegment.speaker))
        )
        result = await db.execute(query)
        return list(result.scalars().all())
        
    async def get_speaker_segments(
        self, 
        db: AsyncSession, 
        meeting_id: str, 
        speaker_id: str
    ) -> List[TranscriptSegment]:
        """Retrieves all segments spoken by a specific participant in a meeting."""
        query = (
            select(TranscriptSegment)
            .where(
                and_(
                    TranscriptSegment.meeting_id == meeting_id,
                    TranscriptSegment.speaker_id == speaker_id
                )
            )
            .order_by(TranscriptSegment.sequence_number.asc())
        )
        result = await db.execute(query)
        return list(result.scalars().all())

transcript_repo = CRUDTranscript(TranscriptSegment)
