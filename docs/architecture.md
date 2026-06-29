# Architecture Document: FireNotes AI

## 1. Overall Architecture Overview

FireNotes AI follows a **Three-Tier Architecture**:
1. **Presentation Layer (Frontend)**: Next.js 14 (App Router) client handling UI, interaction, and caching.
2. **Application Layer (Backend)**: FastAPI asynchronous server handling business logic, validation, and AI orchestration.
3. **Data Layer (Database)**: SQLite database accessed via SQLAlchemy 2.0 ORM.

This decoupled structure ensures that the AI processing backend can scale independently from the UI delivery servers.

---

## 2. Frontend Architecture (Next.js)

### Design Philosophy
The frontend uses **Domain-Driven Design (DDD)** via a `features/` directory architecture. Instead of organizing files by type (e.g., all hooks in one folder, all components in another), files are grouped by business domain:
- `features/meetings`
- `features/search`
- `features/workspace`

### Request Lifecycle
1. **Server Components (SSR)**: Initial page loads fetch critical layout data on the server.
2. **Client Components**: Interactive elements (Video Player, Command Palette) use `"use client"` and manage their own state.
3. **React Query**: API requests are intercepted by `@tanstack/react-query`, caching responses and preventing duplicate network requests.

---

## 3. Backend Architecture (FastAPI)

### Layered Architecture
We strictly enforce a separation of concerns:
1. **Routers (`app/api/`)**: Handle HTTP requests, parse inputs via Pydantic, and format HTTP responses. **Rule:** No business logic or database queries allowed here.
2. **Services (`app/services/`)**: The "Brain" of the backend. Enforces business rules (e.g., "A transcript must be uploaded before a summary can be generated").
3. **Repositories (`app/repositories/`)**: The only layer allowed to import `sqlalchemy.orm.Session`. Translates Service requests into optimized SQL queries.

### Request Lifecycle
1. Request hits FastAPI Middleware (CORS, Logging).
2. Pydantic validates the JSON payload.
3. Router delegates to the injected Service.
4. Service executes logic, calling the Repository if DB access is needed.
5. Repository returns SQLAlchemy Models.
6. Service formats and returns data to Router.
7. Router serializes data back to Pydantic Response schemas.

---

## 4. State Management

- **Server State**: Managed exclusively by `React Query`. Data like "List of Meetings" is cached and automatically invalidated when mutations (Create, Delete) occur.
- **Local UI State**: Managed by `useState` / `useRef` for ephemeral interactions (e.g., modal open/close, video player current time).
- **Global UI State**: Context API (`AppProvider`) is used sparingly, primarily for theme switching or global toast notifications.

### Why this architecture was chosen:
Scaling a transcript viewer requires extreme performance. Storing a 5,000-word transcript in Redux and dispatching actions on every video frame update would lock the main thread. By localizing the `currentTime` state to the `TranscriptContainer` via Refs and using React Query for the static text, we maintain 60 FPS performance.
