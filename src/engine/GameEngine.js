import { createState, MODE, GOAL, MODIFIER, PHASE } from './GameState.js';
import { resolveCountry, resolveCountryFuzzy, isUnplayable, normalise } from '../data/aliases.js';
import { MISSPELLINGS } from '../data/misspellings.js';
import { getNeighbours, ALL_WORLD_COUNTRIES } from '../data/adjacency.js';
import { getStateNeighbours, US_STATES } from '../data/states.js';
import { getContinent, CONTINENTS } from '../data/continents.js';
import { getRiver, getAllRivers } from '../data/rivers.js';
import { Records } from './Records.js';

/**
 * Event-driven game engine.
 * Call engine.on('event', handler) to subscribe.
 * Emitted events: stateChange, placed, error, unplayable, win, gameOver, timerTick
 */
export class GameEngine {
  constructor() {
    this._state = createState();
    this._handlers = new Map();
    this._records = new Records();
  }

  get state() { return this._state; }

  on(event, fn) {
    if (!this._handlers.has(event)) this._handlers.set(event, []);
    this._handlers.get(event).push(fn);
    return () => {
      const arr = this._handlers.get(event);
      const idx = arr.indexOf(fn);
      if (idx >= 0) arr.splice(idx, 1);
    };
  }

  emit(event, data) {
    for (const fn of (this._handlers.get(event) ?? [])) fn(data);
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  startGame({ mode, goal, modifiers = [], errorLimit, timeLimitSeconds, targetContinent, river, lockedStarter = null } = {}) {
    this._stopTimer();
    const prevTheme = this._state?.theme ?? 'dark';
    const prevAllowTypos = this._state?.allowTypos ?? false;
    const s = this._state = createState();
    s.theme = prevTheme;
    s.allowTypos = prevAllowTypos;

    s.mode = mode ?? MODE.WORLD;
    s.goal = goal ?? GOAL.DEFAULT;
    s.modifiers = new Set(modifiers);

    s.errorLimit = errorLimit ?? 3;
    s.timeLimitSeconds = timeLimitSeconds ?? 180;
    s.targetContinent = targetContinent ?? null;
    s.river = river ?? null;
    s.beringStraitActive = s.goal === GOAL.WORLD_DOMINATION;
    s.phase = PHASE.PLAYING;

    // Pick starter
    if (s.mode === MODE.SOURCE_TO_SEA && s.river?.mouth) {
      const endpoints = [...(s.river.sources ?? [s.river.source]), s.river.mouth];
      s.starter = endpoints[Math.floor(Math.random() * endpoints.length)];
    } else {
      const NO_STARTER = new Set(['Vatican City', 'San Marino', 'Monaco', 'Liechtenstein']);
      const pool = this._getPool().filter(c => !NO_STARTER.has(c));
      s.starter = lockedStarter ?? pool[Math.floor(Math.random() * pool.length)];
    }
    s.placed = [s.starter];
    s.placedSet = new Set([s.starter]);

    // Count starter toward river progress if it's on the river
    if (s.mode === MODE.SOURCE_TO_SEA && s.river) {
      const riverList = s.river.countries ?? s.river.states ?? [];
      if (riverList.includes(s.starter)) s.riverCountriesPlaced = 1;
    }

    // Target count for domination modes
    if (s.goal === GOAL.CONTINENTAL) {
      s.totalTarget = getContinent(targetContinent).length;
    } else if (s.goal === GOAL.WORLD_DOMINATION) {
      s.totalTarget = ALL_WORLD_COUNTRIES.length;
    } else if (s.goal === GOAL.NATIONAL_DOMINATION) {
      s.totalTarget = US_STATES.length;
    }

    // Timer: countdown if time limit modifier active, count-up otherwise
    if (s.modifiers.has(MODIFIER.TIME_LIMIT)) {
      s.elapsed = timeLimitSeconds;
    } else {
      s.elapsed = 0;
    }

    this.emit('stateChange', s);
  }

  guess(input) {
    const s = this._state;
    if (s.phase !== PHASE.PLAYING) return;

    // Check unplayable first (no error counted)
    if (isUnplayable(input)) {
      this.emit('unplayable', { input });
      return;
    }

    const valid = this._getPool();
    const candidates = [...valid, ...this._getForeignEntries()];
    let name = resolveCountry(input, candidates);

    if (!name && s.allowTypos) {
      const misspelled = MISSPELLINGS[normalise(input)];
      if (misspelled) name = candidates.find(c => normalise(c) === misspelled) ?? null;
    }
    if (!name && s.allowTypos) {
      name = resolveCountryFuzzy(input, candidates);
    }

    if (!name) {
      this.emit('error', { message: `"${input}" isn't recognised — check the spelling.`, type: 'unknown' });
      return;
    }

    if (s.placedSet.has(name)) {
      this.emit('error', { message: `${name} is already placed.`, type: 'duplicate' });
      return;
    }

    // Adjacency check
    if (!this._isReachable(name)) {
      s.wrongGuesses.add(name);
      const unitLabel = s.mode === MODE.STATES ? 'state' : 'country';
      this._countError(`${name} is not adjacent to any placed ${unitLabel}.`);
      return;
    }

    // Source to Sea: only river countries accepted
    if (s.mode === MODE.SOURCE_TO_SEA) {
      const river = s.river;
      const riverList = river.countries ?? river.states ?? [];
      if (!riverList.includes(name) && !(river.foreign ?? []).includes(name)) {
        this._countError(`${name} is not on the ${river.name} river.`);
        return;
      }
      if (riverList.includes(name)) s.riverCountriesPlaced++;
    }

    // Place the country
    s.placed.push(name);
    s.placedSet.add(name);
    this._startTimerIfNeeded();
    this.emit('placed', { name, placed: [...s.placed] });
    this.emit('stateChange', s);

    this._checkWin();
  }

  _countError(message) {
    const s = this._state;
    s.errors++;
    this._startTimerIfNeeded();
    this.emit('error', { message, type: 'wrong', errors: s.errors });
    this.emit('stateChange', s);

    if (s.modifiers.has(MODIFIER.ERROR_LIMIT) && s.errors >= s.errorLimit) {
      this._endGame(false);
    }
  }

  _isReachable(name) {
    const s = this._state;
    const opts = { beringStrait: s.beringStraitActive };

    if (s.mode === MODE.STATES) {
      for (const placed of s.placedSet) {
        if (getStateNeighbours(placed).has(name)) return true;
      }
      return false;
    }

    // World + STS: BFS through non-river countries for STS
    if (s.mode === MODE.SOURCE_TO_SEA) {
      return this._stsIsReachable(name, opts);
    }

    for (const placed of s.placedSet) {
      if (getNeighbours(placed, opts).has(name)) return true;
    }
    return false;
  }

  _stsIsReachable(target, opts) {
    const s = this._state;
    const river = s.river;
    const riverSet = new Set([...(river.countries ?? river.states ?? []), ...(river.foreign ?? [])]);

    // Rule: river countries are always reachable (the river itself connects
    // them, so once you're on the river you can place any other river country).
    if (riverSet.has(target)) return true;

    // Non-river targets must be directly adjacent to a placed country (1-hop
    // stepping stones — they don't count toward progress, but help bridge gaps).
    const neighbourFn = s.mode === MODE.STATES ? getStateNeighbours : (c) => getNeighbours(c, opts);
    for (const placed of s.placedSet) {
      if (neighbourFn(placed).has(target)) return true;
    }
    return false;
  }

  _checkWin() {
    const s = this._state;
    if (s.goal === GOAL.CONTINENTAL) {
      const target = getContinent(s.targetContinent);
      const allPlaced = target.every(c => s.placedSet.has(c));
      if (allPlaced) { this._endGame(true); return; }
    }
    if (s.goal === GOAL.WORLD_DOMINATION) {
      if (s.placed.length >= ALL_WORLD_COUNTRIES.length) { this._endGame(true); return; }
    }
    if (s.goal === GOAL.NATIONAL_DOMINATION) {
      const allPlaced = US_STATES.every(st => s.placedSet.has(st));
      if (allPlaced) { this._endGame(true); return; }
    }
    if (s.mode === MODE.SOURCE_TO_SEA && s.river) {
      const total = (s.river.countries ?? s.river.states ?? []).length;
      if (s.riverCountriesPlaced >= total) { this._endGame(true); return; }
    }
  }

  _endGame(win) {
    const s = this._state;
    // Idempotent: if the game already ended (e.g. timer ran out the same
    // tick the error limit was hit), don't fire a second panel/record update.
    if (s.phase === PHASE.WIN || s.phase === PHASE.GAME_OVER) return;
    this._stopTimer();
    s.phase = win ? PHASE.WIN : PHASE.GAME_OVER;

    const record = this._records.update(s);
    this.emit(win ? 'win' : 'gameOver', { state: s, record });
    this.emit('stateChange', s);
  }

  // ── Timer ──────────────────────────────────────────────────────────────────

  _startTimerIfNeeded() {
    const s = this._state;
    if (s.timerStarted) return;
    s.timerStarted = true;

    s.timerInterval = setInterval(() => {
      if (s.modifiers.has(MODIFIER.TIME_LIMIT)) {
        s.elapsed = Math.max(0, s.elapsed - 1);
        if (s.elapsed === 0) this._endGame(false);
      } else {
        s.elapsed++;
      }
      this.emit('timerTick', { elapsed: s.elapsed });
    }, 1000);
  }

  _stopTimer() {
    if (this._state.timerInterval) {
      clearInterval(this._state.timerInterval);
      this._state.timerInterval = null;
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  _getPool() {
    const s = this._state;
    if (s.mode === MODE.STATES) return US_STATES;
    return ALL_WORLD_COUNTRIES;
  }

  _getForeignEntries() {
    const s = this._state;
    if (s.mode === MODE.SOURCE_TO_SEA && s.river?.foreign) return s.river.foreign;
    return [];
  }

  /** All valid next guesses (for autocomplete) */
  getAutocompleteCandidates() {
    const s = this._state;
    const pool = [...this._getPool(), ...this._getForeignEntries()];
    if (s.mode === MODE.SOURCE_TO_SEA) {
      return pool.filter(n => !s.placedSet.has(n));
    }
    return pool.filter(n => !s.placedSet.has(n));
  }

  // Switch a completed STS game to endless world/states mode, keeping all
  // placed countries and the river overlay visible as context.
  continueAsEndless() {
    const s = this._state;
    const wasStates = s.river?.states != null;
    s.mode  = wasStates ? MODE.STATES : MODE.WORLD;
    s.goal  = GOAL.DEFAULT;
    s.modifiers = new Set();
    s.phase = PHASE.PLAYING;
    s.beringStraitActive = false;
    s.totalTarget = 0;
    // Keep placed, placedSet, errors, elapsed, river (for overlay), theme
    this.emit('stateChange', s);
  }

  toggleTheme() {
    const s = this._state;
    s.theme = s.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', s.theme);
    this.emit('stateChange', s);
  }

  toggleShowNames() {
    this._state.showNames = !this._state.showNames;
    this.emit('stateChange', this._state);
  }

  toggleShowList() {
    this._state.showList = !this._state.showList;
    this.emit('stateChange', this._state);
  }

  toggleRiverLine() {
    this._state.showRiverLine = !this._state.showRiverLine;
    this.emit('stateChange', this._state);
  }

  toggleAllowTypos() {
    this._state.allowTypos = !this._state.allowTypos;
    this.emit('stateChange', this._state);
  }

  goToMenu() {
    this._stopTimer();
    this._state.phase = PHASE.MENU;
    this.emit('stateChange', this._state);
  }

  get records() { return this._records; }
}
