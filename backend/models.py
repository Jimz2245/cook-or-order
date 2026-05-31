from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True) 
    # primary_key means its the unique identifier for each user
    # index=True means we can search by it quickly by building a lookup table for this column
    email = Column(String, unique=True, nullable=True)
    # unique=True means no two users can have the same email address
    # nullable=True means we allow users to sign up without an email (for Google/Facebook auth)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
   
    pantry_items = relationship("PantryItem", back_populates="owner", cascade="all, delete")

class PantryItem(Base):
    __tablename__ = "pantry_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    # ForeignKey means this column references the id column in the users table, creating a relationship between pantry items and their owners
    ingredient = Column(String, nullable=False)
    
    owner = relationship("User", back_populates="pantry_items")