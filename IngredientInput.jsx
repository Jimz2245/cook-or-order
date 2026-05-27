import { useState } from "react";

export default function IngredientInput({ ingredients, setIngredients, onLoadPantry }) {
  const [input, setInput] = useState("");

  const addIngredient = () => {
    const trimmed = input.trim().toLowerCase();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
    }
    setInput("");
  };

  const removeIngredient = (item) => {
    setIngredients(ingredients.filter((i) => i !== item));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addIngredient();
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add an ingredient (e.g. chicken)"
          style={{
            flex: 1,
            padding: "10px 14px",
            border: "1.5px solid #ddd",
            borderRadius: 8,
            fontSize: "1rem",
          }}
        />
        <button
          onClick={addIngredient}
          style={{
            padding: "10px 18px",
            background: "#f0f0f0",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          + Add
        </button>
        {onLoadPantry && (
          <button
            onClick={onLoadPantry}
            style={{
              padding: "10px 14px",
              background: "#fff",
              border: "1.5px solid #ddd",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            📦 Load pantry
          </button>
        )}
      </div>

      {/* Ingredient tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
        {ingredients.map((item) => (
          <span
            key={item}
            style={{
              background: "#1a1a1a",
              color: "white",
              padding: "6px 12px",
              borderRadius: 20,
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {item}
            <span
              onClick={() => removeIngredient(item)}
              style={{ cursor: "pointer", opacity: 0.7, fontSize: "1.1rem" }}
            >
              ×
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
