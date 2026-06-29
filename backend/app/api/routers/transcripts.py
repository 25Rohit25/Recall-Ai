"""
Why it exists: Exposes the Transcript Management REST endpoints to the client.
Why this architecture is scalable: Uses the `meeting_id` as the root of the path, ensuring tenant and contextual boundaries. The search endpoint returns isolated segments rather than the full transcript to keep payloads small.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies.database import get_db
from app.schemas.transcript import TranscriptSegmentResponse, TranscriptSearchResponse
from app.services.transcript import transcript_service
from app.repositories.transcript import transcript_repo

router = APIRouter(prefix="/meetings/{meeting_id}/transcript", tags=["Transcripts"])

@router.get("", response_model=List[TranscriptSegmentResponse])
async def get_transcript(
    meeting_id: str, 
    db: AsyncSession = Depends(get_db)
):
    """Fetch the entire chronological transcript for a meeting."""
    return await transcript_service.get_full_transcript(db, meeting_id)

@router.get("/search", response_model=TranscriptSearchResponse)
async def search_transcript(
    meeting_id: str,
    q: str = Query(..., min_length=2, description="Search keyword"),
    db: AsyncSession = Depends(get_db)
):
    """Search for specific keywords within a meeting's transcript."""
    matches = await transcript_service.search_transcript(db, meeting_id, q)
    return TranscriptSearchResponse(matches=matches, total_matches=len(matches))

@router.get("/segment/{segment_id}", response_model=TranscriptSegmentResponse)
async def get_segment(
    meeting_id: str,
    segment_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Retrieve a single transcript segment."""
    segment = await transcript_repo.get(db, segment_id)
    if not segment or segment.meeting_id != meeting_id:
        from app.core.exceptions import AppError
        raise AppError("Segment not found", code="NOT_FOUND", status_code=404)
    return segment

@router.get("/speaker/{speaker_id}", response_model=List[TranscriptSegmentResponse])
async def get_speaker_segments(
    meeting_id: str,
    speaker_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Retrieve all segments spoken by a specific participant in a meeting."""
    return await transcript_service.get_speaker_segments(db, meeting_id, speaker_id)
