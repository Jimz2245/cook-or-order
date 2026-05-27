import { useState, useEffect } from "react";
import ComparePage from "./pages/ComparePage";
import PantryPage from "./pages/PantryPage";
import AuthPage from "./pages/AuthPage";
import HistoryPage from "./pages/HistoryPage";
import Navbar from "./components/Navbar";
import { getToken, removeToken } from "./utils/auth";

export default function App() {
  const [page, setPage] = useState("compare");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getToken());
  }, []);

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    setPage("compare");
  };

  // Show auth page if user clicked login
  if (page === "auth") {
    return <AuthPage onSuccess={() => { setIsLoggedIn(true); setPage("compare"); }} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf8" }}>
      <Navbar
        page={page}
        setPage={setPage}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
        {page === "compare" && <ComparePage isLoggedIn={isLoggedIn} />}
        {page === "pantry" && (isLoggedIn ? <PantryPage /> : <AuthPage onSuccess={() => setIsLoggedIn(true)} />)}
        {page === "history" && (isLoggedIn ? <HistoryPage /> : <AuthPage onSuccess={() => setIsLoggedIn(true)} />)}
      </main>
    </div>
  );
}
