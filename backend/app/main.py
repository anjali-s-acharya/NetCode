import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, SessionLocal, engine
from app.routers import capstones, challenges, codeops, lessons
from app.seed import seed_challenges
from app.seed_capstones import seed_capstones
from app.seed_codeops import seed_codeops_challenges
from app.seed_lessons import seed_lessons

app = FastAPI(title="NetCode API", version="0.1.1")

default_origins = "http://localhost:5173,http://localhost:5174"
allowed_origins = os.environ.get("ALLOWED_ORIGINS", default_origins).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(challenges.router)
app.include_router(codeops.router)
app.include_router(lessons.router)
app.include_router(capstones.router)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_challenges(db)
        seed_codeops_challenges(db)
        seed_lessons(db)
        seed_capstones(db)
    finally:
        db.close()


@app.get("/api/health")
def health():
    return {"status": "ok"}
