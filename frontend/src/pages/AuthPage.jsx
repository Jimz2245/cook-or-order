import { useState } from "react"
import { login, register } from "../api"

export default function AuthPage({ onSuccess }) {
    const [mode, setMode] = useState("login")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setLoading(true)
        if (mode === "login") {
            login(email, password)
                .then(onSuccess)
                .catch(err => setError("Login failed"))
                .finally(() => setLoading(false))
        } else {
            register(email, password)
                .then(() => login(email, password))
                .then(onSuccess)
                .catch(err => setError("Registration failed"))
                .finally(() => setLoading(false))
        }
        // if mode is "login" call login(), else call register() then login()
        // on success call onSuccess()
        // catch errors and set error message
    }

    return (
        <div style={{ maxWidth: 380, margin: "80px auto" }}>
            <h2>{mode === "login" ? "Sign in" : "Create account"}</h2>
            {/* email input */}
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            {/* password input */}
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            {/* error message */}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {/* submit button */}
            <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Loading..." : "Submit"}
            </button>
            {/* toggle between login and register */}
            <button onClick={() => setMode(mode === "login" ? "register" : "login")}>
                {mode === "login" ? "Create an account" : "Already have an account?"}
            </button>
        </div>
    )
}