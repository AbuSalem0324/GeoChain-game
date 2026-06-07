import { MODE, GOAL, MODIFIER } from '../engine/GameState.js';
import { showToast } from './Toast.js';
import { t, onLanguageChange, getLanguage, setLanguage, LANGUAGES } from '../i18n/index.js';

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

    this._unsubLang = onLanguageChange(() => {
      this._render();
      this._observeButtons();
    });
  }

  _render() {
    const currentLang = getLanguage();
    const currentFlag = LANGUAGES.find(l => l.code === currentLang)?.flag ?? 'gb';
    const langOptions = LANGUAGES.map(l => `
      <option value="${l.code}" ${l.code === currentLang ? 'selected' : ''}>${l.label}</option>
    `).join('');

    this._el.innerHTML = `
      <div class="menu-top-left">
        <button class="btn btn-sm" id="menu-options" title="${t('menu.options')}"><span class="gc-icon gc-icon-sm">settings</span><span class="menu-top-label">${t('menu.options')}</span></button>
        <div class="menu-lang-picker">
          <span class="menu-lang-flag" id="menu-lang-flag" style="background-image:url(/flags/${currentFlag}.svg)"></span>
          <select id="menu-lang" class="menu-lang-select" aria-label="${t('opts.language')}">
            ${langOptions}
          </select>
        </div>
      </div>

      <div class="menu-theme-toggle">
        <div class="pill-toggle" id="menu-theme">
          <button id="theme-dark" class="active" title="${t('menu.theme.dark')}"><span class="gc-icon gc-icon-sm">dark_mode</span><span class="menu-top-label">${t('menu.theme.dark')}</span></button>
          <button id="theme-light" title="${t('menu.theme.light')}"><span class="gc-icon gc-icon-sm">light_mode</span><span class="menu-top-label">${t('menu.theme.light')}</span></button>
        </div>
      </div>

      <div class="menu-content">
        <div class="menu-logo">${t('app.title')}</div>
        <div class="menu-tagline">${t('app.tagline')}</div>

        <div class="menu-rules">
          <h3>${t('menu.howToPlay')}</h3>
          <div class="rule-item"><div class="rule-arrow green">→</div>${t('menu.rule.1')}</div>
          <div class="rule-item"><div class="rule-arrow green">→</div>${t('menu.rule.2')}</div>
          <div class="rule-item"><div class="rule-arrow amber">→</div>${t('menu.rule.3')}</div>
          <div class="rule-item"><div class="rule-arrow red">→</div>${t('menu.rule.4')}</div>
        </div>

        <div class="menu-buttons">
          <div class="menu-mode-buttons">
            <button class="btn btn-primary btn-lg" id="start-world"><span class="gc-icon btn-emoji">public</span> ${t('menu.startWorld')}</button>
            <button class="btn btn-primary btn-lg" id="start-states"><span class="gc-icon btn-emoji">flag</span> ${t('menu.startStates')}</button>
          </div>
          <div class="menu-extra-buttons">
            <button class="btn btn-lg" id="start-sts"><span class="gc-icon btn-emoji">water</span> ${t('menu.startSts')}</button>
            <button class="btn btn-lg" id="open-conditions"><span class="gc-icon btn-emoji">emoji_events</span> ${t('menu.winConditions')}</button>
          </div>
        </div>

        <div style="margin-top:12px;font-size:0.55rem;color:var(--muted);font-family:var(--font-mono);text-align:center;">
          ${t('menu.condition')}: <span id="condition-display" style="color:var(--accent)">${t('menu.condition.endless')}</span>
        </div>

        <div id="bmc-slot" style="margin-top:16px;display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;">
          <a href="https://www.buymeacoffee.com/islamsz" target="_blank" rel="noopener noreferrer"
             style="display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:8px;
                    background:#f5b547;color:#000;font-family:Inter,system-ui,sans-serif;font-weight:600;
                    font-size:0.85rem;text-decoration:none;border:1px solid #000;
                    box-shadow:0 2px 0 #000;transition:transform 0.1s;">
            <span style="font-size:1.1rem;">🍫</span>${t('menu.bmc')}
          </a>
          <img src="/qr-code.png" alt="${t('menu.bmc')}" class="bmc-qr"
               style="width:80px;height:80px;border-radius:6px;background:#fff;padding:4px;" />
        </div>
      </div>
    `;

    this._bindEvents();
    this._updateConditionDisplay();
  }

  _bindEvents() {
    const el = this._el;

    el.querySelector('#menu-options').addEventListener('click', () => {
      import('./panels/OptionsPanel.js').then(({ showOptionsPanel }) => {
        showOptionsPanel(this._engine);
      });
    });

    el.querySelector('#menu-lang').addEventListener('change', (e) => {
      const newCode = e.target.value;
      const newFlag = LANGUAGES.find(l => l.code === newCode)?.flag ?? 'gb';
      const flagEl = el.querySelector('#menu-lang-flag');
      if (flagEl) flagEl.style.backgroundImage = `url(/flags/${newFlag}.svg)`;
      setLanguage(newCode);
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
        showToast(t('toast.nationalDomIncompat'), 'info', 3500);
        goal = GOAL.DEFAULT;
      }
      this._onStartGame({ mode: MODE.WORLD, goal, modifiers: [...this._pendingModifiers], errorLimit: this._pendingErrorLimit, timeLimitSeconds: this._pendingTimeLimit });
    });

    el.querySelector('#start-states').addEventListener('click', () => {
      const goalIncompatStates = [GOAL.CONTINENTAL, GOAL.WORLD_DOMINATION];
      if (goalIncompatStates.includes(this._pendingGoal)) {
        showToast(t('toast.goalStatesIncompat'), 'error', 3500);
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
        showToast(t('toast.goalStsIncompat'), 'info', 3500);
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
    const goalKeys = {
      [GOAL.DEFAULT]:             'menu.condition.endless',
      [GOAL.CONTINENTAL]:         'menu.condition.continental',
      [GOAL.WORLD_DOMINATION]:    'menu.condition.worldDom',
      [GOAL.NATIONAL_DOMINATION]: 'menu.condition.nationalDom',
    };
    const parts = [t(goalKeys[this._pendingGoal] ?? 'menu.condition.endless')];
    if (this._pendingModifiers.has(MODIFIER.ERROR_LIMIT)) parts.push(t('menu.condition.errors', { n: this._pendingErrorLimit }));
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
