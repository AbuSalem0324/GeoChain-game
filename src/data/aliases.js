
// Canonical name → display name mapping, plus alias → canonical
export const CANONICAL = {
  'united states': 'United States',
  'united kingdom': 'United Kingdom',
  'united arab emirates': 'United Arab Emirates',
  'democratic republic of the congo': 'Democratic Republic of the Congo',
  'republic of the congo': 'Republic of the Congo',
  'central african republic': 'Central African Republic',
  'czech republic': 'Czech Republic',
  'north macedonia': 'North Macedonia',
  'bosnia and herzegovina': 'Bosnia and Herzegovina',
  'trinidad and tobago': 'Trinidad and Tobago',
  "cote d'ivoire": "Côte d'Ivoire",
  'timor-leste': 'Timor-Leste',
  'sao tome and principe': 'São Tomé and Príncipe',
  'papua new guinea': 'Papua New Guinea',
  'saudi arabia': 'Saudi Arabia',
  'south korea': 'South Korea',
  'north korea': 'North Korea',
  'south africa': 'South Africa',
  'south sudan': 'South Sudan',
  'sierra leone': 'Sierra Leone',
  'guinea-bissau': 'Guinea-Bissau',
  'equatorial guinea': 'Equatorial Guinea',
  'burkina faso': 'Burkina Faso',
  'western sahara': 'Western Sahara',
  'french guiana': 'French Guiana',
  'marshall islands': 'Marshall Islands',
  'solomon islands': 'Solomon Islands',
  'new zealand': 'New Zealand',
  'sri lanka': 'Sri Lanka',
  'antigua and barbuda': 'Antigua and Barbuda',
  'saint kitts and nevis': 'Saint Kitts and Nevis',
  'saint lucia': 'Saint Lucia',
  'saint vincent and the grenadines': 'Saint Vincent and the Grenadines',
};

// Alias → canonical key (lowercase, no diacritics)
export const ALIASES = {
  'holland': 'netherlands',
  'the netherlands': 'netherlands',
  'united states of america': 'united states',
  'usa': 'united states',
  'us': 'united states',
  'america': 'united states',
  'england': 'united kingdom',
  'great britain': 'united kingdom',
  'britain': 'united kingdom',
  'uk': 'united kingdom',
  'uae': 'united arab emirates',
  'emirates': 'united arab emirates',
  "ivory coast": "cote d'ivoire",
  "cote d ivoire": "cote d'ivoire",
  'czechia': 'czech republic',
  'czech': 'czech republic',
  'burma': 'myanmar',
  'swaziland': 'eswatini',
  'east timor': 'timor-leste',
  'timor': 'timor-leste',
  'turkiye': 'turkey',
  'türkiye': 'turkey',
  'republic of ireland': 'ireland',
  'eire': 'ireland',
  'cabo verde': 'cape verde',
  'persia': 'iran',
  'hellas': 'greece',
  'formosa': 'taiwan',
  'siam': 'thailand',
  'kampuchea': 'cambodia',
  'abyssinia': 'ethiopia',
  'rhodesia': 'zimbabwe',
  'tanganyika': 'tanzania',
  'dr congo': 'democratic republic of the congo',
  'congo kinshasa': 'democratic republic of the congo',
  'congo dr': 'democratic republic of the congo',
  'drc': 'democratic republic of the congo',
  'congo brazzaville': 'republic of the congo',
  'congo republic': 'republic of the congo',
  'roc': 'republic of the congo',
  'congo': 'republic of the congo',
  'republic of congo': 'republic of the congo',
  'bosnia': 'bosnia and herzegovina',
  'north mac': 'north macedonia',
  'macedonia': 'north macedonia',
  'trinidad': 'trinidad and tobago',
  'tobago': 'trinidad and tobago',
  'the gambia': 'gambia',
  'saudi': 'saudi arabia',
  'ksa': 'saudi arabia',
  'png': 'papua new guinea',
  'new guinea': 'papua new guinea',
  'car': 'central african republic',
  'central africa': 'central african republic',
  'byelorussia': 'belarus',
  'belorussia': 'belarus',
  'surinam': 'suriname',
  'kyrgyzia': 'kyrgyzstan',
  'kirghizia': 'kyrgyzstan',
  'russia': 'russia',
  'russian federation': 'russia',
  'south sudan': 'south sudan',
  'korea': 'south korea',
  'rok': 'south korea',
  'dprk': 'north korea',
  'myanmar': 'myanmar',
  'laos': 'laos',
  "lao": "laos",
  'palestine': 'palestine',
  'west bank': 'palestine',
  'gaza': 'palestine',
  'syria': 'syria',
  'slovak republic': 'slovakia',
  'moldova': 'moldova',
  'republic of moldova': 'moldova',

  // District of Columbia
  'dc':                       'district of columbia',
  'd.c.':                     'district of columbia',
  'd c':                      'district of columbia',
  'columbia':                 'district of columbia',
  'washington dc':            'district of columbia',
  'washington d.c.':          'district of columbia',
  'washington d c':           'district of columbia',
  'washington, dc':           'district of columbia',
  'washington, d.c.':         'district of columbia',
  'washington, d c':          'district of columbia',
  'district of columbia':     'district of columbia',
  // Vatican City
  'vatican': 'vatican city',
  'the vatican': 'vatican city',
  'holy see': 'vatican city',
  'vatikan': 'vatican city',
  // San Marino
  's. marino': 'san marino',
  'republic of san marino': 'san marino',
  // Liechtenstein
  'liecht': 'liechtenstein',
  'lichtenstein': 'liechtenstein',
  'fürstentum liechtenstein': 'liechtenstein',
  // Monaco
  'principality of monaco': 'monaco',
  // Andorra
  'andorre': 'andorra',
  'principality of andorra': 'andorra',
  // Malta
  'republic of malta': 'malta',
  // Bahrain
  'kingdom of bahrain': 'bahrain',
  // Qatar
  'state of qatar': 'qatar',
  // Kuwait
  'state of kuwait': 'kuwait',
  // Maldives
  'republic of maldives': 'maldives',
  // Singapore
  'republic of singapore': 'singapore',
  // Caribbean island short forms
  'the bahamas': 'bahamas',
  'antigua': 'antigua and barbuda',
  'barbuda': 'antigua and barbuda',
  'st kitts and nevis': 'saint kitts and nevis',
  'st. kitts and nevis': 'saint kitts and nevis',
  'st kitts': 'saint kitts and nevis',
  'st. kitts': 'saint kitts and nevis',
  'saint kitts': 'saint kitts and nevis',
  'kitts and nevis': 'saint kitts and nevis',
  'nevis': 'saint kitts and nevis',
  'st lucia': 'saint lucia',
  'st. lucia': 'saint lucia',
  'st vincent and the grenadines': 'saint vincent and the grenadines',
  'st. vincent and the grenadines': 'saint vincent and the grenadines',
  'st vincent': 'saint vincent and the grenadines',
  'st. vincent': 'saint vincent and the grenadines',
  'saint vincent': 'saint vincent and the grenadines',
  'svg': 'saint vincent and the grenadines',
  'grenadines': 'saint vincent and the grenadines',
  // US States shorthand
  'ny': 'new york',
  'penn': 'pennsylvania',
  'jersey': 'new jersey',
};

// Countries that are recognised but unplayable (genuinely no land borders / too tiny to play)
export const UNPLAYABLE = new Set([
  'gibraltar',
  'kiribati',
  'nauru',
  'tuvalu',
  'faroe islands',
]);

// Aliases + common misspellings → canonical unplayable name
export const UNPLAYABLE_ALIASES = {
  // Gibraltar
  'gibralter': 'gibraltar',
  'gibaltar': 'gibraltar',
  'gibralatar': 'gibraltar',
  'gibraltor': 'gibraltar',
  'jibraltar': 'gibraltar',
  'the rock': 'gibraltar',
  'rock of gibraltar': 'gibraltar',
  // Kiribati
  'kirabati': 'kiribati',
  'kirabarti': 'kiribati',
  'kiribatti': 'kiribati',
  'kirabas': 'kiribati',
  'kiribas': 'kiribati',
  'republic of kiribati': 'kiribati',
  // Nauru
  'naru': 'nauru',
  'narau': 'nauru',
  'nauruu': 'nauru',
  'naoru': 'nauru',
  'republic of nauru': 'nauru',
  // Tuvalu
  'tuvallu': 'tuvalu',
  'tuvaluu': 'tuvalu',
  'tuvelu': 'tuvalu',
  'tuvaloo': 'tuvalu',
  'tuvulu': 'tuvalu',
  // Faroe Islands
  'faroes': 'faroe islands',
  'the faroe islands': 'faroe islands',
  'faroe island': 'faroe islands',
  'faeroe islands': 'faroe islands',
  'faroese islands': 'faroe islands',
  'føroyar': 'faroe islands',
  'faroyar': 'faroe islands',
};

/** Normalise input: strip diacritics, lowercase, trim */
export function normalise(str) {
  return str
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['']/g, "'");
}

/** Resolve a player input to a canonical display name, or null */
export function resolveCountry(input, validNames) {
  const norm = normalise(input);
  // Direct match against valid names
  for (const name of validNames) {
    if (normalise(name) === norm) return name;
  }
  // Check alias map
  const aliasTarget = ALIASES[norm];
  if (aliasTarget) {
    for (const name of validNames) {
      if (normalise(name) === aliasTarget) return name;
    }
  }
  // Hyphen-insensitive fallback: treat hyphens and spaces as equivalent.
  // Lets "timor leste" match "Timor-Leste", "guinea bissau" match "Guinea-Bissau", etc.
  const normNoHyphen = norm.replace(/-/g, ' ');
  for (const name of validNames) {
    if (normalise(name).replace(/-/g, ' ') === normNoHyphen) return name;
  }
  return null;
}

/** Check if name is unplayable (including via aliases / common misspellings) */
export function isUnplayable(input) {
  const norm = normalise(input);
  if (UNPLAYABLE.has(norm)) return true;
  const aliased = UNPLAYABLE_ALIASES[norm];
  return aliased ? UNPLAYABLE.has(aliased) : false;
}

/** Levenshtein distance between two strings */
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
  }
  return dp[m][n];
}

/**
 * Fuzzy-resolve input to a valid name using Levenshtein distance.
 * Threshold: ≤1 edit for words ≤6 chars, ≤2 edits for longer words.
 * Returns the best match or null.
 */
export function resolveCountryFuzzy(input, validNames) {
  const norm = normalise(input);
  if (norm.length < 3) return null; // too short to fuzzy-match safely
  const threshold = norm.length <= 6 ? 1 : 2;
  let best = null, bestDist = Infinity;
  for (const name of validNames) {
    const dist = levenshtein(norm, normalise(name));
    if (dist <= threshold && dist < bestDist) {
      best = name;
      bestDist = dist;
    }
  }
  return best;
}
