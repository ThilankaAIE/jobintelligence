from langchain_core.prompts import PromptTemplate

job_extraction_prompt = PromptTemplate(
    input_variables=["job_text"],
    template="""
You are an AI assistant that extracts structured information from a job description.

Job description:
----------------
{job_text}
----------------

Extract the following fields and return STRICTLY as a valid JSON object:

{{
  "title": "",
  "skills_hard": [],
  "skills_soft": [],
  "tools": [],
  "responsibilities": [],
  "qualifications": [],
  "experience_level": "",
  "industry": "",
  "summary": "",
  "clean_text_for_embedding": ""
}}

Rules:
- Do NOT hallucinate. Leave fields empty if unknown.
- skills_hard should contain technical skills.
- skills_soft should contain interpersonal skills.
- summary is 1–2 sentences.
- clean_text_for_embedding must be short, clean text for semantic search.
"""
)
