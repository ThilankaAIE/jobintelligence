"use client";

import { useState } from "react";
import { ingestText, searchSimilar, health } from "@/lib/api";

export default function Home() {
  const [jd, setJd] = useState("");
  const [query, setQuery] = useState("");
  const [out, setOut] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function run(fn: () => Promise<any>) {
    setLoading(true);
    try {
      setOut(await fn());
    } catch (e: any) {
      setOut({ error: e?.message ?? String(e) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>JobIntelligence</h1>

      <button onClick={() => run(health)} disabled={loading}>
        Health
      </button>

      <h2>Ingest Job</h2>
      <textarea
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        rows={10}
        style={{ width: "100%" }}
      />
      <button onClick={() => run(() => ingestText(jd))} disabled={loading || !jd.trim()}>
        Ingest
      </button>

      <h2>Search</h2>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "100%" }}
      />
      <button onClick={() => run(() => searchSimilar(query))} disabled={loading || !query.trim()}>
        Search
      </button>

      <pre
        style={{
          marginTop: 20,
          background: "#111",
          color: "#0f0",
          padding: 16,
          overflowX: "auto",
        }}
      >
        {out ? JSON.stringify(out, null, 2) : "No output yet"}
      </pre>
    </main>
  );
}

