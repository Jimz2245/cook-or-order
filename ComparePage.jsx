import { useState } from "react";
import { compare, getPantry } from "../utils/auth";
import RecipeCard from "../components/RecipeCard";
import CostPanel from "../components/CostPanel";
import IngredientInput from "../components/IngredientInput";

export default function ComparePage({ isLoggedIn }) {
  const [ingredients, setIngredients] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCompare = async () => {
    if (ingredients.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const data = await compare(ingredients);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadPantry = async () => {
    try {
      const data = await getPantry();
      setIngredients(data.items.map((i) => i.ingredient));
    } catch {
      alert("Log in to load your pantry");
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 4 }}>Cook or Order?</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        Enter what's in your fridge. We'll tell you what to make — and whether it's worth ordering instead.
      </p>

      <IngredientInput
        ingredients={ingredients}
        setIngredients={setIngredients}
        onLoadPantry={isLoggedIn ? loadPantry : null}
      />

      <button
        onClick={handleCompare}
        disabled={loading || ingredients.length === 0}
        style={{
          marginTop: 16,
          padding: "12px 28px",
          background: ingredients.length === 0 ? "#ccc" : "#1a1a1a",
          color: "white",
          border: "none",
          borderRadius: 8,
          fontSize: "1rem",
          cursor: ingredients.length === 0 ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Finding recipes..." : "Compare →"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: 16 }}>{error}</p>
      )}

      {results && (
        <div style={{ marginTop: 40 }}>
          <CostPanel estimate={results.cost_estimate} />
          <h2 style={{ marginTop: 32, marginBottom: 16 }}>What you can make</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {results.recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
