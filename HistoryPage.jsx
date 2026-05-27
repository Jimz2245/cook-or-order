import { useState, useEffect } from "react";
import { getHistory } from "../utils/auth";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory().then((data) => {
      setHistory(data.history);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: 8 }}>Search History</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>Your last 10 ingredient searches.</p>

      {loading && <p>Loading...</p>}

      {!loading && history.length === 0 && (
        <p style={{ color: "#999" }}>No searches yet. Try comparing some ingredients!</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {history.map((entry) => (
          <div
            key={entry.id}
            style={{ background: "white", border: "1.5px solid #eee", borderRadius: 10, padding: "14px 18px" }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
              {entry.ingredients.map((ing) => (
                <span key={ing} style={{ background: "#f5f5f5", padding: "3px 10px", borderRadius: 12, fontSize: "0.8rem" }}>
                  {ing}
                </span>
              ))}
            </div>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#aaa" }}>
              {new Date(entry.searched_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
