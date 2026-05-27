import os
import httpx
import anthropic
import asyncio
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.models import User, SearchHistory
from routes.dependencies import get_current_user

router = APIRouter()

SPOONACULAR_API_KEY = os.getenv("SPOONACULAR_API_KEY")
claude_client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


# --- Schemas ---

class CompareRequest(BaseModel):
    ingredients: list[str]

class RecipeResult(BaseModel):
    id: int
    title: str
    image: str
    used_ingredient_count: int
    missed_ingredient_count: int
    missed_ingredients: list[str]

class CostEstimate(BaseModel):
    dish_name: str
    estimated_cost: float
    reasoning: str

class CompareResponse(BaseModel):
    recipes: list[RecipeResult]
    cost_estimate: CostEstimate


# --- Helpers ---

async def fetch_recipes(ingredients: list[str]) -> list[dict]:
    """Call Spoonacular to find recipes matching the given ingredients."""
    url = "https://api.spoonacular.com/recipes/findByIngredients"
    params = {
        "ingredients": ",".join(ingredients),
        "number": 3,
        "ranking": 1,          # Maximize used ingredients
        "ignorePantry": True,
        "apiKey": SPOONACULAR_API_KEY,
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        return response.json()


async def estimate_cost_with_claude(ingredients: list[str], recipes: list[dict]) -> CostEstimate:
    """Ask Claude to estimate what it would cost to order these dishes vs. making them."""
    recipe_names = [r["title"] for r in recipes]

    prompt = f"""
    A user has these ingredients: {", ".join(ingredients)}
    
    They could make one of these dishes: {", ".join(recipe_names)}
    
    Pick the most likely dish they'd order and estimate:
    1. What it would cost to order this from a typical delivery app (include fees + tip)
    2. A brief one-sentence reason for your estimate
    
    Respond ONLY with valid JSON in this exact format, no other text:
    {{
        "dish_name": "Chicken Fried Rice",
        "estimated_cost": 18.50,
        "reasoning": "Typical delivery order with $3 fee and 20% tip from a local Chinese spot."
    }}
    """

    # TODO: In production, run this async with asyncio — for now sync is fine
    message = claude_client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=300,
        messages=[{"role": "user", "content": prompt}]
    )

    import json
    raw = message.content[0].text.strip()
    data = json.loads(raw)
    return CostEstimate(**data)


# --- Routes ---

@router.post("/compare", response_model=CompareResponse)
async def compare(
    body: CompareRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)  # Auth optional
):
    if not body.ingredients:
        raise HTTPException(status_code=400, detail="Please provide at least one ingredient")
    if len(body.ingredients) > 20:
        raise HTTPException(status_code=400, detail="Max 20 ingredients allowed")

    # Run Spoonacular fetch first, then use results for Claude
    try:
        raw_recipes = await fetch_recipes(body.ingredients)
    except httpx.HTTPError:
        raise HTTPException(status_code=503, detail="Recipe service unavailable, try again later")

    if not raw_recipes:
        raise HTTPException(status_code=404, detail="No recipes found with those ingredients")

    # Format recipes
    recipes = [
        RecipeResult(
            id=r["id"],
            title=r["title"],
            image=r["image"],
            used_ingredient_count=r["usedIngredientCount"],
            missed_ingredient_count=r["missedIngredientCount"],
            missed_ingredients=[i["name"] for i in r.get("missedIngredients", [])],
        )
        for r in raw_recipes
    ]

    # Get cost estimate from Claude
    try:
        cost_estimate = await estimate_cost_with_claude(body.ingredients, raw_recipes)
    except Exception:
        # Don't fail the whole request if Claude is down
        cost_estimate = CostEstimate(
            dish_name=raw_recipes[0]["title"],
            estimated_cost=0,
            reasoning="Cost estimate unavailable right now"
        )

    # Save search to history if user is logged in
    if current_user:
        history_entry = SearchHistory(
            user_id=current_user.id,
            ingredients_used=",".join(body.ingredients)
        )
        db.add(history_entry)
        db.commit()

    return CompareResponse(recipes=recipes, cost_estimate=cost_estimate)


@router.get("/recipes/{recipe_id}")
async def get_recipe_detail(recipe_id: int):
    """Get full recipe details including steps from Spoonacular."""
    url = f"https://api.spoonacular.com/recipes/{recipe_id}/information"
    params = {"apiKey": SPOONACULAR_API_KEY, "includeNutrition": False}

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="Recipe not found")
        response.raise_for_status()
        return response.json()
