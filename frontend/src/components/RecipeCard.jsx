export default function RecipeCard({ recipe }) {
    return (
        <div style={{
            border: "1.5px solid #eee",
            borderRadius: "12px",
            overflow: "hidden",
            cursor: "pointer",
            background: "white"
        }}>
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
        </div>
    )
}