"""
Why it exists: Validates the integrity of our SQLAlchemy models, checking cascades, soft deletes, and relationship bindings using our async database test fixtures.
"""
import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Meeting, Participant, MeetingParticipant, TranscriptSegment
from app.repositories.meeting import meeting as repo_meeting
from app.repositories.participant import participant as repo_participant

@pytest.mark.asyncio
async def test_create_meeting(db_session: AsyncSession):
    """Test standard meeting creation and retrieval."""
    from datetime import datetime, timezone
    
    # 1. Create
    m = await repo_meeting.create(db_session, obj_in={
        "title": "Test Sync",
        "meeting_date": datetime.now(timezone.utc),
        "duration": 3600
    })
    assert m.id is not None
    assert m.title == "Test Sync"
    
    # 2. Retrieve
    fetched = await repo_meeting.get(db_session, m.id)
    assert fetched is not None
    assert fetched.id == m.id

@pytest.mark.asyncio
async def test_soft_delete(db_session: AsyncSession):
    """Test that a soft-deleted item no longer appears in global queries."""
    from datetime import datetime, timezone
    
    m = await repo_meeting.create(db_session, obj_in={
        "title": "To Be Deleted",
        "meeting_date": datetime.now(timezone.utc)
    })
    
    # Verify it exists
    fetched = await repo_meeting.get(db_session, m.id)
    assert fetched is not None
    
    # Soft delete it
    await repo_meeting.remove(db_session, id=m.id, soft_delete=True)
    
    # Verify it is hidden from standard queries
    hidden = await repo_meeting.get(db_session, m.id)
    assert hidden is None
    
    # Verify it still exists in the DB (hard check)
    query = select(Meeting).where(Meeting.id == m.id)
    result = await db_session.execute(query)
    raw_m = result.scalars().first()
    assert raw_m is not None
    assert raw_m.deleted_at is not None

@pytest.mark.asyncio
async def test_participant_junction_and_cascade(db_session: AsyncSession):
    """Test the M:M relationship and cascade behavior."""
    from datetime import datetime, timezone
    
    # Create Participant
    p = await repo_participant.create(db_session, obj_in={
        "full_name": "John Doe",
        "email": "john@example.com"
    })
    
    # Create Meeting
    m = await repo_meeting.create(db_session, obj_in={
        "title": "Relationship Test",
        "meeting_date": datetime.now(timezone.utc)
    })
    
    # Link them
    mp = MeetingParticipant(meeting_id=m.id, participant_id=p.id, role="owner")
    db_session.add(mp)
    
    # Add Transcript
    seg = TranscriptSegment(
        meeting_id=m.id,
        speaker_id=p.id,
        transcript_text="Hello world",
        search_text="hello world",
        start_time=0.0,
        end_time=5.0,
        sequence_number=1
    )
    db_session.add(seg)
    await db_session.commit()
    
    # Test Hard Delete Cascade
    await repo_meeting.remove(db_session, id=m.id, soft_delete=False)
    
    # Verify Transcript was cascade deleted
    query = select(TranscriptSegment).where(TranscriptSegment.meeting_id == m.id)
    res = await db_session.execute(query)
    assert res.scalars().first() is None
    
    # Verify Participant still exists (because they are just unlinked)
    surviving_p = await repo_participant.get(db_session, p.id)
    assert surviving_p is not None
