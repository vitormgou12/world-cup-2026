-- ============================================================
-- 003 - Atualiza regras de pontuação
--
-- 1 ponto base por acerto (era 3) e multiplicador da final
-- ajustado para 3.5 (era 4). Idempotente.
-- ============================================================

BEGIN;

-- 1. Multiplicador da final: 4.0 → 3.5
UPDATE phase_multipliers
SET multiplier = 3.5
WHERE phase = 'final';

-- 2. Recria a view ranking com 1 ponto base (em vez de 3)
DROP VIEW IF EXISTS ranking;

CREATE VIEW ranking AS
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
        THEN 1 * pm.multiplier
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

COMMIT;
