"use client";

import { useMemo, useState } from "react";

type Props = {
  role: "user" | "assistant";
  text: string;
};

export default function ChatMessage({ role, text }: Props) {
  const isAssistant = role === "assistant";
  const isLong = isAssistant && text.length > 400;

  const [expanded, setExpanded] = useState(false);

  const displayText = useMemo(() => {
    if (!isLong) return text;
    if (expanded) return text;
    return text.slice(0, 400) + "…";
  }, [text, isLong, expanded]);

  // Keep your existing styling logic here; below is just a placeholder style pattern:
  const bubbleStyle: React.CSSProperties = {
    maxWidth: 760,
    padding: "12px 14px",
    borderRadius: 14,
    margin: "10px 0",
    whiteSpace: "pre-wrap",
    lineHeight: 1.5,
    background: role === "user" ? "#111" : "#fff",
    color: role === "user" ? "#fff" : "#111",
    border: role === "user" ? "1px solid #111" : "1px solid #e5e5e5",
  };

  return (
    <div style={{ display: "flex", justifyContent: role === "user" ? "flex-end" : "flex-start" }}>
      <div style={bubbleStyle}>
        <div>{displayText}</div>

        {isLong ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            style={{
              marginTop: 10,
              padding: 0,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 12,
              color: "#666",
              textDecoration: "underline",
            }}
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
