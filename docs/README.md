# World Cup 2026 — Datarisk Bolão Interno

Competição interna de modelos preditivos para a Copa do Mundo 2026.

---

## Estrutura do projeto

```
world-cup-2026/
├── src/
│   ├── App.jsx                  # Roteamento entre páginas
│   └── pages/
│       ├── RankingPage.jsx      # Ranking dos times com expansão de previsões
│       └── BolaoPage.jsx        # Login + seleção de time + confirmação
├── database/
│   └── schema.sql               # Schema PostgreSQL para Supabase
├── docs/
│   └── README.md
└── package.json
```

---

## Como rodar localmente

```bash
# 1. Criar projeto Vite + React
npm create vite@latest world-cup-2026 -- --template react
cd world-cup-2026

# 2. Instalar dependências
npm install

# 3. Copiar os arquivos de src/ para o projeto
# (substituir App.jsx e adicionar a pasta pages/)

# 4. Rodar
npm run dev
```

---

## Supabase — setup (pendente)

1. Criar projeto em https://supabase.com
2. Executar `database/schema.sql` no SQL Editor
3. Pegar as variáveis de ambiente:
   ```
   VITE_SUPABASE_URL=https://<project>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon-key>
   ```
4. Criar `.env` na raiz do projeto com as variáveis acima
5. Instalar client: `npm install @supabase/supabase-js`
6. Criar `src/lib/supabase.js`:
   ```js
   import { createClient } from "@supabase/supabase-js";
   export const supabase = createClient(
     import.meta.env.VITE_SUPABASE_URL,
     import.meta.env.VITE_SUPABASE_ANON_KEY
   );
   ```
7. Substituir dados mock nas páginas pelas queries ao Supabase

---

## Lógica de pontuação

- Cada time submete **3 probabilidades** por partida: P(casa), P(empate), P(fora) — soma = 100%
- **Acerta** se o outcome com maior probabilidade coincide com o resultado real
- **Pontos** = 10 × multiplicador da fase
- Multiplicadores: Grupos 1× · Oitavas 1.5× · Quartas 2× · Semi 2.5× · Semifinal 3× · Final 4×

---

## Decisões em aberto

- [ ] Confirmar pontuação base por acerto (atualmente 10 pts)
- [ ] Definir deadline de submissão de previsões por fase
- [ ] Política de empate no ranking (desempate por acertos em fases mais avançadas?)
- [ ] Premiação do bolão

---

## Próximos passos técnicos

1. Conectar frontend ao Supabase (dados reais)
2. Implementar autenticação real (Google OAuth via Supabase Auth)
3. Deploy (Vercel ou Netlify)
4. Formulário de submissão de previsões para os times
