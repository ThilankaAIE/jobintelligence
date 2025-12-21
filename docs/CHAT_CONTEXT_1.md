CONTEXT HANDOFF PROMPT — JobIntelligence (UI continuation)

You are continuing an ongoing project called JobIntelligence.
This is a UI-focused continuation. Treat everything below as established context and do not re-litigate earlier steps.

Stack

Next.js 16 (App Router, Turbopack)

TypeScript

Minimal CSS (no Tailwind)

Backend: FastAPI (Railway)

DB: Supabase + pgvector

Frontend API proxy via Next route handlers

Repo structure (current)

web/

app/

api/health/route.ts ✅ PASS

api/ingest/route.ts ✅ PASS

api/search/route.ts ✅ PASS

chat/page.tsx (main work area)

jobs/page.tsx (placeholder)

dashboard/page.tsx (placeholder)

layout.tsx, page.tsx

globals.css (contains .ji-twoPane layout + .ji-focusRing highlight)

app/components/

AppShell.tsx, Sidebar.tsx, Topbar.tsx

chat/

ChatComposer.tsx

ChatLayout.tsx (renamed from ChatTwoPane.tsx) ✅

ChatMessage.tsx (has “Show more / Show less” collapse for long assistant messages) ✅

ResultCard.tsx

RightPanel.tsx (sticky right panel: Filters + Sources + Insights)

lib/api.ts (calls Next route handlers)

.env.local: API_BASE_URL=https://<railway-backend>

Current UI status (confirmed working)

✅ UI-1 PASS: AppShell layout + routing
✅ UI-2 Step 1 PASS: Chat scaffold
✅ UI-2 Step 2 PASS: Perplexity-style chat + result cards
✅ UI-2 Step 3 PASS: Two-pane layout on /chat
✅ Step C PASS: Chat spam reduced; status line shows “Showing X of Y matches”; long assistant messages collapse; source click scrolls + highlight ring
✅ Step 4.0 PASS: Insights panel v1 shows counts + top chips (tools working; hard skills depends on data fields)

Current behavior on /chat

Left pane:

Chat messages (user/right, assistant/left)

On search: assistant says “Here are the best matches.”

Results list renders cards with stable anchors id="result-<rowId>" and scrollMarginTop

Status text appears above results: Showing X of Y matches (filtered vs raw)

Right pane (RightPanel.tsx):

Filters: Skill/keyword input, Country dropdown, Min similarity slider, Apply filters button

Sources: list derived from filtered results; click scrolls to left card and applies focus ring

Insights: derived from filtered results (shownCount/totalCount + top chips)

Filtering logic:

rawResults stores fetched data

results = applyClientFilters(rawResults, filters) client-side

Apply filters currently re-fetches the last query then re-applies client filters (kept intentionally simple)

Important resolved issues

Fixed hydration mismatch from browser extensions (not an app bug)

Removed unsupported @theme CSS rule from globals.css (was causing tooling warnings)

Restored Filters/Sources after RightPanel JSX was overwritten during Insights work

Confirmed ChatLayout.tsx name is OK and in use

Canonical extraction schema (for future alignment)

When parsing job descriptions / JDs, the target JSON schema is:

{
"title": "",
"skills_hard": [],
"skills_soft": [],
"tools": [],
"responsibilities": [],
"qualifications": [],
"experience_level": "",
"industry": "",
"summary": "",
"clean_text_for_embedding": ""
}

Current goal (continue from here)

Continue improving the RightPanel Insights area without breaking Filters and Sources.

Next steps I want (in order, incremental):

Make Insights correctly read hard skills using the canonical schema (skills_hard) and/or map existing fields to it.

Add “Top soft skills” chips (if present) and keep UI minimal (no charts yet).

Keep everything in minimal CSS (no Tailwind), no state libraries required.

Constraints:

Incremental changes only

Don’t break existing chat behavior

No dashboards/charts yet

Keep code simple and test each step before moving forward

Instruction:
Proceed step-by-step. Start by inspecting how results are shaped and propose the smallest code change to make Insights show Top hard skills reliably while keeping Tools working.