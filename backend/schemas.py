from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Dict
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
    health_score: Optional[int]

class IntelligenceSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    overview: str
    decisions: List[str]
    risks: List[str]
    topics: List[str]
    deadlines: List[Dict[str, str]]
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
    transcript_segments: List[TranscriptSegmentSchema]

class SearchResultType(str, Enum):
    meeting = "meeting"
    transcript = "transcript"
    action_item = "action_item"

class SearchResultResponse(BaseModel):
    id: str
    type: SearchResultType
    meeting_id: uuid.UUID
    match_text: str
    timestamp: Optional[float] = None
