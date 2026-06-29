import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Optional, List, Dict, Any
from sqlmodel import Field, SQLModel, Column, JSON, Relationship

class MeetingStatus(str, Enum):
    processing = "processing"
    completed = "completed"

class Meeting(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str
    date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    duration: int
    media_url: Optional[str] = None
    status: MeetingStatus = Field(default=MeetingStatus.processing)
    participants: List[str] = Field(default_factory=list, sa_column=Column(JSON))

    intelligence: Optional["MeetingIntelligence"] = Relationship(back_populates="meeting")
    segments: List["TranscriptSegment"] = Relationship(back_populates="meeting")
    action_items: List["ActionItem"] = Relationship(back_populates="meeting")

class MeetingIntelligence(SQLModel, table=True):
    meeting_id: uuid.UUID = Field(foreign_key="meeting.id", primary_key=True)
    overview: str
    topics: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    health_score: int

    meeting: Meeting = Relationship(back_populates="intelligence")

class TranscriptSegment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    meeting_id: uuid.UUID = Field(foreign_key="meeting.id")
    speaker: str = Field(index=True)
    start_time: float
    end_time: float
    text: str

    meeting: Meeting = Relationship(back_populates="segments")

class ActionItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    meeting_id: uuid.UUID = Field(foreign_key="meeting.id")
    task: str
    status: str
    owner: str
    is_completed: bool = Field(default=False)

    meeting: Meeting = Relationship(back_populates="action_items")
