async function handle(r: Response) {
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function health() {
  return handle(await fetch("/api/health", { cache: "no-store" }));
}

export async function ingestText(raw_text: string, source = "manual") {
  return handle(
    await fetch("/api/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ raw_text, source }),
    })
  );
}

export async function searchSimilar(query: string, match_count = 10) {
  return handle(
    await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, match_count }),
    })
  );
}
