from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from models import User, SearchHistory
from dependencies import get_current_user
from ai import estimate_cost
import httpx
import os
from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from dependencies import get_optional_user
from models import User, SearchHistory

router = APIRouter()

SPOONACULAR_API_KEY = os.getenv("SPOONACULAR_API_KEY")

class CompareRequest(BaseModel):
    ingredients: list[str]

def fetch_recipes(ingredients: list[str]) -> list:
    response = httpx.get(
        "https://api.spoonacular.com/recipes/findByIngredients",
        params={
            "ingredients": ",".join(ingredients),
            "number": 3,
            "apiKey": SPOONACULAR_API_KEY
        }
    )
    return response.json()

@router.post("/compare")
def compare(body: CompareRequest, db: Session = Depends(get_db), current_user: Optional[User] = Depends(get_optional_user)):
    # Case 1: empty ingredients
    if not body.ingredients:
        raise HTTPException(status_code=400, detail="No Ingredients Provided")
    
    # Case 2: too many ingredients
    if len(body.ingredients) > 20:
        raise HTTPException(status_code=400, detail="Too Many Ingredients Provided")

    # Case 3: Spoonacular down
    try:
        raw_recipes = fetch_recipes(body.ingredients)
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Spoonacular API is unavailable")

    # Case 4: no recipes found
    if not raw_recipes:
        raise HTTPException(status_code=404, detail="No Recipes Found")
    
    recipes = [
        {
            "id": r["id"],
            "title": r["title"],
            "image": r["image"],
            "usedCount": r["usedIngredientCount"],
            "missedCount": r["missedIngredientCount"],
            "missedIngredients": [i["name"] for i in r["missedIngredients"]],
        }
        for r in raw_recipes
    ]
    recipe_names = [r["title"] for r in recipes]
    
    # Case 5: AI fails
    try:
        cost = estimate_cost(body.ingredients, recipe_names)
    except Exception:
        cost = {"cost": recipes[0]["title"], "deliveryEstimate": 0, "homeEstimate": 0, "reasoning": "Cost estimate unavailable"}
    
    if current_user:
        history = SearchHistory(
            user_id=current_user.id,
            ingredients_used=",".join(body.ingredients)
        )
    db.add(history)
    db.commit()

    return {"recipes": recipes, "cost_estimate": cost}

def fetch_recipe_detail(recipe_id: int) -> dict:
    response = httpx.get(
        f"https://api.spoonacular.com/recipes/{recipe_id}/information",
        params= {"apiKey": SPOONACULAR_API_KEY,
                "includeNutrition": True
                }
    )
    return response.json()

@router.get("/recipes/{recipe_id}")
def get_recipe_detail(recipe_id: int):
    detail = fetch_recipe_detail(recipe_id)
    
    # Pull only the 4 nutrients we care about from the nutrients list
    nutrients = detail.get("nutrition", {}).get("nutrients", [])
    key_nutrients = {
        n["name"]: round(n["amount"], 1)
        for n in nutrients
        if n["name"] in ["Calories", "Protein", "Carbohydrates", "Fat"]
    }

    return {
        "id": detail["id"],
        "title": detail["title"],
        "image": detail["image"],
        "readyInMinutes": detail.get("readyInMinutes"),
        "servings": detail.get("servings"),
        "instructions": detail.get("instructions"),
        "ingredients": [i["original"] for i in detail["extendedIngredients"]],
        "nutrition": key_nutrients
    }
