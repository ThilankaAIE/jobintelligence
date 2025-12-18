from core.supabase_client import supabase
from core.text_splitter import maybe_split_job_text
from core.pipelines import build_job_extraction_chain
from core.embedding import generate_embedding

job_extraction_chain = build_job_extraction_chain()

def ingest_job(job_text: str, source: str = "manual") -> str:
    """
    End-to-end ingestion:
    1) Store raw JD
    2) Split if long
    3) Extract structured fields via LCEL chain
    4) Generate embedding
    5) Store extracted + embedding
    Returns: job_id (uuid as str)
    """
    job_text = (job_text or "").strip()
    if not job_text:
        raise ValueError("job_text cannot be empty")

    # 1) Insert raw job text
    raw_resp = supabase.table("jobs_raw").insert({
        "raw_text": job_text,
        "source": source
    }).execute()

    job_id = raw_resp.data[0]["id"]

    # 2) Split if too long (safe for LLM)
    processed_text = maybe_split_job_text(job_text)

    # 3) Extract structured fields
    extracted = job_extraction_chain.invoke({"job_text": processed_text})

    # Ensure required field exists
    clean_for_embedding = extracted.get("clean_text_for_embedding") or processed_text

    # 4) Insert extracted record (one-to-one with jobs_raw.id)
    supabase.table("jobs_extracted").insert({
        "id": job_id,
        **extracted
    }).execute()

    # 5) Generate embedding + insert vector
    embedding = generate_embedding(clean_for_embedding)

    # If embedding model fails for any reason, avoid breaking MVP
    if embedding:
        supabase.table("jobs_embeddings").insert({
            "id": job_id,
            "embedding": embedding
        }).execute()

    return job_id
