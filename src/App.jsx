import { useState } from "react";
import RankingPage from "./pages/RankingPage";
import TimesPage from "./pages/TimesPage";
import { isMock } from "./lib/supabase";

const PAGES = [
  { id: "ranking", label: "🏆 Ranking", component: RankingPage },
  { id: "times",   label: "⚽ Times",   component: TimesPage },
];

export default function App() {
  const [page, setPage] = useState("ranking");
  const Current = (PAGES.find(p => p.id === page) ?? PAGES[0]).component;

  return (
    <div>
      <nav style={{
        background: "#0f172a", borderBottom: "1px solid #1e293b",
        padding: "12px 24px", display: "flex", gap: 16, position: "sticky", top: 0, zIndex: 100,
        alignItems: "center"
      }}>
        {PAGES.map(p => (
          <button key={p.id} onClick={() => setPage(p.id)} style={{
            background: page === p.id ? "#3b82f6" : "transparent",
            border: "none", color: page === p.id ? "#fff" : "#64748b",
            padding: "6px 16px", borderRadius: 6, cursor: "pointer",
            fontWeight: 600, fontSize: 14, transition: "all 0.15s"
          }}>
            {p.label}
          </button>
        ))}
        {isMock && (
          <span
            title="Dados mockados — alterne com VITE_USE_MOCK no .env"
            style={{
              marginLeft: "auto",
              background: "#facc15",
              color: "#0f172a",
              padding: "4px 10px",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 0.5,
            }}
          >
            MODO DEMO
          </span>
        )}
      </nav>
      <Current />
    </div>
  );
}
