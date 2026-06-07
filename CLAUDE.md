# CLAUDE.md

Guia para o Claude Code trabalhar neste repositório. Em português — o projeto é interno e em pt-BR.

## O que é

**Copa dos Oráculos** — bolão/competição interna da Datarisk em cima da Copa do Mundo 2026.
Quatro times de data scientists submetem **modelos preditivos** que estimam, para cada partida,
as probabilidades de vitória do mandante / empate / vitória do visitante. O placar mede qual
modelo acerta mais ao longo do torneio.

App de página única (SPA) que mostra o ranking ao vivo e a descrição técnica de cada modelo.
Os dados vivem no Supabase; resultados reais entram via scripts que consomem a football-data.org.

## Stack

- **Frontend:** React 18 + Vite 5. Sem framework de CSS — estilização é **inline** (objetos `style`), tema dark slate (`#0f172a`).
- **Roteamento:** trocado por `useState` em [src/App.jsx](src/App.jsx) (duas páginas, sem react-router).
- **Backend:** Supabase (PostgreSQL + RLS). Client em [src/lib/supabase.js](src/lib/supabase.js) usa a anon key.
- **Scripts:** Node ESM, consomem a API football-data.org com a `SUPABASE_SERVICE_KEY`.

## Comandos

```bash
npm install
npm run dev          # Vite dev server em http://localhost:5173
npm run build        # build de produção (dist/)
npm run preview      # serve o build

npm run seed:matches # importa as 104 partidas da Copa para o Supabase
npm run sync         # busca resultados de ONTEM e atualiza o banco
npm run sync:dry     # mesmo que sync, mas só exibe (não grava)
```

Não há test runner nem linter configurados no momento.

## Estrutura

```text
src/
  App.jsx                  # nav + troca de página via useState
  main.jsx                 # bootstrap React
  lib/
    supabase.js            # client Supabase (anon key, frontend)
    country-flags.js       # nome da seleção (pt/en) → URL de bandeira no flagcdn
  pages/
    RankingPage.jsx        # ranking + previsões expansíveis por time
    TimesPage.jsx          # cards dos 4 times com a descrição técnica de cada modelo
database/
  schema.sql               # schema base (rodar PRIMEIRO)
  migrations/
    001_rls_fix.sql        # habilita RLS + políticas de leitura pública
    002_seed_real_teams.sql# substitui placeholders pelos 4 times reais + membros
    003_update_scoring_rules.sql  # 1 ponto base por acerto + final 3.5×
scripts/
  seed-matches.js          # popula matches (104 jogos) via football-data.org
  sync-results.js          # atualiza result/score das partidas finalizadas
public/escudos/            # escudos SVG dos times (escudo-1..4)
docs/README.md             # documentação do projeto
```

## Modelo de dados (Supabase)

- `teams` — os 4 times de data scientists.
- `members` — pessoas de cada time.
- `matches` — partidas. `result` ∈ `home|draw|away|pending`; `phase` é um enum; `api_id` (id da football-data.org) é a chave de upsert que garante idempotência.
- `phase_multipliers` — multiplicador de pontos por fase.
- `predictions` — 3 probabilidades por (time, partida); constraint exige soma = 100 (±0.01).
- `bets` — palpite do bolão de cada colaborador (uma aposta por e-mail).
- `ranking` (VIEW) — ranking calculado no banco.

## Regras de pontuação (importante)

- Um time **acerta** quando o resultado de maior probabilidade na sua previsão coincide com o resultado real.
- **Pontos por acerto = 1 × multiplicador da fase.**
- Multiplicadores atuais: grupos **1** · 16avos **1.5** · oitavas **2** · quartas **2.5** · semi **3** · final **3.5**.

⚠️ **A pontuação está implementada em DOIS lugares e precisa ficar sincronizada:**
1. A view SQL `ranking` (definida em `schema.sql`, atualizada por `003_update_scoring_rules.sql`).
2. O cálculo **client-side** em [src/pages/RankingPage.jsx](src/pages/RankingPage.jsx) (`PHASE_MULTIPLIERS` + `POINTS_PER_CORRECT`), que é o que a UI realmente usa hoje — a página agrega `matches`/`predictions` no navegador e **não** lê a view `ranking`.

Ao mudar regra de pontuação, ajuste os dois. Note que `schema.sql` ainda traz os valores **antigos** (3 pontos, final 4×); a migration 003 é a fonte da verdade no banco.

## Convenções e armadilhas

- **Migrations rodam em ordem** no SQL Editor do Supabase: `schema.sql` → `001` → `002` → `003`. Todas são idempotentes.
- Nomes de seleções aparecem em **pt e en**; `country-flags.js` mapeia ambos. Ao adicionar país novo, inclua as duas grafias.
- As descrições dos modelos em [TimesPage.jsx](src/pages/TimesPage.jsx) são **JSX hardcoded** (constantes `DESC_*`), não vêm do banco.
- A `SUPABASE_SERVICE_KEY` e a `FOOTBALL_DATA_KEY` são **só para os scripts** — nunca expor no frontend nem commitar `.env`.
- Plataforma de dev: **Windows / PowerShell**. Os scripts são Node puro e rodam cross-platform.

## Variáveis de ambiente (`.env`)

```bash
VITE_SUPABASE_URL=https://<projeto>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>        # frontend
SUPABASE_SERVICE_KEY=<service-role-key>  # só scripts
FOOTBALL_DATA_KEY=<chave>                # football-data.org (plano grátis cobre a Copa)
```

## Git

- Fluxo: trabalho em `develop`, entrega via **cherry-pick** dos commits relevantes para `main` — nunca merge direto (arquivos de mock não vão para `main`).
