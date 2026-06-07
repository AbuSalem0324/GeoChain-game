import { translations } from './translations.js';

const STORAGE_KEY = 'geochain_lang';

// `flag` is the ISO 3166-1 alpha-2 country code used by flag-icons CSS
// (e.g. `<span class="fi fi-gb">`). Lowercase.
export const LANGUAGES = [
  { code: 'en-GB', label: 'English (UK)', flag: 'gb' },
  { code: 'en-US', label: 'English (US)', flag: 'us' },
  { code: 'es',    label: 'Español',      flag: 'es' },
  { code: 'it',    label: 'Italiano',     flag: 'it' },
  { code: 'fr',    label: 'Français',     flag: 'fr' },
  { code: 'de',    label: 'Deutsch',      flag: 'de' },
  { code: 'pt',    label: 'Português',    flag: 'pt' },
  { code: 'hu',    label: 'Magyar',       flag: 'hu' },
];

const FALLBACK = 'en-GB';

let _current = (() => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && translations[stored]) return stored;
  const nav = (navigator.language ?? '').toLowerCase();
  if (nav.startsWith('en-us')) return 'en-US';
  if (nav.startsWith('en'))    return 'en-GB';
  const short = nav.slice(0, 2);
  const match = LANGUAGES.find(l => l.code.toLowerCase().startsWith(short));
  return match?.code ?? FALLBACK;
})();

const _listeners = new Set();

export function getLanguage() { return _current; }

export function setLanguage(code) {
  if (!translations[code]) return;
  if (code === _current) return;
  _current = code;
  localStorage.setItem(STORAGE_KEY, code);
  document.documentElement.setAttribute('lang', code);
  for (const fn of _listeners) fn(code);
}

export function onLanguageChange(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

/** Translate a UI key. Supports {placeholder} substitution. */
export function t(key, vars) {
  const dict = translations[_current] ?? {};
  const fb   = translations[FALLBACK] ?? {};
  let str = dict[key] ?? fb[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replaceAll(`{${k}}`, String(v));
    }
  }
  return str;
}

document.documentElement.setAttribute('lang', _current);
