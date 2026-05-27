from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.models import User, SearchHistory
from routes.dependencies import get_current_user

router = APIRouter()


@router.get("/")
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    history = (
        db.query(SearchHistory)
        .filter(SearchHistory.user_id == current_user.id)
        .order_by(SearchHistory.searched_at.desc())
        .limit(10)
        .all()
    )
    return {
        "history": [
            {
                "id": h.id,
                "ingredients": h.ingredients_used.split(","),
                "searched_at": h.searched_at,
            }
            for h in history
        ]
    }
