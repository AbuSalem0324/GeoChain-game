
// Canonical name → display name mapping
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

import { UNIVERSAL_ALIASES, LANG_ALIASES } from './aliasesByLang.js';
import { getLanguage } from '../i18n/index.js';

// US state shorthand and DC-specific aliases (kept here since they're
// US-States-mode only, not affected by the country i18n system).
const STATES_ALIASES = {
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
  'ny':                       'new york',
  'penn':                     'pennsylvania',
  'jersey':                   'new jersey',
};

/**
 * Build a lookup map: normalised alias → canonical English name.
 * Combines UNIVERSAL_ALIASES (always accepted) with the current
 * language's LANG_ALIASES. Recomputed whenever the language changes.
 */
let _aliasMapCache = null;
let _aliasMapLang = null;

function buildAliasMap() {
  const lang = getLanguage();
  if (_aliasMapCache && _aliasMapLang === lang) return _aliasMapCache;

  const map = Object.create(null);

  // Universal modern aliases (Burma, Holland, DRC, USA, etc.) — always on
  for (const [canonical, aliases] of Object.entries(UNIVERSAL_ALIASES)) {
    for (const a of aliases) map[normalise(a)] = canonical;
  }

  // Per-language aliases for the currently selected language
  for (const [canonical, byLang] of Object.entries(LANG_ALIASES)) {
    const forms = byLang[lang] ?? [];
    for (const a of forms) map[normalise(a)] = canonical;
  }

  // States shorthand — language-agnostic
  for (const [a, target] of Object.entries(STATES_ALIASES)) {
    // STATES_ALIASES values are lowercase canonical keys (legacy); we keep
    // them as-is and the resolver matches them case-insensitively below.
    map[normalise(a)] = target;
  }

  _aliasMapCache = map;
  _aliasMapLang = lang;
  return map;
}

/** Invalidate the cached alias map (called when language changes). */
export function invalidateAliasCache() {
  _aliasMapCache = null;
  _aliasMapLang = null;
}

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
  'gibralter': 'gibraltar', 'gibaltar': 'gibraltar', 'gibralatar': 'gibraltar',
  'gibraltor': 'gibraltar', 'jibraltar': 'gibraltar',
  'the rock': 'gibraltar', 'rock of gibraltar': 'gibraltar',
  'kirabati': 'kiribati', 'kirabarti': 'kiribati', 'kiribatti': 'kiribati',
  'kirabas': 'kiribati', 'kiribas': 'kiribati', 'republic of kiribati': 'kiribati',
  'naru': 'nauru', 'narau': 'nauru', 'nauruu': 'nauru',
  'naoru': 'nauru', 'republic of nauru': 'nauru',
  'tuvallu': 'tuvalu', 'tuvaluu': 'tuvalu', 'tuvelu': 'tuvalu',
  'tuvaloo': 'tuvalu', 'tuvulu': 'tuvalu',
  'faroes': 'faroe islands', 'the faroe islands': 'faroe islands', 'faroe island': 'faroe islands',
  'faeroe islands': 'faroe islands', 'faroese islands': 'faroe islands',
  'føroyar': 'faroe islands', 'faroyar': 'faroe islands',
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

  // 1. Direct match against valid (canonical) names — always accepted
  for (const name of validNames) {
    if (normalise(name) === norm) return name;
  }

  // 2. Alias lookup — universal + current language
  const aliasMap = buildAliasMap();
  const aliasTarget = aliasMap[norm];
  if (aliasTarget) {
    const tNorm = normalise(aliasTarget);
    for (const name of validNames) {
      if (normalise(name) === tNorm) return name;
    }
  }

  // 3. Hyphen-insensitive fallback for both canonical and aliases
  const normNoHyphen = norm.replace(/-/g, ' ');
  for (const name of validNames) {
    if (normalise(name).replace(/-/g, ' ') === normNoHyphen) return name;
  }
  // Also try alias keys with hyphens normalised
  for (const [k, target] of Object.entries(aliasMap)) {
    if (k.replace(/-/g, ' ') === normNoHyphen) {
      const tNorm = normalise(target);
      for (const name of validNames) {
        if (normalise(name) === tNorm) return name;
      }
    }
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
 * Matches against canonical names AND the current-language alias pool,
 * so "Allemange" → Germany works in French.
 */
export function resolveCountryFuzzy(input, validNames) {
  const norm = normalise(input);
  if (norm.length < 3) return null;
  const threshold = norm.length <= 6 ? 1 : 2;

  let best = null, bestDist = Infinity;
  const validSet = new Set(validNames.map(n => normalise(n)));
  const canonicalToValid = new Map();
  for (const name of validNames) canonicalToValid.set(normalise(name), name);

  // 1. Fuzzy against canonical names
  for (const name of validNames) {
    const dist = levenshtein(norm, normalise(name));
    if (dist <= threshold && dist < bestDist) {
      best = name;
      bestDist = dist;
    }
  }

  // 2. Fuzzy against alias forms — universal + current language
  const aliasMap = buildAliasMap();
  for (const [alias, target] of Object.entries(aliasMap)) {
    const dist = levenshtein(norm, alias);
    if (dist <= threshold && dist < bestDist) {
      // Map alias back to a valid (canonical) name in validNames
      const tNorm = normalise(target);
      if (validSet.has(tNorm)) {
        best = canonicalToValid.get(tNorm);
        bestDist = dist;
      }
    }
  }

  return best;
}
