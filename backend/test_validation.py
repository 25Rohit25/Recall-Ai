import asyncio
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from sqlalchemy.orm import selectinload
from database import engine
from models import Meeting
from schemas import MeetingDetailResponse

async def run():
    async with AsyncSession(engine) as session:
        statement = select(Meeting).where(Meeting.id == "3aa30407-eeea-439e-b6e9-5742aab2e40a").options(
            selectinload(Meeting.intelligence),
            selectinload(Meeting.action_items),
            selectinload(Meeting.segments)
        )
        result = await session.exec(statement)
        m = result.first()
        
        if not m:
            print("Meeting not found")
            return
            
        try:
            resp = MeetingDetailResponse(
                id=m.id,
                title=m.title,
                date=m.date,
                duration=m.duration,
                media_url=m.media_url,
                status=m.status,
                intelligence=m.intelligence,
                action_items=m.action_items,
                transcript_segments=m.segments
            )
            print("SUCCESS")
        except Exception as e:
            print("VALIDATION ERROR:")
            print(e)

if __name__ == "__main__":
    asyncio.run(run())
