"""
Why it exists: The MOST IMPORTANT table. It stores every single sentence or phrase spoken in a meeting.
Why this architecture is scalable: Transcripts for a 1-hour meeting can exceed 1000 segments. By normalizing them into this table (rather than a massive JSON blob in the Meeting table), we enable fast, targeted text searches, timestamp-based filtering, and individual segment interactions (like adding a comment to one specific sentence).
How it can evolve: `search_text` is separated for fast exact matches. `embedding_placeholder` will eventually hold a pgvector or Pinecone ID for semantic AI searches across millions of meetings.
Common mistakes avoided: JSON blobs for transcripts, which break SQL text searches and make individual sentence modification impossible.
"""
from typing import Optional
from sqlalchemy import String, Integer, Float, Text, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

class TranscriptSegment(Base):
    __tablename__ = "transcript_segments"

    meeting_id: Mapped[str] = mapped_column(ForeignKey("meetings.id", ondelete="CASCADE"), nullable=False, index=True)
    speaker_id: Mapped[Optional[str]] = mapped_column(ForeignKey("participants.id", ondelete="SET NULL"), nullable=True, index=True)
    
    transcript_text: Mapped[str] = mapped_column(Text, nullable=False)
    search_text: Mapped[str] = mapped_column(Text, nullable=False) # Normalized lowercase version for fast LIKE searches
    
    start_time: Mapped[float] = mapped_column(Float, nullable=False)
    end_time: Mapped[float] = mapped_column(Float, nullable=False)
    
    word_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    confidence_score: Mapped[float] = mapped_column(Float, nullable=False, default=1.0)
    sequence_number: Mapped[int] = mapped_column(Integer, nullable=False) # The chronological order of the segment
    
    language: Mapped[str] = mapped_column(String(10), nullable=False, default="en")
    
    # Placeholders for future AI integrations
    embedding_placeholder: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    sentiment_placeholder: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    keywords_placeholder: Mapped[Optional[str]] = mapped_column(Text, nullable=True) # Comma separated for now

    # Relationships
    meeting: Mapped["Meeting"] = relationship("Meeting", back_populates="transcript_segments")
    speaker: Mapped[Optional["Participant"]] = relationship("Participant", back_populates="spoken_segments")
    
    # Indexes
    __table_args__ = (
        Index('ix_transcript_meeting_start_time', 'meeting_id', 'start_time'),
        Index('ix_transcript_meeting_sequence', 'meeting_id', 'sequence_number'),
    )
