import { GOAL, MODIFIER, MODE } from './GameState.js';

const STORAGE_KEY = 'geochain_records';

export class Records {
  constructor() {
    this._data = this._load();
  }

  _load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    } catch {
      return {};
    }
  }

  _save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data));
    } catch { /* quota exceeded – ignore */ }
  }

  _key(state) {
    const { mode, goal, modifiers, errorLimit, timeLimitSeconds, targetContinent, river } = state;
    const base = mode;

    // Source-to-Sea: river identity is the record bucket
    if (mode === MODE.SOURCE_TO_SEA) return `sts-${river?.id}`;

    // Goal-based buckets (mutually exclusive)
    if (goal === GOAL.CONTINENTAL)         return `${base}-continental-${targetContinent}`;
    if (goal === GOAL.WORLD_DOMINATION)    return `${base}-worlddom`;
    if (goal === GOAL.NATIONAL_DOMINATION) return `${base}-nationaldom`;

    // Endless + modifier buckets
    const mods = modifiers ?? new Set();
    if (mods.has(MODIFIER.ERROR_LIMIT)) return `${base}-error-${errorLimit}`;
    if (mods.has(MODIFIER.TIME_LIMIT))  return `${base}-timer-${timeLimitSeconds}`;

    return `${base}-default`;
  }

  /** Update record after game. Returns { previous, current, isNewRecord } */
  update(state) {
    const key = this._key(state);
    const { placed, errors, goal } = state;
    const score = placed.length - 1; // exclude starter

    const prev = this._data[key] ?? null;
    let isNewRecord = false;

    const isDomination =
      goal === GOAL.CONTINENTAL ||
      goal === GOAL.WORLD_DOMINATION ||
      goal === GOAL.NATIONAL_DOMINATION;

    if (isDomination) {
      // Track fewest errors on win
      if (state.phase === 'win') {
        if (prev === null || errors < prev) {
          this._data[key] = errors;
          isNewRecord = true;
        }
      }
    } else {
      // Most countries placed (covers Endless + Error/Time-limit modifiers)
      if (prev === null || score > prev) {
        this._data[key] = score;
        isNewRecord = true;
      }
    }

    this._save();
    return { previous: prev, current: this._data[key], isNewRecord };
  }

  get(state) {
    return this._data[this._key(state)] ?? null;
  }

  getAll() {
    return { ...this._data };
  }

  clear() {
    this._data = {};
    this._save();
  }
}
