import { useState, useEffect } from "react"
import { getPantry, addPantryItem, deletePantryItem } from "../api"

export default function PantryPage() {
    const [items, setItems] = useState([])
    const [input, setInput] = useState("")

    useEffect(() => {
        // load pantry items when component mounts
        getPantry()
            .then(data => setItems(data.items))
            .catch(err => console.error("Failed to load pantry", err))
    }, [])

    const handleAdd = async () => {
        addPantryItem(input)
            .then(savedItem => {
                setItems([...items, savedItem])
                setInput("")
        })
    }

    const handleDelete = async (id) => {
        deletePantryItem(id)
            .then(() => {
                setItems(items.filter(item => item.id !== id))
            })
            .catch(err => console.error("Failed to delete pantry item", err))
    }

    return (
    <div style={{ paddingTop: 40, maxWidth: 600, margin: "0 auto" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 8 }}>My Pantry</h1>
        <p style={{ color: "#666", marginBottom: 24 }}>Save your staples so you don't retype them every time.</p>

        {/* Add input */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="Add ingredient..."
                style={{ flex: 1, padding: "10px 14px", border: "1.5px solid #ddd", borderRadius: 8, fontSize: "1rem" }}
            />
            <button onClick={handleAdd} style={{ padding: "10px 20px", background: "var(--accent)", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
                Add
            </button>
        </div>

        {loading && <p>Loading...</p>}
        {!loading && items.length === 0 && (
            <p style={{ color: "#999" }}>No pantry items yet. Add some above!</p>
        )}

        {/* Ingredient tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {items.map((item) => (
                <span key={item.id} style={{ background: "#FFF0E6", border: "1px solid #FFA07A", padding: "6px 12px", borderRadius: 20, fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: 8 }}>
                    {item.ingredient}
                    <span onClick={() => handleDelete(item.id)} style={{ cursor: "pointer", color: "#F97316", fontWeight: 600 }}>×</span>
                </span>
            ))}
        </div>
    </div>
    )
}