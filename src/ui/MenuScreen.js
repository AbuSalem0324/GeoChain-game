import { MODE, GOAL, MODIFIER } from '../engine/GameState.js';
import { showToast } from './Toast.js';

export class MenuScreen {
  constructor(el, engine, onStartGame) {
    this._el = el;
    this._engine = engine;
    this._onStartGame = onStartGame;
    this._pendingGoal      = GOAL.DEFAULT;
    this._pendingModifiers = new Set();
    this._pendingErrorLimit = 3;
    this._pendingTimeLimit  = 180;

    this._render();
    this._observeButtons();
  }

  _render() {
    this._el.innerHTML = `
      <div class="menu-top-left">
        <button class="btn btn-sm" id="menu-options"><span class="gc-icon gc-icon-sm">settings</span>Options</button>
      </div>

      <div class="menu-theme-toggle">
        <div class="pill-toggle" id="menu-theme">
          <button id="theme-dark" class="active"><span class="gc-icon gc-icon-sm">dark_mode</span>Dark</button>
          <button id="theme-light"><span class="gc-icon gc-icon-sm">light_mode</span>Light</button>
        </div>
      </div>

      <div class="menu-content">
        <div class="menu-logo">GEOCHAIN</div>
        <div class="menu-tagline">Name a neighbour. Grow the chain.</div>

        <div class="menu-rules">
          <h3>How to play</h3>
          <div class="rule-item">
            <div class="rule-arrow green">→</div>
            A mystery country appears. Type any of its neighbours.
          </div>
          <div class="rule-item">
            <div class="rule-arrow green">→</div>
            Each correct answer extends the chain to new countries.
          </div>
          <div class="rule-item">
            <div class="rule-arrow amber">→</div>
            Countries must border any already-placed country.
          </div>
          <div class="rule-item">
            <div class="rule-arrow red">→</div>
            Wrong answers count as errors. Watch your limit!
          </div>
        </div>

        <div class="menu-buttons">
          <div class="menu-mode-buttons">
            <button class="btn btn-primary btn-lg" id="start-world"><span class="gc-icon btn-emoji">public</span> World Countries</button>
            <button class="btn btn-primary btn-lg" id="start-states"><span class="gc-icon btn-emoji">flag</span> US States</button>
          </div>
          <div class="menu-extra-buttons">
            <button class="btn btn-lg" id="start-sts"><span class="gc-icon btn-emoji">water</span> Source to Sea</button>
            <button class="btn btn-lg" id="open-conditions"><span class="gc-icon btn-emoji">emoji_events</span> Winning Conditions</button>
          </div>
        </div>

        <div style="margin-top:12px;font-size:0.55rem;color:var(--muted);font-family:var(--font-mono);text-align:center;">
          CONDITION: <span id="condition-display" style="color:var(--accent)">DEFAULT — ENDLESS</span>
        </div>
      </div>
    `;

    this._bindEvents();
  }

  _bindEvents() {
    const el = this._el;

    el.querySelector('#menu-options').addEventListener('click', () => {
      import('./panels/OptionsPanel.js').then(({ showOptionsPanel }) => {
        showOptionsPanel(this._engine);
      });
    });

    el.querySelector('#theme-dark').addEventListener('click', () => {
      if (this._engine.state.theme === 'dark') return;
      this._engine.toggleTheme();
      el.querySelector('#theme-dark').classList.add('active');
      el.querySelector('#theme-light').classList.remove('active');
    });
    el.querySelector('#theme-light').addEventListener('click', () => {
      if (this._engine.state.theme === 'light') return;
      this._engine.toggleTheme();
      el.querySelector('#theme-light').classList.add('active');
      el.querySelector('#theme-dark').classList.remove('active');
    });

    this.syncTheme();

    el.querySelector('#start-world').addEventListener('click', () => {
      let goal = this._pendingGoal;
      if (goal === GOAL.NATIONAL_DOMINATION) {
        showToast("National Domination is only available in US States mode — using Endless instead.", 'info', 3500);
        goal = GOAL.DEFAULT;
      }
      this._onStartGame({ mode: MODE.WORLD, goal, modifiers: [...this._pendingModifiers], errorLimit: this._pendingErrorLimit, timeLimitSeconds: this._pendingTimeLimit });
    });

    el.querySelector('#start-states').addEventListener('click', () => {
      const goalIncompatStates = [GOAL.CONTINENTAL, GOAL.WORLD_DOMINATION];
      if (goalIncompatStates.includes(this._pendingGoal)) {
        showToast("That goal isn't compatible with US States — pick another.", 'error', 3500);
        import('./panels/ConditionsPanel.js').then(({ showConditionsPanel }) => {
          showConditionsPanel(MODE.STATES, null, ({ goal, modifiers, errorLimit, timeLimitSeconds }) => {
            this._pendingGoal = goal;
            this._pendingModifiers = new Set(modifiers);
            this._pendingErrorLimit = errorLimit;
            this._pendingTimeLimit = timeLimitSeconds;
            this._updateConditionDisplay();
            this._onStartGame({ mode: MODE.STATES, goal, modifiers, errorLimit, timeLimitSeconds });
          }, GOAL.DEFAULT, []);
        });
        return;
      }
      this._onStartGame({ mode: MODE.STATES, goal: this._pendingGoal, modifiers: [...this._pendingModifiers], errorLimit: this._pendingErrorLimit, timeLimitSeconds: this._pendingTimeLimit });
    });

    el.querySelector('#start-sts').addEventListener('click', () => {
      const goalIncompatSts = [GOAL.CONTINENTAL, GOAL.WORLD_DOMINATION, GOAL.NATIONAL_DOMINATION];
      const goal = goalIncompatSts.includes(this._pendingGoal) ? GOAL.DEFAULT : this._pendingGoal;
      if (goalIncompatSts.includes(this._pendingGoal)) {
        showToast("That goal isn't compatible with Source to Sea — using Endless instead.", 'info', 3500);
      }
      import('./panels/RiverPanel.js').then(({ showRiverRulesPanel, showRiverPanel }) => {
        showRiverRulesPanel(() => {
          showRiverPanel('world', (river) => {
            this._onStartGame({
              mode: MODE.SOURCE_TO_SEA,
              goal,
              modifiers: [...this._pendingModifiers],
              errorLimit: this._pendingErrorLimit,
              timeLimitSeconds: this._pendingTimeLimit,
              river,
            });
          });
        });
      });
    });

    el.querySelector('#open-conditions').addEventListener('click', () => {
      import('./panels/ConditionsPanel.js').then(({ showConditionsPanel }) => {
        showConditionsPanel(MODE.WORLD, null, ({ goal, modifiers, errorLimit, timeLimitSeconds }) => {
          this._pendingGoal = goal;
          this._pendingModifiers = new Set(modifiers);
          this._pendingErrorLimit = errorLimit;
          this._pendingTimeLimit = timeLimitSeconds;
          this._updateConditionDisplay();
        }, this._pendingGoal, [...this._pendingModifiers]);
      });
    });
  }

  syncTheme() {
    const el = this._el;
    const isLight = this._engine.state.theme === 'light';
    el.querySelector('#theme-light').classList.toggle('active', isLight);
    el.querySelector('#theme-dark').classList.toggle('active', !isLight);
  }

  _updateConditionDisplay() {
    const el = this._el.querySelector('#condition-display');
    if (!el) return;
    const goalLabels = {
      [GOAL.DEFAULT]:             'ENDLESS',
      [GOAL.CONTINENTAL]:         'CONTINENTAL',
      [GOAL.WORLD_DOMINATION]:    'WORLD DOMINATION',
      [GOAL.NATIONAL_DOMINATION]: 'NATIONAL DOMINATION',
    };
    const parts = [goalLabels[this._pendingGoal] ?? 'ENDLESS'];
    if (this._pendingModifiers.has(MODIFIER.ERROR_LIMIT)) parts.push(`❌ ${this._pendingErrorLimit} errors`);
    if (this._pendingModifiers.has(MODIFIER.TIME_LIMIT)) {
      const m = Math.floor(this._pendingTimeLimit / 60);
      const s = String(this._pendingTimeLimit % 60).padStart(2, '0');
      parts.push(`⏱ ${m}:${s}`);
    }
    el.textContent = parts.join(' + ');
  }

  _observeButtons() {
    const btns = this._el.querySelectorAll('.menu-mode-buttons .btn, .menu-extra-buttons .btn');
    const check = () => {
      btns.forEach(btn => {
        const overflowing = btn.scrollWidth > btn.clientWidth + 2;
        btn.querySelectorAll('.btn-emoji').forEach(e => {
          e.style.display = overflowing ? 'none' : '';
        });
      });
    };
    const ro = new ResizeObserver(check);
    btns.forEach(btn => ro.observe(btn));
    check();
  }

  show() { this._el.classList.add('active'); }
  hide() { this._el.classList.remove('active'); }
}
