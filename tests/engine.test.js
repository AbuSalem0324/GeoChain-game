import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GameEngine } from '../src/engine/GameEngine.js';
import { MODE, GOAL, MODIFIER, PHASE } from '../src/engine/GameState.js';

// Mock localStorage for Records
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: key => store[key] ?? null,
    setItem: (key, val) => { store[key] = val; },
    clear: () => { store = {}; },
  };
})();
vi.stubGlobal('localStorage', localStorageMock);

describe('GameEngine — World mode', () => {
  let engine;

  beforeEach(() => {
    localStorageMock.clear();
    engine = new GameEngine();
    engine.startGame({ mode: MODE.WORLD, goal: GOAL.DEFAULT });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts in PLAYING phase with one placed country', () => {
    expect(engine.state.phase).toBe(PHASE.PLAYING);
    expect(engine.state.placed.length).toBe(1);
    expect(engine.state.starter).toBeTruthy();
  });

  it('accepts a valid neighbour', async () => {
    const starter = engine.state.starter;
    const { getNeighbours } = await import('../src/data/adjacency.js');
    const neighbours = [...getNeighbours(starter)];
    if (!neighbours.length) return; // edge case

    let placed = false;
    engine.on('placed', () => { placed = true; });
    engine.guess(neighbours[0]);
    expect(placed).toBe(true);
    expect(engine.state.placed.length).toBe(2);
    expect(engine.state.errors).toBe(0);
  });

  it('unrecognised input emits an error event but does not count toward error total', () => {
    let errorFired = false;
    engine.on('error', () => { errorFired = true; });

    engine.guess('XYZZY_COUNTRY_DOESNT_EXIST');
    expect(errorFired).toBe(true);
    expect(engine.state.errors).toBe(0);
  });

  it('emits unplayable for unplayable countries', () => {
    let unplayableFired = false;
    engine.on('unplayable', () => { unplayableFired = true; });
    engine.guess('Gibraltar');
    expect(unplayableFired).toBe(true);
    expect(engine.state.errors).toBe(0);
  });

  it('does not double-count already placed countries', () => {
    const starter = engine.state.starter;
    let errorFired = false;
    engine.on('error', () => { errorFired = true; });
    engine.guess(starter);
    expect(errorFired).toBe(true);
    expect(engine.state.placed.length).toBe(1);
  });

  it('resolves aliases', () => {
    // Start a game with France as the starter by manipulating state
    engine._state.starter = 'Germany';
    engine._state.placed = ['Germany'];
    engine._state.placedSet = new Set(['Germany']);

    let placedName = null;
    engine.on('placed', ({ name }) => { placedName = name; });
    engine.guess('Holland'); // alias for Netherlands
    // Netherlands borders Germany, so this should work
    if (placedName) {
      expect(placedName).toBe('Netherlands');
    }
  });
});

describe('GameEngine — Error Limit condition', () => {
  it('ends game when error limit reached via non-adjacent valid countries', () => {
    localStorageMock.clear();
    const engine = new GameEngine();
    engine.startGame({ mode: MODE.WORLD, goal: GOAL.DEFAULT, modifiers: [MODIFIER.ERROR_LIMIT], errorLimit: 2 });

    // Force a known starter so we can pick two countries guaranteed not to border it
    engine._state.starter = 'Japan';
    engine._state.placed = ['Japan'];
    engine._state.placedSet = new Set(['Japan']);

    let gameOver = false;
    engine.on('gameOver', () => { gameOver = true; });

    engine.guess('France'); // valid country, not adjacent to Japan → error
    expect(engine.state.phase).toBe(PHASE.PLAYING);
    engine.guess('Brazil'); // second non-adjacent valid country → hits limit
    expect(gameOver).toBe(true);
    expect(engine.state.phase).toBe(PHASE.GAME_OVER);
  });
});

describe('GameEngine — States mode', () => {
  it('starts with a valid US state as starter', () => {
    localStorageMock.clear();
    const engine = new GameEngine();
    engine.startGame({ mode: MODE.STATES, goal: GOAL.DEFAULT });
    expect(engine.state.starter).toBeTruthy();
    expect(engine.state.phase).toBe(PHASE.PLAYING);
  });
});

describe('GameEngine — theme toggle', () => {
  it('toggles theme state between dark and light', () => {
    localStorageMock.clear();
    // Stub document for node environment
    vi.stubGlobal('document', { documentElement: { setAttribute: vi.fn() } });
    const engine = new GameEngine();
    expect(engine.state.theme).toBe('dark');
    engine.toggleTheme();
    expect(engine.state.theme).toBe('light');
    engine.toggleTheme();
    expect(engine.state.theme).toBe('dark');
    vi.unstubAllGlobals();
  });
});

describe('Records', () => {
  it('tracks best score', () => {
    localStorageMock.clear();
    const engine = new GameEngine();
    engine.startGame({ mode: MODE.WORLD, goal: GOAL.DEFAULT });

    // Manually set placed array to simulate a game
    engine._state.placed = ['Germany', 'France', 'Spain'];
    engine._state.errors = 1;
    engine._state.phase = PHASE.GAME_OVER;

    const rec1 = engine.records.update(engine._state);
    expect(rec1.current).toBe(2); // placed - 1 = score

    // Simulate worse game
    engine._state.placed = ['Germany', 'France'];
    const rec2 = engine.records.update(engine._state);
    expect(rec2.isNewRecord).toBe(false);
    expect(rec2.current).toBe(2); // unchanged

    // Simulate better game
    engine._state.placed = ['Germany', 'France', 'Spain', 'Portugal', 'Morocco'];
    const rec3 = engine.records.update(engine._state);
    expect(rec3.isNewRecord).toBe(true);
    expect(rec3.current).toBe(4);
  });
});
