"""
Why it exists: Defines input/output schemas for the Global Search API.
"""
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class SearchResultGroup(BaseModel):
    id: str
    type: str
    title: Optional[str] = None
    text: Optional[str] = None
    description: Optional[str] = None
    meeting_id: Optional[str] = None

class GlobalSearchResponse(BaseModel):
    meetings: List[SearchResultGroup]
    transcripts: List[SearchResultGroup]
    action_items: List[SearchResultGroup]
    decisions: List[SearchResultGroup]

class RecentSearchResponse(BaseModel):
    queries: List[str]
