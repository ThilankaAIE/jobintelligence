"use client";

import { useState } from "react";

export default function ChatComposer({
  onSend,
  loading,
}: {
  onSend: (text: string) => void;
  loading: boolean;
}) {
  const [text, setText] = useState("");

  function submit() {
    const t = text.trim();
    if (!t || loading) return;
    onSend(t);
    setText("");
  }

  return (
    <div style={{ borderTop: "1px solid #ddd", padding: 16 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          placeholder="Ask about a job… e.g. 'data engineer snowflake dbt'"
          style={{
            flex: 1,
            padding: "12px 14px",
            border: "1px solid #ccc",
            borderRadius: 10,
          }}
        />
        <button
          onClick={submit}
          disabled={loading}
          style={{
            padding: "12px 16px",
            border: "1px solid #111",
            borderRadius: 10,
            background: loading ? "#eee" : "#111",
            color: loading ? "#666" : "#fff",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
        Tip: press Enter to send.
      </div>
    </div>
  );
}
