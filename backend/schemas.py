from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
from enum import Enum
from models import MeetingStatus

class MeetingListResponse(BaseModel):
    id: uuid.UUID
    title: str
    date: datetime
    duration: int
    status: MeetingStatus
    health_score: Optional[int] = None

class IntelligenceSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    overview: str
    topics: List[str]
    health_score: int

class TranscriptSegmentSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    speaker: str
    start_time: float
    end_time: float
    text: str

class ActionItemSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    task: str
    status: str
    owner: str
    is_completed: bool

class MeetingDetailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    title: str
    date: datetime
    duration: int
    media_url: Optional[str]
    status: MeetingStatus
    intelligence: Optional[IntelligenceSchema]
    action_items: List[ActionItemSchema]
    segments: List[TranscriptSegmentSchema]

class MeetingCreateRequest(BaseModel):
    title: str
    transcript_text: str
    participants: Optional[List[str]] = []

class MeetingUpdateRequest(BaseModel):
    title: Optional[str] = None
    participants: Optional[List[str]] = None

class ActionItemUpdateRequest(BaseModel):
    is_completed: Optional[bool] = None
    task: Optional[str] = None
    owner: Optional[str] = None
