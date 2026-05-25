/**
 * Core game state container — plain data, no side effects.
 * The GameEngine mutates this and fires events.
 */
export const MODE = {
  WORLD: 'world',
  STATES: 'states',
  SOURCE_TO_SEA: 'sts',
};

// Goal = the win condition (pick one).
// Modifier = optional rule layered on top (any combination).
export const GOAL = {
  DEFAULT:             'default',
  CONTINENTAL:         'continental',
  WORLD_DOMINATION:    'worldDomination',
  NATIONAL_DOMINATION: 'nationalDomination',
};

export const MODIFIER = {
  ERROR_LIMIT: 'errorLimit',
  TIME_LIMIT:  'timeLimit',
};

export const PHASE = {
  MENU: 'menu',
  PLAYING: 'playing',
  GAME_OVER: 'gameOver',
  WIN: 'win',
};

/** Create a fresh game state */
export function createState() {
  return {
    phase: PHASE.MENU,
    mode: MODE.WORLD,
    goal: GOAL.DEFAULT,
    modifiers: new Set(),         // Set of MODIFIER values

    // Condition parameters
    errorLimit: 3,
    timeLimitSeconds: 180,
    targetContinent: null, // for Continental Domination

    // River (STS)
    river: null,
    riverCountriesPlaced: 0,

    // Chain
    placed: [],       // ordered array of placed country names
    placedSet: new Set(),
    wrongGuesses: new Set(), // countries guessed correctly but not adjacent
    starter: null,
    errors: 0,

    // Timer
    timerStarted: false,
    elapsed: 0,       // seconds elapsed (count-up) or remaining (countdown)
    timerInterval: null,

    // Flags
    beringStraitActive: false,
    showNames: false,
    showList: false,
    showRiverLine: true,
    allowTypos: false,
    theme: 'dark',

    // Completion tracking
    totalTarget: 0,   // for domination modes
  };
}
