"""
Why it exists: Pydantic models for request/response validation for the AI Workspace APIs.
"""
from typing import Optional, List, Any
from pydantic import BaseModel, Field

class ActionItemResponse(BaseModel):
    id: str
    meeting_id: str
    description: str
    owner_name: Optional[str]
    priority: str
    is_completed: bool
    
    model_config = {"from_attributes": True}

class ActionItemUpdate(BaseModel):
    is_completed: Optional[bool] = None
    description: Optional[str] = None
    priority: Optional[str] = None

class MeetingSummaryResponse(BaseModel):
    id: str
    meeting_id: str
    executive_summary: Optional[str]
    
    model_config = {"from_attributes": True}

class ChatMessageResponse(BaseModel):
    id: str
    role: str
    content: str
    metadata_json: Optional[Any]
    
    model_config = {"from_attributes": True}

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
