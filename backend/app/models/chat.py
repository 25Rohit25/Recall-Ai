"""
Why it exists: Stores native LLM chat conversations for a specific meeting (or globally).
Why this architecture is scalable: Stores AI chat locally to provide memory (context) across multiple messages without re-querying the entire LLM history from the provider APIs.
"""
from typing import Optional
from sqlalchemy import String, Integer, Text, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

class AIConversation(Base):
    __tablename__ = "ai_conversations"
    meeting_id: Mapped[Optional[str]] = mapped_column(ForeignKey("meetings.id", ondelete="CASCADE"), nullable=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, default="New Conversation")
    
    messages: Mapped[list["AIMessage"]] = relationship("AIMessage", back_populates="conversation", cascade="all, delete-orphan")

class AIMessage(Base):
    __tablename__ = "ai_messages"
    conversation_id: Mapped[str] = mapped_column(ForeignKey("ai_conversations.id", ondelete="CASCADE"), nullable=False, index=True)
    role: Mapped[str] = mapped_column(String(50), nullable=False) # 'user', 'assistant', 'system'
    content: Mapped[str] = mapped_column(Text, nullable=False)
    
    # Can store sources used by RAG to generate this specific answer
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True) 
    
    conversation: Mapped["AIConversation"] = relationship("AIConversation", back_populates="messages")
