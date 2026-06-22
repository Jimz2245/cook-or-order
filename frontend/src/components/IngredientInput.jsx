import { useState } from "react"

export default function IngredientInput({ ingredients, setIngredients, onLoadPantry }) {
    const [input, setInput] = useState("")

    const addIngredient = () => {
        const trimmed = input.trim()
        if (trimmed && !ingredients.includes(trimmed)) {
            setIngredients([...ingredients, trimmed])
            setInput("")
        }
    }

    return (
        <div>
            {/* Input row */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addIngredient()}
                    placeholder="Add an ingredient..."
                />
                <button onClick={addIngredient}>Add</button>
                {onLoadPantry && <button onClick={onLoadPantry}>Load Pantry</button>}
            </div>

            {/* Ingredient tags — spaced below the input */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                {ingredients.map((item) => (
                    <span key={item}>
                        {item}
                        <button onClick={() => setIngredients(ingredients.filter(i => i !== item))}>×</button>
                    </span>
                ))}
            </div>
        </div>
    )
}