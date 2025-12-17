from core.pipelines import build_job_extraction_chain

chain = build_job_extraction_chain()

sample_jd = """
We are hiring a Senior Python Engineer skilled in Django, REST APIs,
PostgreSQL, and cloud computing. Strong communication and teamwork required.
"""

print("Testing LLM extraction...")
result = chain.invoke({"job_text": sample_jd})
print(result)
