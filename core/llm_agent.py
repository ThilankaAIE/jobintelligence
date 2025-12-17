from core.openrouter_client import client
from core.config import LLM_MODEL

def simple_llm(message: str) -> str:
    response = client.chat.completions.create(
        model=LLM_MODEL,
        messages=[{"role": "user", "content": message}]
    )
    
    return response.choices[0].message.content

