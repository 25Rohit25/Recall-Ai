from fastapi import APIRouter, Depends, Query
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from typing import List

from database import get_session
from models import Meeting, TranscriptSegment, ActionItem
from schemas import SearchResultResponse, SearchResultType

router = APIRouter(prefix="/api/v1/search", tags=["search"])

@router.get("/", response_model=List[SearchResultResponse])
async def search_knowledge(
    query: str = Query(..., min_length=2, description="Search term for meetings, transcripts, and action items"),
    session: AsyncSession = Depends(get_session)
):
    search_term = f"%{query}%"
    
    # Run separate queries mapping text properties to ilike.
    # SQLite's default LIKE is case-insensitive for ASCII, which fulfills the requirement cleanly.
    stmt_meetings = select(Meeting).where(Meeting.title.ilike(search_term)).limit(10)
    stmt_transcripts = select(TranscriptSegment).where(TranscriptSegment.text.ilike(search_term)).limit(30)
    stmt_actions = select(ActionItem).where(ActionItem.task.ilike(search_term)).limit(10)
    
    results_meetings = await session.exec(stmt_meetings)
    results_transcripts = await session.exec(stmt_transcripts)
    results_actions = await session.exec(stmt_actions)
    
    response: List[SearchResultResponse] = []
    
    for m in results_meetings.all():
        response.append(SearchResultResponse(
            id=str(m.id),
            type=SearchResultType.meeting,
            meeting_id=m.id,
            match_text=m.title
        ))
        
    for t in results_transcripts.all():
        response.append(SearchResultResponse(
            id=str(t.id),
            type=SearchResultType.transcript,
            meeting_id=t.meeting_id,
            match_text=t.text,
            timestamp=t.start_time
        ))
        
    for a in results_actions.all():
        response.append(SearchResultResponse(
            id=str(a.id),
            type=SearchResultType.action_item,
            meeting_id=a.meeting_id,
            match_text=a.task
        ))
        
    return response
