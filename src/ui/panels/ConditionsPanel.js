import { openPanel, closePanel, getPanel } from './PanelManager.js';
import { GOAL, MODIFIER, MODE } from '../../engine/GameState.js';

const GOAL_INCOMPAT = new Set([GOAL.CONTINENTAL, GOAL.WORLD_DOMINATION]);

export function showConditionsPanel(currentMode, _unused, onConfirm, currentGoal, currentModifiers) {
  const isStates = currentMode === MODE.STATES;
  const isSts    = currentMode === MODE.SOURCE_TO_SEA;
  const hideContinentalAndWorld = isStates || isSts;

  let initGoal = currentGoal ?? GOAL.DEFAULT;
  const initMods = new Set(currentModifiers ?? []);

  if (hideContinentalAndWorld && GOAL_INCOMPAT.has(initGoal)) initGoal = GOAL.DEFAULT;
  if (!isStates && initGoal === GOAL.NATIONAL_DOMINATION) initGoal = GOAL.DEFAULT;

  const goalOpt = (g, icon, name, desc, hidden = false) => hidden ? '' : `
    <div class="condition-option ${initGoal === g ? 'selected' : ''}" data-goal="${g}">
      <div class="condition-name">${icon} ${name}</div>
      <div class="condition-desc">${desc}</div>
    </div>`;

  const modOpt = (mod, icon, name, desc, subHtml = '') => `
    <div class="condition-option condition-mod ${initMods.has(mod) ? 'selected' : ''}" data-mod="${mod}">
      <div class="condition-name">${icon} ${name}</div>
      <div class="condition-desc">${desc}</div>
      ${subHtml}
    </div>`;

  const html = `
    <div class="panel">
      <button class="panel-close" id="close-conditions">✕</button>
      <div class="panel-title">GAME MODE</div>

      <div class="condition-section-label">GOAL <span class="condition-section-hint">pick one</span></div>
      <div class="condition-list" id="goal-list">
        ${goalOpt(GOAL.DEFAULT,          '<span class="gc-icon gc-icon-sm">all_inclusive</span>', 'Endless',          'No finish line — play as long as you like.')}
        ${goalOpt(GOAL.CONTINENTAL,         '<span class="gc-icon gc-icon-sm">public</span>', 'Continental',         "Place every country on the starter's continent.", hideContinentalAndWorld)}
        ${goalOpt(GOAL.WORLD_DOMINATION,    '<span class="gc-icon gc-icon-sm">travel_explore</span>', 'World Domination',    'Every country on Earth. Bering Strait unlocked.', hideContinentalAndWorld)}
        ${goalOpt(GOAL.NATIONAL_DOMINATION, '<span class="gc-icon gc-icon-sm">star</span>', 'National Domination', 'Place every US state. Available in US States mode only.', !isStates)}
      </div>

      <div class="condition-section-label" style="margin-top:16px">MODIFIERS <span class="condition-section-hint">optional — mix and match freely</span></div>
      <div class="condition-list" id="mod-list">
        ${modOpt(MODIFIER.ERROR_LIMIT, '<span class="gc-icon gc-icon-sm">close</span>', 'Error Limit', 'Game over when you hit your mistake cap.',
          `<div class="condition-sub"><label>Errors allowed:</label><input type="number" id="error-limit-input" min="1" max="20" value="3" /></div>`)}
        ${modOpt(MODIFIER.TIME_LIMIT,  '<span class="gc-icon gc-icon-sm">schedule</span>', 'Time Limit',  'Race the clock. Score = countries placed.',
          `<div class="condition-sub"><label>Time:</label><input type="text" id="time-limit-input" value="3:00" placeholder="MM:SS" style="width:70px" /><span style="font-size:11px;color:var(--text-dim)">MM:SS</span></div>`)}
      </div>

      <div class="panel-actions">
        <button class="btn btn-primary" id="confirm-condition">CONFIRM</button>
        <button class="btn btn-ghost" id="close-conditions-2">Cancel</button>
      </div>
    </div>
  `;

  openPanel(html);

  const overlay = getPanel();
  let selectedGoal = initGoal;
  const selectedMods = new Set(initMods);

  // Goal: radio
  const goalOptions = overlay.querySelectorAll('#goal-list .condition-option');
  goalOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      goalOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedGoal = opt.dataset.goal;
    });
  });

  // Modifiers: independent toggles — stop inputs from bubbling to parent toggle
  overlay.querySelectorAll('#mod-list input').forEach(input => {
    input.addEventListener('click', e => e.stopPropagation());
    input.addEventListener('mousedown', e => e.stopPropagation());
  });

  const modOptions = overlay.querySelectorAll('#mod-list .condition-option');
  modOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      opt.classList.toggle('selected');
      const mod = opt.dataset.mod;
      if (opt.classList.contains('selected')) selectedMods.add(mod);
      else selectedMods.delete(mod);
    });
  });

  overlay.querySelector('#close-conditions').addEventListener('click', closePanel);
  overlay.querySelector('#close-conditions-2').addEventListener('click', closePanel);

  overlay.querySelector('#confirm-condition').addEventListener('click', () => {
    const errorLimit = parseInt(overlay.querySelector('#error-limit-input')?.value ?? '3', 10);
    const timeStr = overlay.querySelector('#time-limit-input')?.value ?? '3:00';
    const [mins, secs] = timeStr.split(':').map(Number);
    const timeLimitSeconds = ((mins || 0) * 60) + (secs || 0) || 180;
    closePanel();
    onConfirm({ goal: selectedGoal, modifiers: [...selectedMods], errorLimit, timeLimitSeconds });
  });
}
