const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const y = yesterday.toISOString().slice(0, 10);

export const MOCK = {
  teams: [
    { id: "team-1", name: "Team Alpha" },
    { id: "team-2", name: "Team Beta" },
    { id: "team-3", name: "Team Gamma" },
    { id: "team-4", name: "Team Delta" },
    { id: "team-5", name: "Team Epsilon" },
  ],

  members: [
    { team_id: "team-1", name: "Ana" },
    { team_id: "team-1", name: "Bruno" },
    { team_id: "team-1", name: "Carlos" },
    { team_id: "team-2", name: "Diana" },
    { team_id: "team-2", name: "Eduardo" },
    { team_id: "team-3", name: "Fernanda" },
    { team_id: "team-3", name: "Gabriel" },
    { team_id: "team-3", name: "Helena" },
    { team_id: "team-4", name: "Igor" },
    { team_id: "team-4", name: "Julia" },
    { team_id: "team-5", name: "Kleber" },
    { team_id: "team-5", name: "Lucia" },
    { team_id: "team-5", name: "Marcos" },
  ],

  bets: [
    { team_id: "team-1", user_email: "ana@datarisk.io",    user_name: "Ana" },
    { team_id: "team-2", user_email: "diana@datarisk.io",  user_name: "Diana" },
    { team_id: "team-1", user_email: "carlos@datarisk.io", user_name: "Carlos" },
  ],

  ranking: [
    { team_id: "team-1", team_name: "Team Alpha",   position: 1, total_points: "142", wins: "8", losses: "2", pending: "2" },
    { team_id: "team-2", team_name: "Team Beta",    position: 2, total_points: "128", wins: "7", losses: "3", pending: "2" },
    { team_id: "team-3", team_name: "Team Gamma",   position: 3, total_points: "115", wins: "6", losses: "3", pending: "3" },
    { team_id: "team-4", team_name: "Team Delta",   position: 4, total_points: "98",  wins: "5", losses: "4", pending: "3" },
    { team_id: "team-5", team_name: "Team Epsilon", position: 5, total_points: "84",  wins: "4", losses: "5", pending: "3" },
  ],

  // Partidas de ontem (datas geradas dinamicamente para aparecer no RankingPage)
  matches: [
    { id: "match-1", home_team: "Brasil",  away_team: "Argentina", result: "home", score: "2-1", match_date: `${y}T15:00:00+00:00`, phase: "group" },
    { id: "match-2", home_team: "França",  away_team: "Alemanha",  result: "draw", score: "1-1", match_date: `${y}T18:00:00+00:00`, phase: "group" },
    { id: "match-3", home_team: "Espanha", away_team: "Inglaterra", result: "pending", score: null, match_date: `${y}T21:00:00+00:00`, phase: "group" },
  ],

  predictions: [
    { team_id: "team-1", match_id: "match-1", prob_home: "60", prob_draw: "25", prob_away: "15" },
    { team_id: "team-1", match_id: "match-2", prob_home: "35", prob_draw: "30", prob_away: "35" },
    { team_id: "team-1", match_id: "match-3", prob_home: "45", prob_draw: "30", prob_away: "25" },
    { team_id: "team-2", match_id: "match-1", prob_home: "40", prob_draw: "30", prob_away: "30" },
    { team_id: "team-2", match_id: "match-2", prob_home: "50", prob_draw: "25", prob_away: "25" },
    { team_id: "team-2", match_id: "match-3", prob_home: "35", prob_draw: "35", prob_away: "30" },
    { team_id: "team-3", match_id: "match-1", prob_home: "55", prob_draw: "20", prob_away: "25" },
    { team_id: "team-3", match_id: "match-2", prob_home: "30", prob_draw: "40", prob_away: "30" },
    { team_id: "team-3", match_id: "match-3", prob_home: "40", prob_draw: "25", prob_away: "35" },
    { team_id: "team-4", match_id: "match-1", prob_home: "50", prob_draw: "30", prob_away: "20" },
    { team_id: "team-4", match_id: "match-2", prob_home: "40", prob_draw: "30", prob_away: "30" },
    { team_id: "team-4", match_id: "match-3", prob_home: "55", prob_draw: "20", prob_away: "25" },
    { team_id: "team-5", match_id: "match-1", prob_home: "45", prob_draw: "35", prob_away: "20" },
    { team_id: "team-5", match_id: "match-2", prob_home: "35", prob_draw: "25", prob_away: "40" },
    { team_id: "team-5", match_id: "match-3", prob_home: "50", prob_draw: "30", prob_away: "20" },
  ],
};
