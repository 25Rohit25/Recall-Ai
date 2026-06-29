"""
Why it exists: Separates business logic (validation, coordinating related models) from the HTTP API routes and database repositories.
Why this architecture is scalable: It ensures the API router only handles HTTP concerns (parsing, status codes), making the service layer reusable across CLI scripts or background workers.
"""
from typing import Dict, Any, Tuple, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.meeting import Meeting
from app.repositories.meeting import meeting as repo_meeting
from app.core.exceptions import AppError

class MeetingService:
    async def create_meeting(self, db: AsyncSession, meeting_data: Dict[str, Any]) -> Meeting:
        """Business logic for creating a meeting."""
        # 1. Validation: Prevent zero or negative duration
        if meeting_data.get("duration", 0) <= 0:
            raise AppError("Meeting duration must be strictly positive", code="INVALID_DURATION")
            
        # 2. Could add logic here to check if a meeting with the same title already exists today
        
        # 3. Create
        return await repo_meeting.create(db, obj_in=meeting_data)
        
    async def toggle_pin(self, db: AsyncSession, meeting_id: str, pin_status: bool) -> Meeting:
        """Pins or unpins a meeting."""
        m = await repo_meeting.get(db, meeting_id)
        if not m:
            raise AppError("Meeting not found", code="NOT_FOUND", status_code=404)
            
        return await repo_meeting.update(db, db_obj=m, obj_in={"is_pinned": pin_status})
        
    async def toggle_archive(self, db: AsyncSession, meeting_id: str, archive_status: bool) -> Meeting:
        """Archives or restores a meeting."""
        m = await repo_meeting.get(db, meeting_id)
        if not m:
            raise AppError("Meeting not found", code="NOT_FOUND", status_code=404)
            
        return await repo_meeting.update(db, db_obj=m, obj_in={"is_archived": archive_status})
        
    async def duplicate_meeting(self, db: AsyncSession, meeting_id: str) -> Meeting:
        """Duplicates a meeting's metadata (excludes transcripts for now)."""
        m = await repo_meeting.get_with_details(db, meeting_id)
        if not m:
            raise AppError("Meeting not found", code="NOT_FOUND", status_code=404)
            
        # We duplicate the base data
        dup_data = {
            "title": f"Copy of {m.title}",
            "description": m.description,
            "duration": m.duration,
            "meeting_date": m.meeting_date,
            "meeting_type": m.meeting_type
        }
        
        new_meeting = await repo_meeting.create(db, obj_in=dup_data)
        return new_meeting

meeting_service = MeetingService()
