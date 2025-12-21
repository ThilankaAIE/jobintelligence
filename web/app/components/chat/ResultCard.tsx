"use client";

function Chip({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 8px",
        border: "1px solid #ddd",
        borderRadius: 999,
        fontSize: 12,
        marginRight: 6,
        marginBottom: 6,
      }}
    >
      {label}
    </span>
  );
}

export default function ResultCard({ item }: { item: any }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 14,
        padding: 14,
        marginTop: 10,
        background: "#fff",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div style={{ fontWeight: 700 }}>{item.title || "Untitled role"}</div>
        <div style={{ fontSize: 12, color: "#666" }}>
          similarity: {typeof item.similarity === "number" ? item.similarity.toFixed(3) : "—"}
        </div>
      </div>

      {item.summary ? <div style={{ marginTop: 8, color: "#222" }}>{item.summary}</div> : null}

      <div style={{ marginTop: 10 }}>
        {Array.isArray(item.skills_hard) && item.skills_hard.length ? (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Hard skills</div>
            {item.skills_hard.slice(0, 12).map((s: string) => (
              <Chip key={`h-${s}`} label={s} />
            ))}
          </div>
        ) : null}

        {Array.isArray(item.tools) && item.tools.length ? (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Tools</div>
            {item.tools.slice(0, 12).map((s: string) => (
              <Chip key={`t-${s}`} label={s} />
            ))}
          </div>
        ) : null}

        {Array.isArray(item.skills_soft) && item.skills_soft.length ? (
          <div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Soft skills</div>
            {item.skills_soft.slice(0, 12).map((s: string) => (
              <Chip key={`s-${s}`} label={s} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
