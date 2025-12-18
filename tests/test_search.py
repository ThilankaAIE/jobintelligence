from core.rag_engine import search_jobs

print("Running semantic search test...")

query = "Senior Django backend engineer"
results = search_jobs(query, top_k=5)

print(f"Query: {query}")
print(f"Matches found: {len(results)}\n")

for r in results:
    print("-" * 60)
    print("Title:", r.get("title"))
    print("Similarity:", r.get("similarity"))
    print("Hard Skills:", r.get("skills_hard"))
    print("Summary:", r.get("summary"))
