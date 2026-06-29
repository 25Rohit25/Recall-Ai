"""
Why it exists: Handles business logic for transcripts, isolating it from the API and Repository layers.
Why this architecture is scalable: It centralizes text normalization (for searching), sequence integrity checks, and prepares future multilingual transcription handling.
"""
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.transcript import TranscriptSegment
from app.repositories.transcript import transcript_repo
from app.core.exceptions import AppError

class TranscriptService:
    
    async def get_full_transcript(self, db: AsyncSession, meeting_id: str) -> List[TranscriptSegment]:
        """
        Retrieves the full transcript.
        For meetings over 5000 segments, this could be refactored to chunked streaming, 
        but 5000 is enough for a standard 3-hour meeting.
        """
        return await transcript_repo.get_by_meeting(db, meeting_id)

    async def search_transcript(self, db: AsyncSession, meeting_id: str, query: str) -> List[TranscriptSegment]:
        """
        Searches the transcript. Includes validation to prevent expensive empty queries.
        """
        if not query or len(query.strip()) < 2:
            return [] # Too short to search effectively
            
        return await transcript_repo.search_in_meeting(db, meeting_id, query.strip())

    async def get_speaker_segments(self, db: AsyncSession, meeting_id: str, speaker_id: str) -> List[TranscriptSegment]:
        """Retrieves segments by a specific speaker."""
        return await transcript_repo.get_speaker_segments(db, meeting_id, speaker_id)

transcript_service = TranscriptService()
