from core.ingest_pipeline import ingest_job

sample_jd = """
We are hiring a Senior Python Engineer skilled in Django, REST APIs,
PostgreSQL, and cloud computing. Strong communication and teamwork required.
"""

print("Running ingest test...")
job_id = ingest_job(sample_jd, source="manual")
print("✅ Ingested job_id:", job_id)
