import { useState } from "react";

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayStr = yesterday.toISOString().slice(0, 10);

const mockTeams = [
  {
    id: 1, name: "Team Alpha", position: 1, prevPosition: 3,
    points: 142, wins: 8, losses: 2, pending: 2,
    members: ["Ana", "Bruno", "Carlos"],
    predictions: [
      { match: "Brasil x Argentina", home: 60, draw: 25, away: 15, result: "home", correct: true,  date: yesterdayStr },
      { match: "França x Alemanha",  home: 35, draw: 30, away: 35, result: "draw", correct: false, date: yesterdayStr },
      { match: "Espanha x Inglaterra", home: 45, draw: 30, away: 25, result: "home", correct: true, date: "2026-03-27" },
    ]
  },
  {
    id: 2, name: "Team Beta", position: 2, prevPosition: 1,
    points: 128, wins: 7, losses: 3, pending: 2,
    members: ["Diana", "Eduardo"],
    predictions: [
      { match: "Brasil x Argentina", home: 40, draw: 30, away: 30, result: "home", correct: false, date: yesterdayStr },
      { match: "França x Alemanha",  home: 50, draw: 25, away: 25, result: "draw", correct: false, date: yesterdayStr },
      { match: "Espanha x Inglaterra", home: 55, draw: 25, away: 20, result: "home", correct: true, date: "2026-03-27" },
    ]
  },
  {
    id: 3, name: "Team Gamma", position: 3, prevPosition: 2,
    points: 115, wins: 6, losses: 3, pending: 3,
    members: ["Fernanda", "Gabriel", "Helena"],
    predictions: [
      { match: "Brasil x Argentina", home: 55, draw: 20, away: 25, result: "home", correct: true,  date: yesterdayStr },
      { match: "França x Alemanha",  home: 30, draw: 40, away: 30, result: "draw", correct: true,  date: yesterdayStr },
      { match: "Espanha x Inglaterra", home: 35, draw: 35, away: 30, result: "home", correct: false, date: "2026-03-27" },
    ]
  },
  {
    id: 4, name: "Team Delta", position: 4, prevPosition: 4,
    points: 98, wins: 5, losses: 4, pending: 3,
    members: ["Igor", "Julia"],
    predictions: [
      { match: "Brasil x Argentina", home: 50, draw: 30, away: 20, result: "home", correct: true,  date: yesterdayStr },
      { match: "França x Alemanha",  home: 40, draw: 30, away: 30, result: "draw", correct: false, date: yesterdayStr },
      { match: "Espanha x Inglaterra", home: 60, draw: 20, away: 20, result: "home", correct: true, date: "2026-03-27" },
    ]
  },
  {
    id: 5, name: "Team Epsilon", position: 5, prevPosition: 6,
    points: 84, wins: 4, losses: 5, pending: 3,
    members: ["Kleber", "Lucia", "Marcos"],
    predictions: [
      { match: "Brasil x Argentina", home: 45, draw: 35, away: 20, result: "home", correct: true,  date: yesterdayStr },
      { match: "França x Alemanha",  home: 35, draw: 25, away: 40, result: "draw", correct: false, date: yesterdayStr },
      { match: "Espanha x Inglaterra", home: 40, draw: 30, away: 30, result: "home", correct: false, date: "2026-03-27" },
    ]
  },
];

const matchScores = {
  "Brasil x Argentina":  "Brasil 1 x 3 Argentina",
  "França x Alemanha":   "França 2 x 2 Alemanha",
  "Espanha x Inglaterra": "Espanha 3 x 1 Inglaterra",
};

const maxPoints = Math.max(...mockTeams.map(t => t.points));

function PositionBadge({ current, previous }) {
  const diff = previous - current;
  if (diff > 0) return <span style={{ color: "#22c55e", fontWeight: 700, fontSize: 13 }}>▲{diff}</span>;
  if (diff < 0) return <span style={{ color: "#ef4444", fontWeight: 700, fontSize: 13 }}>▼{Math.abs(diff)}</span>;
  return <span style={{ color: "#6b7280", fontSize: 13 }}>—</span>;
}

function ProbBar({ home, draw, away, result, correct }) {
  const colors = { home: "#3b82f6", draw: "#f59e0b", away: "#8b5cf6" };
  const winner = [
    { label: "Casa", val: home, key: "home" },
    { label: "Empate", val: draw, key: "draw" },
    { label: "Fora", val: away, key: "away" },
  ].reduce((a, b) => (b.val > a.val ? b : a));

  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", height: 18, borderRadius: 4, overflow: "hidden", gap: 1 }}>
        {[{ k: "home", v: home }, { k: "draw", v: draw }, { k: "away", v: away }].map(({ k, v }) => (
          <div key={k} style={{
            width: `${v}%`, background: colors[k], opacity: winner.key === k ? 1 : 0.5,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, color: "#fff", fontWeight: 600
          }}>{v > 10 ? `${v}%` : ""}</div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, fontSize: 11, marginTop: 2, color: "#9ca3af" }}>
        <span>Casa {home}%</span><span>Emp {draw}%</span><span>Fora {away}%</span>
        <span style={{ marginLeft: "auto", color: correct ? "#22c55e" : "#ef4444", fontWeight: 600 }}>
          {correct ? "✓ Acertou" : "✗ Errou"}
        </span>
      </div>
    </div>
  );
}

export default function RankingPage() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#f1f5f9", fontFamily: "Inter, sans-serif", padding: "24px 16px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, background: "linear-gradient(90deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          🏆 Ranking — Copa do Mundo Datarisk 2026
        </h1>
        <p style={{ color: "#64748b", marginBottom: 24, fontSize: 14 }}>Datarisk · Bolão Interno</p>

        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "40px 32px 1fr 60px 50px 50px 50px 140px", gap: 8, padding: "8px 12px", color: "#64748b", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
          <span>#</span><span>↕</span><span>Time</span><span style={{textAlign:"center"}}>Pts</span>
          <span style={{textAlign:"center"}}>V</span><span style={{textAlign:"center"}}>D</span><span style={{textAlign:"center"}}>P</span>
          <span>Pontuação</span>
        </div>

        {mockTeams.map((team) => (
          <div key={team.id} style={{ marginBottom: 8 }}>
            <div
              onClick={() => setExpanded(expanded === team.id ? null : team.id)}
              style={{
                display: "grid", gridTemplateColumns: "40px 32px 1fr 60px 50px 50px 50px 140px",
                gap: 8, padding: "14px 12px", borderRadius: 10, cursor: "pointer",
                background: expanded === team.id ? "#1e293b" : "#1e293b88",
                border: `1px solid ${expanded === team.id ? "#3b82f6" : "#334155"}`,
                alignItems: "center", transition: "all 0.15s"
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 18, color: team.position <= 3 ? "#f59e0b" : "#64748b" }}>
                {team.position}
              </span>
              <PositionBadge current={team.position} previous={team.prevPosition} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{team.name}</div>
                <div style={{ color: "#64748b", fontSize: 12 }}>{team.members.join(", ")}</div>
              </div>
              <span style={{ textAlign: "center", fontWeight: 700, fontSize: 16, color: "#3b82f6" }}>{team.points}</span>
              <span style={{ textAlign: "center", color: "#22c55e", fontWeight: 600 }}>{team.wins}</span>
              <span style={{ textAlign: "center", color: "#ef4444", fontWeight: 600 }}>{team.losses}</span>
              <span style={{ textAlign: "center", color: "#f59e0b", fontWeight: 600 }}>{team.pending}</span>
              <div style={{ position: "relative", height: 8, background: "#334155", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(team.points / maxPoints) * 100}%`, background: "linear-gradient(90deg,#3b82f6,#8b5cf6)", borderRadius: 4 }} />
              </div>
            </div>

            {expanded === team.id && (() => {
              const yesterdayPreds = team.predictions.filter(p => p.date === yesterdayStr);
              return (
                <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderTop: "none", borderRadius: "0 0 10px 10px", padding: "16px 16px 12px" }}>
                  <p style={{ color: "#64748b", fontSize: 12, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Previsões — partidas de ontem ({yesterdayStr.split("-").reverse().join("/")})
                  </p>
                  {yesterdayPreds.length === 0 ? (
                    <p style={{ color: "#475569", fontSize: 13 }}>Nenhuma partida ontem.</p>
                  ) : yesterdayPreds.map((p, i) => (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{p.match}</span>
                        <span style={{ fontSize: 12, color: "#94a3b8", background: "#1e293b", padding: "2px 8px", borderRadius: 4 }}>
                          Resultado: <strong style={{ color: "#f1f5f9" }}>{matchScores[p.match] ?? p.match}</strong>
                        </span>
                      </div>
                      <ProbBar {...p} />
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        ))}

        <div style={{ marginTop: 16, display: "flex", gap: 16, fontSize: 12, color: "#64748b" }}>
          <span>V = Vitórias</span><span>D = Derrotas</span><span>P = Pendentes</span>
        </div>
      </div>
    </div>
  );
}
