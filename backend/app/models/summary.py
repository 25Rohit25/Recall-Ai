"""
Why it exists: Stores the AI-generated outputs for a meeting.
Why this architecture is scalable: It strictly enforces a 1-to-1 relationship with Meeting. The fields are split into distinct business values (executive, detailed, decisions, risks) instead of a monolithic string, allowing the frontend to easily tabulate or filter them.
How it can evolve: `ai_model_used` tracks the LLM lineage (e.g. GPT-4o, Claude-3.5-Sonnet) to help debug bad generation outputs and track token costs.
"""
from typing import Optional
from sqlalchemy import String, Integer, Float, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

class MeetingSummary(Base):
    __tablename__ = "meeting_summaries"

    meeting_id: Mapped[str] = mapped_column(ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    
    executive_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    detailed_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    decision_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    risks: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    next_steps: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # AI Auditing
    ai_model_used: Mapped[str] = mapped_column(String(50), nullable=False, default="unknown")
    token_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    generation_duration: Mapped[float] = mapped_column(Float, nullable=False, default=0.0) # Seconds taken to generate

    # Relationships
    meeting: Mapped["Meeting"] = relationship("Meeting", back_populates="summary")
