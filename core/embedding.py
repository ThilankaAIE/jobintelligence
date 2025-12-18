from core.openrouter_client import client
from core.config import EMBED_MODEL

def generate_embedding(text: str) -> list[float]:
    """
    Generate an embedding vector for text using OpenRouter embeddings model.
    """
    text = (text or "").strip()
    if not text:
        return []

    resp = client.embeddings.create(
        model=EMBED_MODEL,
        input=text
    )
    return resp.data[0].embedding
