-- ============================================================
-- Migration 001 — Habilitar RLS em todas as tabelas públicas
-- Aplicar no SQL Editor do Supabase
-- ============================================================

-- Tabelas que estavam sem RLS (qualquer um podia escrever/deletar)
ALTER TABLE teams             ENABLE ROW LEVEL SECURITY;
ALTER TABLE members           ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches           ENABLE ROW LEVEL SECURITY;
ALTER TABLE phase_multipliers ENABLE ROW LEVEL SECURITY;

-- Leitura pública (somente SELECT) nas tabelas de referência
CREATE POLICY "public read phase_multipliers"
  ON phase_multipliers FOR SELECT USING (true);

-- Leitura pública de predictions (necessário para exibir previsões no ranking)
CREATE POLICY "public read predictions"
  ON predictions FOR SELECT USING (true);

-- Leitura pública de bets (necessário para contar votos por time)
-- Escrita continua restrita a cada usuário (policy "own bet only" já existente)
CREATE POLICY "public read bets"
  ON bets FOR SELECT USING (true);
