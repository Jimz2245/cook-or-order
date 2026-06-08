import { useState } from "react"
import IngredientInput from "../components/IngredientInput"
import { compare, getPantry } from "../api"

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
        <div>
            <h1>Cook or Order?</h1>
            <IngredientInput
                ingredients={ingredients}
                setIngredients={setIngredients}
                onLoadPantry={isLoggedIn ? handleLoadPantry : null}
            />
            <button onClick={handleCompare} disabled={loading || ingredients.length === 0}>
                {loading ? "Finding recipes..." : "Compare →"}
            </button>
            {error && <p>{error}</p>}
            {/* Show results when they exist */}
            {results && (
                <div>
                    <h2>Recipes you can make:</h2>
                    <ul>
                        {results.recipes.map(r => (
                            <li key={r.id}>{r.title}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}