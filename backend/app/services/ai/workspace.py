"""
Why it exists: The central orchestrator for the AI Workspace.
Why this architecture is scalable: It isolates the API endpoints from the LLM logic, managing the RAG pipeline and DB saves.
"""
from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.ai.base import BaseLLMProvider
from app.services.ai.mock_provider import MockLLMProvider
from app.repositories.summary import summary_repo
from app.repositories.intelligence import action_item_repo, risk_repo, decision_repo
from app.models.summary import MeetingSummary
from app.models.intelligence import ActionItem, Risk, Decision
from app.core.prompts import EXECUTIVE_SUMMARY_PROMPT

class WorkspaceAIService:
    def __init__(self, provider: BaseLLMProvider):
        self.provider = provider
        
    async def generate_executive_summary(self, db: AsyncSession, meeting_id: str, transcript_text: str) -> MeetingSummary:
        """Generates the executive summary using the LLM and saves it to the DB."""
        # Note: A real implementation might chunk the transcript if it exceeds context windows.
        result_text = await self.provider.generate_completion(
            prompt=transcript_text,
            system_prompt=EXECUTIVE_SUMMARY_PROMPT
        )
        
        # Check if one exists
        existing = await summary_repo.get_by_meeting(db, meeting_id)
        if existing:
            existing.executive_summary = result_text
            summary = await summary_repo.update(db, db_obj=existing, obj_in={})
        else:
            summary = await summary_repo.create(db, obj_in={
                "meeting_id": meeting_id,
                "executive_summary": result_text,
                "ai_model_used": "mock_model"
            })
        return summary
        
    async def extract_action_items(self, db: AsyncSession, meeting_id: str, transcript_text: str) -> List[ActionItem]:
        # Using generate_structured
        schema = {"type": "object"} # Placeholder for real Pydantic schema passed to LLM
        structured_data = await self.provider.generate_structured(transcript_text, schema=schema)
        
        items = []
        for raw_item in structured_data.get("action_items", []):
            item = await action_item_repo.create(db, obj_in={
                "meeting_id": meeting_id,
                "description": raw_item.get("description", ""),
                "owner_name": raw_item.get("owner_name"),
                "priority": raw_item.get("priority", "medium")
            })
            items.append(item)
        return items

    # === RAG ARCHITECTURE PIPELINE ===
    # Transcript -> Chunking -> Ranking -> Context Selection -> Prompt -> LLM -> Answer
    # In an interview, explain this flow:
    # 1. Chunking: We break the transcript into 512-token chunks with 50-token overlap.
    # 2. Embedding: We pass chunks through `text-embedding-3-small`.
    # 3. Vector DB: We store them in pgvector/Pinecone.
    # 4. Retrieval: User asks a question in the chat. We embed the question.
    # 5. Ranking: We retrieve top-K most similar chunks (Cosine Similarity).
    # 6. LLM: We pass those chunks + conversational history to the LLM.
    
    async def chat(self, db: AsyncSession, meeting_id: str, user_message: str) -> str:
        """Handles chat with RAG context."""
        # 1. (Mocked) RAG Retrieval would happen here
        # context = retrieve_context(user_message, meeting_id)
        
        # 2. Fetch history from DB (using chat_repo)
        # 3. Call Provider
        response = await self.provider.chat([
            {"role": "user", "content": user_message}
        ])
        
        # 4. Save to DB
        return response

# Dependency Injection allows swapping providers
# e.g., if env == prod: provider = OpenAIProvider()
workspace_ai_service = WorkspaceAIService(provider=MockLLMProvider())
