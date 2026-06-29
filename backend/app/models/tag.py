"""
Why it exists: Allows grouping and filtering meetings by categories (e.g. 'Sales', 'Product', 'Interview').
Why this architecture is scalable: A normalized Tag table allows for autocompleting existing tags across the entire workspace, while the junction table (MeetingTag) handles the many-to-many relationship.
"""
from typing import List
from sqlalchemy import String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

class Tag(Base):
    __tablename__ = "tags"
    
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    color: Mapped[str] = mapped_column(String(7), nullable=False, default="#4f46e5")

    # Relationships
    meetings: Mapped[List["MeetingTag"]] = relationship("MeetingTag", back_populates="tag", cascade="all, delete-orphan")


class MeetingTag(Base):
    __tablename__ = "meeting_tags"
    __table_args__ = (
        UniqueConstraint('meeting_id', 'tag_id', name='uix_meeting_tag'),
    )

    meeting_id: Mapped[str] = mapped_column(ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False, index=True)
    tag_id: Mapped[str] = mapped_column(ForeignKey("tags.id", ondelete="CASCADE"), nullable=False, index=True)

    # Relationships
    meeting: Mapped["Meeting"] = relationship("Meeting", back_populates="tags")
    tag: Mapped["Tag"] = relationship("Tag", back_populates="meetings")
