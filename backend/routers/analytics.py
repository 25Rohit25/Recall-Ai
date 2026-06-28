from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from database import get_sync_session
from models import Meeting, ActionItem, TranscriptSegment, Decision
from typing import List, Dict, Any
import uuid
from sqlalchemy.orm import selectinload

router = APIRouter(
    prefix="/api/v1/analytics",
    tags=["analytics"]
)

@router.get("/team/{user_name}")
def get_team_analytics(user_name: str, session: Session = Depends(get_sync_session)):
    """
    Aggregate data across ALL meetings for a specific user to return: 
    Total Meetings, Average Talk Time, Global Tasks Completed Percentage, and Total Questions Asked.
    """
    
    # 1. Total Meetings
    # Find all meetings where the user spoke
    speaker_meetings = session.exec(
        select(TranscriptSegment.meeting_id).where(TranscriptSegment.speaker == user_name).distinct()
    ).all()
    
    # Find all meetings where the user owns a task
    owner_meetings = session.exec(
        select(ActionItem.meeting_id).where(ActionItem.owner == user_name).distinct()
    ).all()
    
    # Combine unique meeting IDs to get the total meetings the user was involved in
    all_meeting_ids = set(speaker_meetings) | set(owner_meetings)
    total_meetings = len(all_meeting_ids)
    
    # 2. Average Talk Time
    segments = session.exec(
        select(TranscriptSegment).where(TranscriptSegment.speaker == user_name)
    ).all()
    
    total_talk_time_seconds = sum((seg.end_time - seg.start_time) for seg in segments)
    average_talk_time_seconds = (total_talk_time_seconds / total_meetings) if total_meetings > 0 else 0
    
    # 3. Total Questions Asked
    # We estimate questions by looking for question marks in the user's spoken text
    total_questions = sum(1 for seg in segments if '?' in seg.text)
    
    # 4. Global Tasks Completed Percentage
    action_items = session.exec(
        select(ActionItem).where(ActionItem.owner == user_name)
    ).all()
    
    total_tasks = len(action_items)
    completed_tasks = sum(1 for item in action_items if item.status.lower() in ["completed", "done", "verified"])
    
    tasks_completed_percentage = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
    
    # 5. Open Decisions
    open_decisions = []
    if all_meeting_ids:
        decisions = session.exec(
            select(Decision).where(Decision.meeting_id.in_(all_meeting_ids))
        ).all()
        
        for d in decisions:
            # Check if decision is "open" (last lifecycle status isn't completed/verified)
            is_open = True
            if d.lifecycle_history and len(d.lifecycle_history) > 0:
                last_event = d.lifecycle_history[-1]
                if last_event.get("status", "").lower() in ["completed", "verified"]:
                    is_open = False
            
            if is_open:
                open_decisions.append({
                    "id": d.id,
                    "description": d.description,
                    "lifecycle_history": d.lifecycle_history
                })
    
    return {
        "user_name": user_name,
        "total_meetings": total_meetings,
        "average_talk_time_seconds": round(average_talk_time_seconds, 2),
        "total_questions_asked": total_questions,
        "global_tasks_completed_percentage": round(tasks_completed_percentage, 2),
        "tasks_summary": {
            "total": total_tasks,
            "completed": completed_tasks
        },
        "open_decisions": open_decisions
    }

@router.get("/compare")
def compare_meetings(
    meeting_a: uuid.UUID = Query(..., description="ID of first meeting"),
    meeting_b: uuid.UUID = Query(..., description="ID of second meeting"),
    session: Session = Depends(get_sync_session)
):
    """
    Calculates and returns the mathematical deltas between two meetings.
    """
    m_a = session.get(Meeting, meeting_a)
    m_b = session.get(Meeting, meeting_b)
    
    if not m_a or not m_b:
        raise HTTPException(status_code=404, detail="One or both meetings not found")
        
    def get_metrics(m: Meeting) -> Dict[str, Any]:
        # Participation: distinct speakers in TranscriptSegment
        speakers = session.exec(
            select(TranscriptSegment.speaker).where(TranscriptSegment.meeting_id == m.id).distinct()
        ).all()
        participation = len(speakers)
        
        # Risks
        risks = len(m.intelligence.risks) if m.intelligence and m.intelligence.risks else 0
        
        # Tasks
        tasks = len(m.action_items) if m.action_items else 0
        
        # Health
        health = m.intelligence.health_score if m.intelligence and m.intelligence.health_score else 0
        
        return {
            "id": str(m.id),
            "title": m.title,
            "participation": participation,
            "risks": risks,
            "tasks": tasks,
            "health": health
        }
        
    metrics_a = get_metrics(m_a)
    metrics_b = get_metrics(m_b)
    
    def calc_delta(a: float, b: float) -> Dict[str, Any]:
        diff = b - a
        if a == 0:
            pct = 100.0 if b > 0 else 0.0
        else:
            pct = (diff / a) * 100.0
        return {
            "value_a": a,
            "value_b": b,
            "delta": diff,
            "percentage": round(pct, 1)
        }
        
    return {
        "meeting_a": metrics_a,
        "meeting_b": metrics_b,
        "comparison": {
            "participation": calc_delta(metrics_a["participation"], metrics_b["participation"]),
            "risks": calc_delta(metrics_a["risks"], metrics_b["risks"]),
            "tasks": calc_delta(metrics_a["tasks"], metrics_b["tasks"]),
            "health": calc_delta(metrics_a["health"], metrics_b["health"])
        }
    }
