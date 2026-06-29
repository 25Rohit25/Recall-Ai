"""
Why it exists: Defines chronological "chapters" or AI-detected topics in a meeting.
Why this architecture is scalable: By extracting Topics out of the Meeting model, we can individually search for topics, link transcripts directly to topics, and easily allow users to click a topic and seek the video player to `start_time`.
"""
from typing import Optional
from sqlalchemy import String, Integer, Float, Text, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

class Topic(Base):
    __tablename__ = "topics"

    meeting_id: Mapped[str] = mapped_column(ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False, index=True)
    
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    short_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    start_time: Mapped[float] = mapped_column(Float, nullable=False)
    end_time: Mapped[float] = mapped_column(Float, nullable=False)
    sequence: Mapped[int] = mapped_column(Integer, nullable=False)

    # Relationships
    meeting: Mapped["Meeting"] = relationship("Meeting", back_populates="topics")
    
    # Indexes
    __table_args__ = (
        Index('ix_topic_meeting_sequence', 'meeting_id', 'sequence'),
    )
