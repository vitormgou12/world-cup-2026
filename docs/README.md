# Copa dos Oráculos — Datarisk

Plataforma interna da Datarisk para a competição de **modelos preditivos** da Copa do Mundo 2026.
Cada time de data scientists submete, para cada partida, as probabilidades de vitória do mandante,
empate e vitória do visitante. O ranking mede qual modelo acerta mais ao longo do torneio.

---

## Estrutura

```text
world-cup-2026/
├── src/
│   ├── App.jsx                 # Nav + troca de página (useState, sem router)
│   ├── main.jsx                # Bootstrap React
│   ├── lib/
│   │   ├── supabase.js         # Client Supabase (anon key)
│   │   └── country-flags.js    # Nome da seleção (pt/en) → bandeira (flagcdn)
│   └── pages/
│       ├── RankingPage.jsx     # Ranking + previsões expansíveis por time
│       └── TimesPage.jsx       # Cards dos 4 times com a descrição de cada modelo
├── database/
│   ├── schema.sql              # Schema PostgreSQL base
│   └── migrations/
│       ├── 001_rls_fix.sql                 # RLS + políticas de leitura pública
│       ├── 002_seed_real_teams.sql         # Times reais + membros
│       └── 003_update_scoring_rules.sql    # 1 ponto base por acerto, final 3.5×
├── scripts/
│   ├── seed-matches.js         # Importa as 104 partidas da Copa
│   └── sync-results.js         # Atualiza resultados via football-data.org
├── public/escudos/             # Escudos SVG dos times
└── docs/README.md
```

Stack: **React 18 + Vite 5**, estilização inline (tema dark), backend **Supabase** (PostgreSQL + RLS).

---

## Como rodar localmente

```bash
npm install
npm run dev
```

A app sobe em `http://localhost:5173`.

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Dev server (Vite) |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Serve o build localmente |
| `npm run seed:matches` | Importa as 104 partidas da Copa para o Supabase |
| `npm run sync` | Busca resultados de ontem e grava no banco |
| `npm run sync:dry` | Igual ao sync, mas só exibe (não grava) |

---

## Supabase — setup (produção)

1. Criar projeto em <https://supabase.com>
2. No SQL Editor, rodar **na ordem**: `schema.sql` → `migrations/001` → `002` → `003` (todas idempotentes)
3. Preencher `.env` (veja `.env.example`):

   ```bash
   VITE_SUPABASE_URL=https://<projeto>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon-key>
   SUPABASE_SERVICE_KEY=<service-role-key>  # só p/ scripts, nunca expor no front
   FOOTBALL_DATA_KEY=<chave-football-data>
   ```

4. Seed inicial das partidas: `npm run seed:matches`
5. Sync de resultados: `npm run sync` (ou `npm run sync:dry` p/ testar)

A chave gratuita da football-data.org (que cobre a Copa do Mundo) é criada em
<https://www.football-data.org/client/register>.

---

## Lógica de pontuação

- Cada time submete **3 probabilidades** por partida: P(casa), P(empate), P(fora) — soma = 100%.
- O time **acerta** se o resultado de maior probabilidade prevista coincide com o resultado real.
- **Pontos por acerto = 1 × multiplicador da fase.**

| Fase | Multiplicador |
| --- | --- |
| Fase de grupos | 1× |
| 16avos | 1.5× |
| Oitavas | 2× |
| Quartas | 2.5× |
| Semifinal | 3× |
| Final | 3.5× |

> A pontuação existe na view SQL `ranking` **e** no cálculo client-side de `RankingPage.jsx`
> (que é o que a UI usa hoje). Ao mudar a regra, ajuste os dois lugares.

---

## Times participantes

| Time        | Modelo                            | Membros                                                      |
| ----------- | --------------------------------- | ------------------------------------------------------------ |
| F.R.A.N.G.O | LightGBM híbrido ("Zona do Caos") | Sarah Barbosa, Robson José, Vinícius Raceputi                |
| .DLL        | Regressão Logística + ELO         | Diego Silva, Leandro Nogueira dos Santos, Luís Henrique Lima |
| Oráculo     | XGBoost                           | Amaury Ribeiro, Ailton Jimenez Ferreira                      |
| 99% Fé      | LightGBM + Optuna + ELO dinâmico  | João Vitor Ribeiro, Lucas Müller                             |

A descrição técnica completa de cada modelo está na página **Times** do app
([TimesPage.jsx](../src/pages/TimesPage.jsx)).

---

## Próximos passos técnicos

1. Formulário de submissão de previsões para os times.
2. Migrar o cálculo de pontuação da UI para a view `ranking` (fonte única de verdade).
3. Histórico de evolução de posição no ranking (`PositionBadge` já existe, falta a base).
4. Deploy (Vercel ou Netlify).
