import { useState, useEffect } from "react"
import { getHistory } from "../api"

export default function HistoryPage() {
    const [history, setHistory] = useState([])

    useEffect(() => {
        getHistory()
            .then(data => setHistory(data.history || []))
            .catch(err => console.error("Failed to load history", err))
    }, [])

    return (
    <div style={{ paddingTop: 40, maxWidth: 600, margin: "0 auto" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 8 }}>Search History</h1>
        <p style={{ color: "#666", marginBottom: 24 }}>Your last 10 ingredient searches.</p>

        {history.length === 0 && (
            <p style={{ color: "#999" }}>No searches yet. Try comparing some ingredients!</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {history.map(item => (
                <div key={item.id} style={{ background: "white", border: "1.5px solid #eee", borderRadius: 10, padding: "14px 18px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
                        {item.ingredients.map(ing => (
                            <span key={ing} style={{ background: "#FFF0E6", border: "1px solid #FFA07A", padding: "3px 10px", borderRadius: 12, fontSize: "0.8rem" }}>
                                {ing}
                            </span>
                        ))}
                    </div>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#aaa" }}>
                        {new Date(item.searched_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                </div>
            ))}
        </div>
    </div>
    )
}