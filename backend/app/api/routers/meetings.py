"""
Why it exists: Exposes the Meeting Management REST endpoints to the client.
Why this architecture is scalable: It is thin. All database interactions are offloaded to Repositories, and business logic is handled by the Service Layer. It uses Dependency Injection for the DB session.
"""
from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies.database import get_db
from app.schemas.meeting import MeetingCreate, MeetingUpdate, MeetingResponse, PaginatedMeetingResponse
from app.services.meeting import meeting_service
from app.repositories.meeting import meeting as repo_meeting
from app.utils.pagination import calculate_pages, get_offset

router = APIRouter(prefix="/meetings", tags=["Meetings"])

@router.get("", response_model=PaginatedMeetingResponse)
async def get_meetings(
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(20, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search keyword across title and content"),
    is_pinned: Optional[bool] = Query(None, description="Filter by pinned status"),
    is_archived: bool = Query(False, description="Include archived meetings (default False)"),
    status_filter: Optional[str] = Query(None, description="Filter by transcript status"),
    db: AsyncSession = Depends(get_db)
):
    """Fetch paginated list of meetings with advanced filtering."""
    skip = get_offset(page, size)
    
    meetings, total = await repo_meeting.get_paginated(
        db=db,
        skip=skip,
        limit=size,
        search=search,
        is_pinned=is_pinned,
        is_archived=is_archived,
        status=status_filter
    )
    
    total_pages = calculate_pages(total, size)
    
    return PaginatedMeetingResponse(
        items=meetings,
        total=total,
        page=page,
        size=size,
        pages=total_pages,
        has_next=page < total_pages,
        has_previous=page > 1
    )

@router.get("/{meeting_id}", response_model=MeetingResponse)
async def get_meeting(meeting_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve a single meeting by ID."""
    m = await repo_meeting.get(db, meeting_id)
    if not m:
        from app.core.exceptions import AppError
        raise AppError("Meeting not found", code="NOT_FOUND", status_code=404)
    return m

@router.post("", response_model=MeetingResponse, status_code=status.HTTP_201_CREATED)
async def create_meeting(meeting_in: MeetingCreate, db: AsyncSession = Depends(get_db)):
    """Create a new meeting."""
    return await meeting_service.create_meeting(db, meeting_in.model_dump())

@router.patch("/{meeting_id}", response_model=MeetingResponse)
async def update_meeting(meeting_id: str, meeting_in: MeetingUpdate, db: AsyncSession = Depends(get_db)):
    """Update meeting metadata."""
    m = await repo_meeting.get(db, meeting_id)
    if not m:
        from app.core.exceptions import AppError
        raise AppError("Meeting not found", code="NOT_FOUND", status_code=404)
    return await repo_meeting.update(db, db_obj=m, obj_in=meeting_in.model_dump(exclude_unset=True))

@router.delete("/{meeting_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_meeting(meeting_id: str, db: AsyncSession = Depends(get_db)):
    """Soft delete a meeting."""
    await repo_meeting.remove(db, id=meeting_id, soft_delete=True)
    return None

@router.post("/{meeting_id}/duplicate", response_model=MeetingResponse)
async def duplicate_meeting(meeting_id: str, db: AsyncSession = Depends(get_db)):
    """Duplicates an existing meeting."""
    return await meeting_service.duplicate_meeting(db, meeting_id)

@router.post("/{meeting_id}/archive", response_model=MeetingResponse)
async def archive_meeting(meeting_id: str, db: AsyncSession = Depends(get_db)):
    """Marks a meeting as archived."""
    return await meeting_service.toggle_archive(db, meeting_id, True)

@router.post("/{meeting_id}/restore", response_model=MeetingResponse)
async def restore_meeting(meeting_id: str, db: AsyncSession = Depends(get_db)):
    """Restores an archived meeting."""
    return await meeting_service.toggle_archive(db, meeting_id, False)

@router.post("/{meeting_id}/pin", response_model=MeetingResponse)
async def pin_meeting(meeting_id: str, db: AsyncSession = Depends(get_db)):
    """Pins a meeting to the top."""
    return await meeting_service.toggle_pin(db, meeting_id, True)

@router.post("/{meeting_id}/unpin", response_model=MeetingResponse)
async def unpin_meeting(meeting_id: str, db: AsyncSession = Depends(get_db)):
    """Unpins a meeting."""
    return await meeting_service.toggle_pin(db, meeting_id, False)
