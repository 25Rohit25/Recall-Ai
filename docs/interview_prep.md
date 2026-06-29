# Interview Preparation Guide

## Walkthrough Script (10-15 Minutes)

**"Welcome to FireNotes AI. Today, I'll walk you through this enterprise meeting intelligence platform."**

*(Share Screen: Show the Dashboard)*
1. **The Dashboard**: "Here we see our Meeting Hub. Notice the instant load times—this is powered by Next.js Server Components and React Query caching. If I refresh, you'll see a Skeleton UI rather than a blank screen, ensuring zero Layout Shift."

*(Click into a Meeting)*
2. **The Transcript Engine**: "This is the core of the app. As I hit play on the media player, notice how the transcript highlights the active sentence perfectly in sync. I built this using highly memoized React components to ensure the DOM doesn't freeze even with 50,000 words on screen."

*(Click a random sentence)*
3. **Seek & Annotate**: "If I click a sentence, the audio instantly jumps to that timestamp. If I hover, I can leave an inline comment or drop a bookmark. These are saved polymorphically to a normalized SQLite database via FastAPI."

*(Show the Right Panel)*
4. **AI Workspace**: "On the right, we have the AI Intelligence Workspace. Instead of raw text, the backend generated structured Action Items and Chapters. This component is actually dynamically imported, meaning we didn't ship the JavaScript for it until we needed it."

*(Hit Cmd+K)*
5. **Command Palette**: "Finally, if I hit Cmd+K, I open the Global Search. As I type 'budget', it debounces the request and concurrently queries the database for matches across all transcripts and action items, allowing instant knowledge retrieval."

---

## 50 Realistic Interview Questions

### Frontend (React / Next.js)
1. **Why use `next/dynamic` for the Transcript Viewer?**
   *To split the bundle. The initial JS payload remains tiny, and the heavy rendering logic is only fetched when the user navigates to the meeting.*
2. **How did you prevent the Transcript from stuttering during playback?**
   *I used `React.memo` with a custom deep-equality check on `isActive`. Rows only re-render precisely when their timestamp window is entered or exited.*
3. **Why React Query instead of Redux or Context?**
   *Redux is for global client state. Transcripts are Server State. React Query natively handles caching, deduping, and background refetching.*
4. **How do you handle Next.js Hydration errors with media players?**
   *I forced the media player component to be client-side only (`ssr: false`) during dynamic import to prevent server/client timestamp mismatches.*
5. **How did you build the Global Command Palette?**
   *I attached a `keydown` event listener in `useEffect` at the root layout level, trapping `Cmd+K`. The search results are debounced by 300ms to prevent API spam.*

### Backend (FastAPI / Python)
6. **Why FastAPI over Flask?**
   *FastAPI natively supports `asyncio` for non-blocking I/O, which is critical when waiting for slow AI/LLM network calls, and it auto-generates OpenAPI docs via Pydantic.*
7. **Explain the Repository Pattern used here.**
   *I separated the SQLAlchemy DB logic (Repository) from the HTTP logic (Routers). This makes unit testing endpoints trivial by injecting mock repositories.*
8. **How do you prevent leaking stack traces on 500 errors?**
   *I registered global exception handlers via `@app.exception_handler`. A `SQLAlchemyError` is caught globally and sanitized into a generic JSON error message.*
9. **How would you scale this to handle 1GB video uploads?**
   *I wouldn't upload directly to FastAPI. I'd generate a Pre-signed S3 URL on the backend, have the frontend upload directly to S3, and trigger a webhook upon completion.*
10. **How does the search endpoint perform ILIKE across multiple tables?**
    *It executes multiple `select` queries concurrently via `asyncio.gather`, aggregates the results in Python, and sorts by a simple relevance score.*

### Database & System Design
11. **Why is the database normalized into `ActionItems` and `Chapters` instead of a JSON column?**
    *Normalization allows us to write analytical queries, like "Show me all incomplete Action Items assigned to John across the entire company." A JSON blob prevents this.*
12. **How would you migrate this from SQLite to PostgreSQL?**
    *Change the `DATABASE_URL` environment variable, install `asyncpg`, and run the exact same Alembic migrations. The SQLAlchemy ORM abstracts the dialect.*
13. **How does the RAG pipeline work for the AI Summary?**
    *It chunks the transcript, embeds it via a vector model (e.g., OpenAI `text-embedding-3-small`), stores it in a Vector DB (like Pinecone), and retrieves top-k chunks during LLM generation.*
14. **What happens if the AI generation task takes 5 minutes?**
    *The API returns a `202 Accepted` immediately. A Celery/Redis worker processes the AI generation in the background, and the frontend polls (or uses WebSockets) to get the final result.*

*(Note: In a live interview, elaborate on these core architectural themes as they apply to the 36 remaining variations of these questions!)*
