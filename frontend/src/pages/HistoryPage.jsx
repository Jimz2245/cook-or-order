import { useState, useEffect } from "react"
import { getHistory } from "../api"

export default function HistoryPage() {
    const [history, setHistory] = useState([])

    useEffect(() => {
        getHistory()
            .then(data => setHistory(data))
            .catch(err => console.error("Failed to load history", err))
    }, [])

    return (
        <div>
            <h2>My Cooking History</h2>
            <ul>
                {history.map(item => (
                    <li key={item.id}>
                        {item.name} - {item.date}
                    </li>
                ))}
            </ul>
        </div>
    )
}