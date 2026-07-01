import { useState } from "react"
import { getRecipeDetail } from "../api"

export default function RecipeCard({ recipe }) {
    const [open, setOpen] = useState(false)
    const [detail, setDetail] = useState(null)

    const handleClick = async () => {
        setOpen(true)
        const data = await getRecipeDetail(recipe.id)
        setDetail(data)
    }

    return (
        <div
            style={{
                border: "1.5px solid #eee",
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                background: "white"
            }}
            onClick={handleClick}
        >
            <img src={recipe.image} alt={recipe.title} style={{ width: "100%", height: 160, objectFit: "cover" }} />
            <div style={{ padding: 16 }}>
                <h3 style={{ margin: "0 0 8px" }}>{recipe.title}</h3>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>
                    ✅ Uses {recipe.usedCount} of your ingredients
                </p>
                {recipe.missedCount > 0 && (
                    <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#999" }}>
                        🛒 Missing: {recipe.missedIngredients.slice(0, 2).join(", ")}
                        {recipe.missedCount > 2 && ` +${recipe.missedCount - 2} more`}
                    </p>
                )}
            </div>
            {open && (
            <div 
                onClick={() => setOpen(false)}
                style={{
                    position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
                    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200
                }}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: "white", borderRadius: 16, padding: 32,
                        maxWidth: 560, width: "90%", maxHeight: "80vh", overflowY: "auto"
                    }}
                >
                    {detail ? (
                        <>
                            <h2>{detail.title}</h2>
                            <p>⏱ {detail.readyInMinutes} min · 🍽 {detail.servings} servings</p>
                            <h3>Nutrition</h3>
                            <p>🔥 {detail.nutrition.Calories} cal · 💪 {detail.nutrition.Protein}g protein · 🍞 {detail.nutrition.Carbohydrates}g carbs · 🧈 {detail.nutrition.Fat}g fat</p>
                            <h3>Ingredients</h3>
                            <ul>{detail.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}</ul>
                            <h3>Instructions</h3>
                            <p style={{ lineHeight: 1.6 }}>{detail.instructions}</p>
                            <button onClick={() => setOpen(false)} style={{ marginTop: 16, padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", background: "var(--accent)", color: "white" }}>Close</button>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
        )}
        </div>
    )
}