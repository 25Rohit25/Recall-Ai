import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Optional, List, Dict, Any
from sqlmodel import Field, SQLModel, Column, JSON, Relationship
import sqlalchemy as sa
from pydantic import BaseModel

class HealthBreakdown(BaseModel):
    participation: int
    decision_clarity: int
    action_completion: int
    sentiment: int
    ownership: int

class SpeakerStats(BaseModel):
    talk_time_percentage: float
    questions_asked: int
    tasks_assigned: int
    deadlines: int
    positive_sentiment: int

class MeetingStatus(str, Enum):
    processing = "processing"
    completed = "completed"

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    hashed_password: str

# ----------------- KNOWLEDGE GRAPH LINKS ----------------- #

class MeetingEntityLink(SQLModel, table=True):
    meeting_id: uuid.UUID = Field(foreign_key="meeting.id", primary_key=True)
    entity_id: int = Field(foreign_key="knowledgeentity.id", primary_key=True)

class ActionItemEntityLink(SQLModel, table=True):
    action_item_id: int = Field(foreign_key="actionitem.id", primary_key=True)
    entity_id: int = Field(foreign_key="knowledgeentity.id", primary_key=True)

class KnowledgeEntity(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    type: str # e.g. 'Technology', 'Topic', 'Risk'
    
    meetings: List["Meeting"] = Relationship(back_populates="entities", link_model=MeetingEntityLink)
    action_items: List["ActionItem"] = Relationship(back_populates="entities", link_model=ActionItemEntityLink)

# ----------------- MAIN MODELS ----------------- #

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
    decisions: List["Decision"] = Relationship(back_populates="meeting")
    
    entities: List[KnowledgeEntity] = Relationship(back_populates="meetings", link_model=MeetingEntityLink)

class MeetingIntelligence(SQLModel, table=True):
    meeting_id: uuid.UUID = Field(foreign_key="meeting.id", primary_key=True)
    overview: str
    
    risks: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    topics: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    deadlines: List[Dict[str, str]] = Field(default_factory=list, sa_column=Column(JSON))
    health_score: int
    
    health_breakdown: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    speaker_intelligence: Optional[List[Dict[str, Any]]] = Field(default=None, sa_column=Column(JSON))
    relationship_graph: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))

    meeting: Meeting = Relationship(back_populates="intelligence")

class TranscriptSegment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    meeting_id: uuid.UUID = Field(foreign_key="meeting.id")
    speaker: str = Field(index=True)
    start_time: float
    end_time: float
    text: str
    sentiment: Optional[str] = None

    meeting: Meeting = Relationship(back_populates="segments")

class Decision(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    meeting_id: uuid.UUID = Field(foreign_key="meeting.id")
    description: str
    lifecycle_history: List[Dict[str, Any]] = Field(default_factory=list, sa_column=Column(JSON))
    
    meeting: Meeting = Relationship(back_populates="decisions")

class ActionItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    meeting_id: uuid.UUID = Field(foreign_key="meeting.id")
    task: str
    status: str
    owner: str
    is_completed: bool = Field(default=False)
    lifecycle_history: List[Dict[str, Any]] = Field(default_factory=list, sa_column=Column(JSON))

    meeting: Meeting = Relationship(back_populates="action_items")
    entities: List[KnowledgeEntity] = Relationship(back_populates="action_items", link_model=ActionItemEntityLink)
