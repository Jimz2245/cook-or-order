# 🍳 Cook or Order

Cook or Order is a full-stack web app that helps you decide whether to cook or order food. Enter ingredients from your fridge, get matching recipes, and see an AI-powered cost comparison between making it at home vs. ordering delivery. Each recipe also includes a full nutritional breakdown.

**Live Demo:** https://cook-or-order.vercel.app

---

## Features

- 🔍 Ingredient-based recipe search powered by Spoonacular API
- 💰 AI-generated cost comparison (home cooking vs. delivery) using OpenRouter LLM
- 🥗 Nutritional breakdown per recipe (calories, protein, carbs, fat)
- 🛒 Personal pantry to save your staple ingredients
- 📋 Search history to track past comparisons
- 🔐 User authentication with JWT

---

## Tech Stack

**Frontend:** React, Vite, deployed on Vercel  
**Backend:** FastAPI (Python), deployed on Render  
**Database:** PostgreSQL (Supabase)  
**APIs:** Spoonacular (recipes), OpenRouter LLM (cost estimation)  
**Auth:** JWT with bcrypt password hashing

---

## Running Locally

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Create a `.env` file in the `backend` folder:
```
DATABASE_URL=your_postgresql_url
SECRET_KEY=your_secret_key
SPOONACULAR_API_KEY=your_spoonacular_key
OPENROUTER_API_KEY=your_openrouter_key
```