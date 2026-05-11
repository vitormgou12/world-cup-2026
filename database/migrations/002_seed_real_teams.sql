-- ============================================================
-- 002 - Seed dos 4 times reais do Copa dos Oráculos Datarisk
--
-- Substitui os times placeholder (Team Alpha/Beta/...) pelos
-- times reais com seus membros. Idempotente: pode ser rodado
-- múltiplas vezes sem efeito colateral.
-- ============================================================

BEGIN;

-- 1. Remove times placeholder (CASCADE deleta members + predictions deles)
DELETE FROM teams
WHERE name IN ('Team Alpha', 'Team Beta', 'Team Gamma', 'Team Delta', 'Team Epsilon');

-- 2. Insere os 4 times reais
INSERT INTO teams (name) VALUES
  ('F.R.A.N.G.O'),
  ('.DLL'),
  ('Oráculo'),
  ('99% Fé')
ON CONFLICT (name) DO NOTHING;

-- 3. Insere membros (skip se já existir membro com mesmo nome no mesmo time)
INSERT INTO members (team_id, name)
SELECT t.id, m.member_name
FROM (VALUES
  ('F.R.A.N.G.O', 'Sarah Barbosa'),
  ('F.R.A.N.G.O', 'Robson José'),
  ('F.R.A.N.G.O', 'Vinícius Raceputi'),
  ('.DLL',        'Diego Silva'),
  ('.DLL',        'Leandro Nogueira dos Santos'),
  ('.DLL',        'Luís Henrique Lima'),
  ('Oráculo',     'Amaury Ribeiro'),
  ('Oráculo',     'Ailton Jimenez Ferreira'),
  ('99% Fé',      'João Vitor Ribeiro'),
  ('99% Fé',      'Lucas Müller')
) AS m(team_name, member_name)
JOIN teams t ON t.name = m.team_name
WHERE NOT EXISTS (
  SELECT 1 FROM members ex
  WHERE ex.team_id = t.id AND ex.name = m.member_name
);

COMMIT;
