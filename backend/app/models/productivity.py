"""
Why it exists: Defines data structures specifically for personal productivity (Bookmarks, Search History).
Why this architecture is scalable: It separates global search telemetry (SearchHistory) and personal organization (Bookmarks) from core meeting data.
"""
from typing import Optional
from sqlalchemy import String, Text, ForeignKey, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base

class Bookmark(Base):
    __tablename__ = "bookmarks"
    
    # A bookmark can link to a meeting, or specifically a transcript segment
    meeting_id: Mapped[str] = mapped_column(ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False, index=True)
    segment_id: Mapped[Optional[str]] = mapped_column(ForeignKey("transcript_segments.id", ondelete="CASCADE"), nullable=True, index=True)
    
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    pinned: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    color: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)

class SearchHistory(Base):
    """Stores recent searches for the user."""
    __tablename__ = "search_history"
    
    query: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    user_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True) # Placeholder for auth

class RecentActivity(Base):
    """Tracks what the user has recently viewed, edited, or searched."""
    __tablename__ = "recent_activity"
    
    user_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    action_type: Mapped[str] = mapped_column(String(50), nullable=False) # 'viewed_meeting', 'searched', 'completed_task'
    entity_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True) # ID of the meeting/task
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
