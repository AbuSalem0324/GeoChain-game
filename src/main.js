import { GameEngine } from './engine/GameEngine.js';
import './ui/panels/OptionsPanel.js'; // applies saved font offset immediately
import { MenuScreen } from './ui/MenuScreen.js';
import { GameScreen } from './ui/GameScreen.js';
import { MODE, GOAL, MODIFIER, PHASE } from './engine/GameState.js';
import { showContinentPicker } from './ui/panels/ContinentPanel.js';
import { DUAL_CONTINENT, getContinents } from './data/continents.js';
import { showToast } from './ui/Toast.js';

// Restore theme early to prevent flash
const savedTheme = localStorage.getItem('geochain_theme') ?? 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

const engine = new GameEngine();
engine.state.theme = savedTheme;

const menuEl = document.getElementById('screen-menu');
const gameEl = document.getElementById('screen-game');

let gameScreen = null;
let topoWorld = null;
let topoStates = null;

// ── Load map data ──────────────────────────────────────────────────────────

async function loadWorldTopo() {
  if (topoWorld) return topoWorld;
  // Use fetch to load from public dir or node_modules via Vite asset handling
  const res = await fetch('/topo/countries-50m.json');
  topoWorld = await res.json();
  return topoWorld;
}

async function loadStatesTopo() {
  if (topoStates) return topoStates;
  const res = await fetch('/topo/states-10m.json');
  topoStates = await res.json();
  return topoStates;
}

// ── App controller ─────────────────────────────────────────────────────────

function showMenu() {
  gameEl.classList.remove('active');
  menuEl.classList.add('active');
  if (gameScreen) { gameScreen.cleanup(); gameScreen = null; }
  menuScreen.syncTheme();
}

async function startGame(config) {
  const { mode, goal = GOAL.DEFAULT, modifiers = [], errorLimit = 3, timeLimitSeconds = 180, river } = config;

  // Determine continent for continental domination
  let targetContinent = config.targetContinent ?? null;

  const launchGame = async (tc, lockedStarter = null) => {
    engine.startGame({ mode, goal, modifiers, errorLimit, timeLimitSeconds, targetContinent: tc, river, lockedStarter });
    const s = engine.state;

    // Save theme
    localStorage.setItem('geochain_theme', s.theme);

    // Switch screens
    menuEl.classList.remove('active');
    gameEl.classList.add('active');

    if (!gameScreen) {
      gameScreen = new GameScreen(gameEl, engine, showMenu, () => {
        const s = engine.state;
        const nextMode = s.mode === MODE.STATES ? MODE.WORLD : MODE.STATES;
        const goalIncompatStates = [GOAL.CONTINENTAL, GOAL.WORLD_DOMINATION];
        if (nextMode === MODE.STATES && goalIncompatStates.includes(s.goal)) {
          showToast("That goal isn't compatible with US States — pick another.", 'error', 3500);
          import('./ui/panels/ConditionsPanel.js').then(({ showConditionsPanel }) => {
            showConditionsPanel(MODE.STATES, null, ({ goal, modifiers, errorLimit, timeLimitSeconds }) => {
              startGame({ mode: MODE.STATES, goal, modifiers, errorLimit, timeLimitSeconds });
            }, GOAL.DEFAULT, []);
          });
          return;
        }
        startGame({ mode: nextMode, goal: s.goal, modifiers: [...s.modifiers], errorLimit: s.errorLimit, timeLimitSeconds: s.timeLimitSeconds });
      }, startGame);
    }

    // Load map data
    if (mode === MODE.STATES || (mode === MODE.SOURCE_TO_SEA && river?.states)) {
      const topo = await loadStatesTopo();
      await gameScreen.loadStatesMap(topo);
    } else {
      const topo = await loadWorldTopo();
      await gameScreen.loadWorldMap(topo);
    }

    // River overlay
    if (mode === MODE.SOURCE_TO_SEA && river?.line) {
      gameScreen.setRiverOverlay(river);
    } else {
      gameScreen.clearRiverOverlay();
    }

    // Sync initial state then centre on starter country
    engine.emit('stateChange', engine.state);
    // Wait one frame so SVG paths are painted before getBBox() is called
    requestAnimationFrame(() => gameScreen.resetView());
  };

  // Continental domination — pick a starter first, then resolve the continent.
  if (goal === GOAL.CONTINENTAL && !targetContinent) {
    // Use a temporary startGame to sample a starter, then launch for real.
    engine.startGame({ mode, goal, modifiers, errorLimit, timeLimitSeconds, targetContinent: 'Europe', river });
    const starter = engine.state.starter;

    if (DUAL_CONTINENT[starter]) {
      // Dual-continent starter: ask the player which continent to dominate.
      // Only show the continents that starter belongs to, pass locked starter so we don't re-roll.
      showContinentPicker((chosen) => launchGame(chosen, starter), DUAL_CONTINENT[starter]);
      return;
    }
    // Single-continent starter: use its continent directly.
    const conts = getContinents(starter);
    launchGame(conts[0] ?? 'Europe', starter);
    return;
  }

  launchGame(targetContinent);
}

// ── Theme sync ─────────────────────────────────────────────────────────────

engine.on('stateChange', s => {
  document.documentElement.setAttribute('data-theme', s.theme);
  localStorage.setItem('geochain_theme', s.theme);
});

// ── Boot ───────────────────────────────────────────────────────────────────

const menuScreen = new MenuScreen(menuEl, engine, startGame);
menuEl.classList.add('active');

// Preload world data in background
loadWorldTopo().catch(() => {});
