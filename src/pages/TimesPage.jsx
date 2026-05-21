const TIMES = [
  {
    id: "frango",
    name: "F.R.A.N.G.O",
    subtitle: "Framework de Resultados e Análise Numérica de Gols e Odds",
    members: ["Sarah Barbosa", "Robson José", "Vinícius Raceputi"],
    escudo: "/escudos/escudo-1.svg",
    color: "#16a34a",
    accent: "#15803d",
    text: "#ffffff",
    description: "Teste",
  },
  {
    id: "fe",
    name: "99% Fé",
    subtitle: null,
    members: ["João Vitor Ribeiro", "Lucas Müller"],
    escudo: "/escudos/escudo-2.svg",
    color: "#facc15",
    accent: "#eab308",
    text: "#14532d",
    description: "",
  },
  {
    id: "dll",
    name: ".DLL",
    subtitle: null,
    members: ["Diego Silva", "Leandro Nogueira dos Santos", "Luís Henrique Lima"],
    escudo: "/escudos/escudo-3.svg",
    color: "#16a34a",
    accent: "#15803d",
    text: "#ffffff",
    description: "",
  },
  {
    id: "oraculo",
    name: "Oráculo",
    subtitle: null,
    members: ["Amaury Ribeiro", "Ailton Jimenez Ferreira"],
    escudo: "/escudos/escudo-4.svg",
    color: "#facc15",
    accent: "#eab308",
    text: "#14532d",
    description: "",
  },
];

export default function TimesPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#f1f5f9", fontFamily: "Inter, sans-serif", padding: "24px 16px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, background: "linear-gradient(90deg,#16a34a,#facc15)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          ⚽ Conheça os Times
        </h1>
        <p style={{ color: "#64748b", marginBottom: 24, fontSize: 14 }}>
          Copa dos Oráculos · Datarisk · Os times que disputam o melhor modelo preditivo
        </p>

        {TIMES.map(time => (
          <article
            key={time.id}
            style={{
              marginBottom: 16,
              borderRadius: 14,
              overflow: "hidden",
              border: `1px solid ${time.accent}`,
              boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
            }}
          >
            <header
              style={{
                display: "flex",
                gap: 16,
                padding: "18px 20px",
                background: time.color,
                color: time.text,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  padding: 4,
                }}
              >
                <img
                  src={time.escudo}
                  alt={`Escudo ${time.name}`}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>{time.name}</h2>
                {time.subtitle && (
                  <p style={{ fontSize: 11, opacity: 0.85, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {time.subtitle}
                  </p>
                )}
                <p style={{ fontSize: 13, fontWeight: 600 }}>
                  {time.members.join(", ")}
                </p>
              </div>
            </header>

            <section style={{ background: "#1e293b", padding: "16px 20px" }}>
              <h3 style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, fontWeight: 600 }}>
                Modelo & estratégia
              </h3>
              {time.description ? (
                <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.55 }}>
                  {time.description}
                </p>
              ) : (
                <p style={{ fontSize: 13, color: "#475569", fontStyle: "italic", lineHeight: 1.55 }}>
                  Em breve: o time vai descrever aqui o modelo desenvolvido e a estratégia usada para prever os resultados.
                </p>
              )}
            </section>
          </article>
        ))}
      </div>
    </div>
  );
}
