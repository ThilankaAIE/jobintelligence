from core.openrouter_client import client
from core.config import LLM_MODEL

print("Testing OpenRouter LLM...")

response = client.chat.completions.create(
    model=LLM_MODEL,
    messages=[
        {"role": "user", "content": "Hello, can you confirm OpenRouter is working?"}
    ]
)

print("LLM Response:")
print(response.choices[0].message.content)

