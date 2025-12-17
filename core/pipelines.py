# core/pipelines.py

import json
import re

from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda

from core.prompts import job_extraction_prompt
from core.langchain_llm import get_langchain_llm


def parse_json_safe(text: str):
    """
    Parse JSON output from the LLM.
    Handles cases where the model returns Markdown code blocks like ```json{...}```.
    """

    # 1) Strip markdown code fences if present
    text = (text or "").strip()
    text = re.sub(r"^```json\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"^```\s*", "", text)
    text = re.sub(r"\s*```$", "", text)

    # 2) Attempt JSON loading directly
    try:
        return json.loads(text)
    except Exception:
        pass

    # 3) Extract the first JSON object found in the text (best-effort)
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        json_text = match.group(0)
        try:
            return json.loads(json_text)
        except Exception:
            pass

    # 4) Fallback minimal structure (keeps pipeline resilient)
    return {
        "title": "",
        "skills_hard": [],
        "skills_soft": [],
        "tools": [],
        "responsibilities": [],
        "qualifications": [],
        "experience_level": "",
        "industry": "",
        "summary": text[:300],
        "clean_text_for_embedding": text,
    }


def build_job_extraction_chain():
    """
    LCEL pipeline:
    PromptTemplate → LLM → StrOutputParser → JSON-safe parsing
    """
    llm = get_langchain_llm()
    parser = StrOutputParser()

    chain = (
        job_extraction_prompt
        | llm
        | parser
        | RunnableLambda(parse_json_safe)
    )
    return chain