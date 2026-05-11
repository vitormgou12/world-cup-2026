const dayOffset = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
const d_2 = dayOffset(-2); // anteontem
const d_1 = dayOffset(-1); // ontem
const d1  = dayOffset(1);  // amanhã

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

  matches: [
    // Anteontem
    { id: "m1", home_team: "Brasil",   away_team: "Argentina",  result: "home",    score: "2-1", match_date: `${d_2}T18:00:00+00:00`, phase: "group" },
    // Ontem
    { id: "m2", home_team: "França",   away_team: "Alemanha",   result: "draw",    score: "1-1", match_date: `${d_1}T15:00:00+00:00`, phase: "group" },
    { id: "m3", home_team: "Espanha",  away_team: "Inglaterra", result: "home",    score: "2-0", match_date: `${d_1}T18:00:00+00:00`, phase: "group" },
    { id: "m4", home_team: "Portugal", away_team: "Holanda",    result: "away",    score: "0-3", match_date: `${d_1}T21:00:00+00:00`, phase: "group" },
    // Amanhã (pending)
    { id: "m5", home_team: "Itália",   away_team: "Bélgica",    result: "pending", score: null,  match_date: `${d1}T15:00:00+00:00`,  phase: "group" },
    { id: "m6", home_team: "México",   away_team: "Uruguai",    result: "pending", score: null,  match_date: `${d1}T18:00:00+00:00`,  phase: "group" },
  ],

  predictions: [
    // F.R.A.N.G.O — modelo forte: acerta tudo do passado
    { team_id: "frango",  match_id: "m1", prob_home: "65", prob_draw: "20", prob_away: "15" },
    { team_id: "frango",  match_id: "m2", prob_home: "30", prob_draw: "45", prob_away: "25" },
    { team_id: "frango",  match_id: "m3", prob_home: "60", prob_draw: "25", prob_away: "15" },
    { team_id: "frango",  match_id: "m4", prob_home: "20", prob_draw: "25", prob_away: "55" },
    { team_id: "frango",  match_id: "m5", prob_home: "50", prob_draw: "30", prob_away: "20" },
    { team_id: "frango",  match_id: "m6", prob_home: "45", prob_draw: "30", prob_away: "25" },

    // .DLL — técnico: acerta tudo do passado
    { team_id: "dll",     match_id: "m1", prob_home: "60", prob_draw: "25", prob_away: "15" },
    { team_id: "dll",     match_id: "m2", prob_home: "35", prob_draw: "40", prob_away: "25" },
    { team_id: "dll",     match_id: "m3", prob_home: "50", prob_draw: "25", prob_away: "25" },
    { team_id: "dll",     match_id: "m4", prob_home: "30", prob_draw: "30", prob_away: "40" },
    { team_id: "dll",     match_id: "m5", prob_home: "45", prob_draw: "30", prob_away: "25" },
    { team_id: "dll",     match_id: "m6", prob_home: "40", prob_draw: "35", prob_away: "25" },

    // Oráculo — médio: acerta a maioria
    { team_id: "oraculo", match_id: "m1", prob_home: "45", prob_draw: "30", prob_away: "25" },
    { team_id: "oraculo", match_id: "m2", prob_home: "25", prob_draw: "45", prob_away: "30" },
    { team_id: "oraculo", match_id: "m3", prob_home: "45", prob_draw: "30", prob_away: "25" },
    { team_id: "oraculo", match_id: "m4", prob_home: "25", prob_draw: "30", prob_away: "45" },
    { team_id: "oraculo", match_id: "m5", prob_home: "30", prob_draw: "40", prob_away: "30" },
    { team_id: "oraculo", match_id: "m6", prob_home: "35", prob_draw: "35", prob_away: "30" },

    // 99% Fé — fé no time da casa, alguns erros
    { team_id: "fe",      match_id: "m1", prob_home: "50", prob_draw: "30", prob_away: "20" },
    { team_id: "fe",      match_id: "m2", prob_home: "45", prob_draw: "25", prob_away: "30" }, // errou (draw)
    { team_id: "fe",      match_id: "m3", prob_home: "40", prob_draw: "30", prob_away: "30" },
    { team_id: "fe",      match_id: "m4", prob_home: "55", prob_draw: "25", prob_away: "20" }, // errou (away)
    { team_id: "fe",      match_id: "m5", prob_home: "40", prob_draw: "30", prob_away: "30" },
    { team_id: "fe",      match_id: "m6", prob_home: "45", prob_draw: "30", prob_away: "25" },
  ],
};
