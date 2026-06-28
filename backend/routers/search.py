from fastapi import APIRouter, Depends, Query
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from sqlalchemy import text
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
    # Standard LIKE queries for meetings and actions
    search_term_like = f"%{query}%"
    stmt_meetings = select(Meeting).where(Meeting.title.ilike(search_term_like)).limit(10)
    stmt_actions = select(ActionItem).where(ActionItem.task.ilike(search_term_like)).limit(10)
    
    results_meetings = await session.exec(stmt_meetings)
    results_actions = await session.exec(stmt_actions)
    
    response: List[SearchResultResponse] = []
    
    for m in results_meetings.all():
        response.append(SearchResultResponse(
            id=str(m.id),
            type=SearchResultType.meeting,
            meeting_id=m.id,
            match_text=m.title
        ))
        
    for a in results_actions.all():
        response.append(SearchResultResponse(
            id=str(a.id),
            type=SearchResultType.action_item,
            meeting_id=a.meeting_id,
            match_text=a.task
        ))
        
    # FTS5 query for transcripts with snippet extraction
    fts_query = query # FTS5 uses its own match syntax, just passing the term
    stmt_transcripts = text("""
        SELECT ts.id, ts.meeting_id, ts.text, ts.speaker, ts.start_time, 
               snippet(fts_transcript_segments, 2, '<mark>', '</mark>', '...', 20) as highlighted
        FROM fts_transcript_segments fts
        JOIN transcriptsegment ts ON fts.id = ts.id
        WHERE fts_transcript_segments MATCH :query
        ORDER BY fts.rank
        LIMIT 30
    """)
    
    # Simple sanitize for FTS MATCH (remove quotes to avoid parse errors on simple text searches)
    safe_query = query.replace('"', '').replace("'", "")
    
    try:
        results_transcripts = await session.execute(stmt_transcripts, {"query": safe_query})
        
        for t in results_transcripts.all():
            response.append(SearchResultResponse(
                id=str(t.id),
                type=SearchResultType.transcript,
                meeting_id=t.meeting_id,
                match_text=t.text,
                highlighted_text=t.highlighted,
                timestamp=t.start_time
            ))
    except Exception as e:
        # FTS5 might throw syntax errors if the query is malformed for MATCH, fail gracefully
        pass
        
    return response
