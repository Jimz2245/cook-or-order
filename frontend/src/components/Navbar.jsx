import { UtensilsCrossed, ShoppingBasket, Clock, LogOut, LogIn } from "lucide-react"
import { useState } from "react"

export default function Navbar({ page, setPage, isLoggedIn, onLogout }) {
    const [tooltip, setTooltip] = useState(null)

    const NavButton = ({ icon, label, onClick }) => (
        <div style={{ position: "relative" }}>
            <button
                onClick={onClick}
                style={{ background: tooltip === label ? "#f0f0f0" : "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 8 }}
                onMouseEnter={() => setTooltip(label)}
                onMouseLeave={() => setTooltip(null)}
            >
                {icon}
            </button>
            {tooltip === label && (
                <span style={{
                    position: "absolute", top: "100%", left: "50%",
                    transform: "translateX(-50%)", background: "#1a1a1a",
                    color: "white", padding: "4px 8px", borderRadius: "4px",
                    fontSize: "12px", whiteSpace: "nowrap", marginTop: "4px",
                    zIndex: 200
                }}>
                    {label}
                </span>
            )}
        </div>
    )

    return (
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 32px", height: 56, background: "#ffffff", borderBottom: "1px solid #eee", position: "sticky", top: 0, zIndex: 100 }}>
            <span style={{ fontWeight: "bold", fontSize: "18px" }}>🍳 Cook or Order</span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <NavButton icon={<UtensilsCrossed />} label="Compare" onClick={() => setPage("compare")} />
                <NavButton icon={<ShoppingBasket />} label="Pantry" onClick={() => setPage("pantry")} />
                <NavButton icon={<Clock />} label="History" onClick={() => setPage("history")} />
                {isLoggedIn
                    ? <NavButton icon={<LogOut />} label="Sign Out" onClick={onLogout} />
                    : <NavButton icon={<LogIn />} label="Sign In" onClick={() => setPage("auth")} />
                }
            </div>
        </nav>
    )
}