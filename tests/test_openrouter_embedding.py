from core.openrouter_client import client
from core.config import EMBED_MODEL

print("Testing OpenRouter Embedding...")

text = "This is a test embedding for JobIntelligence MVP."

response = client.embeddings.create(
    model=EMBED_MODEL,
    input=text
)

embedding = response.data[0].embedding
print("Embedding length:", len(embedding))
print("First 5 values:", embedding[:5])