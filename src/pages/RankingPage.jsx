import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { flagUrl } from "../lib/country-flags";

function TeamFlag({ name }) {
  const src = flagUrl(name, 40);
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      width={20}
      height={14}
      style={{ borderRadius: 2, objectFit: "cover", verticalAlign: "middle" }}
      loading="lazy"
    />
  );
}

// Datas são exibidas e agrupadas no fuso de Brasília (a Copa é evento BR).
// match_date é guardado em UTC no banco — convertemos para BRT só na exibição.
const TZ = "America/Sao_Paulo";

// Retorna 'YYYY-MM-DD' da data no fuso de Brasília (en-CA usa esse formato).
const brtDay = (d) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date(d));

// "ontem" no calendário de Brasília
const yesterdayStr = brtDay(new Date(Date.now() - 24 * 60 * 60 * 1000));

const fmtDate = (iso) =>
  iso ? brtDay(iso).split("-").reverse().join("/") : "—";

const sameDay = (iso, refStr) =>
  iso && brtDay(iso) === refStr;

const PHASE_MULTIPLIERS = {
  group: 1, round_of_32: 1.5, round_of_16: 2,
  quarterfinal: 2.5, semifinal: 3, final: 3.5,
};
const POINTS_PER_CORRECT = 1;

// Times de teste (baselines) — exibidos separados e fora do ranking do bolão
const TEST_TEAMS = new Set(["Naive Random", "Underdog Predictor"]);

const STATUS_LABELS = {
  correct: { color: "#22c55e", text: "✓ Acertou" },
  wrong:   { color: "#ef4444", text: "✗ Errou" },
  pending: { color: "#f59e0b", text: "⏳ Aguardando" },
};

function HeaderTip({ children, tip, align = "center" }) {
  const [show, setShow] = useState(false);
  return (
    <span
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      style={{ position: "relative", cursor: "help", textAlign: align, display: "inline-block", width: "100%" }}
    >
      {children}
      {show && (
        <span style={{
          position: "absolute", top: "calc(100% + 4px)", left: "50%",
          transform: "translateX(-50%)",
          background: "#0f172a", color: "#f1f5f9",
          padding: "4px 10px", borderRadius: 6,
          fontSize: 11, fontWeight: 500,
          letterSpacing: 0, textTransform: "none",
          whiteSpace: "nowrap",
          border: "1px solid #334155",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          zIndex: 20,
          pointerEvents: "none",
        }}>
          {tip}
        </span>
      )}
    </span>
  );
}

function PositionBadge({ current, previous }) {
  const diff = previous - current;
  if (diff > 0) return <span style={{ color: "#22c55e", fontWeight: 700, fontSize: 13 }}>▲{diff}</span>;
  if (diff < 0) return <span style={{ color: "#ef4444", fontWeight: 700, fontSize: 13 }}>▼{Math.abs(diff)}</span>;
  return <span style={{ color: "#6b7280", fontSize: 13 }}>—</span>;
}

function ProbBar({ home, draw, away, status }) {
  const colors = { home: "#3b82f6", draw: "#f59e0b", away: "#8b5cf6" };
  const winner = [
    { val: home, key: "home" },
    { val: draw, key: "draw" },
    { val: away, key: "away" },
  ].reduce((a, b) => (b.val > a.val ? b : a));
  const label = STATUS_LABELS[status];

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
        <span style={{ marginLeft: "auto", color: label.color, fontWeight: 600 }}>
          {label.text}
        </span>
      </div>
    </div>
  );
}

function PredictionRow({ p, showResult }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}>
          <TeamFlag name={p.home_team} />
          {p.home_team} <span style={{ color: "#475569" }}>×</span> {p.away_team}
          <TeamFlag name={p.away_team} />
          <span style={{ marginLeft: 8, fontSize: 11, color: "#64748b", fontWeight: 500 }}>
            {fmtDate(p.match_date)}
          </span>
        </span>
        {showResult && (
          <span style={{ fontSize: 12, color: "#94a3b8", background: "#1e293b", padding: "2px 8px", borderRadius: 4 }}>
            Resultado: <strong style={{ color: "#f1f5f9" }}>{p.score ?? "Pendente"}</strong>
          </span>
        )}
      </div>
      <ProbBar home={p.home} draw={p.draw} away={p.away} status={p.status} />
    </div>
  );
}

const TABS = [
  { id: "lastDay",  label: "Último dia" },
  { id: "history",  label: "Histórico" },
  { id: "upcoming", label: "Próximos" },
];

function TabBar({ active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 14, borderBottom: "1px solid #1e293b" }}>
      {TABS.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            background: "transparent",
            border: "none",
            padding: "8px 14px",
            color: active === t.id ? "#3b82f6" : "#64748b",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
            borderBottom: `2px solid ${active === t.id ? "#3b82f6" : "transparent"}`,
            marginBottom: -1,
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function ExpandedTeam({ team }) {
  const [tab, setTab] = useState("lastDay");

  const lists = {
    lastDay:  team.predictions.filter(p => sameDay(p.match_date, yesterdayStr)),
    history:  team.predictions.filter(p => p.status !== "pending"),
    // Próximos: data crescente (jogo mais próximo primeiro). As demais abas
    // herdam a ordem decrescente padrão (mais recente no topo).
    upcoming: team.predictions
      .filter(p => p.status === "pending")
      .sort((a, b) => (a.match_date ?? "").localeCompare(b.match_date ?? "")),
  };
  const showResult = tab !== "upcoming";
  const empty = {
    lastDay:  "Nenhuma partida ontem.",
    history:  "Nenhum jogo finalizado ainda.",
    upcoming: "Nenhum palpite pendente.",
  };

  return (
    <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderTop: "none", borderRadius: "0 0 10px 10px", padding: "16px 16px 12px" }}>
      <TabBar active={tab} onChange={setTab} />
      {lists[tab].length === 0
        ? <p style={{ color: "#475569", fontSize: 13 }}>{empty[tab]}</p>
        : lists[tab].map((p, i) => <PredictionRow key={i} p={p} showResult={showResult} />)
      }
    </div>
  );
}

function buildTeams({ teams, members, matches, predictions }) {
  const matchById = new Map((matches || []).map(m => [m.id, m]));

  const enriched = (teams || []).map(t => {
    const teamMembers = (members || [])
      .filter(m => m.team_id === t.id)
      .map(m => m.name);

    const teamPreds = (predictions || [])
      .filter(p => p.team_id === t.id)
      .map(p => {
        const match = matchById.get(p.match_id);
        const home  = parseFloat(p.prob_home);
        const draw  = parseFloat(p.prob_draw);
        const away  = parseFloat(p.prob_away);
        const maxP  = Math.max(home, draw, away);
        const predicted = maxP === home ? "home" : maxP === draw ? "draw" : "away";
        const status = match?.result === "pending"
          ? "pending"
          : predicted === match?.result ? "correct" : "wrong";
        return {
          home_team:  match?.home_team,
          away_team:  match?.away_team,
          match_date: match?.match_date,
          phase:      match?.phase ?? "group",
          home, draw, away,
          status,
          score: match?.score,
        };
      })
      .sort((a, b) => (b.match_date ?? "").localeCompare(a.match_date ?? ""));

    let wins = 0, losses = 0, pending = 0, points = 0;
    for (const p of teamPreds) {
      if (p.status === "pending") pending++;
      else if (p.status === "correct") {
        wins++;
        points += POINTS_PER_CORRECT * (PHASE_MULTIPLIERS[p.phase] ?? 1);
      } else losses++;
    }

    return {
      id:      t.id,
      name:    t.name,
      members: teamMembers,
      predictions: teamPreds,
      wins, losses, pending, points,
      isTest: TEST_TEAMS.has(t.name),
    };
  });

  // Separa os times do bolão dos times de teste (baselines)
  const competing = enriched.filter(t => !t.isTest);
  const testing   = enriched.filter(t => t.isTest);

  // Ordena por pontos desc; ranking estilo RANK() (empates dividem posição)
  competing.sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
  let lastPoints = null, lastPos = 0;
  competing.forEach((t, i) => {
    if (t.points !== lastPoints) {
      lastPos = i + 1;
      lastPoints = t.points;
    }
    t.position = lastPos;
  });

  // Times de teste não têm posição no ranking; ficam por último
  testing.sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
  testing.forEach(t => { t.position = null; });

  return [...competing, ...testing];
}

export default function RankingPage() {
  const [teams, setTeams]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    async function load() {
      const [{ data: teamsRaw }, { data: members }, { data: matches }, { data: predictions }] =
        await Promise.all([
          supabase.from("teams").select("id, name"),
          supabase.from("members").select("team_id, name"),
          supabase.from("matches").select("id, home_team, away_team, result, score, match_date, phase"),
          supabase.from("predictions").select("team_id, match_id, prob_home, prob_draw, prob_away"),
        ]);

      setTeams(buildTeams({ teams: teamsRaw, members, matches, predictions }));
      setLoading(false);
    }
    load();
  }, []);

  const maxPoints = Math.max(...teams.map(t => t.points), 1);

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#f1f5f9", fontFamily: "Inter, sans-serif", padding: "24px 16px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, background: "linear-gradient(90deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          🏆 Ranking — Copa dos Oráculos
        </h1>
        <p style={{ color: "#64748b", marginBottom: 24, fontSize: 14 }}>Datarisk · Competição de modelos preditivos</p>

        {loading ? (
          <p style={{ color: "#475569", fontSize: 14 }}>Carregando...</p>
        ) : teams.length === 0 ? (
          <p style={{ color: "#475569", fontSize: 14 }}>Nenhum time cadastrado ainda.</p>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "40px 32px 1fr 60px 50px 50px 50px 140px", gap: 8, padding: "8px 12px", color: "#64748b", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, overflow: "visible" }}>
              <span>#</span><span>↕</span><span>Time</span>
              <HeaderTip tip="Pontos">Pts</HeaderTip>
              <HeaderTip tip="Vitórias">V</HeaderTip>
              <HeaderTip tip="Derrotas">D</HeaderTip>
              <HeaderTip tip="Pendentes">P</HeaderTip>
              <span>Pontuação</span>
            </div>

            {teams.map((team, idx) => {
              const firstTest = team.isTest && (idx === 0 || !teams[idx - 1].isTest);
              return (
              <div key={team.id}>
                {firstTest && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0 10px", color: "#64748b" }}>
                    <div style={{ flex: 1, height: 1, background: "#1e293b" }} />
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
                      Modelos de teste · fora do bolão
                    </span>
                    <div style={{ flex: 1, height: 1, background: "#1e293b" }} />
                  </div>
                )}
                <div style={{ marginBottom: 8, opacity: team.isTest ? 0.7 : 1 }}>
                <div
                  onClick={() => setExpanded(expanded === team.id ? null : team.id)}
                  style={{
                    display: "grid", gridTemplateColumns: "40px 32px 1fr 60px 50px 50px 50px 140px",
                    gap: 8, padding: "14px 12px", borderRadius: 10, cursor: "pointer",
                    background: expanded === team.id ? "#1e293b" : "#1e293b88",
                    border: `1px ${team.isTest ? "dashed" : "solid"} ${expanded === team.id ? "#3b82f6" : "#334155"}`,
                    alignItems: "center", transition: "all 0.15s"
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 18, color: !team.isTest && team.position <= 3 ? "#f59e0b" : "#64748b" }}>
                    {team.isTest ? "—" : team.position}
                  </span>
                  {team.isTest
                    ? <span style={{ color: "#6b7280", fontSize: 13 }}>—</span>
                    : <PositionBadge current={team.position} previous={team.position} />}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      {team.name}
                      {team.isTest && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5,
                          color: "#94a3b8", background: "#0f172a", border: "1px solid #334155",
                          padding: "1px 7px", borderRadius: 4,
                        }}>
                          Teste
                        </span>
                      )}
                    </div>
                    <div style={{ color: "#64748b", fontSize: 12 }}>
                      {team.isTest ? "Baseline · não pontua no bolão" : (team.members.join(", ") || "—")}
                    </div>
                  </div>
                  <span style={{ textAlign: "center", fontWeight: 700, fontSize: 16, color: "#3b82f6" }}>{team.points}</span>
                  <span style={{ textAlign: "center", color: "#22c55e", fontWeight: 600 }}>{team.wins}</span>
                  <span style={{ textAlign: "center", color: "#ef4444", fontWeight: 600 }}>{team.losses}</span>
                  <span style={{ textAlign: "center", color: "#f59e0b", fontWeight: 600 }}>{team.pending}</span>
                  <div style={{ position: "relative", height: 8, background: "#334155", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(team.points / maxPoints) * 100}%`, background: "linear-gradient(90deg,#3b82f6,#8b5cf6)", borderRadius: 4 }} />
                  </div>
                </div>

                {expanded === team.id && <ExpandedTeam team={team} />}
                </div>
              </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
