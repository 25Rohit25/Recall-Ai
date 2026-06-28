# 🔥 FireNotes AI 

> The Premium, Next-Generation Meeting Intelligence Platform.

FireNotes AI transforms mundane meeting recordings into highly interactive, synchronized workspaces powered by an AI-driven Intelligence Engine. Experience seamless media playback bound directly to speaker transcripts, intelligent action item extraction, and instantaneous knowledge search—all wrapped in an elite, enterprise-grade dark mode aesthetic.

![FireNotes AI Workspace](https://via.placeholder.com/1200x600/020617/8B5CF6?text=FireNotes+AI+Workspace)

---

## ✨ Elite Features

- **Bidirectional Media Sync:** Click any transcript segment to instantly seek the media player to that exact timestamp. The transcript automatically scrolls and highlights the active speaker as the media plays.
- **Unified Intelligence Schema:** A normalized, JSON1-powered SQLite database that natively models transcripts, key decisions, risks, and health scores to provide unparalleled query speed and structure.
- **Global Command Palette:** Instantly access any feature using `Ctrl+K`. Search your meeting history, jump to action items, or invoke the AI Copilot without touching your mouse.
- **AI Copilot & Intelligence Panel:** An interactive sidebar offering immediate executive summaries, health scores, and an interactive prompt interface to interrogate your meeting data.
- **One-Click Markdown Export:** Seamlessly compile the entire meeting—including checked tasks, health scores, and the timestamped transcript—into a structured Markdown document.
- **Enterprise Dark Mode:** "Style Decoupled" aesthetic mimicking the top-tier SaaS DNA (slate gradients, glassmorphism, fluid typography, and premium scrollbars).

---

## 🏗️ Architecture Overview

FireNotes AI is built on a highly decoupled, cloud-native architecture optimized for zero N+1 queries and blazing-fast edge rendering.

### 1. The Backend (FastAPI + SQLModel)
- **Engine:** Python 3.11 with FastAPI.
- **Database:** SQLite leveraging the `JSON1` extension for highly optimized array modeling (Transcript Segments & Action Items) without the overhead of massive junction tables.
- **Data Flow:** Fully asynchronous SQLAlchemy `async_session` utilizing `selectinload` to eagerly fetch multi-relational intelligence schemas in a single trip.
- **Validation:** Strict Pydantic v2 parsing guarantees type safety between the ORM and the JSON API.

### 2. The Frontend (Next.js + Zustand)
- **Framework:** Next.js 15 App Router utilizing Tailwind CSS v4.
- **State Management:** Zustand manages the high-frequency UI mutations (like `currentTime` for video sync) with O(1) performance overhead, completely decoupled from React context waterfalls.
- **Data Fetching:** TanStack Query (React Query v5) caches the REST API payload for snappy, optimistic UI rendering.
- **Containerization:** Built utilizing Next.js `standalone` output, drastically reducing the Docker image footprint.

---

## 🚀 Getting Started

Deploying FireNotes AI locally is fully containerized and takes seconds.

### Prerequisites
- Docker & Docker Compose installed.

### Spin up the Application

1. Clone the repository and navigate to the root directory.
2. Build and start the containers in detached mode:

```bash
docker-compose up -d --build
```

3. **Access the Backend API Docs (Swagger UI):**  
   👉 [http://localhost:8000/docs](http://localhost:8000/docs)
4. **Access the Frontend Application:**  
   👉 [http://localhost:3000](http://localhost:3000)

### Troubleshooting
- If no meetings appear, ensure you have run the backend seed script locally or against the mounted volume to populate the `firenotes.db` file with mock meeting intelligence.
- To shut down the environment, run: `docker-compose down`.

---

*Architected for speed. Designed for intelligence. Engineered for scale.*
