"use client";

import { useMemo, useState } from "react";
import { searchSimilar } from "@/lib/api";
import ChatComposer from "@/app/components/chat/ChatComposer";
import ChatMessage from "@/app/components/chat/ChatMessage";
import ResultCard from "@/app/components/chat/ResultCard";
import ChatLayout from "@/app/components/chat/ChatLayout";
import RightPanel from "@/app/components/chat/RightPanel";

type Msg = { role: "user" | "assistant"; text: string };

type Filters = {
  skill: string;
  country: string;
  minSimilarity: number;
};

// --- helpers (robust to unknown result shape) ---
function getSimilarity(item: any): number {
  const v =
    item?.similarity ??
    item?.score ??
    item?.match_score ??
    item?.metadata?.similarity ??
    0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function textIncludes(hay: any, needle: string): boolean {
  if (!needle) return true;
  const n = needle.trim().toLowerCase();
  if (!n) return true;
  const h = String(hay ?? "").toLowerCase();
  return h.includes(n);
}

function arrayIncludes(arr: any, needle: string): boolean {
  if (!needle) return true;
  const n = needle.trim().toLowerCase();
  if (!n) return true;
  if (!Array.isArray(arr)) return false;
  return arr.some((x) => String(x ?? "").toLowerCase().includes(n));
}

function getCountry(item: any): string {
  return (
    item?.country ??
    item?.location_country ??
    item?.location?.country ??
    item?.metadata?.country ??
    ""
  );
}

function applyClientFilters(items: any[], filters: Filters): any[] {
  return (items || []).filter((item) => {
    // min similarity
    if (getSimilarity(item) < filters.minSimilarity) return false;

    // country (only if item has a country; if missing, don't exclude)
    if (filters.country) {
      const c = String(getCountry(item) || "").toUpperCase();
      if (c && c !== filters.country.toUpperCase()) return false;
    }

    // skill/keyword: search across common fields
    const needle = filters.skill;
    if (needle.trim()) {
      const ok =
        textIncludes(item?.title, needle) ||
        textIncludes(item?.role, needle) ||
        textIncludes(item?.company, needle) ||
        textIncludes(item?.summary, needle) ||
        textIncludes(item?.snippet, needle) ||
        textIncludes(item?.clean_text, needle) ||
        arrayIncludes(item?.hard_skills, needle) ||
        arrayIncludes(item?.skills, needle) ||
        arrayIncludes(item?.tools, needle);

      if (!ok) return false;
    }

    return true;
  });
}

function focusResult(anchorId: string) {
    const el = document.getElementById(anchorId);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });

    el.classList.add("ji-focusRing");
    window.setTimeout(() => {
      el.classList.remove("ji-focusRing");
    }, 900);
  }

function normalizeToken(x: any): string {
  return String(x ?? "").trim();
}

function topCountsFromArray(items: any[], getter: (item: any) => any[] | undefined, topN = 8) {
  const map = new Map<string, number>();

  for (const item of items) {
    const arr = getter(item) || [];
    if (!Array.isArray(arr)) continue;

    for (const v of arr) {
      const key = normalizeToken(v);
      if (!key) continue;
      map.set(key, (map.get(key) || 0) + 1);
    }
  }

  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([label, count]) => ({ label, count }));
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Ask a role or paste a JD and I’ll find the closest matches.",
    },
  ]);

  const [rawResults, setRawResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState<string>("");

  const [filters, setFilters] = useState<Filters>({
    skill: "",
    country: "",
    minSimilarity: 0.5,
  });

  const results = useMemo(
    () => applyClientFilters(rawResults, filters),
    [rawResults, filters]
  );

  const totalCount = rawResults.length;
  const shownCount = results.length;

  const statusText = lastQuery.trim()
    ? loading
      ? "Searching…"
      : `Showing ${shownCount} of ${totalCount} matches`
    : "";

  // --- Sources data is based on FILTERED results (as you requested) ---
  const sources = useMemo(() => {
    return results.map((item, idx) => {
      const id = String(item?.id ?? item?.job_id ?? idx);
      const title = String(item?.title ?? item?.role ?? "Untitled role");
      const company = item?.company ? String(item.company) : "";
      const sim = Number(item?.similarity);
      const similarity = Number.isFinite(sim) ? sim : undefined;

      return { id, title, company, similarity };
    });
  }, [results]);

  const insights = useMemo(() => {
    const topSkills = topCountsFromArray(
      results,
      (it) => it?.skills_hard ?? it?.skills,
      10
    );

    const softSkills = topCountsFromArray(
      results,
      (it) => it?.skills_soft ?? it?.skills,
      10
    );

    const topTools = topCountsFromArray(
      results,
      (it) => it?.tools,
      10
    );

    return {
      shownCount: results.length,
      totalCount: rawResults.length,
      topSkills,
      topTools,
      softSkills,
    };
  }, [results, rawResults]);

  async function runSearch(text: string) {
    setMessages((m) => [
      ...m,
      { role: "user", text },
      { role: "assistant", text: "Searching…" },
    ]);
    setLoading(true);
    setRawResults([]);
    setLastQuery(text);

    try {
      const data = await searchSimilar(text, 10);
      const arr = Array.isArray(data) ? data : [];
      setRawResults(arr);

      setMessages((m) => {
        const mm = [...m];
        const filteredCount = applyClientFilters(arr, filters).length;
        mm[mm.length - 1] = {
          role: "assistant",
          text: "Here are the best matches.",
        };
        return mm;
      });
    } catch (e: any) {
      setMessages((m) => {
        const mm = [...m];
        mm[mm.length - 1] = {
          role: "assistant",
          text: `Error: ${e?.message || "Failed"}`,
        };
        return mm;
      });
    } finally {
      setLoading(false);
    }
  }

  async function onSend(text: string) {
    await runSearch(text);
  }

  async function onApplyFilters() {
    if (!lastQuery.trim()) return;

    setLoading(true);
    
    try {
      const data = await searchSimilar(lastQuery, 10);
      const arr = Array.isArray(data) ? data : [];
      setRawResults(arr);

    } catch (e: any) {
      setMessages((m) => [...m, { role: "assistant", text: `Error: ${e?.message || "Failed"}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ChatLayout
      left={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 64px)",
          }}
        >
          <div style={{ flex: 1, overflowY: "auto", padding: 20, maxWidth: 900 }}>
            <h1 style={{ marginTop: 0 }}>Chat</h1>

            <div style={{ marginTop: 12 }}>
              {messages.map((m, i) => (
                <ChatMessage key={i} role={m.role} text={m.text} />
              ))}
            </div>

            {results.length ? (
              <div style={{ marginTop: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontSize: 13, color: "#666" }}>Top matches</div>
                  {statusText ? (
                    <div style={{ fontSize: 12, color: "#666" }}>{statusText}</div>
                  ) : null}
                </div>

                {results.map((item, idx) => {
                  const rowId = String(item?.id ?? item?.job_id ?? idx);
                  const anchorId = `result-${rowId}`;

                  return (
                    <div
                      key={anchorId}
                      id={anchorId}
                      style={{ scrollMarginTop: 90 }}
                    >
                      <ResultCard item={item} />
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

          <ChatComposer onSend={onSend} loading={loading} />
        </div>
      }
      right={
        <RightPanel
          filters={filters}
          onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
          onApply={onApplyFilters}
          canApply={!!lastQuery.trim() && !loading}
          sources={sources}
          onSelectSource={focusResult}
          insights={insights}
        />
      }
    />
  );
}
