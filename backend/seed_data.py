import asyncio
import os
import uuid
from datetime import datetime, timezone, timedelta
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel
from sqlalchemy import text

from database import create_tables, async_engine
from models import Meeting, MeetingStatus, MeetingIntelligence, TranscriptSegment, ActionItem, Decision

async def seed():
    print("Creating tables and FTS5...")
    await create_tables()
    
    async_session = sessionmaker(async_engine, class_=AsyncSession, expire_on_commit=False)
    
    meetings_data = [
        {
            "title": "Q3 Product Roadmap Review",
            "participants": ["Sarah (PM)", "John (Eng)", "Mike (Design)"],
            "date": datetime.now(timezone.utc) - timedelta(days=2),
            "duration": 45 * 60,
            "status": MeetingStatus.completed,
            "intelligence": {
                "overview": "The team discussed the upcoming Q3 product roadmap, focusing heavily on integrating the new LLM features into the core platform. Sarah highlighted the need to finalize the UI designs by next week, while John raised concerns about API rate limits. The meeting concluded with a clear path forward for the alpha release.",
                "risks": ["Potential delays in UI sign-off", "API costs might exceed projections"],
                "topics": ["Q3 Roadmap", "AI Integration", "UI/UX", "API Limits"],
                "health_score": 85
            },
            "action_items": [
                {"task": "Finalize UI designs for the AI Copilot", "owner": "Mike", "is_completed": False},
                {"task": "Investigate Anthropic rate limit increases", "owner": "John", "is_completed": True},
                {"task": "Schedule alpha testing sessions with top 5 clients", "owner": "Sarah", "is_completed": False}
            ],
            "decisions": [
                "Launch the AI Copilot in beta to all enterprise users in Q3.",
                "Backend will transition from REST to GraphQL for the new features."
            ],
            "transcript": [
                ("Sarah (PM)", "Alright team, let's kick off the Q3 roadmap review. The main focus is the new AI Copilot."),
                ("John (Eng)", "I've been looking at the LLM integration. We need to be careful with API rate limits if we roll this out to everyone."),
                ("Mike (Design)", "From a UX perspective, we have wireframes ready. I just need final approval on the chat interface."),
                ("Sarah (PM)", "Let's aim to finalize those designs by next week. Can you set up a review session, Mike?"),
                ("Mike (Design)", "Will do. I'll send an invite for Tuesday."),
                ("John (Eng)", "Regarding the backend, I strongly suggest we move to GraphQL for these new components to handle the complex state better."),
                ("Sarah (PM)", "I agree. Let's make that a formal decision for Q3. What about the API limits?"),
                ("John (Eng)", "I'll reach out to Anthropic and OpenAI to see about enterprise tier limits and cost projections."),
                ("Sarah (PM)", "Perfect. I want to make sure we're ready for an alpha test next month."),
                ("Mike (Design)", "Do we have a list of clients for the alpha?"),
                ("Sarah (PM)", "Not yet. I'll take the action item to schedule sessions with our top 5 enterprise clients."),
                ("John (Eng)", "Sounds like a solid plan. Are we still supporting the legacy notes feature?"),
                ("Sarah (PM)", "Yes, but it won't get any new updates. All resources are on the Copilot."),
                ("Mike (Design)", "I'll make sure the legacy feature is still accessible but deprioritized in the nav."),
                ("John (Eng)", "One more thing, I need DevOps support for the new staging environment."),
                ("Sarah (PM)", "I'll sync with Dave from DevOps to get you what you need."),
                ("Mike (Design)", "Awesome. I'm excited about this release."),
                ("John (Eng)", "Me too, it's going to be a game changer."),
                ("Sarah (PM)", "Alright, thanks everyone. Let's get to work!"),
                ("Mike (Design)", "See you Tuesday for the design review.")
            ]
        },
        {
            "title": "Engineering Sprint Retrospective",
            "participants": ["David (Lead)", "Eve (Backend)", "Frank (Frontend)"],
            "date": datetime.now(timezone.utc) - timedelta(days=5),
            "duration": 30 * 60,
            "status": MeetingStatus.completed,
            "intelligence": {
                "overview": "The engineering team reviewed Sprint 42. Highlights included completing the new authentication flow ahead of schedule. However, CI/CD pipeline issues caused delays. The team decided to dedicate 20% of the next sprint to tech debt and infrastructure improvements.",
                "risks": ["CI/CD pipeline instability", "Burnout from context switching"],
                "topics": ["Sprint 42", "Auth Flow", "CI/CD", "Tech Debt"],
                "health_score": 72
            },
            "action_items": [
                {"task": "Refactor GitHub Actions deployment script", "owner": "Eve", "is_completed": False},
                {"task": "Document new auth flow for the API consumers", "owner": "Frank", "is_completed": False}
            ],
            "decisions": [
                "Allocate 20% of Sprint 43 to addressing tech debt.",
                "Move to a monorepo structure for frontend packages."
            ],
            "transcript": [
                ("David (Lead)", "Welcome to the Sprint 42 retro. Let's start with what went well."),
                ("Eve (Backend)", "The new OAuth flow is deployed and working great. We finished it two days early."),
                ("Frank (Frontend)", "Yeah, the frontend integration was super smooth. The new token management is much cleaner."),
                ("David (Lead)", "Great job on that. What didn't go so well?"),
                ("Eve (Backend)", "The CI/CD pipeline broke three times this week. It cost us at least a day of productivity."),
                ("Frank (Frontend)", "Agreed. Waiting 45 minutes for a build to fail because of a flaky test is painful."),
                ("David (Lead)", "Okay, we need to fix this. Eve, can you look into refactoring the GitHub Actions scripts?"),
                ("Eve (Backend)", "Yes, I can take that on. We need to cache the node_modules better."),
                ("David (Lead)", "Let's also make a decision to allocate 20% of our next sprint purely to tech debt and infra."),
                ("Frank (Frontend)", "I love that idea. I want to look into moving our frontend packages to a monorepo."),
                ("David (Lead)", "Let's do it. Monorepo it is. Any other action items?"),
                ("Frank (Frontend)", "We need to document the new auth flow for the mobile team."),
                ("David (Lead)", "Can you handle the documentation, Frank?"),
                ("Frank (Frontend)", "Sure, I'll write it up tomorrow."),
                ("Eve (Backend)", "I'll review it once it's done."),
                ("David (Lead)", "Awesome. I feel good about this upcoming sprint. We're tackling the right problems."),
                ("Eve (Backend)", "Definitely. Reducing pipeline time will be a huge win."),
                ("Frank (Frontend)", "I'll start researching Turborepo for the frontend setup."),
                ("David (Lead)", "Sounds good. See you all at standup tomorrow."),
                ("Eve (Backend)", "Bye everyone!")
            ]
        },
        {
            "title": "Sales Pipeline Review — Enterprise",
            "participants": ["Grace (VP Sales)", "Heidi (AE)", "Ivan (AE)"],
            "date": datetime.now(timezone.utc) - timedelta(days=1),
            "duration": 60 * 60,
            "status": MeetingStatus.completed,
            "intelligence": {
                "overview": "Weekly review of the enterprise sales pipeline. Heidi is close to closing the Acme Corp deal but needs a final security review. Ivan is struggling to get traction with Globex. Decided to offer a 10% discount to Acme Corp to accelerate signing.",
                "risks": ["Acme Corp deal slipping to next quarter", "Globex might churn to competitor"],
                "topics": ["Pipeline", "Acme Corp", "Globex", "Security Review", "Discounts"],
                "health_score": 88
            },
            "action_items": [
                {"task": "Schedule security review call with Acme Corp CISO", "owner": "Heidi", "is_completed": True},
                {"task": "Draft competitive battlecard against Competitor X for Globex", "owner": "Ivan", "is_completed": False},
                {"task": "Approve 10% discount for Acme Corp", "owner": "Grace", "is_completed": False}
            ],
            "decisions": [
                "Offer a 10% discount to Acme Corp to close the deal this month."
            ],
            "transcript": [
                ("Grace (VP Sales)", "Let's run through the enterprise pipeline. Heidi, how is Acme Corp looking?"),
                ("Heidi (AE)", "Really good. We have verbal agreement from the VP of Engineering, but their CISO wants a final security review."),
                ("Grace (VP Sales)", "Do we have our SOC2 report ready to send over?"),
                ("Heidi (AE)", "Yes, I sent it yesterday. We just need a 30-minute call to go over their questionnaire."),
                ("Grace (VP Sales)", "Get that scheduled ASAP. I don't want this slipping into next quarter."),
                ("Heidi (AE)", "I'll get it on the calendar for tomorrow. They also asked if there's any wiggle room on pricing."),
                ("Grace (VP Sales)", "If they sign by Friday, I'll approve a 10% discount. Use that as leverage."),
                ("Heidi (AE)", "Perfect, that should get it across the line."),
                ("Grace (VP Sales)", "Ivan, what's happening with Globex? They've been stalled for weeks."),
                ("Ivan (AE)", "They are evaluating Competitor X alongside us. They think the competitor has better reporting features."),
                ("Grace (VP Sales)", "We beat them on integrations and ease of use. You need to hammer those points home."),
                ("Ivan (AE)", "I know, but their procurement team is very feature-checklist focused."),
                ("Grace (VP Sales)", "I want you to draft a competitive battlecard against Competitor X specifically for this account."),
                ("Ivan (AE)", "Will do. I'll highlight our CRM integrations."),
                ("Grace (VP Sales)", "Let's try to get an executive sponsor on the line next week. I can join the call."),
                ("Ivan (AE)", "That would be great, I'll propose some times to them."),
                ("Grace (VP Sales)", "Overall pipeline looks healthy, but we need to push these late-stage deals over the line."),
                ("Heidi (AE)", "Agreed. I'm focusing 100% on Acme this week."),
                ("Ivan (AE)", "And I'll work on the Globex strategy."),
                ("Grace (VP Sales)", "Great. Let's catch up on Slack later if anything changes.")
            ]
        },
        {
            "title": "Design System V2 Kickoff",
            "participants": ["Judy (Lead Designer)", "Mallory (Frontend)", "Alice (Design)"],
            "date": datetime.now(timezone.utc) - timedelta(hours=5),
            "duration": 50 * 60,
            "status": MeetingStatus.completed,
            "intelligence": {
                "overview": "Kickoff meeting for version 2 of the internal design system. The goal is to move from standard CSS to Tailwind and standardize component props. Mallory emphasized the need for accessibility (a11y) from day one. Decided to build the new components in isolation using Storybook.",
                "risks": ["Migration of legacy components might take longer than expected", "Inconsistent prop naming conventions"],
                "topics": ["Design System", "Tailwind", "Accessibility", "Storybook"],
                "health_score": 92
            },
            "action_items": [
                {"task": "Set up new Storybook repository", "owner": "Mallory", "is_completed": True},
                {"task": "Audit existing components for a11y violations", "owner": "Alice", "is_completed": False},
                {"task": "Define standard color palette tokens in Tailwind config", "owner": "Judy", "is_completed": False}
            ],
            "decisions": [
                "Adopt Tailwind CSS for all new components.",
                "All components must meet WCAG AA accessibility standards before release.",
                "Build components in isolation using Storybook."
            ],
            "transcript": [
                ("Judy (Lead Designer)", "Alright, let's talk Design System V2. Our current setup is getting bloated."),
                ("Mallory (Frontend)", "I agree. The custom CSS classes are a mess to maintain. I'm strongly advocating we move to Tailwind."),
                ("Alice (Design)", "From a design perspective, Tailwind aligns well with how we think about utility tokens anyway."),
                ("Judy (Lead Designer)", "Then it's decided. We adopt Tailwind. But how do we handle the migration?"),
                ("Mallory (Frontend)", "We shouldn't try to migrate everything at once. Let's build V2 in isolation using Storybook."),
                ("Judy (Lead Designer)", "I like that. We can release components one by one."),
                ("Alice (Design)", "One thing I want to push for is accessibility. V1 was terrible for screen readers."),
                ("Mallory (Frontend)", "Absolutely. We need to mandate WCAG AA compliance for every new component."),
                ("Judy (Lead Designer)", "Agreed. Alice, can you audit our existing components to see where we fail worst on a11y?"),
                ("Alice (Design)", "Yes, I'll start a spreadsheet with the violations."),
                ("Mallory (Frontend)", "I'll get the new Storybook repo set up and configured with Tailwind today."),
                ("Judy (Lead Designer)", "And I'll work on mapping our Figma color variables to the new Tailwind config."),
                ("Alice (Design)", "Make sure we include robust focus states this time."),
                ("Judy (Lead Designer)", "Definitely. Focus rings will be baked into the base interactive component."),
                ("Mallory (Frontend)", "What about icons? Are we sticking with Lucide?"),
                ("Judy (Lead Designer)", "Yes, Lucide has been great. Let's keep it."),
                ("Alice (Design)", "I'll make sure the Figma library uses the latest Lucide SVGs."),
                ("Mallory (Frontend)", "Awesome. I think this is going to make development so much faster once it's done."),
                ("Judy (Lead Designer)", "Short term pain for long term gain. Let's get to it!"),
                ("Alice (Design)", "Thanks everyone, talk soon.")
            ]
        },
        {
            "title": "Investor Update — Series B Prep",
            "participants": ["Charlie (CEO)", "Dave (CFO)"],
            "date": datetime.now(timezone.utc) - timedelta(days=10),
            "duration": 40 * 60,
            "status": MeetingStatus.completed,
            "intelligence": {
                "overview": "Strategic discussion preparing for the upcoming Series B fundraising round. Dave presented the updated financial model, highlighting strong ARR growth but high customer acquisition costs (CAC). Charlie emphasized focusing the pitch deck on the new AI capabilities as the primary growth driver.",
                "risks": ["High CAC might worry conservative investors", "Macroeconomic environment tightening"],
                "topics": ["Series B", "Fundraising", "Financial Model", "ARR", "CAC", "Pitch Deck"],
                "health_score": 78
            },
            "action_items": [
                {"task": "Finalize Q2 financial metrics slide", "owner": "Dave", "is_completed": True},
                {"task": "Draft narrative for the AI product vision", "owner": "Charlie", "is_completed": False},
                {"task": "Create list of top 20 target VC firms", "owner": "Dave", "is_completed": False}
            ],
            "decisions": [
                "Target a $30M raise for the Series B.",
                "Position the company as an AI-first platform rather than a traditional SaaS."
            ],
            "transcript": [
                ("Charlie (CEO)", "Dave, let's review where we are with the Series B prep. How does the model look?"),
                ("Dave (CFO)", "Our ARR growth is strong. We hit $5M ARR last month, which puts us in a great spot."),
                ("Charlie (CEO)", "That's fantastic. But what about burn rate?"),
                ("Dave (CFO)", "Burn is manageable, but our Customer Acquisition Cost (CAC) has crept up significantly this quarter."),
                ("Charlie (CEO)", "Investors are going to grill us on that. We need a good narrative around why CAC is high."),
                ("Dave (CFO)", "We can point to the aggressive marketing spend we did in April, which hasn't fully matured into closed deals yet."),
                ("Charlie (CEO)", "Okay. More importantly, the pitch deck needs to scream 'AI'. That's what VCs are funding right now."),
                ("Dave (CFO)", "Agreed. We should position ourselves as an AI-first platform, not just another SaaS tool."),
                ("Charlie (CEO)", "Exactly. I'll take the pen on drafting the narrative for the product vision slide."),
                ("Dave (CFO)", "I'll finalize the Q2 financial metrics slide so you have the hard numbers."),
                ("Charlie (CEO)", "How much should we target for the raise?"),
                ("Dave (CFO)", "Given our growth and the current market multiples, I think we should target $30M."),
                ("Charlie (CEO)", "Wow, $30M. That gives us a lot of runway. Let's make that the official target."),
                ("Dave (CFO)", "I'll start building a list of the top 20 target VC firms we should approach."),
                ("Charlie (CEO)", "Make sure Sequoia and Andreessen are at the top of that list."),
                ("Dave (CFO)", "Will do. I'll have the list ready for review by Monday."),
                ("Charlie (CEO)", "This is going to be a grueling process, but I think we have a great story to tell."),
                ("Dave (CFO)", "The numbers back it up. We just need to nail the pitch."),
                ("Charlie (CEO)", "Alright, let's keep refining. Talk tomorrow."),
                ("Dave (CFO)", "Have a good evening, Charlie.")
            ]
        }
    ]

    async with async_session() as session:
        for data in meetings_data:
            meeting = Meeting(
                title=data["title"],
                participants=data["participants"],
                date=data["date"],
                duration=data["duration"],
                status=data["status"]
            )
            session.add(meeting)
            await session.commit()
            
            # Add intelligence
            intel = MeetingIntelligence(
                meeting_id=meeting.id,
                overview=data["intelligence"]["overview"],
                risks=data["intelligence"]["risks"],
                topics=data["intelligence"]["topics"],
                health_score=data["intelligence"]["health_score"]
            )
            session.add(intel)
            
            # Add action items
            for ai in data["action_items"]:
                session.add(ActionItem(
                    meeting_id=meeting.id,
                    task=ai["task"],
                    owner=ai["owner"],
                    status="pending",
                    is_completed=ai["is_completed"]
                ))
                
            # Add decisions
            for dec in data["decisions"]:
                session.add(Decision(
                    meeting_id=meeting.id,
                    description=dec
                ))
                
            # Add transcript segments
            current_time = 0.0
            segments = []
            for speaker, text_content in data["transcript"]:
                seg = TranscriptSegment(
                    meeting_id=meeting.id,
                    speaker=speaker,
                    start_time=current_time,
                    end_time=current_time + 15.0,
                    text=text_content
                )
                session.add(seg)
                segments.append(seg)
                current_time += 15.0
                
            await session.commit()
            
            # Add to FTS5
            for seg in segments:
                await session.execute(text(
                    "INSERT INTO fts_transcript_segments(id, meeting_id, text, speaker) VALUES (:id, :meeting_id, :text, :speaker)"
                ), {"id": seg.id, "meeting_id": str(seg.meeting_id), "text": seg.text, "speaker": seg.speaker})
            
            await session.commit()
            print(f"Seeded meeting: {meeting.title}")

if __name__ == "__main__":
    asyncio.run(seed())
