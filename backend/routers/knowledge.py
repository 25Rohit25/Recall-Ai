from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_sync_session
from models import KnowledgeEntity, MeetingEntityLink, Meeting, ActionItemEntityLink, ActionItem, Any
from sqlalchemy.orm import selectinload

router = APIRouter(
    prefix="/api/v1/knowledge",
    tags=["knowledge"]
)

@router.get("/{entity_name}")
def get_knowledge_entity_timeline(entity_name: str, session: Session = Depends(get_sync_session)):
    """
    Returns a chronological timeline containing every meeting where this entity was discussed, 
    all related decisions, associated risks, and key owners.
    """
    # Find the entity
    entity = session.exec(
        select(KnowledgeEntity).where(KnowledgeEntity.name == entity_name)
    ).first()
    
    if not entity:
        raise HTTPException(status_code=404, detail=f"Knowledge entity '{entity_name}' not found")
        
    # Efficiently fetch meetings with related entities, intelligence, decisions, and action_items
    statement = (
        select(Meeting)
        .join(Meeting.entities)
        .where(KnowledgeEntity.id == entity.id)
        .options(
            selectinload(Meeting.intelligence),
            selectinload(Meeting.decisions),
            selectinload(Meeting.action_items)
        )
        .order_by(Meeting.date.asc())
    )
    
    meetings = session.exec(statement).all()
    
    timeline = []
    
    for meeting in meetings:
        # Extract risks from meeting intelligence if any
        risks = []
        if meeting.intelligence and meeting.intelligence.risks:
            risks = meeting.intelligence.risks
            
        decisions = [
            {
                "id": d.id, 
                "description": d.description, 
                "lifecycle_history": d.lifecycle_history
            } for d in meeting.decisions
        ]
        
        action_items = [
            {
                "id": a.id, 
                "task": a.task, 
                "owner": a.owner, 
                "status": a.status
            } for a in meeting.action_items
        ]
        
        timeline.append({
            "meeting_id": str(meeting.id),
            "meeting_title": meeting.title,
            "date": meeting.date.isoformat() if meeting.date else None,
            "decisions": decisions,
            "risks": risks,
            "action_items": action_items
        })
        
    return {
        "entity": {
            "id": entity.id,
            "name": entity.name,
            "type": entity.type
        },
        "total_meetings": len(meetings),
        "timeline": timeline
    }
