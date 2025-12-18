# core/rag_engine.py

from core.embedding import generate_embedding
from core.supabase_client import supabase

def search_jobs(query: str, top_k: int = 5):
    """
    Semantic search over job descriptions:
    1) Generate embedding for query
    2) Call Supabase RPC match_jobs (pgvector)
    3) Fetch structured job rows from jobs_extracted
    4) Return results ordered by similarity
    """
    query = (query or "").strip()
    if not query:
        return []

    q_emb = generate_embedding(query)
    if not q_emb:
        return []

    # 1) Vector similarity search (returns ids + similarity)
    matches = supabase.rpc("match_jobs", {
        "query_embedding": q_emb,
        "match_count": top_k
    }).execute()

    if not matches.data:
        return []

    # 2) Keep order by similarity
    id_to_score = {row["id"]: row["similarity"] for row in matches.data}
    ids_in_order = [row["id"] for row in matches.data]

    # 3) Fetch structured job details
    jobs = supabase.table("jobs_extracted").select("*").in_("id", ids_in_order).execute().data

    # 4) Sort jobs to match similarity ordering + attach score
    jobs_sorted = sorted(jobs, key=lambda j: id_to_score.get(j["id"], 0), reverse=True)
    for j in jobs_sorted:
        j["similarity"] = float(id_to_score.get(j["id"], 0))

    return jobs_sorted
