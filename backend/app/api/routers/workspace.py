"""
Why it exists: Exposes the AI Workspace and Chat functionality over REST API.
Why this architecture is scalable: It provides specialized endpoints (e.g., `/summary`, `/action-items`) rather than a single massive `/workspace` endpoint. This allows the frontend to stream or lazily load individual tabs (like Risks or Decisions) only when the user clicks them.
"""
from typing import List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies.database import get_db
from app.schemas.intelligence import ActionItemResponse, ActionItemUpdate, MeetingSummaryResponse, ChatRequest, ChatMessageResponse
from app.repositories.summary import summary_repo
from app.repositories.intelligence import action_item_repo
from app.repositories.chat import conversation_repo, message_repo
from app.services.ai.workspace import workspace_ai_service
from app.core.exceptions import AppError

router = APIRouter(prefix="/meetings/{meeting_id}/workspace", tags=["AI Workspace"])

@router.get("/summary", response_model=MeetingSummaryResponse)
async def get_summary(meeting_id: str, db: AsyncSession = Depends(get_db)):
    """Fetch the executive summary for the meeting."""
    summary = await summary_repo.get_by_meeting(db, meeting_id)
    if not summary:
        raise AppError("Summary not found", status_code=404)
    return summary

@router.post("/summary/regenerate", response_model=MeetingSummaryResponse)
async def regenerate_summary(meeting_id: str, db: AsyncSession = Depends(get_db)):
    """Trigger the LLM to regenerate the executive summary."""
    # In reality, fetch full transcript text here
    mock_transcript = "This is the transcript of the meeting."
    return await workspace_ai_service.generate_executive_summary(db, meeting_id, mock_transcript)

@router.get("/action-items", response_model=List[ActionItemResponse])
async def get_action_items(meeting_id: str, db: AsyncSession = Depends(get_db)):
    return await action_item_repo.get_by_meeting(db, meeting_id)

@router.patch("/action-items/{item_id}", response_model=ActionItemResponse)
async def update_action_item(meeting_id: str, item_id: str, update_data: ActionItemUpdate, db: AsyncSession = Depends(get_db)):
    """Updates an action item (e.g. marking it complete)."""
    item = await action_item_repo.get(db, id=item_id)
    if not item or item.meeting_id != meeting_id:
        raise AppError("Action Item not found", status_code=404)
    
    updated = await action_item_repo.update(db, db_obj=item, obj_in=update_data.model_dump(exclude_unset=True))
    return updated

@router.post("/chat", response_model=ChatMessageResponse)
async def chat_with_meeting(meeting_id: str, request: ChatRequest, db: AsyncSession = Depends(get_db)):
    """Send a message to the AI assistant using the meeting context (RAG)."""
    response_content = await workspace_ai_service.chat(db, meeting_id, request.message)
    
    # Store conversation (simplified logic, assumes 1 convo per meeting for now)
    convo = await conversation_repo.get_by_meeting(db, meeting_id)
    if not convo:
        convo = await conversation_repo.create(db, obj_in={"meeting_id": meeting_id, "title": "Meeting Chat"})
        
    # Save user message
    await message_repo.create(db, obj_in={"conversation_id": convo.id, "role": "user", "content": request.message})
    
    # Save & return AI message
    ai_msg = await message_repo.create(db, obj_in={"conversation_id": convo.id, "role": "assistant", "content": response_content})
    return ai_msg
