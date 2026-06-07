import { openPanel, closePanel, getPanel } from './PanelManager.js';
import { GOAL, MODIFIER, MODE } from '../../engine/GameState.js';
import { t } from '../../i18n/index.js';

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
      <div class="panel-title">${t('cond.title')}</div>

      <div class="condition-section-label">${t('cond.goal')} <span class="condition-section-hint">${t('cond.goal.hint')}</span></div>
      <div class="condition-list" id="goal-list">
        ${goalOpt(GOAL.DEFAULT,             '<span class="gc-icon gc-icon-sm">all_inclusive</span>',  t('cond.endless'),     t('cond.endless.desc'))}
        ${goalOpt(GOAL.CONTINENTAL,         '<span class="gc-icon gc-icon-sm">public</span>',         t('cond.continental'), t('cond.continental.desc'), hideContinentalAndWorld)}
        ${goalOpt(GOAL.WORLD_DOMINATION,    '<span class="gc-icon gc-icon-sm">travel_explore</span>',t('cond.worldDom'),     t('cond.worldDom.desc'), hideContinentalAndWorld)}
        ${goalOpt(GOAL.NATIONAL_DOMINATION, '<span class="gc-icon gc-icon-sm">star</span>',           t('cond.nationalDom'), t('cond.nationalDom.desc'), !isStates)}
      </div>

      <div class="condition-section-label" style="margin-top:16px">${t('cond.modifiers')} <span class="condition-section-hint">${t('cond.modifiers.hint')}</span></div>
      <div class="condition-list" id="mod-list">
        ${modOpt(MODIFIER.ERROR_LIMIT, '<span class="gc-icon gc-icon-sm">close</span>', t('cond.errorLimit'), t('cond.errorLimit.desc'),
          `<div class="condition-sub"><label>${t('cond.errorLimit.field')}</label><input type="number" id="error-limit-input" min="1" max="20" value="3" /></div>`)}
        ${modOpt(MODIFIER.TIME_LIMIT,  '<span class="gc-icon gc-icon-sm">schedule</span>', t('cond.timeLimit'),  t('cond.timeLimit.desc'),
          `<div class="condition-sub"><label>${t('cond.timeLimit.field')}</label><input type="text" id="time-limit-input" value="3:00" placeholder="MM:SS" style="width:70px" /><span style="font-size:11px;color:var(--text-dim)">MM:SS</span></div>`)}
      </div>

      <div class="panel-actions">
        <button class="btn btn-primary" id="confirm-condition">${t('cond.confirm')}</button>
        <button class="btn btn-ghost" id="close-conditions-2">${t('cond.cancel')}</button>
      </div>
    </div>
  `;

  openPanel(html);

  const overlay = getPanel();
  let selectedGoal = initGoal;
  const selectedMods = new Set(initMods);

  const goalOptions = overlay.querySelectorAll('#goal-list .condition-option');
  goalOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      goalOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedGoal = opt.dataset.goal;
    });
  });

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
