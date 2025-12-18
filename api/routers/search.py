from fastapi import APIRouter
from pydantic import BaseModel
from core.rag_engine import search_jobs

router = APIRouter()

class SearchRequest(BaseModel):
    query: str
    top_k: int = 5

@router.post("/similar")
def search_similar(payload: SearchRequest):
    return search_jobs(payload.query, payload.top_k)
