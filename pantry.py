from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models.models import User, PantryItem
from routes.dependencies import get_current_user

router = APIRouter()


class PantryItemCreate(BaseModel):
    ingredient: str


@router.get("/")
def get_pantry(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    items = db.query(PantryItem).filter(PantryItem.user_id == current_user.id).all()
    return {"items": [{"id": i.id, "ingredient": i.ingredient} for i in items]}


@router.post("/", status_code=201)
def add_pantry_item(
    body: PantryItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = PantryItem(user_id=current_user.id, ingredient=body.ingredient.strip().lower())
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"id": item.id, "ingredient": item.ingredient}


@router.delete("/{item_id}")
def delete_pantry_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(PantryItem).filter(
        PantryItem.id == item_id,
        PantryItem.user_id == current_user.id  # Ensure users can only delete their own items
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    db.delete(item)
    db.commit()
    return {"message": "Deleted"}
