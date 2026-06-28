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
from models import Meeting, MeetingIntelligence, ActionItem, TranscriptSegment, Decision, MeetingStatus
from schemas import (
    MeetingListResponse, MeetingDetailResponse, MeetingCreateRequest, 
    MeetingUpdateRequest, ActionItemUpdateRequest, GenerateSummaryResponse,
    AskMeetingRequest, AskMeetingResponse
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
            selectinload(Meeting.segments),
            selectinload(Meeting.decisions),
            selectinload(Meeting.entities)
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
    # Create Meeting
    new_meeting = Meeting(
        title=request.title,
        participants=request.participants or [],
        status=MeetingStatus.processing,
        date=datetime.now(timezone.utc),
        duration=0 # Will update based on segments
    )
    session.add(new_meeting)
    await session.commit()
    
    # Parse transcript
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
        
    await session.commit()
    await session.refresh(new_meeting)
    
    # Add to FTS5
    if segments_data:
        for seg in segments_data:
            # Need to get segment id to insert into FTS5, but we just bulk inserted without fetching IDs back easily
            # Let's fetch all segments for this meeting
            pass
            
    # Properly index in FTS5
    all_segments = await session.exec(select(TranscriptSegment).where(TranscriptSegment.meeting_id == new_meeting.id))
    for segment in all_segments.all():
        await session.execute(text(
            "INSERT INTO fts_transcript_segments(id, meeting_id, text, speaker) VALUES (:id, :meeting_id, :text, :speaker)"
        ), {"id": segment.id, "meeting_id": str(segment.meeting_id), "text": segment.text, "speaker": segment.speaker})
        
    await session.commit()
    
    # Refresh and load relations
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
        
    # Delete from FTS5
    await session.execute(text("DELETE FROM fts_transcript_segments WHERE meeting_id = :meeting_id"), {"meeting_id": str(meeting_id)})
    
    await session.delete(meeting) # Cascades should handle the rest if configured, otherwise we should manually delete or let DB handle
    await session.commit()
    return {"message": "Meeting deleted"}

@router.post("/{meeting_id}/generate-summary", response_model=GenerateSummaryResponse)
async def generate_summary(meeting_id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    meeting = await session.get(Meeting, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    # Fetch all transcript text
    segments = await session.exec(select(TranscriptSegment).where(TranscriptSegment.meeting_id == meeting_id).order_by(TranscriptSegment.start_time))
    full_transcript = "\n".join([f"{s.speaker}: {s.text}" for s in segments.all()])
    
    summary_data = await llm_service.generate_summary(full_transcript)
    
    # Store intelligence
    intel = MeetingIntelligence(
        meeting_id=meeting_id,
        overview=summary_data.get("overview", ""),
        risks=summary_data.get("risks", []),
        topics=summary_data.get("topics", []),
        health_score=summary_data.get("health_score", 0),
        deadlines=[]
    )
    session.add(intel)
    
    # Store decisions
    for dec in summary_data.get("key_decisions", []):
        session.add(Decision(meeting_id=meeting_id, description=dec))
        
    # Store action items
    for ai in summary_data.get("action_items", []):
        session.add(ActionItem(meeting_id=meeting_id, task=ai.get("task", ""), owner=ai.get("owner", "Unassigned"), status="pending"))
        
    meeting.status = MeetingStatus.completed
    session.add(meeting)
    await session.commit()
    
    # Fetch updated meeting to build response
    updated_meeting = await get_meeting(meeting_id, session)
    
    return GenerateSummaryResponse(
        message="Summary generated successfully",
        intelligence=updated_meeting.intelligence,
        action_items=updated_meeting.action_items,
        decisions=updated_meeting.decisions
    )

@router.post("/{meeting_id}/ask", response_model=AskMeetingResponse)
async def ask_meeting(meeting_id: uuid.UUID, request: AskMeetingRequest, session: AsyncSession = Depends(get_session)):
    segments = await session.exec(select(TranscriptSegment).where(TranscriptSegment.meeting_id == meeting_id).order_by(TranscriptSegment.start_time))
    full_transcript = "\n".join([f"{s.speaker}: {s.text}" for s in segments.all()])
    
    answer = await llm_service.ask_about_meeting(full_transcript, request.question)
    return AskMeetingResponse(answer=answer)

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
