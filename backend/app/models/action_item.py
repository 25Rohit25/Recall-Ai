"""
Why it exists: Stores tasks derived from the meeting context by AI or manually entered.
Why this architecture is scalable: Normalizing ActionItems allows the application to build a global "My Tasks" view across *all* meetings for a single `assignee_id`.
How it can evolve: `status` ENUM allows integration with Jira/Asana later (syncing status).
"""
from typing import Optional
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, Text, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

class ActionItem(Base):
    __tablename__ = "action_items"

    meeting_id: Mapped[str] = mapped_column(ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False, index=True)
    assignee_id: Mapped[Optional[str]] = mapped_column(ForeignKey("participants.id", ondelete="SET NULL"), nullable=True, index=True)
    
    task: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    priority: Mapped[str] = mapped_column(String(20), nullable=False, default="medium") # low, medium, high
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="open") # open, in_progress, completed, cancelled
    completed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    
    due_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    meeting: Mapped["Meeting"] = relationship("Meeting", back_populates="action_items")
    assignee: Mapped[Optional["Participant"]] = relationship("Participant", back_populates="assigned_action_items")
