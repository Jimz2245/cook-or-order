from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://localhost/cook_or_order")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Creating a connection to the database for each request and closing it after the request is done. 
# This is a common pattern in FastAPI to ensure we don't have too many open connections.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()