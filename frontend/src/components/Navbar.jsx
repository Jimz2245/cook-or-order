export default function Navbar({ page, setPage, isLoggedIn, onLogout }) {
    return (
        <nav>
            {/* App name on the left */}
            <span>🍳 Cook or Order</span>

            {/* Nav links on the right */}
            <div>
                {/* Three buttons: Compare, Pantry, History */}
                <button onClick={() => setPage("compare")}>Compare</button>
                <button onClick={() => setPage("pantry")}>Pantry</button>
                <button onClick={() => setPage("history")}>History</button>

                {/* Sign in or Sign out depending on isLoggedIn */}
                {isLoggedIn 
                    ? <button onClick={onLogout}>Sign Out</button>
                    : <button onClick={() => setPage("auth")}>Sign In</button>
                }
            </div>
        </nav>
    )
}