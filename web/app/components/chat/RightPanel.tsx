"use client";

type Filters = {
  skill: string;
  country: string;
  minSimilarity: number;
};

type SourceItem = {
  id: string;          // used to build anchorId
  title: string;
  company?: string;
  similarity?: number;
};

type InsightItem = { label: string; count: number };

type Insights = {
  shownCount: number;
  totalCount: number;
  topSkills: InsightItem[];
  softSkills: InsightItem[];
  topTools: InsightItem[];
};

type Props = {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  onApply: () => void;
  canApply?: boolean;

  sources: SourceItem[];
  onSelectSource: (anchorId: string) => void;

  insights: Insights;
  
};


export default function RightPanel({ filters, onChange, onApply, canApply = true, sources, onSelectSource, insights }: Props) {
  return (
    <aside
        style={{
      position: "sticky",
      top: 16,
      alignSelf: "start",
      height: "calc(100vh - 32px)",
      overflow: "auto",
      border: "1px solid #e5e5e5",
      borderRadius: 12,
      padding: 16,
      background: "#fff",
    }}
  >
    <div style={{ display: "grid", gap: 18 }}>
      {/* Filters */}
      <section>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Filters</h3>

        <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#666" }}>Skill / Keyword</span>
            <input
              value={filters.skill}
              onChange={(e) => onChange({ skill: e.target.value })}
              placeholder="e.g. python, dbt"
              style={{
                height: 36,
                padding: "0 10px",
                borderRadius: 10,
                border: "1px solid #e5e5e5",
                outline: "none",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#666" }}>Country</span>
            <select
              value={filters.country}
              onChange={(e) => onChange({ country: e.target.value })}
              style={{
                height: 36,
                padding: "0 10px",
                borderRadius: 10,
                border: "1px solid #e5e5e5",
                outline: "none",
                background: "#fff",
              }}
            >
              <option value="">Any</option>
              <option value="AU">AU</option>
              <option value="LK">LK</option>
              <option value="SG">SG</option>
            </select>
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#666" }}>
              Min similarity: {filters.minSimilarity.toFixed(2)}
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={filters.minSimilarity}
              onChange={(e) => onChange({ minSimilarity: Number(e.target.value) })}
            />
          </label>

          <button
            onClick={onApply}
            disabled={!canApply}
            style={{
              height: 40,
              borderRadius: 12,
              border: "1px solid #111",
              background: canApply ? "#111" : "#999",
              color: "#fff",
              fontWeight: 700,
              cursor: canApply ? "pointer" : "not-allowed",
            }}
          >
            Apply filters
          </button>

          <div style={{ fontSize: 12, color: "#666" }}>
            Tip: run a search first, then apply filters.
          </div>
        </div>
      </section>

      {/* Sources */}
      <section>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Sources</h3>

        {sources.length ? (
          <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
            {sources.slice(0, 8).map((s, i) => {
              const anchorId = `result-${s.id}`;
              return (
                <button
                  key={anchorId}
                  onClick={() => onSelectSource(anchorId)}
                  style={{
                    textAlign: "left",
                    width: "100%",
                    padding: "10px 10px",
                    borderRadius: 10,
                    border: "1px solid #eee",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700 }}>
                    {i + 1}. {s.title}
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 12,
                      color: "#666",
                      display: "flex",
                      gap: 10,
                    }}
                  >
                    <span>{s.company || "—"}</span>
                    {typeof s.similarity === "number" ? (
                      <span>sim: {s.similarity.toFixed(3)}</span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <p style={{ marginTop: 8, fontSize: 13, color: "#666" }}>
            Run a search to see sources.
          </p>
        )}
      </section>

      {/* Insights */}
      <section>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Insights</h3>

        <div style={{ marginTop: 10, display: "grid", gap: 12 }}>
          
          <div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Top hard skills</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {insights.topSkills.length ? (
                insights.topSkills.slice(0, 10).map((s) => (
                  <span
                    key={s.label}
                    style={{
                      fontSize: 12,
                      padding: "6px 10px",
                      borderRadius: 999,
                      border: "1px solid #e5e5e5",
                      background: "#fff",
                    }}
                    title={`${s.count} matches`}
                  >
                    {s.label} <span style={{ color: "#666" }}>({s.count})</span>
                  </span>
                ))
              ) : (
                <span style={{ fontSize: 12, color: "#666" }}>No data yet</span>
              )}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Top soft skills</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {insights.softSkills.length ? (
                insights.softSkills.slice(0, 10).map((s) => (
                  <span
                    key={s.label}
                    style={{
                      fontSize: 12,
                      padding: "6px 10px",
                      borderRadius: 999,
                      border: "1px solid #e5e5e5",
                      background: "#fff",
                    }}
                    title={`${s.count} matches`}
                  >
                    {s.label} <span style={{ color: "#666" }}>({s.count})</span>
                  </span>
                ))
              ) : (
                <span style={{ fontSize: 12, color: "#666" }}>No data yet</span>
              )}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Top tools</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {insights.topTools.length ? (
                insights.topTools.slice(0, 10).map((t) => (
                  <span
                    key={t.label}
                    style={{
                      fontSize: 12,
                      padding: "6px 10px",
                      borderRadius: 999,
                      border: "1px solid #e5e5e5",
                      background: "#fff",
                    }}
                    title={`${t.count} matches`}
                  >
                    {t.label} <span style={{ color: "#666" }}>({t.count})</span>
                  </span>
                ))
              ) : (
                <span style={{ fontSize: 12, color: "#666" }}>No data yet</span>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
    </aside>
    );
}
