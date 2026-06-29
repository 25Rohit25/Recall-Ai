import asyncio
from datetime import datetime, timezone, timedelta
from database import async_engine, create_tables
from sqlmodel.ext.asyncio.session import AsyncSession
from models import Meeting, MeetingIntelligence, TranscriptSegment, ActionItem, MeetingStatus

async def seed():
    await create_tables()
    
    async with AsyncSession(async_engine) as session:
        # Check if already seeded
        # ...
        
        m1 = Meeting(
            title="Weekly Engineering Sync",
            duration=3600,
            date=datetime.now(timezone.utc) - timedelta(days=2),
            participants=["Alice", "Bob", "Charlie"],
            status=MeetingStatus.completed
        )
        session.add(m1)
        await session.commit()
        await session.refresh(m1)

        intel1 = MeetingIntelligence(
            meeting_id=m1.id,
            overview="The team discussed the upcoming Q3 roadmap, specifically focusing on the new API gateway migration. Bob raised concerns about backward compatibility, but Charlie confirmed that versioning will handle legacy clients.",
            topics=["API Gateway", "Q3 Roadmap", "Legacy Systems"],
            health_score=92
        )
        session.add(intel1)

        segments1 = [
            ("Alice", 0.0, 5.5, "Alright team, let's get started. Today we need to lock in the Q3 roadmap."),
            ("Alice", 5.5, 12.0, "Specifically, I want to talk about the API gateway migration."),
            ("Bob", 12.5, 20.0, "I'm a bit concerned about backward compatibility for our enterprise clients if we switch the routing logic now."),
            ("Charlie", 20.5, 28.0, "We've already accounted for that. The v1 endpoints will remain untouched and routed through the legacy load balancer until December."),
            ("Alice", 28.5, 35.0, "Great. Bob, can you review the routing rules Charlie drafted by end of week?"),
            ("Bob", 35.5, 38.0, "Will do. I'll have it reviewed by Friday.")
        ]
        
        for spk, start, end, txt in segments1:
            session.add(TranscriptSegment(meeting_id=m1.id, speaker=spk, start_time=start, end_time=end, text=txt))

        session.add(ActionItem(meeting_id=m1.id, task="Review routing rules draft", owner="Bob", status="pending", is_completed=False))
        
        m2 = Meeting(
            title="Design Review: Dashboard UI",
            duration=2400,
            date=datetime.now(timezone.utc) - timedelta(days=5),
            participants=["Alice", "Diana"],
            status=MeetingStatus.completed
        )
        session.add(m2)
        await session.commit()
        await session.refresh(m2)

        intel2 = MeetingIntelligence(
            meeting_id=m2.id,
            overview="Reviewed the new dashboard UI designs. The layout needs more contrast for accessibility. Diana will revise the color palette.",
            topics=["UI/UX", "Accessibility", "Color Palette"],
            health_score=85
        )
        session.add(intel2)

        segments2 = [
            ("Diana", 0.0, 8.0, "So here is the updated dashboard layout. I've moved the metrics to the top."),
            ("Alice", 8.5, 15.0, "I like the placement, but the contrast on the grey text is a bit too low. It might fail accessibility checks."),
            ("Diana", 15.5, 22.0, "Good point. I'll darken the text and increase the font weight slightly on the labels."),
            ("Alice", 22.5, 25.0, "Awesome, thanks.")
        ]
        
        for spk, start, end, txt in segments2:
            session.add(TranscriptSegment(meeting_id=m2.id, speaker=spk, start_time=start, end_time=end, text=txt))

        session.add(ActionItem(meeting_id=m2.id, task="Revise color palette for accessibility", owner="Diana", status="pending", is_completed=False))

        await session.commit()
        print("Database seeded successfully with assignment-compliant models!")

if __name__ == "__main__":
    asyncio.run(seed())
