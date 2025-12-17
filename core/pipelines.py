import json
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda
from core.prompts import job_extraction_prompt
from core.langchain_llm import get_langchain_llm

def parse_json_safe(text: str):
    try:
        return json.loads(text)
    except:
        # fallback minimal JSON
        return {
            "title": "",
            "skills_hard": [],
            "skills_soft": [],
            "tools": [],
            "responsibilities": [],
            "qualifications": [],
            "experience_level": "",
            "industry": "",
            "summary": text[:200],
            "clean_text_for_embedding": text,
        }

def build_job_extraction_chain():
    llm = get_langchain_llm()
    parser = StrOutputParser()

    chain = (
        job_extraction_prompt
        | llm
        | parser
        | RunnableLambda(parse_json_safe)
    )
    return chain
