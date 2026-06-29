"""
Why it exists: Stores granular AI extracted entities (Chapters, Decisions, Risks, Insights, FollowUps) rather than large text blobs.
Why this architecture is scalable: By splitting the summary into individual rows, users can comment on, edit, delete, or resolve a specific Decision or Action Item without re-parsing a giant JSON object.
"""
from typing import Optional
from sqlalchemy import String, Integer, Float, Text, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

class Chapter(Base):
    __tablename__ = "chapters"
    meeting_id: Mapped[str] = mapped_column(ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    start_time: Mapped[float] = mapped_column(Float, nullable=False)
    end_time: Mapped[float] = mapped_column(Float, nullable=False)
    
class Decision(Base):
    __tablename__ = "decisions"
    meeting_id: Mapped[str] = mapped_column(ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    context: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    owner_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    priority: Mapped[str] = mapped_column(String(50), nullable=False, default="medium")
    timestamp: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

class Risk(Base):
    __tablename__ = "risks"
    meeting_id: Mapped[str] = mapped_column(ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    severity: Mapped[str] = mapped_column(String(50), nullable=False, default="medium")
    mitigation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

class FollowUp(Base):
    __tablename__ = "follow_ups"
    meeting_id: Mapped[str] = mapped_column(ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    owner_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="pending")

class Insight(Base):
    __tablename__ = "insights"
    meeting_id: Mapped[str] = mapped_column(ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False) # e.g., "Customer Feedback", "Competitor Mention"
