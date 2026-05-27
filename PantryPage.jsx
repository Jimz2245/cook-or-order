import { useState, useEffect } from "react";
import { getPantry, addPantryItem, deletePantryItem } from "../utils/auth";

export default function PantryPage() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPantry().then((data) => {
      setItems(data.items);
      setLoading(false);
    });
  }, []);

  const handleAdd = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const newItem = await addPantryItem(trimmed);
    setItems([...items, newItem]);
    setInput("");
  };

  const handleDelete = async (id) => {
    // Optimistic update: remove from UI first, then confirm with backend
    setItems(items.filter((i) => i.id !== id));
    await deletePantryItem(id);
  };

  return (
    <div>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: 8 }}>My Pantry</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>Save your staples so you don't retype them every time.</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add ingredient..."
          style={{ flex: 1, padding: "10px 14px", border: "1.5px solid #ddd", borderRadius: 8, fontSize: "1rem" }}
        />
        <button onClick={handleAdd} style={{ padding: "10px 20px", background: "#1a1a1a", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}>
          Add
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && items.length === 0 && (
        <p style={{ color: "#999" }}>No pantry items yet. Add some above!</p>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {items.map((item) => (
          <span
            key={item.id}
            style={{
              background: "#f0f0f0",
              padding: "8px 14px",
              borderRadius: 20,
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {item.ingredient}
            <span onClick={() => handleDelete(item.id)} style={{ cursor: "pointer", color: "#999" }}>×</span>
          </span>
        ))}
      </div>
    </div>
  );
}
