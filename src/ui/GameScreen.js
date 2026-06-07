import { GOAL, MODIFIER, MODE, PHASE } from '../engine/GameState.js';

function _fmtTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
import { Autocomplete } from './Autocomplete.js';
import { showToast } from './Toast.js';
import { t, onLanguageChange } from '../i18n/index.js';
import { showGameOverPanel, showWinPanel } from './panels/ResultPanel.js';
import { showContinentPicker } from './panels/ContinentPanel.js';
import { DUAL_CONTINENT, getContinent } from '../data/continents.js';
import { WorldMapRenderer } from '../renderer/WorldMapRenderer.js';
import { FlatMapRenderer } from '../renderer/FlatMapRenderer.js';
import { ALL_WORLD_COUNTRIES } from '../data/adjacency.js';
import { US_STATES } from '../data/states.js';

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export class GameScreen {
  constructor(el, engine, onMenu, onSwitchMode, onNewGame) {
    this._el = el;
    this._engine = engine;
    this._onMenu = onMenu;
    this._onSwitchMode = onSwitchMode;
    this._onNewGame = onNewGame;
    this._renderer = null;
    this._autocomplete = null;
    this._topoWorld = null;
    this._topoStates = null;
    this._unsubs = [];

    this._render();
    this._bindEngineEvents();

    this._unsubLang = onLanguageChange(() => {
      this._render();
      this._syncState(this._engine.state);
    });
  }

  _render() {
    this._el.innerHTML = `
      <header id="game-header">
        <div class="header-logo">${t('app.title')}</div>
        <div class="header-stats">
          <div class="stat-item">
            <div class="stat-label">${t('game.stat.placed')}</div>
            <div class="stat-value accent" id="stat-placed">0</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">${t('game.stat.errors')}</div>
            <div class="stat-value error" id="stat-errors">0</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">${t('game.stat.time')}</div>
            <div class="stat-value" id="stat-time">00:00</div>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn btn-icon" id="hdr-theme" title="${t('game.btn.theme')}"><span class="gc-icon gc-icon-bare">light_mode</span></button>
          <button class="btn btn-sm" id="hdr-switch-mode"><span class="gc-icon gc-icon-sm">flag</span>${t('game.btn.switchToStates')}</button>
          <button class="btn btn-sm" id="hdr-new">${t('game.btn.newGame')}</button>
          <button class="btn btn-sm" id="hdr-menu">${t('game.btn.menu')}</button>
        </div>
      </header>

      <div class="game-body">
        <aside id="game-sidebar">
          <div class="sidebar-message" id="sidebar-msg">${t('game.msg.borderStarter.country')}</div>

          <div class="search-wrapper">
            <div class="search-input-row">
              <div class="input-ghost-wrapper">
                <input type="text" id="country-input" placeholder="${t('game.input.placeholderDefault')}" autocomplete="off" autocorrect="off" spellcheck="false" />
                <div id="autocomplete-ghost"></div>
              </div>
              <button class="btn btn-primary btn-sm" id="go-btn">${t('game.btn.go')}</button>
            </div>
          </div>

          <div id="badge-errors" class="badge error" style="display:none">
            <span class="badge-label">${t('game.badge.errors')}</span>
            <span class="badge-value" id="badge-err-val">0 / 3</span>
          </div>

          <div id="badge-river" class="badge amber" style="display:none">
            <span class="badge-label">${t('game.badge.riverProgress')}</span>
            <span class="badge-value" id="badge-river-val">0 / ?</span>
          </div>

          <div id="progress-wrap" style="display:none">
            <div class="progress-bar-wrapper">
              <div class="progress-label">
                <span id="prog-label">${t('game.progress.riverCountries')}</span>
                <span id="prog-frac">0 / 0</span>
              </div>
              <div class="progress-bar-bg">
                <div class="progress-bar-fill" id="prog-bar" style="width:0%"></div>
              </div>
            </div>
          </div>

          <div id="chain-section">
            <div class="chain-list-header" id="chain-toggle">
              <span style="font-size:0.7rem;color:var(--text-dim)">${t('game.chain.show')}</span>
              <span id="chain-chevron" style="color:var(--muted)">▾</span>
            </div>
            <div id="chain-collapse" style="display:none">
              <div style="display:flex;align-items:center;gap:8px;margin:8px 0 4px">
                <span style="font-size:0.65rem;color:var(--muted)">${t('game.chain.showNames')}</span>
                <label class="pill-toggle" style="display:inline-flex">
                  <button id="toggle-names">${t('game.chain.toggle')}</button>
                </label>
              </div>
              <div class="chain-list" id="chain-list"></div>
            </div>
          </div>
        </aside>

        <main id="map-container">
          <div id="map-mode-label" class="map-label" style="display:none"><span class="gc-icon gc-icon-sm">flag</span>${t('map.label.usStates')}</div>
          <button class="map-reset-btn" id="globe-reset">↺ ${t('map.btn.reset')}</button>
          <div class="river-controls" id="river-controls" style="display:none">
            <div class="river-name-label" id="river-name-label"></div>
            <button class="river-toggle-btn" id="river-line-toggle"><span class="gc-icon gc-icon-sm">water</span>${t('map.btn.hideRiver')}</button>
          </div>
        </main>
      </div>
    `;

    this._bindUI();
  }

  _bindUI() {
    const el = this._el;

    el.querySelector('#hdr-theme').addEventListener('click', () => this._engine.toggleTheme());
    el.querySelector('#hdr-new').addEventListener('click', () => {
      const s = this._engine.state;
      this._onNewGame({ mode: s.mode, goal: s.goal, modifiers: [...s.modifiers], errorLimit: s.errorLimit, timeLimitSeconds: s.timeLimitSeconds, river: s.river });
    });
    el.querySelector('#hdr-switch-mode').addEventListener('click', () => this._onSwitchMode());
    el.querySelector('#hdr-menu').addEventListener('click', () => this._onMenu());

    const input = el.querySelector('#country-input');
    const ghost = el.querySelector('#autocomplete-ghost');
    this._autocomplete = new Autocomplete(input, ghost, () => this._engine.getAutocompleteCandidates());

    const submit = () => {
      const val = input.value.trim();
      if (!val) return;
      this._engine.guess(val);
      this._autocomplete.clear();
      input.focus();
    };

    el.querySelector('#go-btn').addEventListener('click', submit);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });

    el.querySelector('#chain-toggle').addEventListener('click', () => {
      const collapse = el.querySelector('#chain-collapse');
      const open = collapse.style.display === 'none';
      collapse.style.display = open ? '' : 'none';
      el.querySelector('#chain-chevron').textContent = open ? '▴' : '▾';
    });

    el.querySelector('#toggle-names').addEventListener('click', () => {
      this._engine.toggleShowNames();
    });

    el.querySelector('#river-line-toggle')?.addEventListener('click', () => {
      this._engine.toggleRiverLine();
    });

    el.querySelector('#globe-reset')?.addEventListener('click', () => {
      this._renderer?.resetView?.();
    });
  }

  _bindEngineEvents() {
    const e = this._engine;

    this._unsubs.push(
      e.on('stateChange', s => this._syncState(s)),
      e.on('placed', ({ name }) => {
        showToast(t('toast.placed', { name }), 'success');
      }),
      e.on('error', ({ message, messageKey, messageParams }) => {
        const text = messageKey ? t(messageKey, messageParams) : message;
        showToast(text, 'error');
      }),
      e.on('unplayable', ({ input }) => showToast(t('toast.unplayable', { input }), 'info')),
      e.on('timerTick', ({ elapsed }) => this._updateTimer(elapsed)),
      e.on('gameOver', ({ state, record }) => {
        showGameOverPanel(state, record, {
          again:      () => { const s = this._engine.state; this._onNewGame({ mode: s.mode, goal: s.goal, modifiers: [...s.modifiers], errorLimit: s.errorLimit, timeLimitSeconds: s.timeLimitSeconds, river: s.river }); },
          switchMode: () => this._onSwitchMode(),
          menu:       () => this._onMenu(),
        });
      }),
      e.on('win', ({ state, record }) => {
        const delay = state.mode === MODE.SOURCE_TO_SEA ? 3000 : 0;
        setTimeout(() => {
          showWinPanel(state, record, {
            again:       () => { const s = this._engine.state; this._onNewGame({ mode: s.mode, goal: s.goal, modifiers: [...s.modifiers], errorLimit: s.errorLimit, timeLimitSeconds: s.timeLimitSeconds, river: s.river }); },
            keepPlaying: () => { const s = this._engine.state; if (s.mode === MODE.SOURCE_TO_SEA) this._engine.continueAsEndless(); },
            switchMode:  () => this._onSwitchMode(),
            menu:        () => this._onMenu(),
          });
        }, delay);
      }),
    );
  }

  // ── Sync state → DOM ──────────────────────────────────────────────────────

  _syncState(s) {
    const el = this._el;
    const score = s.placed.length;

    el.querySelector('#stat-placed').textContent = score;
    el.querySelector('#stat-errors').textContent = s.errors;
    this._updateTimer(s.elapsed);

    // Error badge
    const errBadge = el.querySelector('#badge-errors');
    if ((s.modifiers ?? new Set()).has(MODIFIER.ERROR_LIMIT)) {
      errBadge.style.display = '';
      el.querySelector('#badge-err-val').textContent = `${s.errors} / ${s.errorLimit}`;
    } else {
      errBadge.style.display = 'none';
    }

    // River badge + progress
    const riverBadge = el.querySelector('#badge-river');
    const progressWrap = el.querySelector('#progress-wrap');
    if (s.mode === MODE.SOURCE_TO_SEA && s.river) {
      const total = (s.river.countries ?? s.river.states ?? []).length;
      const pct = total > 0 ? (s.riverCountriesPlaced / total) * 100 : 0;
      const riverUnit = s.river.states ? 'states' : 'countries';
      riverBadge.style.display = '';
      el.querySelector('#badge-river-val').textContent = `${s.riverCountriesPlaced} / ${total}`;
      progressWrap.style.display = '';
      el.querySelector('#prog-label').textContent = riverUnit === 'states' ? t('game.progress.riverStates') : t('game.progress.riverCountries');
      el.querySelector('#prog-frac').textContent = `${s.riverCountriesPlaced} / ${total}`;
      el.querySelector('#prog-bar').style.width = `${pct}%`;
    } else {
      riverBadge.style.display = 'none';
      progressWrap.style.display = 'none';
    }

    // Mode label
    const modeLabel = el.querySelector('#map-mode-label');
    modeLabel.style.display = s.mode === MODE.STATES ? '' : 'none';

    // River controls — show whenever a river is active, even after continuing as endless
    const riverControls = el.querySelector('#river-controls');
    if (s.river) {
      riverControls.style.display = '';
      el.querySelector('#river-name-label').innerHTML = `<span class="gc-icon gc-icon-sm">water</span>${s.river.name.toUpperCase()}`;
      el.querySelector('#river-line-toggle').innerHTML = `<span class="gc-icon gc-icon-sm">water</span>${s.showRiverLine ? t('map.btn.hideRiver') : t('map.btn.showRiver')}`;
      this._renderer?.setRiverLinesVisible?.(s.showRiverLine);
    } else {
      riverControls.style.display = 'none';
    }

    // Chain list
    const list = el.querySelector('#chain-list');
    if (list) {
      list.innerHTML = s.placed.map((name, i) => `
        <div class="chain-item">
          <span class="chain-num">${i + 1}</span>
          <span class="chain-name ${s.showNames ? '' : 'blurred'}">${name}</span>
        </div>
      `).join('');
      list.scrollTop = list.scrollHeight;
    }

    // Theme icon
    el.querySelector('#hdr-theme').innerHTML = `<span class="gc-icon gc-icon-bare">${s.theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>`;

    // Switch-mode button: show the opposite mode as the target
    const switchBtn = el.querySelector('#hdr-switch-mode');
    if (s.mode === MODE.STATES) {
      switchBtn.innerHTML = `<span class="gc-icon gc-icon-sm">public</span>${t('game.btn.switchToWorld')}`;
    } else {
      switchBtn.innerHTML = `<span class="gc-icon gc-icon-sm">flag</span>${t('game.btn.switchToStates')}`;
    }

    // Input placeholder
    const input = el.querySelector('#country-input');
    if (input) input.placeholder = s.mode === MODE.STATES ? t('game.input.placeholderState') : t('game.input.placeholderCountry');

    // Sidebar message
    const msg = el.querySelector('#sidebar-msg');
    const mods = s.modifiers ?? new Set();

    const isStates = s.mode === MODE.STATES;

    // Build each active condition as a separate chip
    const chips = [];
    if (s.mode === MODE.SOURCE_TO_SEA && s.river) {
      const total = (s.river.countries ?? s.river.states ?? []).length;
      const riverUnit = s.river.states ? 'states' : 'countries';
      chips.push({
        id: 'river', icon: 'water',
        label: t('chip.river.label', { river: s.river.name }),
        value: t(riverUnit === 'states' ? 'chip.river.value.states' : 'chip.river.value.countries', { n: s.riverCountriesPlaced, total }),
      });
    } else if (s.goal === GOAL.CONTINENTAL) {
      const continentSet = new Set(getContinent(s.targetContinent));
      const continentPlaced = s.placed.filter(c => continentSet.has(c)).length;
      chips.push({ id: 'continental', icon: 'public', label: t('chip.continental.label', { continent: s.targetContinent }), value: `${continentPlaced}/${s.totalTarget}` });
    } else if (s.goal === GOAL.WORLD_DOMINATION) {
      chips.push({ id: 'worlddom', icon: 'public', label: t('chip.worldDom.label'), value: `${score}/${s.totalTarget}` });
    } else if (s.goal === GOAL.NATIONAL_DOMINATION) {
      chips.push({ id: 'nationaldom', icon: 'star', label: t('chip.nationalDom.label'), value: `${score}/${s.totalTarget}` });
    }
    if (mods.has(MODIFIER.ERROR_LIMIT)) {
      chips.push({ id: 'errors', icon: 'close', label: t('chip.errors.label'), value: `${s.errors}/${s.errorLimit}` });
    }
    if (mods.has(MODIFIER.TIME_LIMIT)) {
      chips.push({ id: 'time', icon: 'schedule', label: t('chip.time.label'), value: _fmtTime(s.elapsed) });
    }

    if (chips.length === 0) {
      msg.classList.remove('sidebar-message-chips');
      if (s.placed.length <= 1) {
        msg.textContent = isStates ? t('game.msg.borderStarter.state') : t('game.msg.borderStarter.country');
      } else {
        const key = isStates
          ? (score === 1 ? 'game.msg.placed.state' : 'game.msg.placed.states')
          : (score === 1 ? 'game.msg.placed.country' : 'game.msg.placed.countries');
        msg.textContent = t(key, { n: score });
      }
    } else if (chips.length === 1) {
      const c = chips[0];
      msg.classList.remove('sidebar-message-chips');
      msg.innerHTML = `<span class="gc-icon gc-icon-sm">${c.icon}</span>${c.label} — <span data-chip-value="${c.id}">${c.value}</span>`;
    } else {
      msg.classList.add('sidebar-message-chips');
      msg.innerHTML = chips.map(c => `
        <div class="condition-chip" data-chip-id="${c.id}">
          <span class="gc-icon gc-icon-sm">${c.icon}</span>
          <div class="condition-chip-text">
            <div class="condition-chip-label">${c.label}</div>
            <div class="condition-chip-value" data-chip-value="${c.id}">${c.value}</div>
          </div>
        </div>
      `).join('');
    }

    // Sync theme to renderer before updating country colours
    this._renderer?.setTheme?.(s.theme);

    // Update renderer colours
    this._updateRendererStatus(s);

    // Reset zoom to starter whenever a new game begins
    if (s.phase === PHASE.PLAYING && s.placed.length === 1) {
      requestAnimationFrame(() => this.resetView());
    }
  }

  _updateRendererStatus(s) {
    if (!this._renderer) return;

    // STS with river.states uses the US states renderer too — treat it as states mode.
    const isStatesRenderer = s.mode === MODE.STATES || (s.mode === MODE.SOURCE_TO_SEA && s.river?.states);
    const allNames = isStatesRenderer ? [...US_STATES] : [...ALL_WORLD_COUNTRIES];
    for (const name of allNames) {
      let status = 'unplaced';
      if (s.placedSet.has(name)) {
        status = name === s.starter ? 'starter' : 'placed';
      }
      if (isStatesRenderer) {
        this._renderer.setStateStatus?.(name, status);
      } else {
        this._renderer.setCountryStatus?.(name, status);
      }
    }

    // Hide the starter's name in tooltips until at least one other place is placed.
    this._renderer.setStarterMystery?.(s.placed.length <= 1);
  }

  _updateTimer(elapsed) {
    const el = this._el.querySelector('#stat-time');
    if (!el) return;
    el.textContent = formatTime(elapsed);

    const s = this._engine.state;
    if ((s.modifiers ?? new Set()).has(MODIFIER.TIME_LIMIT)) {
      el.classList.toggle('countdown', true);
      el.classList.toggle('warning', elapsed <= 30);

      // Keep the sidebar Time chip in sync with the countdown
      const timeChip = this._el.querySelector('[data-chip-value="time"]');
      if (timeChip) timeChip.textContent = _fmtTime(elapsed);
    }
  }

  // ── Map loading ───────────────────────────────────────────────────────────

  async loadWorldMap(topoData) {
    this._topoWorld = topoData;
    const container = this._el.querySelector('#map-container');
    if (this._renderer) this._renderer.dispose();
    this._renderer = new WorldMapRenderer(container);
    await this._renderer.loadWorld(topoData, ALL_WORLD_COUNTRIES);
    this._renderer.setTooltipMode('placed');
    const s = this._engine.state;
    if (s.theme) this._renderer.setTheme(s.theme);
  }

  async loadStatesMap(topoData) {
    this._topoStates = topoData;
    const container = this._el.querySelector('#map-container');
    if (this._renderer) this._renderer.dispose();
    this._renderer = new FlatMapRenderer(container);
    await this._renderer.loadStates(topoData, US_STATES);
    this._renderer.setTooltipMode('placed');
    this._renderer.setTheme(this._engine.state.theme);
  }

  setRiverOverlay(river) {
    if (!river || !this._renderer) return;
    this._renderer.clearRiverLines?.();

    const useDetail = this._engine.state.mode === MODE.SOURCE_TO_SEA;
    const mainCoords = (useDetail && river.detailLine?.length) ? river.detailLine : river.line;
    const strokeW = useDetail ? '0.35' : '0.28';

    if (useDetail && river.detailSecondaryLines?.length) {
      for (const sec of river.detailSecondaryLines) {
        this._renderer.setRiverLine?.(sec.coords, sec.color, strokeW);
      }
    } else if (river.secondaryLine) {
      this._renderer.setRiverLine?.(river.secondaryLine.coords, river.secondaryLine.color, strokeW);
    }

    this._renderer.setRiverLine?.(mainCoords, '#00aaff', strokeW);
  }

  clearRiverOverlay() {
    this._renderer?.clearRiverLines?.();
  }

  resetView() {
    const s = this._engine.state;
    // For STS mode, fit the entire river into view rather than just the starter country
    if (s.mode === MODE.SOURCE_TO_SEA && s.river && this._renderer?.resetViewToCoords) {
      const mainLine = s.river.detailLine?.length ? s.river.detailLine : s.river.line;
      const coordArrays = [mainLine];
      if (s.river.detailSecondaryLines?.length) {
        for (const sec of s.river.detailSecondaryLines) coordArrays.push(sec.coords);
      } else if (s.river.secondaryLine?.coords) {
        coordArrays.push(s.river.secondaryLine.coords);
      }
      this._renderer.resetViewToCoords(coordArrays);
      return;
    }
    const names = s.placed;
    this._renderer?.resetView?.(names.length ? names : null);
  }

  show() { this._el.classList.add('active'); }
  hide() { this._el.classList.remove('active'); }

  cleanup() {
    for (const unsub of this._unsubs) unsub();
    this._unsubs = [];
    this._unsubLang?.();
    this._unsubLang = null;
  }
}
