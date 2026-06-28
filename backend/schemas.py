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
    health_score: Optional[int]

class IntelligenceSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    overview: str
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

class KnowledgeEntitySchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    type: str

class DecisionSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    description: str
    lifecycle_history: List[Dict[str, Any]]

class ActionItemSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    task: str
    status: str
    owner: str
    lifecycle_history: List[Dict[str, Any]] = []
    entities: List[KnowledgeEntitySchema] = []

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
    decisions: List[DecisionSchema] = []
    entities: List[KnowledgeEntitySchema] = []

class SearchResultType(str, Enum):
    meeting = "meeting"
    transcript = "transcript"
    action_item = "action_item"

class SearchResultResponse(BaseModel):
    id: str
    type: SearchResultType
    meeting_id: uuid.UUID
    match_text: str
    highlighted_text: Optional[str] = None
    timestamp: Optional[float] = None

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

class GenerateSummaryResponse(BaseModel):
    message: str
    intelligence: IntelligenceSchema
    action_items: List[ActionItemSchema]
    decisions: List[DecisionSchema]

class AskMeetingRequest(BaseModel):
    question: str

class AskMeetingResponse(BaseModel):
    answer: str

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user_name: str
    user_email: str
