from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from database import get_sync_session
from models import Meeting
import uuid

router = APIRouter(
    prefix="/api/v1/meetings",
    tags=["workflows"]
)

@router.post("/{meeting_id}/generate-workflow")
def generate_workflow(
    meeting_id: uuid.UUID, 
    type: str = Query(..., description="Workflow type (e.g., slack, email, jira)"),
    session: Session = Depends(get_sync_session)
):
    """
    Simulates an LLM response formatting the meeting's intelligence, tasks, 
    and deadlines into a rich, copy-pasteable Markdown payload.
    """
    meeting = session.get(Meeting, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    intelligence = meeting.intelligence
    action_items = meeting.action_items
    
    # Simulate LLM generation based on workflow type
    workflow_content = ""
    
    if type.lower() == "slack":
        workflow_content += f"*Meeting Summary: {meeting.title}*\n\n"
        if intelligence and intelligence.overview:
            workflow_content += f"> {intelligence.overview}\n\n"
        
        workflow_content += "*🚀 Action Items*\n"
        for idx, item in enumerate(action_items):
            owner = f"@{item.owner}" if item.owner else "@channel"
            workflow_content += f"{idx + 1}. {owner} - {item.task}\n"
            
    elif type.lower() == "email":
        workflow_content += f"Subject: Meeting Notes: {meeting.title}\n\n"
        workflow_content += "Hi team,\n\nHere are the notes from our recent sync:\n\n"
        if intelligence and intelligence.overview:
            workflow_content += f"Summary:\n{intelligence.overview}\n\n"
            
        workflow_content += "Action Items:\n"
        for item in action_items:
            workflow_content += f"- {item.task} (Owner: {item.owner})\n"
            
        workflow_content += "\nBest,\nFireNotes AI"
        
    elif type.lower() == "jira":
        workflow_content += f"h1. Epic: {meeting.title}\n\n"
        if intelligence and intelligence.overview:
            workflow_content += f"h2. Background\n{intelligence.overview}\n\n"
            
        workflow_content += "h2. Sub-tasks\n"
        for item in action_items:
            workflow_content += f"* [ ] {item.task} - Assignee: {item.owner}\n"
            
    else:
        raise HTTPException(status_code=400, detail="Unsupported workflow type. Choose from: slack, email, jira")
        
    return {
        "meeting_id": str(meeting.id),
        "workflow_type": type,
        "content": workflow_content
    }

@router.post("/{meeting_id}/generate-recommendations")
def generate_recommendations(
    meeting_id: uuid.UUID,
    session: Session = Depends(get_sync_session)
):
    """
    Simulates an LLM analyzing the meeting transcript to proactively output an array of suggestions.
    """
    meeting = session.get(Meeting, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    suggestions = []
    
    # Simple heuristics to generate realistic-looking "AI" suggestions
    if meeting.action_items:
        owners = set([item.owner for item in meeting.action_items if item.owner])
        if owners:
            suggestions.append(f"Notify stakeholders: {', '.join(owners)} about newly assigned tasks.")
            
    if meeting.intelligence and meeting.intelligence.risks:
        suggestions.append(f"Schedule follow-up meeting regarding flagged risk: '{meeting.intelligence.risks[0]}'")
        
    if meeting.intelligence and meeting.intelligence.topics:
        suggestions.append(f"Create a Jira Epic for discussed topic: '{meeting.intelligence.topics[0]}'")
        
    if not suggestions:
        suggestions.append("Distribute meeting summary to all participants.")
        suggestions.append("Review open action items from previous week.")
        
    return {
        "meeting_id": str(meeting.id),
        "recommendations": suggestions
    }
