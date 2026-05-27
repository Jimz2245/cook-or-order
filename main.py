from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, recipes, pantry, history
from database import engine, Base

# Create all DB tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cook or Order API", version="1.0.0")

# Allow your React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Add production URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route groups
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(recipes.router, prefix="/api", tags=["recipes"])
app.include_router(pantry.router, prefix="/api/pantry", tags=["pantry"])
app.include_router(history.router, prefix="/api/history", tags=["history"])


@app.get("/health")
def health_check():
    return {"status": "ok"}
