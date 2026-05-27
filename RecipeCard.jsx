import { useState } from "react";
import { getRecipeDetail } from "../utils/auth";

export default function RecipeCard({ recipe }) {
  const [detail, setDetail] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openDetail = async () => {
    setOpen(true);
    if (!detail) {
      setLoading(true);
      try {
        const data = await getRecipeDetail(recipe.id);
        setDetail(data);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div
        onClick={openDetail}
        style={{
          border: "1.5px solid #eee",
          borderRadius: 12,
          overflow: "hidden",
          cursor: "pointer",
          background: "white",
          transition: "box-shadow 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
      >
        <img src={recipe.image} alt={recipe.title} style={{ width: "100%", height: 160, objectFit: "cover" }} />
        <div style={{ padding: 16 }}>
          <h3 style={{ margin: "0 0 8px", fontSize: "1rem" }}>{recipe.title}</h3>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "#666" }}>
            ✅ Uses {recipe.used_ingredient_count} of your ingredients
          </p>
          {recipe.missed_ingredient_count > 0 && (
            <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "#999" }}>
              🛒 Missing: {recipe.missed_ingredients.slice(0, 2).join(", ")}
              {recipe.missed_ingredient_count > 2 && ` +${recipe.missed_ingredient_count - 2} more`}
            </p>
          )}
        </div>
      </div>

      {/* Simple modal */}
      {open && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              background: "white", borderRadius: 16, padding: 32,
              maxWidth: 560, width: "90%", maxHeight: "80vh", overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0 }}>{recipe.title}</h2>
            {loading && <p>Loading recipe details...</p>}
            {detail && (
              <>
                <p style={{ color: "#555" }}>⏱ {detail.readyInMinutes} min · 🍽 {detail.servings} servings</p>
                <h3>Ingredients</h3>
                <ul>
                  {detail.extendedIngredients?.map((ing) => (
                    <li key={ing.id}>{ing.original}</li>
                  ))}
                </ul>
                <h3>Instructions</h3>
                <p style={{ lineHeight: 1.6 }}>{detail.instructions || "No instructions available."}</p>
              </>
            )}
            <button
              onClick={() => setOpen(false)}
              style={{ marginTop: 16, padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
