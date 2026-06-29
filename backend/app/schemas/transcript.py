"""
Why it exists: Defines input/output schemas for Transcript operations using Pydantic V2.
Why this architecture is scalable: We exclude the `search_text` and `embedding_placeholder` from the response to save massive bandwidth, as the frontend only needs the raw `transcript_text`.
"""
from typing import Optional, List
from pydantic import BaseModel, Field

class SpeakerResponse(BaseModel):
    id: str
    name: str
    avatar_url: Optional[str] = None
    
    model_config = {"from_attributes": True}

class TranscriptSegmentResponse(BaseModel):
    id: str
    meeting_id: str
    speaker_id: Optional[str] = None
    
    transcript_text: str
    start_time: float
    end_time: float
    
    word_count: int
    confidence_score: float
    sequence_number: int
    language: str
    
    speaker: Optional[SpeakerResponse] = None
    
    model_config = {"from_attributes": True}

class TranscriptSearchResponse(BaseModel):
    matches: List[TranscriptSegmentResponse]
    total_matches: int
