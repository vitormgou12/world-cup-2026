const FLAG_CODES = {
  // América do Sul
  "Brasil": "br", "Brazil": "br",
  "Argentina": "ar",
  "Uruguai": "uy", "Uruguay": "uy",
  "Colômbia": "co", "Colombia": "co",
  "Equador": "ec", "Ecuador": "ec",
  "Paraguai": "py", "Paraguay": "py",
  "Peru": "pe", "Chile": "cl",
  "Bolívia": "bo", "Bolivia": "bo",
  "Venezuela": "ve",
  // América do Norte / Central
  "México": "mx", "Mexico": "mx",
  "Estados Unidos": "us", "United States": "us", "EUA": "us", "USA": "us",
  "Canadá": "ca", "Canada": "ca",
  "Costa Rica": "cr",
  "Honduras": "hn",
  "Jamaica": "jm",
  "Panamá": "pa", "Panama": "pa",
  // Europa
  "França": "fr", "France": "fr",
  "Alemanha": "de", "Germany": "de",
  "Espanha": "es", "Spain": "es",
  "Inglaterra": "gb-eng", "England": "gb-eng",
  "Itália": "it", "Italy": "it",
  "Holanda": "nl", "Netherlands": "nl",
  "Portugal": "pt",
  "Bélgica": "be", "Belgium": "be",
  "Croácia": "hr", "Croatia": "hr",
  "Polônia": "pl", "Poland": "pl",
  "Suíça": "ch", "Switzerland": "ch",
  "Áustria": "at", "Austria": "at",
  "Dinamarca": "dk", "Denmark": "dk",
  "República Tcheca": "cz", "Czechia": "cz", "Czech Republic": "cz",
  "Sérvia": "rs", "Serbia": "rs",
  "Escócia": "gb-sct", "Scotland": "gb-sct",
  "Hungria": "hu", "Hungary": "hu",
  "Eslováquia": "sk", "Slovakia": "sk",
  "Noruega": "no", "Norway": "no",
  "Turquia": "tr", "Turkey": "tr",
  "País de Gales": "gb-wls", "Wales": "gb-wls",
  // África
  "Marrocos": "ma", "Morocco": "ma",
  "Tunísia": "tn", "Tunisia": "tn",
  "Senegal": "sn",
  "Egito": "eg", "Egypt": "eg",
  "Costa do Marfim": "ci", "Ivory Coast": "ci",
  "Camarões": "cm", "Cameroon": "cm",
  "Argélia": "dz", "Algeria": "dz",
  "Gana": "gh", "Ghana": "gh",
  "Nigéria": "ng", "Nigeria": "ng",
  "África do Sul": "za", "South Africa": "za",
  // Ásia / Oceania
  "Japão": "jp", "Japan": "jp",
  "Coreia do Sul": "kr", "South Korea": "kr",
  "Irã": "ir", "Iran": "ir",
  "Austrália": "au", "Australia": "au",
  "Arábia Saudita": "sa", "Saudi Arabia": "sa",
  "Catar": "qa", "Qatar": "qa",
  "Iraque": "iq", "Iraq": "iq",
  "Jordânia": "jo", "Jordan": "jo",
  "Uzbequistão": "uz", "Uzbekistan": "uz",
  "Nova Zelândia": "nz", "New Zealand": "nz",
  // Outros possíveis
  "Bósnia e Herzegovina": "ba", "Bosnia-Herzegovina": "ba",
  "A definir": null,
};

export function flagUrl(teamName, size = 40) {
  const code = FLAG_CODES[teamName?.trim()];
  if (!code) return null;
  return `https://flagcdn.com/w${size}/${code}.png`;
}
