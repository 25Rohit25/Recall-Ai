import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks, UploadFile, File
import asyncio
from typing import Dict, List
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select, desc
from sqlalchemy.orm import selectinload
from sqlalchemy import text
from datetime import datetime, timezone

from database import get_session
from models import Meeting, MeetingIntelligence, ActionItem, TranscriptSegment, MeetingStatus
from schemas import (
    MeetingListResponse, MeetingDetailResponse, MeetingCreateRequest, 
    MeetingUpdateRequest, ActionItemUpdateRequest
)
from services import llm_service, transcript_parser

router = APIRouter(prefix="/api/v1/meetings", tags=["meetings"])

@router.get("/", response_model=List[MeetingListResponse])
async def list_meetings(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    session: AsyncSession = Depends(get_session)
):
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
        
    meeting.segments.sort(key=lambda s: s.start_time)
    
    return meeting

@router.post("/", response_model=MeetingDetailResponse)
async def create_meeting(request: MeetingCreateRequest, session: AsyncSession = Depends(get_session)):
    new_meeting = Meeting(
        title=request.title,
        participants=request.participants or [],
        status=MeetingStatus.processing,
        date=datetime.now(timezone.utc),
        duration=0
    )
    session.add(new_meeting)
    await session.commit()
    
    segments_data = transcript_parser.parse_raw_transcript(request.transcript_text)
    
    duration = 0
    if segments_data:
        duration = int(segments_data[-1]["end_time"])
        new_meeting.duration = duration
    
    for seg in segments_data:
        segment = TranscriptSegment(
            meeting_id=new_meeting.id,
            speaker=seg["speaker"],
            start_time=seg["start_time"],
            end_time=seg["end_time"],
            text=seg["text"]
        )
        session.add(segment)
        
    # Generate mock AI summary as per assignment spec
    intel = MeetingIntelligence(
        meeting_id=new_meeting.id,
        overview=f"This is an AI-generated mock summary for {new_meeting.title}. The team discussed various technical topics and outlined next steps.",
        topics=["Technical Architecture", "Next Steps", "Review"],
        health_score=85
    )
    session.add(intel)

    mock_action = ActionItem(
        meeting_id=new_meeting.id,
        task="Review the technical architecture document",
        owner="Engineering Team",
        status="pending",
        is_completed=False
    )
    session.add(mock_action)
    new_meeting.status = MeetingStatus.completed

    await session.commit()
    await session.refresh(new_meeting)
    return await get_meeting(new_meeting.id, session)

@router.put("/{meeting_id}", response_model=MeetingDetailResponse)
async def update_meeting(meeting_id: uuid.UUID, request: MeetingUpdateRequest, session: AsyncSession = Depends(get_session)):
    meeting = await session.get(Meeting, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    if request.title is not None:
        meeting.title = request.title
    if request.participants is not None:
        meeting.participants = request.participants
        
    session.add(meeting)
    await session.commit()
    return await get_meeting(meeting_id, session)

@router.delete("/{meeting_id}")
async def delete_meeting(meeting_id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    meeting = await session.get(Meeting, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    await session.delete(meeting) 
    await session.commit()
    return {"message": "Meeting deleted"}

@router.patch("/action-items/{item_id}")
async def update_action_item(item_id: int, request: ActionItemUpdateRequest, session: AsyncSession = Depends(get_session)):
    item = await session.get(ActionItem, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Action item not found")
        
    if request.is_completed is not None:
        item.is_completed = request.is_completed
    if request.task is not None:
        item.task = request.task
    if request.owner is not None:
        item.owner = request.owner
        
    session.add(item)
    await session.commit()
    await session.refresh(item)
    return item
