import { useState } from "react"
import IngredientInput from "../components/IngredientInput"
import { compare, getPantry } from "../api"
import RecipeCard from "../components/RecipeCard"

export default function ComparePage({ isLoggedIn }) {
    const [ingredients, setIngredients] = useState([])
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleCompare = async () => {
        // 1. set loading to true, clear error
        // 2. call compare(ingredients)
        // 3. set results to the data
        // 4. catch any errors and set error message
        // 5. set loading to false when done
        setLoading(true)
        setError(null)
        compare(ingredients)
            .then(data => setResults(data))
            .catch(err => setError("Failed to find recipes"))
            .finally(() => setLoading(false))
    }

    const handleLoadPantry = async () => {
        // call getPantry(), set ingredients to the items
        setLoading(true)
        setError(null)
        getPantry()
            .then(data => setIngredients(data.items.map(i => i.ingredient)))
            .catch(err => setError("Failed to load pantry"))
            .finally(() => setLoading(false))
    }

    return (
        <div style={{ paddingTop: "40px" }}>
            <h1 style={{ textAlign: "center" }}>Cook or Order?</h1>
            
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <IngredientInput
                    ingredients={ingredients}
                    setIngredients={setIngredients}
                    onLoadPantry={isLoggedIn ? handleLoadPantry : null}
                />
                <button
                    onClick={handleCompare}
                    disabled={loading || ingredients.length === 0}
                    style={{ marginTop: 16, width: 200, background: "var(--accent)", color: "white", borderRadius: "8px", fontWeight: "bold", padding: "8px 16px", border: "none", fontSize: "14px" }}
                >
                    {loading ? "Finding recipes..." : "Compare →"}
                </button>
            </div>

            {error && <p style={{ textAlign: "center" }}>{error}</p>}

            {results && (
                <div>
                    <div style={{ background: "#1a1a1a", color: "white", padding: "20px", borderRadius: "12px", marginTop: "20px" }}>
                        <p>Ordering {results.cost_estimate.cost} would cost ~${results.cost_estimate.deliveryEstimate}</p>
                        <p>Making it at home would cost ~${results.cost_estimate.homeEstimate}</p>
                        <p style={{ opacity: 0.7 }}>{results.cost_estimate.reasoning}</p>
                    </div>
                    <h2>Recipes you can make:</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginTop: 24 }}>
                        {results.recipes.map(r => (
                            <RecipeCard key={r.id} recipe={r} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}