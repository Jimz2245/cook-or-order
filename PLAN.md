# Cook or Order — Full Build Plan

## What You're Building
A web app where users enter ingredients they have, get 3 recipes they can make, and see an AI-estimated cost comparison vs. ordering takeout. Users can save pantry staples so they don't retype every time.

## Tech Stack
- **Backend**: FastAPI (Python) + PostgreSQL
- **Frontend**: React.js (you already know this)
- **External APIs**: Spoonacular (recipes), Claude API (cost estimation + recipe narrative)
- **Auth**: JWT (JSON Web Tokens)
- **Deployment**: Railway (backend + DB), Vercel (frontend)

---

## Week 1 — Backend Foundations
*Goal: A working API that takes ingredients and returns recipes*

### Day 1 — Environment Setup (2 hrs)
**Learn**: What is a virtual environment, pip, and why we isolate dependencies
- Install Python, create a virtual environment: `python -m venv venv`
- Install FastAPI and Uvicorn: `pip install fastapi uvicorn`
- Run your first server: `uvicorn main:app --reload`
- Explore `http://localhost:8000/docs` — FastAPI auto-generates this, it's magic
- **Milestone**: Server runs, `/health` endpoint returns `{ "status": "ok" }`

### Day 2 — Your First Real Endpoint (2 hrs)
**Learn**: HTTP methods (GET vs POST), request/response bodies, Pydantic models
- Build a POST endpoint `/api/ingredients` that accepts a list of ingredients
- Learn Pydantic: how FastAPI validates incoming data automatically
- Return a hardcoded mock recipe response (no external API yet)
- **Milestone**: Send ingredients via `/docs`, get a response back

### Day 3 — Spoonacular Integration (2 hrs)
**Learn**: How to call external APIs with `httpx`, environment variables, `.env` files
- Sign up for Spoonacular free tier (150 req/day)
- Store API key in `.env`, load it with `python-dotenv`
- Wire up `/api/recipes` to call Spoonacular's `findByIngredients` endpoint
- **Milestone**: Real recipes come back based on real ingredients

### Day 4 — PostgreSQL + SQLAlchemy (2 hrs)
**Learn**: What a relational database is, tables, rows, ORM basics
- Install PostgreSQL locally (or use Railway's free DB right away)
- Install SQLAlchemy + psycopg2: `pip install sqlalchemy psycopg2-binary`
- Create your first table: `users` with id, email, hashed_password
- **Milestone**: Database exists, can write and read a test row

### Day 5 — User Auth Part 1: Registration (2 hrs)
**Learn**: Password hashing (bcrypt), why you NEVER store plain passwords
- Install: `pip install passlib[bcrypt] python-jose`
- Build `POST /api/auth/register` — accepts email + password, hashes it, saves to DB
- Return a success message (no JWT yet)
- **Milestone**: Register a user, see them in the database

### Day 6 — User Auth Part 2: Login + JWT (2 hrs)
**Learn**: What JWT is, tokens vs sessions, why stateless auth matters
- Build `POST /api/auth/login` — verify password hash, return a JWT token
- Create a `get_current_user` dependency that validates the token on protected routes
- **Milestone**: Login returns a token, protected routes reject invalid tokens

### Day 7 — Pantry Storage (2 hrs)
**Learn**: Foreign keys, relating tables, authenticated endpoints
- Create `pantry_items` table (user_id → ingredient name)
- Build CRUD: save ingredients, get saved ingredients, delete one
- Lock these behind auth — only you can see your pantry
- **Milestone**: Log in, save "chicken, rice, garlic", retrieve them on next visit

---

## Week 2 — Core Features
*Goal: The full cook vs. order comparison working end-to-end*

### Day 8 — Claude API Integration (2 hrs)
**Learn**: Prompt engineering, system prompts, structured AI output
- Sign up for Claude API (Anthropic Console)
- Send ingredients + recipe name to Claude, ask it to estimate takeout cost
- Ask Claude to respond in JSON: `{ "dish": "...", "estimated_cost": 12.50, "reasoning": "..." }`
- **Milestone**: Get a real cost estimate back from Claude

### Day 9 — The Main Comparison Endpoint (2 hrs)
**Learn**: Async functions, running multiple API calls efficiently
- Build `POST /api/compare` — the heart of the app
- Calls Spoonacular for recipes AND Claude for cost estimate in parallel
- Returns: recipes array + cost comparison object
- **Milestone**: One API call gives you everything the frontend needs

### Day 10 — Recipe Detail Endpoint (2 hrs)
**Learn**: Path parameters, data modeling, nested responses
- Build `GET /api/recipes/{id}` using Spoonacular's recipe info endpoint
- Return: ingredients, steps, cook time, servings
- Add a Claude layer: generate a friendly "why make this tonight" blurb
- **Milestone**: Click a recipe, get full details + an AI-written summary

### Day 11 — Error Handling + Validation (2 hrs)
**Learn**: HTTP status codes, exception handling, defensive programming
- What happens if Spoonacular is down? If the user sends no ingredients?
- Add proper error responses: 400 (bad input), 404 (not found), 503 (external API down)
- Add input validation: minimum 1 ingredient, max 20, no empty strings
- **Milestone**: App handles bad inputs gracefully instead of crashing

### Day 12 — Search History (2 hrs)
**Learn**: Timestamps, ordering queries, pagination basics
- Create `search_history` table: user_id, ingredients_used, timestamp
- Save every comparison search automatically when logged in
- Build `GET /api/history` — return last 10 searches
- **Milestone**: Users can see what they searched before

### Day 13 — Testing Your API (2 hrs)
**Learn**: Why testing matters, pytest basics, mocking external APIs
- Install pytest: `pip install pytest pytest-asyncio httpx`
- Write 3 tests: register user, login, call /api/compare with mock data
- **Milestone**: `pytest` runs and all 3 tests pass

### Day 14 — Buffer / Catch-Up Day
Use this to finish anything from Week 1-2, or revisit concepts that didn't click.

---

## Week 3 — Frontend
*Goal: A polished React UI wired to your real backend*

### Day 15 — Project Setup + Auth UI (2 hrs)
**Learn**: Connecting React to a backend API, storing JWT in localStorage
- Create React app, install axios for API calls
- Build login + register forms
- On login, store JWT token, redirect to main page
- **Milestone**: Can log in through the UI, token stored

### Day 16 — Ingredient Input Component (2 hrs)
**Learn**: Controlled components, dynamic list state in React
- Build the ingredient input: type an ingredient, hit enter to add, click × to remove
- Show saved pantry items with a "load my pantry" button
- **Milestone**: Interactive ingredient builder works

### Day 17 — Results Page (2 hrs)
**Learn**: Loading states, conditional rendering, mapping API data to UI
- Call `/api/compare` when user submits ingredients
- Show loading spinner while waiting
- Display 3 recipe cards + the cost comparison panel side by side
- **Milestone**: Full flow works: input → submit → see results

### Day 18 — Recipe Detail Modal (2 hrs)
**Learn**: React portals, modals, managing nested state
- Click a recipe card → modal opens with full ingredients + steps
- Show the Claude-generated "why make this" blurb
- Add a "save to pantry" button for ingredients you don't have
- **Milestone**: Clicking any recipe shows full detail

### Day 19 — Pantry Manager Page (2 hrs)
**Learn**: CRUD in the frontend, optimistic UI updates
- Build a /pantry page: see saved ingredients, add new ones, delete old ones
- Optimistic update: remove item from UI immediately, then confirm with backend
- **Milestone**: Full pantry management works

### Day 20 — Polish + Mobile (2 hrs)
**Learn**: CSS media queries, responsive design review (you know this)
- Make every page look good on mobile
- Add empty states ("You have no pantry items yet"), error messages
- Smooth loading transitions
- **Milestone**: App looks good on phone and desktop

### Day 21 — Buffer / Catch-Up Day

---

## Week 4 — Deploy + Stretch Features
*Goal: Live on the internet with a real URL*

### Day 22 — Deploy Backend to Railway (2 hrs)
**Learn**: Environment variables in production, Procfiles, database migrations
- Create Railway account, connect your GitHub repo
- Add your `.env` variables in Railway's dashboard
- Run database migrations on production DB
- **Milestone**: `https://your-app.railway.app/docs` is live

### Day 23 — Deploy Frontend to Vercel (2 hrs)
**Learn**: Build processes, environment variables in React (`VITE_API_URL`)
- Connect GitHub repo to Vercel
- Set `VITE_API_URL` to your Railway backend URL
- Fix any CORS issues (common gotcha — backend needs to allow your frontend's domain)
- **Milestone**: Full app live at a real URL you can share

### Day 24 — Stretch: "I have $20" Mode (2 hrs)
- User enters a budget
- Claude suggests what 3-5 ingredients to buy that unlock the most recipes
- Calls Spoonacular to validate those recipes are real
- **Milestone**: Budget mode works end to end

### Day 25 — Stretch: Nutrition Comparison (2 hrs)
- Pull nutrition data from Spoonacular for each recipe
- Estimate takeout nutrition using Claude (approximate)
- Show calories, protein side-by-side in the comparison panel
- **Milestone**: Users see health tradeoff not just cost

### Day 26-28 — Final Polish + README
- Record a short demo video (huge for resumes — embed it in your README)
- Write a thorough README: what it does, how to run it locally, tech stack, screenshots
- Clean up console.logs, remove test routes, finalize error handling
- **Milestone**: Someone else can clone and run your project in under 5 minutes

---

## Key Concepts Map
*Everything you'll actually understand by the end*

| Concept | Where You'll Learn It |
|---|---|
| REST API design | Week 1, Days 1-3 |
| Relational databases + SQL | Week 1, Day 4 |
| Password hashing + JWT auth | Week 1, Days 5-6 |
| External API integration | Week 1, Day 3 + Week 2, Day 8 |
| Prompt engineering | Week 2, Day 8 |
| Async programming | Week 2, Day 9 |
| Error handling | Week 2, Day 11 |
| Testing | Week 2, Day 13 |
| Full-stack wiring | Week 3 |
| Deployment | Week 4 |

---

## Resources
- FastAPI docs: https://fastapi.tiangolo.com (genuinely great docs)
- Spoonacular API: https://spoonacular.com/food-api
- Anthropic API: https://docs.anthropic.com
- SQLAlchemy: https://docs.sqlalchemy.org
- Railway: https://railway.app
- Vercel: https://vercel.com
