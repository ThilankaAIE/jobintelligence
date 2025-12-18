from fastapi import APIRouter
from pydantic import BaseModel
from core.ingest_pipeline import ingest_job

router = APIRouter()

class IngestRequest(BaseModel):
    text: str
    source: str = "manual"

@router.post("/text")
def ingest_text(payload: IngestRequest):
    job_id = ingest_job(payload.text, payload.source)
    return {"job_id": job_id}
