import { openPanel, closePanel, getPanel } from './PanelManager.js';
import { t, getLanguage, setLanguage, LANGUAGES } from '../../i18n/index.js';

const STORAGE_KEY = 'geochain_font_offset';
const BIAS = 4;

export function getFontOffset() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === '4' || stored === '2') { localStorage.setItem(STORAGE_KEY, '0'); return 0; }
  return parseInt(stored ?? '0', 10);
}

function applyFontOffset(displayValue) {
  const cssValue = displayValue + BIAS;
  document.documentElement.style.setProperty('--font-offset', String(cssValue));
  document.body.classList.toggle('font-bold', displayValue >= 6);
  localStorage.setItem(STORAGE_KEY, String(displayValue));
}

applyFontOffset(getFontOffset());

export function showOptionsPanel(engine) {
  const currentDisplay = getFontOffset();
  const label = v => v > 0 ? `+${v}` : String(v);
  const currentLang = getLanguage();

  const langOptions = LANGUAGES.map(l => `
    <option value="${l.code}" ${l.code === currentLang ? 'selected' : ''}>${l.label}</option>
  `).join('');

  const currentFlag = LANGUAGES.find(l => l.code === currentLang)?.flag ?? 'gb';

  const html = `
    <div class="panel" style="max-width:400px">
      <button class="panel-close" id="opts-close">✕</button>
      <div class="panel-title">${t('opts.title')}</div>

      <div class="opts-section">
        <div class="opts-label">${t('opts.language')}</div>
        <div class="opts-lang-row">
          <span class="opts-lang-flag" id="opts-lang-flag" style="background-image:url(/flags/${currentFlag}.svg)"></span>
          <select id="opts-lang" class="opts-lang-select">
            ${langOptions}
          </select>
        </div>
      </div>

      <div class="opts-section">
        <div class="opts-label">${t('opts.wordSize')} <span class="opts-value" id="opts-size-val">${label(currentDisplay)}</span></div>
        <div class="opts-slider-row">
          <span class="opts-slider-cap">−3</span>
          <input type="range" id="opts-font-slider" min="-3" max="6" value="${Math.max(-3, Math.min(6, currentDisplay))}" step="1" class="opts-slider" />
          <span class="opts-slider-cap">+6</span>
        </div>
        <button class="btn btn-ghost" id="opts-font-reset" style="margin-top:10px;font-size:0.65rem;${currentDisplay === 0 ? 'display:none' : ''}">${t('opts.reset')}</button>
      </div>

      <div class="opts-section">
        <div class="opts-label">${t('opts.allowTypos')}</div>
        <div class="opts-toggle-row">
          <div class="pill-toggle" style="width:fit-content">
            <button id="opts-typos-off" class="${!engine.state.allowTypos ? 'active' : ''}">${t('opts.typosOff')}</button>
            <button id="opts-typos-on" class="${engine.state.allowTypos ? 'active' : ''}">${t('opts.typosOn')}</button>
          </div>
          <span class="opts-toggle-hint">${t('opts.typosHint')}</span>
        </div>
      </div>
    </div>
  `;

  openPanel(html);
  const overlay = getPanel();

  overlay.querySelector('#opts-close').addEventListener('click', closePanel);

  const slider  = overlay.querySelector('#opts-font-slider');
  const valSpan = overlay.querySelector('#opts-size-val');
  const resetBtn = overlay.querySelector('#opts-font-reset');

  slider.addEventListener('input', () => {
    const v = parseInt(slider.value, 10);
    valSpan.textContent = label(v);
    applyFontOffset(v);
    resetBtn.style.display = v === 0 ? 'none' : '';
  });

  resetBtn.addEventListener('click', () => {
    slider.value = '0';
    valSpan.textContent = '0';
    applyFontOffset(0);
    resetBtn.style.display = 'none';
  });

  const typosOff = overlay.querySelector('#opts-typos-off');
  const typosOn  = overlay.querySelector('#opts-typos-on');

  typosOff.addEventListener('click', () => {
    if (engine.state.allowTypos) engine.toggleAllowTypos();
    typosOff.classList.add('active');
    typosOn.classList.remove('active');
  });

  typosOn.addEventListener('click', () => {
    if (!engine.state.allowTypos) engine.toggleAllowTypos();
    typosOn.classList.add('active');
    typosOff.classList.remove('active');
  });

  overlay.querySelector('#opts-lang').addEventListener('change', (e) => {
    const newCode = e.target.value;
    const newFlag = LANGUAGES.find(l => l.code === newCode)?.flag ?? 'gb';
    // Swap the flag preview immediately so the user sees feedback before
    // the panel re-renders in the new language.
    const flagEl = overlay.querySelector('#opts-lang-flag');
    if (flagEl) flagEl.style.backgroundImage = `url(/flags/${newFlag}.svg)`;
    setLanguage(newCode);
    closePanel();
    showOptionsPanel(engine);
  });
}
