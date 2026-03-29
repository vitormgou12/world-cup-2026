import { useState } from "react";
import RankingPage from "./pages/RankingPage";
import BolaoPage from "./pages/BolaoPage";

export default function App() {
  const [page, setPage] = useState("ranking");

  return (
    <div>
      <nav style={{
        background: "#0f172a", borderBottom: "1px solid #1e293b",
        padding: "12px 24px", display: "flex", gap: 16, position: "sticky", top: 0, zIndex: 100
      }}>
        {["ranking", "bolao"].map(p => (
          <button key={p} onClick={() => setPage(p)} style={{
            background: page === p ? "#3b82f6" : "transparent",
            border: "none", color: page === p ? "#fff" : "#64748b",
            padding: "6px 16px", borderRadius: 6, cursor: "pointer",
            fontWeight: 600, fontSize: 14, transition: "all 0.15s"
          }}>
            {p === "ranking" ? "🏆 Ranking" : "🌍 Bolão"}
          </button>
        ))}
      </nav>
      {page === "ranking" ? <RankingPage /> : <BolaoPage />}
    </div>
  );
}
