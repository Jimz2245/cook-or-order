export default function Navbar({ page, setPage, isLoggedIn, onLogout }) {
  const navItem = (label, key) => (
    <span
      onClick={() => setPage(key)}
      style={{
        cursor: "pointer",
        padding: "6px 12px",
        borderRadius: 6,
        fontWeight: page === key ? 600 : 400,
        background: page === key ? "#1a1a1a" : "transparent",
        color: page === key ? "white" : "#444",
        fontSize: "0.9rem",
      }}
    >
      {label}
    </span>
  );

  return (
    <nav style={{ borderBottom: "1px solid #eee", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "white" }}>
      <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>🍳 Cook or Order</span>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {navItem("Compare", "compare")}
        {navItem("Pantry", "pantry")}
        {navItem("History", "history")}
        {isLoggedIn
          ? <span onClick={onLogout} style={{ cursor: "pointer", fontSize: "0.9rem", color: "#999", marginLeft: 8 }}>Sign out</span>
          : <span onClick={() => setPage("auth")} style={{ cursor: "pointer", fontSize: "0.9rem", fontWeight: 600, marginLeft: 8 }}>Sign in</span>
        }
      </div>
    </nav>
  );
}
