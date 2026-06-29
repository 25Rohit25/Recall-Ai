"""
Why it exists: Represents an individual (user, guest, or system) who attends meetings.
Why this architecture is scalable: It separates the concept of a Participant from an Application User. A participant might be a guest identified only by an email who doesn't have a login account yet.
How it can evolve: `future_external_id` allows linking this participant record to a future robust `User` table or CRM contact (e.g. Salesforce).
"""
from typing import List, Optional
from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

class Participant(Base):
    __tablename__ = "participants"

    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, unique=True, index=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    
    # A hex color code assigned to the participant for UI consistency across meetings
    color: Mapped[str] = mapped_column(String(7), nullable=False, default="#4f46e5")
    
    future_external_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, index=True)

    # Relationships
    meetings: Mapped[List["MeetingParticipant"]] = relationship("MeetingParticipant", back_populates="participant")
    spoken_segments: Mapped[List["TranscriptSegment"]] = relationship("TranscriptSegment", back_populates="speaker")
    assigned_action_items: Mapped[List["ActionItem"]] = relationship("ActionItem", back_populates="assignee")


"""
Why it exists: A junction table managing the Many-to-Many relationship between Meetings and Participants.
Why this architecture is scalable: Instead of a simple association table, it is a full model containing edge-specific data (role, speaking_time). This handles scenarios where someone is an 'owner' in one meeting but a 'guest' in another.
"""
from sqlalchemy import ForeignKey, UniqueConstraint

class MeetingParticipant(Base):
    __tablename__ = "meeting_participants"
    __table_args__ = (
        UniqueConstraint('meeting_id', 'participant_id', name='uix_meeting_participant'),
    )

    meeting_id: Mapped[str] = mapped_column(ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False, index=True)
    participant_id: Mapped[str] = mapped_column(ForeignKey("participants.id", ondelete="CASCADE"), nullable=False, index=True)
    
    role: Mapped[str] = mapped_column(String(50), nullable=False, default="attendee") # owner, attendee, guest
    display_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    speaking_time: Mapped[int] = mapped_column(Integer, nullable=False, default=0) # Total seconds spoken in this meeting

    # Relationships
    meeting: Mapped["Meeting"] = relationship("Meeting", back_populates="participants")
    participant: Mapped["Participant"] = relationship("Participant", back_populates="meetings")
