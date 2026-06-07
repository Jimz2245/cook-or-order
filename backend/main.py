from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from auth import router as auth_router
from compare import router as compare_router
from pantry import router as pantry_router
from history import router as history_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cook or Order API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(compare_router, prefix="/api", tags=["compare"])
app.include_router(pantry_router, prefix="/api/pantry", tags=["pantry"])
app.include_router(history_router, prefix="/api/history", tags=["history"])

@app.get("/health")
def health_check():
    return {"status": "ok"}