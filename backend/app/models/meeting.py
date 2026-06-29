"""
Why it exists: The central aggregate root of the application. Everything ties back to a Meeting.
Why this architecture is scalable: It uses UUIDs for unguessable IDs (crucial for sharing links), stores duration and dates distinctly from created_at, and uses strict ENUMs for processing states (transcript/summary status).
How it can evolve: Can easily be linked to a future `Tenant` or `Workspace` model for B2B SaaS.
Common mistakes avoided: Missing soft delete (which would permanently delete client data), storing large text (like transcript) directly in this table instead of offloading to related tables.
"""
from typing import List, Optional
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, Enum, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

class Meeting(Base):
    __tablename__ = "meetings"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    duration: Mapped[int] = mapped_column(Integer, nullable=False, default=0) # Duration in seconds
    meeting_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    recording_url: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    
    meeting_type: Mapped[str] = mapped_column(String(100), nullable=False, default="general")
    is_pinned: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, index=True)
    is_archived: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, index=True)
    
    transcript_status: Mapped[str] = mapped_column(String(50), nullable=False, default="pending") # pending, processing, completed, failed
    summary_status: Mapped[str] = mapped_column(String(50), nullable=False, default="pending")
    
    # Relationships
    participants: Mapped[List["MeetingParticipant"]] = relationship("MeetingParticipant", back_populates="meeting", cascade="all, delete-orphan")
    transcript_segments: Mapped[List["TranscriptSegment"]] = relationship("TranscriptSegment", back_populates="meeting", cascade="all, delete-orphan")
    summary: Mapped[Optional["MeetingSummary"]] = relationship("MeetingSummary", back_populates="meeting", uselist=False, cascade="all, delete-orphan")
    action_items: Mapped[List["ActionItem"]] = relationship("ActionItem", back_populates="meeting", cascade="all, delete-orphan")
    topics: Mapped[List["Topic"]] = relationship("Topic", back_populates="meeting", cascade="all, delete-orphan")
    tags: Mapped[List["MeetingTag"]] = relationship("MeetingTag", back_populates="meeting", cascade="all, delete-orphan")
    settings: Mapped[Optional["MeetingSetting"]] = relationship("MeetingSetting", back_populates="meeting", uselist=False, cascade="all, delete-orphan")
    
    # Engagement & Productivity Relationships
    comments: Mapped[List["Comment"]] = relationship("Comment", back_populates="meeting", cascade="all, delete-orphan")
    highlights: Mapped[List["Highlight"]] = relationship("Highlight", back_populates="meeting", cascade="all, delete-orphan")
    conversations: Mapped[List["FutureConversation"]] = relationship("FutureConversation", back_populates="meeting", cascade="all, delete-orphan")
