import asyncio
import random
import uuid
from datetime import datetime, timedelta, timezone
from typing import List

from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import AsyncSessionLocal
from app.models import (
    Meeting, Participant, MeetingParticipant, TranscriptSegment,
    MeetingSummary, Topic, ActionItem, Tag, MeetingTag
)

# Realistic Seed Data Banks
PARTICIPANT_NAMES = ["Alice Smith", "Bob Jones", "Charlie Davis", "Diana Prince", "Evan Wright", "Fiona Gallagher", "George Lucas", "Hannah Abbott", "Ian Malcolm", "Julia Roberts"]
DEPARTMENTS = ["Engineering", "Sales", "Marketing", "Product", "Executive"]
MEETING_TYPES = ["Q3 Roadmap Planning", "Sprint Retrospective", "Client Sync: Acme Corp", "Design System Review", "All Hands", "1:1 Sync"]

TRANSCRIPT_SENTENCES = [
    "I think we need to pivot our strategy for Q3.",
    "Can you share the screen so we can look at the metrics?",
    "The deployment went out smoothly last night.",
    "We are seeing a 15% increase in churn this month.",
    "Let's assign this to the backend team.",
    "I'll follow up with the client regarding the new requirements.",
    "Are we still on track for the Friday release?",
    "The new UI feels much faster now.",
    "I'll take the action item to draft the architecture document.",
    "We need to schedule a follow up next week."
]

async def seed_data():
    async with AsyncSessionLocal() as db:
        print("Starting Seed Generation...")
        
        # 1. Create Tags
        tags = [Tag(name=dept, color=f"#{random.randint(0, 0xFFFFFF):06x}") for dept in DEPARTMENTS]
        db.add_all(tags)
        await db.commit()
        
        # 2. Create 60 Participants
        participants = []
        for i in range(60):
            name = random.choice(PARTICIPANT_NAMES) + f" {i}"
            email = f"{name.lower().replace(' ', '.')}@example.com"
            p = Participant(full_name=name, email=email, color=f"#{random.randint(0, 0xFFFFFF):06x}")
            participants.append(p)
        db.add_all(participants)
        await db.commit()
        
        # 3. Create 12 Meetings
        for m_idx in range(12):
            meeting_date = datetime.now(timezone.utc) - timedelta(days=random.randint(1, 30))
            duration = random.randint(1800, 3600) # 30 to 60 mins
            
            meeting = Meeting(
                title=random.choice(MEETING_TYPES),
                description=f"Generated Meeting #{m_idx+1}",
                duration=duration,
                meeting_date=meeting_date,
                transcript_status="completed",
                summary_status="completed"
            )
            db.add(meeting)
            await db.commit()
            
            # Attach Tags
            db.add(MeetingTag(meeting_id=meeting.id, tag_id=random.choice(tags).id))
            
            # 4. Attach 5 Participants per Meeting
            meeting_participants = random.sample(participants, 5)
            for p in meeting_participants:
                db.add(MeetingParticipant(
                    meeting_id=meeting.id, 
                    participant_id=p.id, 
                    role=random.choice(["owner", "attendee"]),
                    speaking_time=random.randint(0, 600)
                ))
            
            # 5. Generate 100 Transcript Segments per meeting (1200 total)
            current_time = 0.0
            for s_idx in range(100):
                speaker = random.choice(meeting_participants)
                text = random.choice(TRANSCRIPT_SENTENCES)
                
                segment = TranscriptSegment(
                    meeting_id=meeting.id,
                    speaker_id=speaker.id,
                    transcript_text=text,
                    search_text=text.lower(),
                    start_time=current_time,
                    end_time=current_time + 5.0,
                    word_count=len(text.split()),
                    sequence_number=s_idx
                )
                db.add(segment)
                current_time += 6.0
                
            # 6. Generate Summary
            summary = MeetingSummary(
                meeting_id=meeting.id,
                executive_summary="This was a highly productive meeting covering key Q3 metrics.",
                detailed_summary="The team discussed the upcoming release and assigned action items.",
                decision_summary="We decided to proceed with the redesign.",
                risks="Potential delay in QA testing.",
                next_steps="Follow up on Friday.",
                ai_model_used="gpt-4o",
                token_count=1250,
                generation_duration=4.2
            )
            db.add(summary)
            
            # 7. Generate Topics (approx 3 per meeting)
            for t_idx in range(3):
                db.add(Topic(
                    meeting_id=meeting.id,
                    title=f"Topic {t_idx+1}",
                    short_summary="A brief discussion on the topic.",
                    start_time=t_idx * 600.0,
                    end_time=(t_idx + 1) * 600.0,
                    sequence=t_idx
                ))
                
            # 8. Generate 10 Action Items per meeting
            for a_idx in range(10):
                db.add(ActionItem(
                    meeting_id=meeting.id,
                    assignee_id=random.choice(meeting_participants).id,
                    task=f"Follow up on task {a_idx+1}",
                    priority=random.choice(["low", "medium", "high"]),
                    status=random.choice(["open", "in_progress", "completed"]),
                    due_date=datetime.now(timezone.utc) + timedelta(days=7)
                ))
            
            await db.commit()
            print(f"Generated Meeting {m_idx+1}/12")

        print("Successfully generated: 12 Meetings, 60 Participants, 1200 Transcripts, 12 Summaries, 120 Action Items.")

if __name__ == "__main__":
    asyncio.run(seed_data())
