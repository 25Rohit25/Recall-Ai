"""
Why it exists: Defines strict input and output validation shapes using Pydantic V2.
Why this architecture is scalable: It completely decouples the API data structures from the internal SQLAlchemy models, preventing accidental exposure of internal fields (like `deleted_at`) to the client.
"""
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class MeetingBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    duration: int = Field(..., gt=0, description="Duration in seconds")
    meeting_date: datetime
    meeting_type: str = Field(default="general")

class MeetingCreate(MeetingBase):
    pass

class MeetingUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    duration: Optional[int] = Field(None, gt=0)
    meeting_date: Optional[datetime] = None
    meeting_type: Optional[str] = None

class MeetingResponse(MeetingBase):
    id: str
    is_pinned: bool
    is_archived: bool
    transcript_status: str
    summary_status: str
    created_at: datetime
    updated_at: datetime
    
    # We could include embedded participants here if needed by UI
    # participants: List[ParticipantResponse] = []

    model_config = {"from_attributes": True}

class PaginatedMeetingResponse(BaseModel):
    items: List[MeetingResponse]
    total: int
    page: int
    size: int
    pages: int
    has_next: bool
    has_previous: bool
