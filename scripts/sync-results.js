/**
 * sync-results.js
 * Busca resultados da Copa do Mundo via football-data.org e atualiza o Supabase.
 *
 * Uso:
 *   node scripts/sync-results.js                        → ontem, salva no banco
 *   node scripts/sync-results.js --dry-run              → ontem, só exibe (não salva)
 *   node scripts/sync-results.js --date=2026-06-15      → data específica
 *   node scripts/sync-results.js --mock --dry-run       → teste sem API nem banco
 *
 * Variáveis de ambiente necessárias (.env):
 *   FOOTBALL_DATA_KEY     → chave gratuita em football-data.org/client/register
 *   VITE_SUPABASE_URL     → URL do projeto Supabase
 *   SUPABASE_SERVICE_KEY  → chave service_role do Supabase (não a anon key)
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config();

// ─── Argumentos ────────────────────────────────────────────
const DRY_RUN  = process.argv.includes("--dry-run");
const USE_MOCK = process.argv.includes("--mock");
const dateArg  = process.argv.find((a) => a.startsWith("--date="))?.split("=")[1];

// ─── Configuração ──────────────────────────────────────────
const API_KEY          = process.env.FOOTBALL_DATA_KEY;
const SUPABASE_URL     = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_KEY;

const BASE_URL = "https://api.football-data.org/v4";

// Mapeamento de fase da API → fase do nosso schema
const PHASE_MAP = {
  "Group Stage":     "group",
  "Round of 32":     "round_of_32",
  "Round of 16":     "round_of_16",
  "Quarter-finals":  "quarterfinal",
  "Semi-finals":     "semifinal",
  "Final":           "final",
};

// ─── Helpers ───────────────────────────────────────────────
function getTargetDate() {
  if (dateArg) return dateArg;
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function formatDateBR(isoDate) {
  return isoDate.split("-").reverse().join("/");
}

// ─── Busca na API ──────────────────────────────────────────
async function fetchMatches(date) {
  const url = `${BASE_URL}/matches?dateFrom=${date}&dateTo=${date}&competitions=WC`;
  const res  = await fetch(url, {
    headers: { "X-Auth-Token": API_KEY },
  });

  if (res.status === 429) throw new Error("Limite de requisições atingido. Aguarde 1 minuto.");
  if (!res.ok)            throw new Error(`Erro na API: ${res.status} ${res.statusText}`);

  const data = await res.json();
  return data.matches ?? [];
}

// ─── Mapeamento de resultado ───────────────────────────────
function mapResult(match) {
  if (match.status !== "FINISHED") return null;

  const winner = match.score.winner;
  if (winner === "HOME_TEAM") return "home";
  if (winner === "AWAY_TEAM") return "away";
  if (winner === "DRAW")      return "draw";
  return null;
}

function formatScore(match) {
  const home = match.homeTeam.name;
  const away = match.awayTeam.name;
  const gh   = match.score.fullTime.home;
  const ga   = match.score.fullTime.away;
  return `${home} ${gh} x ${ga} ${away}`;
}

function mapPhase(match) {
  const stage = match.stage ?? match.group ?? "Group Stage";
  return PHASE_MAP[stage] ?? "group";
}

// ─── Dados mock para teste local ───────────────────────────
const MOCK_MATCHES = [
  {
    id: 9001,
    utcDate: new Date().toISOString(),
    status: "FINISHED",
    stage: "Group Stage",
    homeTeam: { name: "Brasil" },
    awayTeam: { name: "Argentina" },
    score: { winner: "AWAY_TEAM", fullTime: { home: 1, away: 3 } },
  },
  {
    id: 9002,
    utcDate: new Date().toISOString(),
    status: "FINISHED",
    stage: "Group Stage",
    homeTeam: { name: "França" },
    awayTeam: { name: "Alemanha" },
    score: { winner: "DRAW", fullTime: { home: 2, away: 2 } },
  },
  {
    id: 9003,
    utcDate: new Date().toISOString(),
    status: "SCHEDULED",
    stage: "Group Stage",
    homeTeam: { name: "Espanha" },
    awayTeam: { name: "Portugal" },
    score: { winner: null, fullTime: { home: null, away: null } },
  },
];

// ─── Main ──────────────────────────────────────────────────
async function run() {
  const date  = getTargetDate();
  const flags = [DRY_RUN && "DRY-RUN", USE_MOCK && "MOCK"].filter(Boolean).join(" + ");

  console.log("\n🌍  Copa Datarisk 2026 — Sync de Resultados");
  console.log(`📅  Data alvo : ${formatDateBR(date)}${flags ? `  [${flags}]` : ""}\n`);

  // 1. Busca partidas
  let matches;

  if (USE_MOCK) {
    console.log("🧪  Usando dados mock (--mock)...");
    matches = MOCK_MATCHES;
  } else {
    if (!API_KEY) {
      console.error("❌  FOOTBALL_DATA_KEY não definida no .env");
      console.error("   Crie uma chave gratuita em: https://www.football-data.org/client/register");
      process.exit(1);
    }
    console.log("🔍  Consultando football-data.org...");
    matches = await fetchMatches(date);
  }

  console.log(`   ${matches.length} partida(s) encontrada(s)\n`);

  if (matches.length === 0) {
    console.log("Nenhuma partida da Copa encontrada para essa data.");
    console.log("Tente: node scripts/sync-results.js --date=YYYY-MM-DD --dry-run");
    return;
  }

  // 2. Processa resultados
  console.log("📋  Partidas:\n");
  const updates     = [];
  const resultLabel = { home: "Vitória Casa", draw: "Empate", away: "Vitória Fora" };

  for (const m of matches) {
    const result = mapResult(m);
    const score  = formatScore(m);

    if (!result) {
      console.log(`   ⏳  ${m.homeTeam.name} x ${m.awayTeam.name}  (${m.status} — sem resultado final)`);
      continue;
    }

    console.log(`   ✅  ${score}  →  ${resultLabel[result]}`);

    updates.push({
      home_team : m.homeTeam.name,
      away_team : m.awayTeam.name,
      score,
      result,
      match_date: m.utcDate,
      api_id    : String(m.id),
      phase     : mapPhase(m),
    });
  }

  console.log(`\n   ${updates.length} de ${matches.length} partida(s) com resultado final.\n`);

  // 3. Salva no Supabase
  if (DRY_RUN) {
    console.log("✅  Dry-run concluído. Nenhum dado foi salvo.");
    return;
  }

  if (updates.length === 0) {
    console.log("Nada para salvar.");
    return;
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE) {
    console.error("❌  VITE_SUPABASE_URL ou SUPABASE_SERVICE_KEY não definidos no .env");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE);
  console.log("💾  Salvando no Supabase...\n");

  for (const u of updates) {
    const { error } = await supabase
      .from("matches")
      .upsert(u, { onConflict: "api_id" }); // api_id garante idempotência (sem duplicatas)

    if (error) console.error(`   ❌  Erro ao salvar "${u.score}": ${error.message}`);
    else       console.log(`   ✅  Salvo: ${u.score}`);
  }

  console.log("\n🏁  Sync concluído.");
}

run().catch((err) => {
  console.error("\n❌  Erro inesperado:", err.message);
  process.exit(1);
});
