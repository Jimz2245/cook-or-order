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
                <button onClick={addIngredient}
                    style = {{ background: "#e5e5e5", border: "none", borderRadius: 8, padding: "4px 8px", cursor: "pointer", fontWeight: "500" }}>Add</button>
                {onLoadPantry && <button onClick={onLoadPantry}>Load Pantry</button>}
            </div>

            {/* Ingredient tags — spaced below the input */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                {ingredients.map((item) => (
                    <span key={item} style={{ background: "#FFF0E6", 
                                            padding: "4px 8px", 
                                            borderRadius: "4px", 
                                            border: "1px solid #FFA07A", 
                                            fontSize: "14px",
                                            display: "inline-flex",
                                            alignItems: "center" }}>
                        {item}
                        <button 
                            onClick={() => setIngredients(ingredients.filter(i => i !== item))}
                            style={{ 
                                background: "none", 
                                border: "none", 
                                cursor: "pointer", 
                                marginLeft: 6, 
                                color: "#F97316",
                                fontSize: "16px",
                                lineHeight: 1,
                                padding: 0
                            }}
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
        </div>
    )
}