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
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addIngredient()}
                placeholder="Add an ingredient..."
            />
            <button onClick={addIngredient}>Add</button>
            {/* Load pantry button — only show if onLoadPantry exists */}
            {onLoadPantry && <button onClick={onLoadPantry}>Load Pantry</button>}
            {/* Ingredient tags */}
            <div>
                {ingredients.map((item) => (
                    <span key={item}>
                        {item}
                        {/* × button to remove */}
                        <button onClick={() => setIngredients(ingredients.filter(i => i !== item))}>×</button>
                    </span>
                ))}
            </div>
        </div>
    )
}