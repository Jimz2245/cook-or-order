const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// --- Token helpers ---

export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => localStorage.setItem("token", token);
export const removeToken = () => localStorage.removeItem("token");

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}


// --- API calls ---

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Something went wrong" }));
    throw new Error(err.detail || "Request failed");
  }

  return res.json();
}


// Auth
export const register = (email, password) =>
  request("/api/auth/register", { method: "POST", body: JSON.stringify({ email, password }) });

export const login = async (email, password) => {
  const data = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.access_token);
  return data;
};


// Core compare feature
export const compare = (ingredients) =>
  request("/api/compare", { method: "POST", body: JSON.stringify({ ingredients }) });


// Recipe detail
export const getRecipeDetail = (id) => request(`/api/recipes/${id}`);


// Pantry
export const getPantry = () => request("/api/pantry/");
export const addPantryItem = (ingredient) =>
  request("/api/pantry/", { method: "POST", body: JSON.stringify({ ingredient }) });
export const deletePantryItem = (id) =>
  request(`/api/pantry/${id}`, { method: "DELETE" });


// History
export const getHistory = () => request("/api/history/");
