You are continuing an ongoing project called **JobIntelligence**.

This is a UI-focused continuation. Treat everything below as established context.

====================
PROJECT CONTEXT
====================

Stack:
- Next.js 16 (App Router, Turbopack)
- TypeScript
- Minimal CSS (no Tailwind yet)
- Backend: FastAPI (Railway)
- DB: Supabase + pgvector
- Frontend API proxy via Next route handlers

Repo structure (confirmed working):

web/
  app/
    api/
      health/route.ts
      ingest/route.ts
      search/route.ts
    chat/page.tsx
    jobs/page.tsx
    dashboard/page.tsx
    layout.tsx
    page.tsx
  components/
    shell/
      AppShell.tsx
      Sidebar.tsx
      Topbar.tsx
    chat/
      ChatComposer.tsx
      ChatMessage.tsx
      ResultCard.tsx
    ui/
      Button.tsx
      Card.tsx
      Badge.tsx
  lib/
    api.ts

.env.local:
API_BASE_URL=https://<railway-backend>

API wiring status:
- GET /api/health → PASS
- POST /api/ingest → PASS
- POST /api/search → PASS

Current UI status:
- UI-1: PASS (AppShell + routing)
- UI-2 Step 1: PASS (chat scaffold)
- UI-2 Step 2: PASS (Perplexity-style chat + result cards)

Current Chat UI features:
- User query bubble (right aligned)
- Assistant responses (left)
- Search results rendered as cards
- Skills + tools chips
- Similarity score visible
- Scroll works
- No console or network errors

Confirmed screenshot shows:
- Query: "data engineer snowflake dbt"
- Multiple matching jobs rendered correctly

====================
CURRENT GOAL
====================

Continue with **UI-2 Step 3** only.

UI-2 Step 3 objective:
- Introduce a **two-pane layout**:
  - Left: Chat results (existing)
  - Right: Filters / Sources / Insights panel (sticky)

Constraints:
- Incremental changes only
- No breaking of existing chat
- No Tailwind yet
- Prefer simple components
- Zustand allowed later, not required now

Design inspirations:
- Perplexity (chat + sources)
- Stripe (spacing, calm UI)
- TailAdmin (filters & dashboards)
- Metro (clear hierarchy)

Instruction:
Proceed step-by-step.
Start by proposing the component structure and layout changes for UI-2 Step 3.
Do NOT jump ahead to dashboards or charts yet.
