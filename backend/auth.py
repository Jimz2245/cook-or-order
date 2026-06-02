from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
import bcrypt
from database import get_db
from models import User
from jose import jwt
from datetime import datetime, timedelta
import os

router = APIRouter()
# APIRouter is a mini version of the FastAPI app that we can use to group related routes together.
# We will create a separate router for each feature of our app (auth, recipes, pantry, history) 
# and then include them in the main app in main.py. This keeps our code organized and modular.

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

SECRET_KEY = os.getenv("SECRET_KEY", "devkey123")
ALGORITHM = "HS256"

def create_token(user_id: int) -> str:
    expire = datetime.utcnow() + timedelta(days=7)
    payload = {"sub": str(user_id), "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
# Gives token to user after login to prove their identity for future requests

@router.post("/register", status_code=201)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == body.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(email=body.email, hashed_password=hash_password(body.password))
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User registered successfully", "user_id": user.id}

# Login route

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/login")
def login(body: LoginRequest, db: Session = Depends(get_db)):
    # Step 1: Find the user by email
    user = db.query(User).filter(User.email == body.email).first()

    # Step 2: If user not found or password is incorrect, raise error
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Step 3: If credentials are valid, create and return a token
    token = create_token(user.id)

    # Step 4: Return the token to the client
    return {"access_token": token, "token_type": "bearer"}

