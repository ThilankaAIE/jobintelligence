from langchain_openai import ChatOpenAI
from core.config import OPENROUTER_API_KEY, OPENROUTER_BASE_URL, LLM_MODEL

def get_langchain_llm():
    llm = ChatOpenAI(
        model=LLM_MODEL,
        api_key=OPENROUTER_API_KEY,
        base_url=OPENROUTER_BASE_URL,
        temperature=0.2,
    )
    return llm