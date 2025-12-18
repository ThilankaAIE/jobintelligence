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
origins = [
    "http://localhost:3000",           # Next.js local dev
    "http://127.0.0.1:3000",
    "https://*.pages.dev",  # Cloudflare Pages (replace later)
    # "https://YOUR_CUSTOM_DOMAIN.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
