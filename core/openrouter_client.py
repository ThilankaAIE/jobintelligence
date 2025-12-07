from openai import OpenAI
from core.config import OPENROUTER_API_KEY, OPENROUTER_BASE_URL

client = OpenAI(
    api_key=OPENROUTER_API_KEY,
    base_url=OPENROUTER_BASE_URL,
    default_headers={
        "HTTP-Referer": "http://localhost:3000",  # required by OpenRouter
        "X-Title": "JobIntelligence AI",          # any name you want
    }
)

