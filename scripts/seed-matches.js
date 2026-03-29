/**
 * seed-matches.js
 * Importa todas as 104 partidas da Copa 2026 via football-data.org para o Supabase.
 * Pode ser rodado novamente sem duplicar — usa api_id como chave de upsert.
 *
 * Uso:
 *   node scripts/seed-matches.js --dry-run   → exibe sem salvar
 *   node scripts/seed-matches.js             → salva no banco
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config();

const DRY_RUN      = process.argv.includes("--dry-run");
const API_KEY      = process.env.FOOTBALL_DATA_KEY;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

const PHASE_MAP = {
  "GROUP_STAGE":   "group",
  "LAST_32":       "round_of_32",
  "LAST_16":       "round_of_16",
  "QUARTER_FINALS":"quarterfinal",
  "SEMI_FINALS":   "semifinal",
  "THIRD_PLACE":   "semifinal",
  "FINAL":         "final",
};

const PHASE_LABEL = {
  group:        "Fase de Grupos",
  round_of_32:  "16avos de Final",
  round_of_16:  "Oitavas de Final",
  quarterfinal: "Quartas de Final",
  semifinal:    "Semifinal",
  final:        "Final",
};

async function run() {
  console.log("\n🌍  Copa Datarisk 2026 — Seed de Partidas");
  console.log(DRY_RUN ? "   [DRY-RUN — nada será salvo]\n" : "");

  console.log("🔍  Consultando football-data.org...");
  const res = await fetch("https://api.football-data.org/v4/competitions/WC/matches", {
    headers: { "X-Auth-Token": API_KEY },
  });

  if (!res.ok) throw new Error(`API retornou ${res.status}: ${res.statusText}`);

  const { matches } = await res.json();
  console.log(`   ${matches.length} partida(s) encontrada(s)\n`);

  const records = matches.map(m => ({
    api_id:     String(m.id),
    home_team:  m.homeTeam?.name || "A definir",
    away_team:  m.awayTeam?.name || "A definir",
    phase:      PHASE_MAP[m.stage] ?? "group",
    match_date: m.utcDate,
    result:     "pending",
  }));

  // Resumo por fase
  const byPhase = {};
  records.forEach(r => { byPhase[r.phase] = (byPhase[r.phase] || 0) + 1; });

  console.log("📋  Partidas por fase:");
  Object.entries(byPhase).forEach(([phase, count]) => {
    console.log(`   ${PHASE_LABEL[phase] ?? phase}: ${count}`);
  });

  console.log(`\n   Total: ${records.length} partidas`);

  if (DRY_RUN) {
    console.log("\n   Amostra — primeiros 5 jogos:");
    records.slice(0, 5).forEach(r => {
      const date = new Date(r.match_date).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
      console.log(`   [${r.api_id}]  ${date}  ${r.home_team} x ${r.away_team}  (${PHASE_LABEL[r.phase]})`);
    });
    console.log("\n✅  Dry-run concluído.");
    return;
  }

  // Upsert no Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log("\n💾  Salvando no Supabase...");

  let ok = 0, fail = 0;
  for (const r of records) {
    const { error } = await supabase
      .from("matches")
      .upsert(r, { onConflict: "api_id" });

    if (error) { console.error(`   ❌  [${r.api_id}] ${r.home_team} x ${r.away_team}: ${error.message}`); fail++; }
    else ok++;
  }

  console.log(`\n🏁  Concluído: ${ok} salvas, ${fail} erros.`);
}

run().catch(err => {
  console.error("\n❌  Erro:", err.message);
  process.exit(1);
});
