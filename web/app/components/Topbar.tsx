"use client";

import { useHealth } from "@/lib/useHealth";

export default function Topbar() {
  const status = useHealth();

  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: 16, borderBottom: "1px solid #ddd" }}>
      <div>Perplexity-style chat • Stripe-style dashboard</div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 14 }}>
          API:{" "}
          {status === "checking" && "Checking..."}
          {status === "ok" && "Connected ✅"}
          {status === "error" && "Error ❌"}
        </span>

        {/* your buttons */}
        <button>Chat</button>
        <button>Dashboard</button>
      </div>
    </div>
  );
}
