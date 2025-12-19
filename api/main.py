from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routers import health, ingest, search

app = FastAPI(
    title="JobIntelligence API",
    version="0.1",
)

# ----------------------------
# CORS configuration
# ----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://jobintelligence.pages.dev",
    ],
    allow_origin_regex=r"^https:\/\/.*\.jobintelligence\.pages\.dev$",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Routers
# ----------------------------
app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(ingest.router, prefix="/ingest", tags=["ingest"])
app.include_router(search.router, prefix="/search", tags=["search"])

# ----------------------------
# Root
# ----------------------------
@app.get("/")
def root():
    return {"message": "JobIntelligence API is running. Visit /docs"}
