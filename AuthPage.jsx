import { useState } from "react";
import { login, register } from "../utils/auth";

export default function AuthPage({ onSuccess }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password);
        await login(email, password);
      }
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 380, margin: "80px auto", padding: "0 1rem" }}>
      <h2 style={{ marginBottom: 24 }}>{mode === "login" ? "Sign in" : "Create account"}</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", width: "100%", padding: "10px 14px", marginBottom: 12, borderRadius: 8, border: "1.5px solid #ddd", fontSize: "1rem", boxSizing: "border-box" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        style={{ display: "block", width: "100%", padding: "10px 14px", marginBottom: 16, borderRadius: 8, border: "1.5px solid #ddd", fontSize: "1rem", boxSizing: "border-box" }}
      />

      {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ width: "100%", padding: "12px", background: "#1a1a1a", color: "white", border: "none", borderRadius: 8, fontSize: "1rem", cursor: "pointer" }}
      >
        {loading ? "..." : mode === "login" ? "Sign in" : "Create account"}
      </button>

      <p style={{ marginTop: 16, textAlign: "center", fontSize: "0.9rem" }}>
        {mode === "login" ? "No account? " : "Already have one? "}
        <span
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          style={{ color: "#1a1a1a", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
        >
          {mode === "login" ? "Sign up" : "Sign in"}
        </span>
      </p>
    </div>
  );
}
