import uuid
import asyncio
from datetime import datetime, timezone, timedelta
from sqlmodel import SQLModel, create_engine, Session
from models import User, Meeting, MeetingIntelligence, TranscriptSegment, ActionItem, MeetingStatus

sqlite_url = "sqlite:///firenotes.db"
engine = create_engine(sqlite_url, echo=False)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def generate_meeting_1(session: Session, user: User):
    meeting_id = uuid.uuid4()
    meeting = Meeting(
        id=meeting_id,
        title="ReflexCube Q3 Pitch Deck Review",
        duration=3600,
        status=MeetingStatus.completed,
        date=datetime.now(timezone.utc) - timedelta(days=2)
    )
    session.add(meeting)

    intel = MeetingIntelligence(
        meeting_id=meeting_id,
        overview="Review of the Q3 pitch deck for ReflexCube investors. Focus was on ARR metrics, churn reduction strategies, and market expansion.",
        decisions=[
            "Approved slide 4 changes on user acquisition cost.",
            "Decided to remove the generic testimonials.",
            "Revised Q4 revenue projections down by 5% to be conservative."
        ],
        risks=[
            "Potential pushback on engineering headcount projections.",
            "Q4 pipeline seems light compared to Q3 close rates."
        ],
        topics=["Financials", "Product Roadmap", "Go-To-Market", "Hiring"],
        deadlines=[
            {"task": "Finalize deck", "date": "Friday 5PM"},
            {"task": "Update financial model", "date": "Thursday EOD"}
        ],
        health_score=85
    )
    session.add(intel)

    phrases = [
        "Alright, let's get started on the Q3 pitch deck.",
        "I've updated the ARR metrics on slide 3.",
        "Wait, are those numbers including the recent churn from the enterprise tier?",
        "Yes, the net retention rate is factored in.",
        "I think we need to highlight the expansion revenue more prominently.",
        "Agreed. Slide 4 has the updated CAC, but I feel it's too dense.",
        "Let's remove the generic testimonials and put the logos instead.",
        "Good call. What about the product roadmap on slide 8?",
        "The timeline for the new AI features might be too aggressive.",
        "Can we push the beta release to Q1 next year?",
        "If we do that, we need to adjust the revenue projections.",
        "Let's revise the Q4 projections down by 5% to be safe.",
        "I'm worried investors will push back on the engineering headcount.",
        "We can justify it with the new infrastructure requirements.",
        "Okay, I'll update the financial model by Thursday.",
        "And I'll finalize the deck by Friday at 5 PM."
    ]

    speakers = ["Alice (CEO)", "Bob (CFO)", "Charlie (VP Prod)"]
    
    current_time = 0.0
    for i in range(45):
        speaker = speakers[i % 3]
        text = phrases[i % len(phrases)] + f" [Segment {i}]"
        duration = len(text) * 0.1
        
        # Introduce overlapping speech
        overlap = 0.5 if i % 5 == 0 and i > 0 else 0.0
        start = max(0.0, current_time - overlap)
        end = start + duration
        
        segment = TranscriptSegment(
            meeting_id=meeting_id,
            speaker=speaker,
            start_time=start,
            end_time=end,
            text=text
        )
        session.add(segment)
        current_time = end

    session.add(ActionItem(meeting_id=meeting_id, task="Update financial model", status="pending", owner="Bob (CFO)"))
    session.add(ActionItem(meeting_id=meeting_id, task="Finalize deck", status="pending", owner="Alice (CEO)"))

def generate_meeting_2(session: Session, user: User):
    meeting_id = uuid.uuid4()
    meeting = Meeting(
        id=meeting_id,
        title="High-Throughput Event Scheduler Architecture Sync",
        duration=2700,
        status=MeetingStatus.completed,
        date=datetime.now(timezone.utc) - timedelta(days=5)
    )
    session.add(meeting)

    intel = MeetingIntelligence(
        meeting_id=meeting_id,
        overview="Architecture review for the new distributed event scheduler. Evaluated Kafka vs RabbitMQ and discussed Redis caching layers.",
        decisions=[
            "Selected Apache Kafka as the primary event bus.",
            "Adopted a hybrid Redis caching strategy for hot partitions.",
            "Decided to split the scheduler microservice into ingest and execution."
        ],
        risks=[
            "Data skew in Kafka partitions could lead to consumer lag.",
            "Redis memory eviction policies need tuning to avoid data loss."
        ],
        topics=["Architecture", "Message Brokers", "Caching", "Microservices"],
        deadlines=[
            {"task": "Draft Kafka partition strategy", "date": "Next Monday"},
            {"task": "Load test Redis configuration", "date": "Wednesday"}
        ],
        health_score=92
    )
    session.add(intel)

    phrases = [
        "Let's dive into the event scheduler architecture.",
        "We are evaluating Kafka versus RabbitMQ for the main bus.",
        "Given our throughput of 100k events/sec, Kafka is the clear winner.",
        "But what about the operational overhead of managing Zookeeper?",
        "We can use KRaft mode, which eliminates Zookeeper entirely.",
        "Okay, I'm sold on Kafka. How are we handling state?",
        "I propose a hybrid Redis caching strategy for hot partitions.",
        "We need to be careful with memory eviction policies there.",
        "Agreed. We should load test the Redis configuration thoroughly.",
        "What about the monolithic scheduler service?",
        "We should split it into an ingest service and an execution service.",
        "That will allow us to scale them independently based on load.",
        "I'll draft the Kafka partition strategy by next Monday.",
        "And I'll handle the Redis load testing by Wednesday."
    ]

    speakers = ["David (Architect)", "Eve (Backend Lead)", "Frank (DevOps)"]
    
    current_time = 0.0
    for i in range(50):
        speaker = speakers[i % 3]
        text = phrases[i % len(phrases)] + f" [Segment {i}]"
        duration = len(text) * 0.1
        
        overlap = 1.0 if i % 4 == 0 and i > 0 else 0.0
        start = max(0.0, current_time - overlap)
        end = start + duration
        
        segment = TranscriptSegment(
            meeting_id=meeting_id,
            speaker=speaker,
            start_time=start,
            end_time=end,
            text=text
        )
        session.add(segment)
        current_time = end

    session.add(ActionItem(meeting_id=meeting_id, task="Draft Kafka partition strategy", status="pending", owner="Eve (Backend Lead)"))
    session.add(ActionItem(meeting_id=meeting_id, task="Load test Redis", status="completed", owner="Frank (DevOps)"))

def generate_meeting_3(session: Session, user: User):
    meeting_id = uuid.uuid4()
    meeting = Meeting(
        id=meeting_id,
        title="Incident Post-Mortem: DB Connection Pool Exhaustion",
        duration=1800,
        status=MeetingStatus.completed,
        date=datetime.now(timezone.utc) - timedelta(days=1)
    )
    session.add(meeting)

    intel = MeetingIntelligence(
        meeting_id=meeting_id,
        overview="Post-mortem for the production outage caused by database connection pool exhaustion in the user service.",
        decisions=[
            "Implement PgBouncer for connection pooling at the database level.",
            "Set explicit timeouts on all database queries.",
            "Add alert for connection pool utilization > 80%."
        ],
        risks=[
            "Current ORM defaults might still leak connections on unhandled exceptions.",
            "Adding PgBouncer adds another network hop, potentially increasing latency slightly."
        ],
        topics=["Incident Response", "Database", "Observability", "Reliability"],
        deadlines=[
            {"task": "Deploy PgBouncer to staging", "date": "Tomorrow 10AM"},
            {"task": "Audit ORM timeout configs", "date": "Friday"}
        ],
        health_score=70
    )
    session.add(intel)

    phrases = [
        "Let's review the timeline for yesterday's outage.",
        "At 14:00 UTC, the user service started throwing 500 errors.",
        "The root cause was connection pool exhaustion on the main database.",
        "Why didn't our alerts fire before it went down?",
        "We didn't have a specific alert for connection pool utilization.",
        "That's a miss. We need an alert for utilization over 80%.",
        "How do we prevent the exhaustion in the first place?",
        "We should implement PgBouncer for better connection management.",
        "I'll deploy PgBouncer to staging tomorrow morning.",
        "We also need explicit timeouts on all database queries.",
        "Right now, some long-running queries are holding connections indefinitely.",
        "I can audit the ORM timeout configurations by Friday.",
        "Let's make sure we test the failover behavior as well."
    ]

    speakers = ["Grace (SRE)", "Heidi (Engineering Manager)", "Ivan (Backend Eng)"]
    
    current_time = 0.0
    for i in range(42):
        speaker = speakers[i % 3]
        text = phrases[i % len(phrases)] + f" [Segment {i}]"
        duration = len(text) * 0.1
        
        overlap = 0.2 if i % 3 == 0 and i > 0 else 0.0
        start = max(0.0, current_time - overlap)
        end = start + duration
        
        segment = TranscriptSegment(
            meeting_id=meeting_id,
            speaker=speaker,
            start_time=start,
            end_time=end,
            text=text
        )
        session.add(segment)
        current_time = end

    session.add(ActionItem(meeting_id=meeting_id, task="Deploy PgBouncer", status="pending", owner="Grace (SRE)"))
    session.add(ActionItem(meeting_id=meeting_id, task="Audit ORM configs", status="pending", owner="Ivan (Backend Eng)"))
    session.add(ActionItem(meeting_id=meeting_id, task="Add connection pool alert", status="completed", owner="Grace (SRE)"))

def seed():
    create_db_and_tables()
    with Session(engine) as session:
        # Check if already seeded
        existing_user = session.query(User).first()
        if existing_user:
            print("Database already seeded.")
            return

        user = User(name="Jane Doe", email="jane.doe@firenotes.ai")
        session.add(user)
        session.commit()
        session.refresh(user)

        generate_meeting_1(session, user)
        generate_meeting_2(session, user)
        generate_meeting_3(session, user)
        
        session.commit()
        print("Database seeded with 3 highly realistic meetings.")

if __name__ == "__main__":
    seed()
