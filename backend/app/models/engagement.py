"""
Why it exists: Designs the schema for interactive features (Comments, Highlights, AI Chat).
Why this architecture is scalable: Comments and Highlights link specifically to a `TranscriptSegment` (and its `start_time`), allowing precise anchoring on the timeline.
"""
from typing import List, Optional
from sqlalchemy import String, Text, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

class Comment(Base):
    __tablename__ = "comments"
    
    meeting_id: Mapped[str] = mapped_column(ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False, index=True)
    segment_id: Mapped[Optional[str]] = mapped_column(ForeignKey("transcript_segments.id", ondelete="CASCADE"), nullable=True, index=True)
    author_id: Mapped[str] = mapped_column(ForeignKey("participants.id", ondelete="CASCADE"), nullable=False)
    
    content: Mapped[str] = mapped_column(Text, nullable=False)
    resolved: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    
    # Relationships
    meeting: Mapped["Meeting"] = relationship("Meeting", back_populates="comments")
    # segment: Mapped[Optional["TranscriptSegment"]] = relationship("TranscriptSegment")

class Highlight(Base):
    __tablename__ = "highlights"
    
    meeting_id: Mapped[str] = mapped_column(ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False, index=True)
    segment_id: Mapped[str] = mapped_column(ForeignKey("transcript_segments.id", ondelete="CASCADE"), nullable=False, index=True)
    
    color: Mapped[str] = mapped_column(String(20), nullable=False, default="yellow")
    
    # Relationships
    meeting: Mapped["Meeting"] = relationship("Meeting", back_populates="highlights")

class FutureConversation(Base):
    """Represents a chat thread between a user and the AI about a specific meeting."""
    __tablename__ = "future_conversations"
    
    meeting_id: Mapped[str] = mapped_column(ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, default="Chat with Meeting")
    
    # Relationships
    meeting: Mapped["Meeting"] = relationship("Meeting", back_populates="conversations")
    messages: Mapped[List["FutureConversationMessage"]] = relationship("FutureConversationMessage", back_populates="conversation", cascade="all, delete-orphan")

class FutureConversationMessage(Base):
    __tablename__ = "future_conversation_messages"
    
    conversation_id: Mapped[str] = mapped_column(ForeignKey("future_conversations.id", ondelete="CASCADE"), nullable=False, index=True)
    
    role: Mapped[str] = mapped_column(String(20), nullable=False) # 'user' or 'ai'
    content: Mapped[str] = mapped_column(Text, nullable=False)
    
    # Relationships
    conversation: Mapped["FutureConversation"] = relationship("FutureConversation", back_populates="messages")
