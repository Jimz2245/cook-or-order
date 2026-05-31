from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import httpx

load_dotenv()  # reads your .env file
API_KEY = os.getenv("SPOONACULAR_API_KEY")  # grabs the value by name

app = FastAPI() # Creates the server
#start with "uvicorn main:app --reload"

# This defines what the request body must look like
class IngredientsRequest(BaseModel):
    ingredients: list[str]

def fetch_recipes(ingredients):
    response = httpx.get(
        "https://api.spoonacular.com/recipes/findByIngredients",
        params={
            "ingredients": ",".join(ingredients),
            "number": 3,
            "apiKey": API_KEY
        }
    )
    return response.json()

@app.get("/health") # a GET request to this endpoint will trigger the function below
def health_check():
    return {"status": "ok"} #sends this back

# You can have as many routes as you want. Every feature of your app will be a new route:

@app.post("/api/recipes")
def get_recipes(body: IngredientsRequest):
    recipes = fetch_recipes(body.ingredients)
    return {"recipes": recipes}