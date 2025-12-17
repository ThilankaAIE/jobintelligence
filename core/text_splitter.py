from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1500,
    chunk_overlap=200,
)

def maybe_split_job_text(job_text: str, max_len: int = 3000):
    if len(job_text) <= max_len:
        return job_text
    
    chunks = splitter.split_text(job_text)
    return "\n\n".join(chunks[:3])  # Use first few chunks for extraction