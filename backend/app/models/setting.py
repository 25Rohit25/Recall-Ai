"""
Why it exists: Stores display and interaction preferences specific to a single meeting view.
Why this architecture is scalable: Kept distinct from the Meeting model to avoid bloating it. Future user-specific preferences (like 'always_show_timestamps') can be linked here.
"""
from sqlalchemy import Boolean, Float, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

class MeetingSetting(Base):
    __tablename__ = "meeting_settings"

    meeting_id: Mapped[str] = mapped_column(ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    
    playback_speed: Mapped[float] = mapped_column(Float, nullable=False, default=1.0)
    auto_scroll: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    theme_preference: Mapped[str] = mapped_column(String(20), nullable=False, default="system")
    transcript_font_size: Mapped[str] = mapped_column(String(10), nullable=False, default="md")
    
    show_timestamp: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    show_speaker_avatar: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    # Relationships
    meeting: Mapped["Meeting"] = relationship("Meeting", back_populates="settings")
