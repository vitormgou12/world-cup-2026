import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayStr = yesterday.toISOString().slice(0, 10);

function PositionBadge({ current, previous }) {
  const diff = previous - current;
  if (diff > 0) return <span style={{ color: "#22c55e", fontWeight: 700, fontSize: 13 }}>▲{diff}</span>;
  if (diff < 0) return <span style={{ color: "#ef4444", fontWeight: 700, fontSize: 13 }}>▼{Math.abs(diff)}</span>;
  return <span style={{ color: "#6b7280", fontSize: 13 }}>—</span>;
}

function ProbBar({ home, draw, away, correct }) {
  const colors = { home: "#3b82f6", draw: "#f59e0b", away: "#8b5cf6" };
  const winner = [
    { val: home, key: "home" },
    { val: draw, key: "draw" },
    { val: away, key: "away" },
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
  const [teams, setTeams]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    async function load() {
      // 1. Ranking view
      const { data: ranking } = await supabase.from("ranking").select("*");

      // 2. Membros
      const { data: members } = await supabase.from("members").select("team_id, name");

      // 3. Partidas de ontem
      const { data: matches } = await supabase
        .from("matches")
        .select("id, home_team, away_team, result, score")
        .gte("match_date", `${yesterdayStr}T00:00:00+00:00`)
        .lte("match_date", `${yesterdayStr}T23:59:59+00:00`);

      // 4. Previsões para essas partidas
      let predictions = [];
      if (matches?.length) {
        const { data: preds } = await supabase
          .from("predictions")
          .select("team_id, match_id, prob_home, prob_draw, prob_away")
          .in("match_id", matches.map(m => m.id));
        predictions = preds || [];
      }

      const maxPts = Math.max(...(ranking || []).map(r => parseFloat(r.total_points)), 1);

      const teamsData = (ranking || []).map(r => {
        const teamMembers = (members || [])
          .filter(m => m.team_id === r.team_id)
          .map(m => m.name);

        const teamPreds = predictions
          .filter(p => p.team_id === r.team_id)
          .map(p => {
            const match = (matches || []).find(m => m.id === p.match_id);
            const home  = parseFloat(p.prob_home);
            const draw  = parseFloat(p.prob_draw);
            const away  = parseFloat(p.prob_away);
            const maxP  = Math.max(home, draw, away);
            const predicted = maxP === home ? "home" : maxP === draw ? "draw" : "away";
            const correct   = match?.result !== "pending" && predicted === match?.result;
            return {
              match: `${match?.home_team} x ${match?.away_team}`,
              home, draw, away,
              correct,
              score: match?.score,
            };
          });

        return {
          id:       r.team_id,
          name:     r.team_name,
          position: parseInt(r.position),
          points:   parseFloat(r.total_points),
          wins:     parseInt(r.wins),
          losses:   parseInt(r.losses),
          pending:  parseInt(r.pending),
          members:  teamMembers,
          predictions: teamPreds,
          maxPts,
        };
      });

      setTeams(teamsData);
      setLoading(false);
    }

    load();
  }, []);

  const maxPoints = Math.max(...teams.map(t => t.points), 1);

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#f1f5f9", fontFamily: "Inter, sans-serif", padding: "24px 16px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, background: "linear-gradient(90deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          🏆 Ranking — Copa do Mundo Datarisk 2026
        </h1>
        <p style={{ color: "#64748b", marginBottom: 24, fontSize: 14 }}>Datarisk · Bolão Interno</p>

        {loading ? (
          <p style={{ color: "#475569", fontSize: 14 }}>Carregando...</p>
        ) : teams.length === 0 ? (
          <p style={{ color: "#475569", fontSize: 14 }}>Nenhum time cadastrado ainda.</p>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "40px 32px 1fr 60px 50px 50px 50px 140px", gap: 8, padding: "8px 12px", color: "#64748b", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
              <span>#</span><span>↕</span><span>Time</span>
              <span style={{ textAlign: "center" }}>Pts</span>
              <span style={{ textAlign: "center" }}>V</span>
              <span style={{ textAlign: "center" }}>D</span>
              <span style={{ textAlign: "center" }}>P</span>
              <span>Pontuação</span>
            </div>

            {teams.map((team) => (
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
                  <PositionBadge current={team.position} previous={team.position} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{team.name}</div>
                    <div style={{ color: "#64748b", fontSize: 12 }}>{team.members.join(", ") || "—"}</div>
                  </div>
                  <span style={{ textAlign: "center", fontWeight: 700, fontSize: 16, color: "#3b82f6" }}>{team.points}</span>
                  <span style={{ textAlign: "center", color: "#22c55e", fontWeight: 600 }}>{team.wins}</span>
                  <span style={{ textAlign: "center", color: "#ef4444", fontWeight: 600 }}>{team.losses}</span>
                  <span style={{ textAlign: "center", color: "#f59e0b", fontWeight: 600 }}>{team.pending}</span>
                  <div style={{ position: "relative", height: 8, background: "#334155", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(team.points / maxPoints) * 100}%`, background: "linear-gradient(90deg,#3b82f6,#8b5cf6)", borderRadius: 4 }} />
                  </div>
                </div>

                {expanded === team.id && (
                  <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderTop: "none", borderRadius: "0 0 10px 10px", padding: "16px 16px 12px" }}>
                    <p style={{ color: "#64748b", fontSize: 12, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                      Previsões — partidas de ontem ({yesterdayStr.split("-").reverse().join("/")})
                    </p>
                    {team.predictions.length === 0 ? (
                      <p style={{ color: "#475569", fontSize: 13 }}>Nenhuma partida ontem.</p>
                    ) : team.predictions.map((p, i) => (
                      <div key={i} style={{ marginBottom: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{p.match}</span>
                          <span style={{ fontSize: 12, color: "#94a3b8", background: "#1e293b", padding: "2px 8px", borderRadius: 4 }}>
                            Resultado: <strong style={{ color: "#f1f5f9" }}>{p.score ?? p.match}</strong>
                          </span>
                        </div>
                        <ProbBar {...p} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div style={{ marginTop: 16, display: "flex", gap: 16, fontSize: 12, color: "#64748b" }}>
              <span>V = Vitórias</span><span>D = Derrotas</span><span>P = Pendentes</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
