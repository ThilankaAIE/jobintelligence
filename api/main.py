from fastapi import FastAPI
from api.routers import health, ingest, search

app = FastAPI(title="JobIntelligence API", version="0.1")

app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(ingest.router, prefix="/ingest", tags=["ingest"])
app.include_router(search.router, prefix="/search", tags=["search"])

@app.get("/")
def root():
    return {"message": "JobIntelligence API is running. Visit /docs"}

