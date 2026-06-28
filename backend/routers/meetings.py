import uuid
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select, desc
from sqlalchemy.orm import selectinload
from typing import List

from database import get_session
from models import Meeting, MeetingIntelligence
from schemas import MeetingListResponse, MeetingDetailResponse

router = APIRouter(prefix="/api/v1/meetings", tags=["meetings"])

@router.get("/", response_model=List[MeetingListResponse])
async def list_meetings(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    session: AsyncSession = Depends(get_session)
):
    # Retrieve meetings with associated health_score via a join
    statement = (
        select(Meeting, MeetingIntelligence.health_score)
        .outerjoin(MeetingIntelligence, Meeting.id == MeetingIntelligence.meeting_id)
        .order_by(desc(Meeting.date))
        .offset(offset)
        .limit(limit)
    )
    
    results = await session.exec(statement)
    meetings = results.all()
    
    response = []
    for meeting, health_score in meetings:
        response.append(
            MeetingListResponse(
                id=meeting.id,
                title=meeting.title,
                date=meeting.date,
                duration=meeting.duration,
                status=meeting.status,
                health_score=health_score
            )
        )
    return response

@router.get("/{meeting_id}", response_model=MeetingDetailResponse)
async def get_meeting(meeting_id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    # Eagerly load all relationships to prevent N+1 queries
    statement = (
        select(Meeting)
        .where(Meeting.id == meeting_id)
        .options(
            selectinload(Meeting.intelligence),
            selectinload(Meeting.action_items),
            selectinload(Meeting.segments)
        )
    )
    
    results = await session.exec(statement)
    meeting = results.first()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    # Order transcript segments chronologically by start_time
    meeting.segments.sort(key=lambda s: s.start_time)
    
    return MeetingDetailResponse(
        id=meeting.id,
        title=meeting.title,
        date=meeting.date,
        duration=meeting.duration,
        media_url=meeting.media_url,
        status=meeting.status,
        intelligence=meeting.intelligence,
        action_items=meeting.action_items,
        transcript_segments=meeting.segments
    )
