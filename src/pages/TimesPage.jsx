// ─── Componentes de descrição ─────────────────────────────

const S = {
  p:    { fontSize: 14, color: "#cbd5e1", lineHeight: 1.65, marginBottom: 10 },
  tag:  { display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: 0.4,
          padding: "2px 8px", borderRadius: 4, marginBottom: 12, textTransform: "uppercase" },
  h4:   { fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase",
          letterSpacing: 0.5, marginTop: 14, marginBottom: 6 },
  ul:   { paddingLeft: 18, margin: "0 0 10px 0" },
  li:   { fontSize: 14, color: "#cbd5e1", lineHeight: 1.65, marginBottom: 4 },
  b:    { color: "#f1f5f9", fontWeight: 600 },
  note: { fontSize: 12, color: "#64748b", fontStyle: "italic", lineHeight: 1.6,
          borderLeft: "2px solid #334155", paddingLeft: 10, marginTop: 10 },
  pill: { display: "inline-block", fontSize: 11, fontWeight: 700, padding: "1px 7px",
          borderRadius: 3, background: "#0f172a", color: "#7dd3fc", marginLeft: 6 },
};

function AlgoTag({ children, color }) {
  return (
    <span style={{ ...S.tag, background: color + "22", color: color, border: `1px solid ${color}44` }}>
      {children}
    </span>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginTop: 12 }}>
      <p style={S.h4}>{title}</p>
      {children}
    </div>
  );
}

const DESC_FRANGO = (
  <div>
    <AlgoTag color="#22c55e">LightGBM</AlgoTag>
    <AlgoTag color="#a78bfa">Híbrido</AlgoTag>

    <p style={S.p}>
      Modelo híbrido de classificação supervisionada multiclasse. A estratégia central está na
      identificação da <span style={S.b}>"Zona do Caos"</span>: como o mercado de apostas é altamente
      eficiente, o algoritmo delega previsões de jogos mais previsíveis ao consenso das odds e
      entra majoritariamente nos raros cenários de baixa confiança — onde a diferença de probabilidade
      entre os resultados mais prováveis é inferior a 0,05.
    </p>
    <p style={S.p}>
      O modelo adota ainda um <span style={S.b}>Ensemble de Campo Neutro</span> que espelha as
      estatísticas para eliminar o viés estrutural de mandante.
    </p>

    <Section title="60 variáveis selecionadas">
      <ul style={S.ul}>
        <li style={S.li}><span style={S.b}>Sinal do Mercado:</span> probabilidades implícitas das odds, métrica de Confiança do Mercado e Entropia de Shannon para medir incerteza global.</li>
        <li style={S.li}><span style={S.b}>Desempenho em Campo:</span> gols, xG, posse, passes, finalizações (totais e no alvo), defesas do goleiro, escanteios, cartões e faltas.</li>
        <li style={S.li}><span style={S.b}>Interações de Vantagem:</span> diferença absoluta e proporção direta entre mandante e visitante.</li>
        <li style={S.li}><span style={S.b}>Peso por Competição:</span> escalar que penaliza erros em grandes campeonatos e valoriza desempenho em torneios difíceis versus amistosos.</li>
      </ul>
    </Section>

    <p style={S.note}>
      Métricas de forma recente agregadas em janelas de 3, 5 e 10 jogos com médias móveis simples
      e ponderadas. Operador de atraso aplicado em todo o processo para garantir integridade temporal.
    </p>
  </div>
);

const DESC_FE = (
  <div>
    <AlgoTag color="#facc15">LightGBM</AlgoTag>
    <AlgoTag color="#38bdf8">Optuna</AlgoTag>
    <AlgoTag color="#f97316">ELO Dinâmico</AlgoTag>

    <p style={S.p}>
      Modelo de classificação multiclasse (vitória mandante / empate / vitória visitante) baseado em
      LightGBM, com hiperparâmetros otimizados via Optuna e validação cruzada temporal.
      O treinamento usou dados históricos de seleções e o modelo foi <span style={S.b}>testado na
      Copa de 2022</span> antes de ser aplicado à Copa de 2026.
    </p>

    <Section title="Principais variáveis">
      <ul style={S.ul}>
        <li style={S.li}><span style={S.b}>Odds de mercado</span> normalizadas como probabilidades implícitas — a variável mais preditiva, usada como âncora.</li>
        <li style={S.li}><span style={S.b}>ELO rating</span> de cada seleção, calculado dinamicamente com K-factor variável por competição.</li>
        <li style={S.li}><span style={S.b}>Gap de ELO</span> — diferença absoluta de força entre os times.</li>
        <li style={S.li}><span style={S.b}>Flags contextuais:</span> campo neutro (<code style={{ fontSize: 12, color: "#7dd3fc" }}>is_neutral</code>) e fase eliminatória (<code style={{ fontSize: 12, color: "#7dd3fc" }}>is_knockout</code>).</li>
        <li style={S.li}><span style={S.b}>Variáveis categóricas:</span> times, competição e estágio.</li>
      </ul>
    </Section>

    <Section title="O que é o ELO?">
      <p style={S.p}>
        Sistema de pontuação que mede a força relativa de cada seleção pelo histórico de resultados:
        vencer um adversário forte vale mais do que vencer um fraco, e perder para um favorito penaliza
        menos do que perder para uma zebra. O ELO é inicializado pelo <span style={S.b}>ranking FIFA
        de julho de 2014</span> e atualizado jogo a jogo — com atualizações mais agressivas em jogos
        de Copa do Mundo do que em amistosos.
      </p>
    </Section>

    <p style={S.note}>
      Janela de dados: julho de 2014 até maio de 2026, coletados via Sofascore.
    </p>
  </div>
);

const DESC_DLL = (
  <div>
    <AlgoTag color="#38bdf8">Regressão Logística</AlgoTag>
    <AlgoTag color="#f97316">ELO Dinâmico</AlgoTag>

    <p style={S.p}>
      Algoritmo de Regressão Logística multinomial prevendo 3 classes: vitória do mandante /
      empate / vitória do visitante. A ideia central: as odds do mercado já são um baseline forte
      (~60% de acurácia). Para superá-las, o modelo captura sinal além do que o mercado precifica —
      forma recente, força dos times e qualidade dos adversários.
    </p>

    <Section title="Features">
      <ul style={S.ul}>
        <li style={S.li}><span style={S.b}>Log-probs das odds:</span> log(1/odd) para casa/empate/fora. Ancoram o modelo no consenso do mercado.</li>
        <li style={S.li}><span style={S.b}>Rolling K=5:</span> médias móveis das últimas 5 partidas de cada time (gols, xG, finalização no alvo, posse, pontos). Captura de forma recente.</li>
        <li style={S.li}><span style={S.b}>Rolling H/A split K=10:</span> separa desempenho do mandante como mandante e do visitante como visitante (xG pró, xG contra, pts). Captura efeito casa.</li>
        <li style={S.li}><span style={S.b}>Elo dinâmico:</span> estilo eloratings.net com +60 de vantagem de casa, atualizado após cada resultado.</li>
        <li style={S.li}><span style={S.b}>SoS (Strength of Schedule):</span> Elo médio dos últimos 10 oponentes. Ajusta a forma pelo nível dos adversários.</li>
      </ul>
    </Section>

    <Section title="Validação temporal (483 partidas após 2025-06-30)">
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #334155" }}>
              {["Métrica", "Log Loss", "Acurácia"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "6px 12px", color: "#64748b", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Baseline (1/odd)", "0.8367", "60.5%"],
              ["Modelo .DLL",      "0.8368", "61.3% (+4 acertos)"],
            ].map(([label, ll, acc]) => (
              <tr key={label} style={{ borderBottom: "1px solid #1e293b" }}>
                <td style={{ padding: "7px 12px", color: "#94a3b8" }}>{label}</td>
                <td style={{ padding: "7px 12px", color: "#f1f5f9" }}>{ll}</td>
                <td style={{ padding: "7px 12px", color: "#22c55e", fontWeight: 600 }}>{acc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>

    <p style={{ ...S.note, marginTop: 12 }}>
      Ganho marginal em log-loss, mas +4 hits na competição e recall de empate saltou de 1.6% → 13.8%:
      relevante porque empates pontuam igual e o baseline praticamente nunca os prevê.
      Em runtime, o modelo re-computa rolling/Elo/SoS a cada chamada usando a base pública mais atualizada.
    </p>
  </div>
);

const DESC_ORACULO = (
  <div>
    <AlgoTag color="#f97316">XGBoost</AlgoTag>
    <AlgoTag color="#a78bfa">Treinado em 100% dos dados</AlgoTag>

    <p style={S.p}>
      Modelo XGBoost Classifier. O Feature Importance do modelo final revela que o XGBoost
      concentra muito peso na <span style={S.b}>inteligência de mercado</span> — as variáveis mais
      críticas são as odds brutas e as distribuições normalizadas de probabilidade implícita das casas
      de apostas (<code style={{ fontSize: 12, color: "#7dd3fc" }}>prob_casa_norm</code>,{" "}
      <code style={{ fontSize: 12, color: "#7dd3fc" }}>odd_vitoria_casa_ml</code>,{" "}
      <code style={{ fontSize: 12, color: "#7dd3fc" }}>odds_favor_diff</code>).
    </p>

    <p style={S.p}>
      O diferencial é que o modelo não é um mero replicador de odds: ele usa o mercado como baseline
      forte e aplica uma camada de <span style={S.b}>microestatísticas dos últimos 5 jogos</span> para
      corrigir e refinar a predição.
    </p>

    <Section title="Variáveis de campo">
      <ul style={S.ul}>
        <li style={S.li}><span style={S.b}>xG:</span> diferencial e razão de Expected Goals (<code style={{ fontSize: 12, color: "#7dd3fc" }}>xg_diff</code>, <code style={{ fontSize: 12, color: "#7dd3fc" }}>xg_ratio</code>) e volume de finalizações dentro da área.</li>
        <li style={S.li}><span style={S.b}>Estilo e retrospecto:</span> dominância de posse de bola e fragilidade defensiva recente (média de gols sofridos fora de casa).</li>
      </ul>
    </Section>

    <Section title="Experimento: Algoritmo de Mutação (Zebras)">
      <p style={S.p}>
        Foi testada uma estratégia de <span style={S.b}>"Mutação Preditiva"</span> no loop de inferência —
        uma função estocástica baseada em odds ratio para forçar inversões de resultado e evitar viés
        pró-favorito. O conceito era interessante, mas Log Loss e Brier Score pioraram. O rigor estatístico
        falou mais alto: a função foi desativada e o modelo final ficou puramente orgânico.
      </p>
    </Section>

    <p style={S.note}>
      Estratégia de treino para produção: após validação com split 70/30, o modelo final foi retreinado
      com 100% da base histórica. Com a Copa acontecendo de 4 em 4 anos e o futebol mudando rapidamente,
      usar o dataset completo garante que os dados mais recentes sejam absorvidos pelo modelo.
    </p>
  </div>
);

// ─── Dados dos times ──────────────────────────────────────

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
    description: DESC_FRANGO,
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
    description: DESC_FE,
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
    description: DESC_DLL,
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
    description: DESC_ORACULO,
  },
];

// ─── Componente principal ─────────────────────────────────

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
              <h3 style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12, fontWeight: 600 }}>
                Modelo & estratégia
              </h3>
              {time.description}
            </section>
          </article>
        ))}
      </div>
    </div>
  );
}
