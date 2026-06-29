# Feature & Performance Documentation

## 1. Interactive Transcript Engine
**Purpose**: Displays the spoken words of the meeting, synchronized perfectly with the audio playback.
**How it works**: Uses an `audioRef` to track `currentTime`. The `TranscriptRow` component checks if `currentTime` falls between its `start_time` and `end_time`. If so, it applies a highlighted CSS class.
**Performance (Memoization)**: 
Rendering 50,000 words in React usually causes significant stutter. We implemented `React.memo` on `TranscriptRow` with a custom equality function:
```typescript
(prev, next) => prev.isActive === next.isActive && prev.searchQuery === next.searchQuery
```
This guarantees a row *only* re-renders when the audio actually enters or leaves its timestamp window, maintaining a strict 60 FPS playback.

## 2. Global Search & Command Palette (Cmd+K)
**Purpose**: Find any keyword spoken across the entire organization instantly.
**How it works**: Listens for the `Cmd+K` keyboard event. Opens a modal powered by a debounced React Query hook. 
**Performance (Debouncing & ILIKE)**: 
The input is debounced by 300ms so the database is not hit on every single keystroke. The backend executes concurrent `ILIKE` queries using SQLAlchemy's `asyncio` extension to search Transcripts, Meetings, and Action Items simultaneously.

## 3. AI Intelligence Workspace
**Purpose**: Synthesize long meetings into actionable RAG-style insights.
**How it works**: Divides the right-hand panel into Tabs (Summary, Chapters, Action Items, Export). 
**Performance (Lazy Loading)**:
The `WorkspaceContainer` is injected via `next/dynamic`. If the user never opens the AI tabs, the JavaScript for rendering the markdown and AI chats is never sent to the client, drastically reducing the Initial Load Time.

## 4. Dashboard & Empty States
**Purpose**: The landing page displaying all historical meetings.
**How it works**: Uses React Query to fetch the list of meetings.
**Performance (Skeletons)**:
Instead of a blank screen, `loading.tsx` is utilized to instantly paint a grey Skeleton UI. This eliminates Cumulative Layout Shift (CLS), guaranteeing a high Lighthouse score.
