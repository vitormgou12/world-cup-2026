const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const y = yesterday.toISOString().slice(0, 10);

export const MOCK = {
  teams: [
    { id: "frango",  name: "F.R.A.N.G.O" },
    { id: "dll",     name: ".DLL" },
    { id: "oraculo", name: "Oráculo" },
    { id: "fe",      name: "99% Fé" },
  ],

  members: [
    { team_id: "frango",  name: "Sarah Barbosa" },
    { team_id: "frango",  name: "Robson José" },
    { team_id: "frango",  name: "Vinícius Raceputi" },
    { team_id: "dll",     name: "Diego Silva" },
    { team_id: "dll",     name: "Leandro Nogueira dos Santos" },
    { team_id: "dll",     name: "Luís Henrique Lima" },
    { team_id: "oraculo", name: "Amaury Ribeiro" },
    { team_id: "oraculo", name: "Ailton Jimenez Ferreira" },
    { team_id: "fe",      name: "João Vitor Ribeiro" },
    { team_id: "fe",      name: "Lucas Müller" },
  ],

  ranking: [
    { team_id: "frango",  team_name: "F.R.A.N.G.O", position: 1, total_points: "165", wins: "8", losses: "2", pending: "2" },
    { team_id: "dll",     team_name: ".DLL",        position: 2, total_points: "140", wins: "7", losses: "3", pending: "2" },
    { team_id: "oraculo", team_name: "Oráculo",     position: 3, total_points: "118", wins: "6", losses: "3", pending: "3" },
    { team_id: "fe",      team_name: "99% Fé",      position: 4, total_points: "95",  wins: "5", losses: "4", pending: "3" },
  ],

  matches: [
    { id: "match-1", home_team: "Brasil",  away_team: "Argentina",  result: "home", score: "2-1", match_date: `${y}T15:00:00+00:00`, phase: "group" },
    { id: "match-2", home_team: "França",  away_team: "Alemanha",   result: "draw", score: "1-1", match_date: `${y}T18:00:00+00:00`, phase: "group" },
    { id: "match-3", home_team: "Espanha", away_team: "Inglaterra", result: "pending", score: null, match_date: `${y}T21:00:00+00:00`, phase: "group" },
  ],

  predictions: [
    { team_id: "frango",  match_id: "match-1", prob_home: "65", prob_draw: "20", prob_away: "15" },
    { team_id: "frango",  match_id: "match-2", prob_home: "30", prob_draw: "45", prob_away: "25" },
    { team_id: "frango",  match_id: "match-3", prob_home: "50", prob_draw: "25", prob_away: "25" },
    { team_id: "dll",     match_id: "match-1", prob_home: "60", prob_draw: "25", prob_away: "15" },
    { team_id: "dll",     match_id: "match-2", prob_home: "35", prob_draw: "40", prob_away: "25" },
    { team_id: "dll",     match_id: "match-3", prob_home: "45", prob_draw: "30", prob_away: "25" },
    { team_id: "oraculo", match_id: "match-1", prob_home: "35", prob_draw: "30", prob_away: "35" },
    { team_id: "oraculo", match_id: "match-2", prob_home: "25", prob_draw: "45", prob_away: "30" },
    { team_id: "oraculo", match_id: "match-3", prob_home: "30", prob_draw: "35", prob_away: "35" },
    { team_id: "fe",      match_id: "match-1", prob_home: "50", prob_draw: "30", prob_away: "20" },
    { team_id: "fe",      match_id: "match-2", prob_home: "45", prob_draw: "25", prob_away: "30" },
    { team_id: "fe",      match_id: "match-3", prob_home: "40", prob_draw: "30", prob_away: "30" },
  ],
};
