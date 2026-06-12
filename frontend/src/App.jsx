import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import { getToken, removeToken } from "./api"
import ComparePage from "./pages/ComparePage"
import AuthPage from "./pages/AuthPage"
import PantryPage from "./pages/PantryPage"

export default function App() {
    const [page, setPage] = useState("compare")
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        setIsLoggedIn(!!getToken())
    }, [])

    const handleLogout = () => {
        removeToken()
        setIsLoggedIn(false)
        setPage("compare")
    }

    return (
        <div>
            <Navbar
                page={page}
                setPage={setPage}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
            />
            <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem" }}>
                {page === "compare" && <ComparePage isLoggedIn={isLoggedIn} />}
                {page === "auth" && (
                    <AuthPage onSuccess={() => {
                        setIsLoggedIn(true)
                        setPage("compare")
                    }} />
                )}
                {page === "pantry" && (isLoggedIn ? <PantryPage /> : <AuthPage onSuccess={() => { setIsLoggedIn(true); setPage("pantry") }} />)}
            </main>
        </div>
    )
}