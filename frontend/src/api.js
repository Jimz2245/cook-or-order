const BASE_URL = "http://localhost:8000"

export const getToken = () => localStorage.getItem("token")
export const setToken = (token) => localStorage.setItem("token", token)
export const removeToken = () => localStorage.removeItem("token")

export async function login(email, password) {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    setToken(data.access_token)
    return data
}

export async function register(email, password) {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    return await res.json()
}

export async function compare(ingredients) {
    const res = await fetch(`${BASE_URL}/api/compare`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({ ingredients })
    })
    return await res.json()
}

export async function getPantry() {
    const res = await fetch(`${BASE_URL}/api/pantry`, {
        headers: { "Authorization": `Bearer ${getToken()}` }
    })
    return await res.json()
}

export async function addPantryItem(ingredient) {
    const res = await fetch(`${BASE_URL}/api/pantry/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({ ingredient })
    })
    return await res.json()
}

export async function deletePantryItem(id) {
    const res = await fetch(`${BASE_URL}/api/pantry/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${getToken()}` }
    })
    return await res.json()
}

export async function getHistory() {
    const res = await fetch(`${BASE_URL}/api/history/`, {
        headers: { "Authorization": `Bearer ${getToken()}` }
    })
    return await res.json()
}

export async function getRecipeDetail(id) {
    const res = await fetch(`${BASE_URL}/api/recipes/${id}`)
    return await res.json()
}