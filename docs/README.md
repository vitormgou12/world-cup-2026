# Copa dos Oráculos — Datarisk

Plataforma interna da Datarisk para a competição de modelos preditivos da Copa do Mundo 2026.

---

## Estrutura

```text
world-cup-2026/
├── src/
│   ├── App.jsx                 # Nav + roteamento entre páginas
│   ├── lib/
│   │   ├── supabase.js         # Client real ou mock (controlado por env)
│   │   ├── mock-supabase.js    # Implementação fake do client (só branch develop)
│   │   └── mock-data.js        # Dados de demonstração (só branch develop)
│   └── pages/
│       ├── RankingPage.jsx     # Ranking dos times + previsões expansíveis
│       └── TimesPage.jsx       # Detalhe dos 4 times + espaço de descrição
├── database/
│   └── schema.sql              # Schema PostgreSQL para Supabase
├── scripts/
│   ├── seed-matches.js         # Popula partidas iniciais
│   └── sync-results.js         # Atualiza resultados via football-data.org
└── docs/README.md
```

---

## Como rodar localmente

```bash
npm install
npm run dev
```

A app sobe em `http://localhost:5173`.

---

## Modo demo (mock) × Supabase real

Disponível apenas na branch `develop` (a `main` roda sempre contra Supabase).
A app alterna entre **dados mockados** (para apresentação) e **Supabase real**
via uma única variável no `.env`:

```bash
# .env
VITE_USE_MOCK=true        # demo — usa src/lib/mock-data.js
# VITE_USE_MOCK=false     # produção — usa Supabase
```

**Regras de fallback:**

- `VITE_USE_MOCK=true` → sempre mock
- `VITE_USE_MOCK=false` (ou ausente) **+** `VITE_SUPABASE_URL` ausente → cai no mock automaticamente
- `VITE_USE_MOCK=false` **+** `VITE_SUPABASE_URL` setado → Supabase

Quando estiver em modo demo, aparece um badge **`MODO DEMO`** amarelo no canto superior direito da nav.

> Depois de mudar o `.env`, reinicie o `npm run dev` (Vite só lê env no startup).

Os dados de demo estão em [src/lib/mock-data.js](../src/lib/mock-data.js) e cobrem ranking, partidas de ontem e previsões dos 4 times.

---

## Supabase — setup (produção)

1. Criar projeto em <https://supabase.com>
2. Rodar `database/schema.sql` no SQL Editor
3. Preencher `.env`:

   ```bash
   VITE_SUPABASE_URL=https://<projeto>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon-key>
   SUPABASE_SERVICE_KEY=<service-role-key>  # só p/ scripts, nunca expor no front
   FOOTBALL_DATA_KEY=<chave-football-data>
   ```

4. Seed inicial: `npm run seed:matches`
5. Sync de resultados: `npm run sync` (ou `npm run sync:dry` p/ testar)

---

## Lógica de pontuação

- Cada time submete **3 probabilidades** por partida: P(casa), P(empate), P(fora) — soma = 100%
- **Acerta** se o outcome com maior probabilidade coincide com o resultado real
- **Pontos** = 10 × multiplicador da fase
- Multiplicadores: Grupos 1× · Oitavas 1.5× · Quartas 2× · Semi 2.5× · Semifinal 3× · Final 4×

---

## Times participantes

| Time        | Membros                                                      |
| ----------- | ------------------------------------------------------------ |
| F.R.A.N.G.O | Sarah Barbosa, Robson José, Vinícius Raceputi                |
| .DLL        | Diego Silva, Leandro Nogueira dos Santos, Luís Henrique Lima |
| Oráculo     | Amaury Ribeiro, Ailton Jimenez Ferreira                      |
| 99% Fé      | João Vitor Ribeiro, Lucas Müller                             |

---

## Próximos passos técnicos

1. Adicionar logos PNG dos times (substituir emojis em [TimesPage.jsx](../src/pages/TimesPage.jsx))
2. Preencher descrição do modelo/estratégia de cada time
3. Formulário de submissão de previsões para os times
4. Deploy (Vercel ou Netlify)
