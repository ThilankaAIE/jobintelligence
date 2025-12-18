from core.supabase_client import supabase

job = supabase.table("jobs_raw").select("*").order("created_at", desc=True).limit(1).execute().data
print("Latest jobs_raw:", job)

if job:
    job_id = job[0]["id"]

    extracted = supabase.table("jobs_extracted").select("*").eq("id", job_id).execute().data
    print("\nMatching jobs_extracted:", extracted)

    emb = supabase.table("jobs_embeddings").select("id").eq("id", job_id).execute().data
    print("\nMatching jobs_embeddings:", emb)
