const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

if (!API_BASE) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");

async function handle(r: Response) {
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function health() {
  return handle(await fetch(`${API_BASE}/health/`, { cache: "no-store" }));
}

export async function ingestText(text: string, source = "manual") {
  return handle(
    await fetch(`${API_BASE}/ingest/text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, source }),
    })
  );
}

export async function searchSimilar(query: string, match_count = 10) {
  return handle(
    await fetch(`${API_BASE}/search/similar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, match_count }),
    })
  );
}
