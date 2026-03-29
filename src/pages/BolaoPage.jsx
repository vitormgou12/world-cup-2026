import { useState } from "react";

const TEAMS = [
  { id: 1, name: "Team Alpha", members: ["Ana", "Bruno", "Carlos"], voters: 14 },
  { id: 2, name: "Team Beta", members: ["Diana", "Eduardo"], voters: 9 },
  { id: 3, name: "Team Gamma", members: ["Fernanda", "Gabriel", "Helena"], voters: 11 },
  { id: 4, name: "Team Delta", members: ["Igor", "Julia"], voters: 7 },
  { id: 5, name: "Team Epsilon", members: ["Kleber", "Lucia", "Marcos"], voters: 5 },
];

const totalVoters = TEAMS.reduce((s, t) => s + t.voters, 0);

export default function BolaoPage() {
  const [step, setStep] = useState("login"); // login | select | confirm | done
  const [authMethod, setAuthMethod] = useState(null);
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [selected, setSelected] = useState(null);
  const [confirming, setConfirming] = useState(false);

  function handleGoogleLogin() {
    setUser({ name: "Vitor", email: "vitor@datarisk.io", avatar: "V" });
    setStep("select");
  }

  function handleEmailLogin(e) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setUser({ name: email.split("@")[0], email, avatar: email[0].toUpperCase() });
    setStep("select");
  }

  function handleConfirm() {
    setStep("done");
  }

  if (step === "done") {
    const team = TEAMS.find(t => t.id === selected);
    return (
      <div style={{ minHeight: "100vh", background: "#0f172a", color: "#f1f5f9", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 420, padding: 32 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Aposta confirmada!</h2>
          <p style={{ color: "#94a3b8", marginBottom: 24 }}>
            Você apostou no <strong style={{ color: "#3b82f6" }}>{team.name}</strong>.<br />
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
            <div onSubmit={handleEmailLogin}>
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
        {/* Header */}
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

        {/* Team cards */}
        {TEAMS.map(team => {
          const pct = Math.round((team.voters / totalVoters) * 100);
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
                  <div style={{ color: "#64748b", fontSize: 12 }}>{team.members.join(", ")}</div>
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

        {/* Confirm button */}
        {selected && !confirming && (
          <div style={{ marginTop: 20, padding: "16px 20px", background: "#1e293b", borderRadius: 12, border: "1px solid #334155" }}>
            <p style={{ margin: "0 0 12px", color: "#94a3b8", fontSize: 14 }}>
              Confirmar aposta em <strong style={{ color: "#f1f5f9" }}>{TEAMS.find(t => t.id === selected)?.name}</strong>?
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
              Time: <strong style={{ color: "#f1f5f9" }}>{TEAMS.find(t => t.id === selected)?.name}</strong>
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={handleConfirm}
                style={{ padding: "11px 28px", background: "#f59e0b", border: "none", borderRadius: 8, color: "#0f172a", fontWeight: 700, cursor: "pointer" }}>
                Sim, confirmar
              </button>
              <button onClick={() => setConfirming(false)}
                style={{ padding: "11px 20px", background: "transparent", border: "1px solid #334155", borderRadius: 8, color: "#94a3b8", cursor: "pointer" }}>
                Voltar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
