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
        <div>
            <h2>My Pantry</h2>
            <ul>
                {items.map(item => (
                    <li key={item.id}>
                        {item.ingredient}
                        <button onClick={() => handleDelete(item.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Add a new item"
            />
            <button onClick={handleAdd}>Add</button>
        </div>
    )
}