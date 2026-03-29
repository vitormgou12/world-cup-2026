-- ============================================================
-- World Cup 2026 – Datarisk Bolão Interno
-- Schema PostgreSQL para Supabase
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- 1. TIMES (grupos de data scientists)
-- ──────────────────────────────────────────────────────────
CREATE TABLE teams (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ──────────────────────────────────────────────────────────
-- 2. MEMBROS (data scientists de cada time)
-- ──────────────────────────────────────────────────────────
CREATE TABLE members (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id    UUID REFERENCES teams(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  email      TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ──────────────────────────────────────────────────────────
-- 3. PARTIDAS
-- ──────────────────────────────────────────────────────────
CREATE TYPE match_phase AS ENUM (
  'group', 'round_of_32', 'round_of_16',
  'quarterfinal', 'semifinal', 'final'
);

CREATE TYPE match_result AS ENUM ('home', 'draw', 'away', 'pending');

CREATE TABLE matches (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_team   TEXT NOT NULL,
  away_team   TEXT NOT NULL,
  phase       match_phase NOT NULL DEFAULT 'group',
  match_date  TIMESTAMPTZ,
  result      match_result NOT NULL DEFAULT 'pending',
  score       TEXT,          -- ex: "Brasil 1 x 3 Argentina"
  api_id      TEXT UNIQUE,   -- ID externo da API de futebol (evita duplicatas)
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ──────────────────────────────────────────────────────────
-- 4. MULTIPLICADORES POR FASE
-- ──────────────────────────────────────────────────────────
CREATE TABLE phase_multipliers (
  phase       match_phase PRIMARY KEY,
  multiplier  NUMERIC(4,2) NOT NULL DEFAULT 1.0
);

-- Valores padrão
INSERT INTO phase_multipliers (phase, multiplier) VALUES
  ('group',        1.0),
  ('round_of_32',  1.5),
  ('round_of_16',  2.0),
  ('quarterfinal', 2.5),
  ('semifinal',    3.0),
  ('final',        4.0);

-- ──────────────────────────────────────────────────────────
-- 5. PREVISÕES (três probabilidades por partida por time)
-- ──────────────────────────────────────────────────────────
CREATE TABLE predictions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id      UUID REFERENCES teams(id) ON DELETE CASCADE,
  match_id     UUID REFERENCES matches(id) ON DELETE CASCADE,
  prob_home    NUMERIC(5,2) NOT NULL CHECK (prob_home BETWEEN 0 AND 100),
  prob_draw    NUMERIC(5,2) NOT NULL CHECK (prob_draw BETWEEN 0 AND 100),
  prob_away    NUMERIC(5,2) NOT NULL CHECK (prob_away BETWEEN 0 AND 100),
  submitted_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (team_id, match_id),
  -- As três probabilidades devem somar 100 (tolerância de 0.01)
  CONSTRAINT probs_sum_to_100 CHECK (
    ABS(prob_home + prob_draw + prob_away - 100) < 0.01
  )
);

-- ──────────────────────────────────────────────────────────
-- 6. APOSTAS DO BOLÃO (qual time cada colaborador apostou)
-- ──────────────────────────────────────────────────────────
CREATE TABLE bets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email  TEXT NOT NULL,
  user_name   TEXT,
  team_id     UUID REFERENCES teams(id),
  bet_date    TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_email)   -- uma aposta por pessoa
);

-- ──────────────────────────────────────────────────────────
-- 7. VIEW: RANKING (calculado automaticamente)
-- ──────────────────────────────────────────────────────────
-- Lógica de pontuação:
--   O time acerta se o outcome com maior probabilidade prevista
--   coincide com o resultado real da partida.
--   Pontos = base_points * multiplicador_da_fase
--   base_points = 10 por acerto (ajustável)

CREATE OR REPLACE VIEW ranking AS
WITH scored AS (
  SELECT
    p.team_id,
    m.phase,
    CASE
      WHEN m.result = 'pending' THEN 'pending'
      WHEN (
        (p.prob_home >= p.prob_draw AND p.prob_home >= p.prob_away AND m.result = 'home') OR
        (p.prob_draw >= p.prob_home AND p.prob_draw >= p.prob_away AND m.result = 'draw') OR
        (p.prob_away >= p.prob_home AND p.prob_away >= p.prob_draw AND m.result = 'away')
      ) THEN 'correct'
      ELSE 'wrong'
    END AS outcome
  FROM predictions p
  JOIN matches m ON m.id = p.match_id
),
aggregated AS (
  SELECT
    s.team_id,
    COUNT(*) FILTER (WHERE s.outcome = 'correct') AS wins,
    COUNT(*) FILTER (WHERE s.outcome = 'wrong')   AS losses,
    COUNT(*) FILTER (WHERE s.outcome = 'pending') AS pending,
    SUM(
      CASE WHEN s.outcome = 'correct'
        THEN 3 * pm.multiplier
        ELSE 0
      END
    ) AS total_points
  FROM scored s
  JOIN phase_multipliers pm ON pm.phase = s.phase
  GROUP BY s.team_id
)
SELECT
  t.id         AS team_id,
  t.name       AS team_name,
  COALESCE(a.wins,         0) AS wins,
  COALESCE(a.losses,       0) AS losses,
  COALESCE(a.pending,      0) AS pending,
  COALESCE(a.total_points, 0) AS total_points,
  RANK() OVER (ORDER BY COALESCE(a.total_points, 0) DESC) AS position
FROM teams t
LEFT JOIN aggregated a ON a.team_id = t.id
ORDER BY position;

-- ──────────────────────────────────────────────────────────
-- 8. ROW LEVEL SECURITY (básico)
-- ──────────────────────────────────────────────────────────
ALTER TABLE bets       ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Leitura pública do ranking e partidas
CREATE POLICY "public read ranking"    ON teams    FOR SELECT USING (true);
CREATE POLICY "public read matches"    ON matches  FOR SELECT USING (true);
CREATE POLICY "public read members"    ON members  FOR SELECT USING (true);

-- Aposta: cada usuário gerencia apenas a própria
CREATE POLICY "own bet only" ON bets
  FOR ALL USING (auth.jwt() ->> 'email' = user_email);
