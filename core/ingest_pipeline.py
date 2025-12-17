from core.pipelines import build_job_extraction_chain
from core.text_splitter import maybe_split_job_text

job_extraction_chain = build_job_extraction_chain()

def extract_structured_job(job_text):
    processed = maybe_split_job_text(job_text)
    return job_extraction_chain.invoke({"job_text": processed})
