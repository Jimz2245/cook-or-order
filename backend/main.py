from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI() # Creates the server
#start with "uvicorn main:app --reload"

# This defines what the request body must look like
class IngredientsRequest(BaseModel):
    ingredients: list[str]

@app.get("/health") # a GET request to this endpoint will trigger the function below
def health_check():
    return {"status": "ok"} #sends this back

# You can have as many routes as you want. Every feature of your app will be a new route:

@app.post("/api/ingredients")
def receive_ingredients(body: IngredientsRequest):
    return {
        "received": body.ingredients,
        "count": len(body.ingredients)
    }