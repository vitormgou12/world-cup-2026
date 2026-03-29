import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function BolaoPage() {
  const [teams, setTeams]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [step, setStep]         = useState("login"); // login | select | confirm | done
  const [authMethod, setAuthMethod] = useState(null);
  const [email, setEmail]       = useState("");
  const [user, setUser]         = useState(null);
  const [selected, setSelected] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    async function load() {
      const { data: teamsData } = await supabase.from("teams").select("id, name");
      const { data: members }   = await supabase.from("members").select("team_id, name");
      const { data: bets }      = await supabase.from("bets").select("team_id");

      const betCounts = {};
      (bets || []).forEach(b => {
        betCounts[b.team_id] = (betCounts[b.team_id] || 0) + 1;
      });
      const totalBets = (bets || []).length;

      setTeams((teamsData || []).map(t => ({
        id:      t.id,
        name:    t.name,
        members: (members || []).filter(m => m.team_id === t.id).map(m => m.name),
        voters:  betCounts[t.id] || 0,
        totalBets,
      })));
      setLoading(false);
    }
    load();
  }, []);

  const totalVoters = teams.reduce((s, t) => s + t.voters, 0);

  function handleGoogleLogin() {
    setUser({ name: "Vitor", email: "vitor@datarisk.io", avatar: "V" });
    setStep("select");
  }

  function handleEmailLogin(e) {
    e.preventDefault?.();
    if (!email.includes("@")) return;
    setUser({ name: email.split("@")[0], email, avatar: email[0].toUpperCase() });
    setStep("select");
  }

  async function handleConfirm() {
    setSubmitting(true);
    setError(null);
    const { error: err } = await supabase.from("bets").insert({
      user_email: user.email,
      user_name:  user.name,
      team_id:    selected,
    });
    setSubmitting(false);
    if (err) {
      setError(err.message);
      setConfirming(false);
    } else {
      setStep("done");
    }
  }

  const selectedTeam = teams.find(t => t.id === selected);

  if (step === "done") {
    return (
      <div style={{ minHeight: "100vh", background: "#0f172a", color: "#f1f5f9", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 420, padding: 32 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Aposta confirmada!</h2>
          <p style={{ color: "#94a3b8", marginBottom: 24 }}>
            Você apostou no <strong style={{ color: "#3b82f6" }}>{selectedTeam?.name}</strong>.<br />
            Boa sorte na Copa 2026!
          </p>
          <button onClick={() => { setStep("select"); setSelected(null); }}
            style={{ padding: "10px 28px", background: "#3b82f6", border: "none", borderRadius: 8, color: "#fff", fontWeight: 600, cursor: "pointer" }}>
            Ver ranking
          </button>
        </div>
      </div>
    );
  }

  if (step === "login") {
    return (
      <div style={{ minHeight: "100vh", background: "#0f172a", color: "#f1f5f9", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#1e293b", borderRadius: 16, padding: 36, width: 360, boxShadow: "0 8px 32px #0008" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>🌍 Bolão Copa 2026</h1>
          <p style={{ color: "#64748b", marginBottom: 28, fontSize: 14 }}>Datarisk · Entre para fazer sua aposta</p>

          {!authMethod && (
            <>
              <button onClick={handleGoogleLogin}
                style={{ width: "100%", padding: "12px", background: "#fff", color: "#1e293b", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", marginBottom: 12, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>G</span> Entrar com Google
              </button>
              <button onClick={() => setAuthMethod("email")}
                style={{ width: "100%", padding: "12px", background: "transparent", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, fontWeight: 500, cursor: "pointer", fontSize: 14 }}>
                Entrar com e-mail
              </button>
            </>
          )}

          {authMethod === "email" && (
            <div>
              <input
                type="email" placeholder="seu@datarisk.io" value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: "100%", padding: "11px 14px", background: "#0f172a", border: "1px solid #334155", borderRadius: 8, color: "#f1f5f9", fontSize: 14, marginBottom: 12, boxSizing: "border-box" }}
              />
              <button onClick={handleEmailLogin}
                style={{ width: "100%", padding: "12px", background: "#3b82f6", border: "none", borderRadius: 8, color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 15 }}>
                Continuar
              </button>
              <button onClick={() => setAuthMethod(null)}
                style={{ width: "100%", marginTop: 8, padding: "10px", background: "transparent", border: "none", color: "#64748b", cursor: "pointer", fontSize: 13 }}>
                Voltar
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#f1f5f9", fontFamily: "Inter, sans-serif", padding: "24px 16px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 2 }}>🌍 Bolão Copa 2026</h1>
            <p style={{ color: "#64748b", fontSize: 14 }}>Escolha o time que você acredita ter o melhor modelo</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
              {user?.avatar}
            </div>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>{user?.name}</span>
          </div>
        </div>

        {loading ? (
          <p style={{ color: "#475569", fontSize: 14 }}>Carregando times...</p>
        ) : teams.length === 0 ? (
          <p style={{ color: "#475569", fontSize: 14 }}>Nenhum time cadastrado ainda.</p>
        ) : (
          <>
            {teams.map(team => {
              const pct = totalVoters > 0 ? Math.round((team.voters / totalVoters) * 100) : 0;
              const isSelected = selected === team.id;
              return (
                <div key={team.id}
                  onClick={() => setSelected(isSelected ? null : team.id)}
                  style={{
                    marginBottom: 10, padding: "16px 18px", borderRadius: 12, cursor: "pointer",
                    background: isSelected ? "#1e3a5f" : "#1e293b",
                    border: `2px solid ${isSelected ? "#3b82f6" : "#334155"}`,
                    transition: "all 0.15s"
                  }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{team.name}</div>
                      <div style={{ color: "#64748b", fontSize: 12 }}>{team.members.join(", ") || "—"}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#3b82f6" }}>{pct}%</div>
                      <div style={{ color: "#64748b", fontSize: 11 }}>{team.voters} apostas</div>
                    </div>
                  </div>
                  <div style={{ height: 6, background: "#334155", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: isSelected ? "#3b82f6" : "#475569", borderRadius: 3, transition: "width 0.3s" }} />
                  </div>
                </div>
              );
            })}

            {error && (
              <p style={{ color: "#ef4444", fontSize: 13, marginTop: 8 }}>Erro: {error}</p>
            )}

            {selected && !confirming && (
              <div style={{ marginTop: 20, padding: "16px 20px", background: "#1e293b", borderRadius: 12, border: "1px solid #334155" }}>
                <p style={{ margin: "0 0 12px", color: "#94a3b8", fontSize: 14 }}>
                  Confirmar aposta em <strong style={{ color: "#f1f5f9" }}>{selectedTeam?.name}</strong>?
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setConfirming(true)}
                    style={{ flex: 1, padding: "11px", background: "#3b82f6", border: "none", borderRadius: 8, color: "#fff", fontWeight: 600, cursor: "pointer" }}>
                    Confirmar
                  </button>
                  <button onClick={() => setSelected(null)}
                    style={{ padding: "11px 18px", background: "transparent", border: "1px solid #334155", borderRadius: 8, color: "#94a3b8", cursor: "pointer" }}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {confirming && (
              <div style={{ marginTop: 20, padding: "20px", background: "#1e293b", borderRadius: 12, border: "2px solid #f59e0b", textAlign: "center" }}>
                <p style={{ fontSize: 15, marginBottom: 4 }}>⚠️ Tem certeza? Apostas não podem ser alteradas após confirmação.</p>
                <p style={{ color: "#64748b", fontSize: 13, marginBottom: 16 }}>
                  Time: <strong style={{ color: "#f1f5f9" }}>{selectedTeam?.name}</strong>
                </p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                  <button onClick={handleConfirm} disabled={submitting}
                    style={{ padding: "11px 28px", background: "#f59e0b", border: "none", borderRadius: 8, color: "#0f172a", fontWeight: 700, cursor: "pointer", opacity: submitting ? 0.6 : 1 }}>
                    {submitting ? "Salvando..." : "Sim, confirmar"}
                  </button>
                  <button onClick={() => setConfirming(false)} disabled={submitting}
                    style={{ padding: "11px 20px", background: "transparent", border: "1px solid #334155", borderRadius: 8, color: "#94a3b8", cursor: "pointer" }}>
                    Voltar
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
