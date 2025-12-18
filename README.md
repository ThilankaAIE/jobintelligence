# JobIntelligence MVP

Day 1: Project skeleton and initial folder structure created.

Day 2: Supabase fully connected — verified database read/write, pgvector installed, search SQL function working, and environment variables properly configured.

Day 3: OpenRouter integrated — API key added, config updated, LLM and embedding models tested, and a simple LLM helper function implemented for easier usage across the project.

Day 4: LangChain packages installed, PromptTemplate created, LCEL chain created, JSON output is clean dict (no markdown fences), Extraction fields match schema

Day 5: Supabase insert into jobs_raw, Supabase insert into jobs_extracted, Generate embedding using clean_text_for_embedding, Supabase insert into jobs_embeddings, End-to-end test: ingest → stored in all 3 tables

Day 6: Query → embedding, match_jobs RPC (pgvector), Fetch structured job rows, Similarity scoring (0.86 is strong)