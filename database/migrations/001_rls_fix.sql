-- ============================================================
-- Migration 001 — Habilitar RLS em todas as tabelas públicas
-- Aplicar no SQL Editor do Supabase
-- Idempotente: pode ser executada mais de uma vez sem erro
-- ============================================================

-- Tabelas que estavam sem RLS (qualquer um podia escrever/deletar)
ALTER TABLE teams             ENABLE ROW LEVEL SECURITY;
ALTER TABLE members           ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches           ENABLE ROW LEVEL SECURITY;
ALTER TABLE phase_multipliers ENABLE ROW LEVEL SECURITY;

-- Leitura pública (somente SELECT) nas tabelas de referência
DROP POLICY IF EXISTS "public read teams"             ON teams;
DROP POLICY IF EXISTS "public read members"           ON members;
DROP POLICY IF EXISTS "public read matches"           ON matches;
DROP POLICY IF EXISTS "public read phase_multipliers" ON phase_multipliers;
DROP POLICY IF EXISTS "public read predictions"       ON predictions;
DROP POLICY IF EXISTS "public read bets"              ON bets;
DROP POLICY IF EXISTS "public read ranking"           ON teams;   -- nome antigo

CREATE POLICY "public read teams"             ON teams             FOR SELECT USING (true);
CREATE POLICY "public read members"           ON members           FOR SELECT USING (true);
CREATE POLICY "public read matches"           ON matches           FOR SELECT USING (true);
CREATE POLICY "public read phase_multipliers" ON phase_multipliers FOR SELECT USING (true);
CREATE POLICY "public read predictions"       ON predictions       FOR SELECT USING (true);
CREATE POLICY "public read bets"              ON bets              FOR SELECT USING (true);

-- Aposta: INSERT restrito ao próprio usuário autenticado
DROP POLICY IF EXISTS "own bet only" ON bets;
CREATE POLICY "own bet only" ON bets
  FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = user_email);
