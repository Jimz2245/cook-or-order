from openai import OpenAI
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

def estimate_cost(ingredients: list[str], recipe_names: list[str]) -> dict:
    prompt = f"""
    You are a food cost estimator.

    Given these ingredients: {', '.join(ingredients)}
    And these possible recipes: {', '.join(recipe_names)}

    Estimate what it would cost to order the most likely dish from a typical
    food delivery app including fees and tip. Also estimate the cost of making
    it at home with those ingredients.

    Respond ONLY with this exact JSON structure, no other text, no backticks:
    {{
        "cost": "Chicken Fried Rice",
        "deliveryEstimate": 18.50,
        "homeEstimate": 4.20,
        "reasoning": "Typical DoorDash order with $3 fee and 20% tip."
    }}
    """
    response = client.chat.completions.create(
        model="meta-llama/llama-3.1-8b-instruct",
        messages=[{"role": "user", "content": prompt}]
    )
    raw = response.choices[0].message.content
    return json.loads(raw)