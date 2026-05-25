import { openPanel, closePanel, getPanel } from './PanelManager.js';
import { GOAL, MODE } from '../../engine/GameState.js';

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function showGameOverPanel(state, record, callbacks) {
  const score = state.placed.length;
  const isNewRecord = record?.isNewRecord;
  const label = state.mode === MODE.STATES ? 'States' : 'Countries';

  const html = `
    <div class="panel">
      <div class="panel-title" style="color:var(--accent3)">GAME OVER</div>
      ${isNewRecord ? '<div class="new-record-badge"><span class="gc-icon gc-icon-sm">emoji_events</span>NEW RECORD</div>' : ''}
      <div class="result-score" style="margin:16px 0">${score}</div>
      <div class="result-stats">
        <div class="result-stat">
          <span class="label">${label}</span>
          <span class="value">${score}</span>
        </div>
        <div class="result-stat">
          <span class="label">Errors</span>
          <span class="value" style="color:var(--accent3)">${state.errors}</span>
        </div>
        <div class="result-stat">
          <span class="label">Time</span>
          <span class="value">${formatTime(state.elapsed)}</span>
        </div>
        ${record?.current !== null ? `
        <div class="result-stat">
          <span class="label">Best</span>
          <span class="value" style="color:var(--accent)">${record.current}</span>
        </div>` : ''}
      </div>
      <div class="panel-actions">
        <button class="btn btn-primary" id="res-again">Play Again</button>
        ${state.mode !== MODE.SOURCE_TO_SEA ? '<button class="btn btn-primary" id="res-mode">Switch Mode</button>' : ''}
        <button class="btn btn-ghost" id="res-menu">Menu</button>
      </div>
    </div>
  `;

  openPanel(html);
  const overlay = getPanel();

  overlay.querySelector('#res-again').addEventListener('click', () => { closePanel(); callbacks.again(); });
  overlay.querySelector('#res-mode')?.addEventListener('click', () => { closePanel(); callbacks.switchMode(); });
  overlay.querySelector('#res-menu').addEventListener('click',  () => { closePanel(); callbacks.menu(); });
}

export function showWinPanel(state, record, callbacks) {
  const score = state.placed.length;
  const isNewRecord = record?.isNewRecord;
  const label = state.mode === MODE.STATES ? 'States placed' : 'Countries placed';

  let title = '';
  if (state.goal === GOAL.WORLD_DOMINATION) {
    title = '<span class="gc-icon">travel_explore</span>WORLD DOMINATED!';
  } else if (state.goal === GOAL.NATIONAL_DOMINATION) {
    title = '<span class="gc-icon">star</span>NATION DOMINATED!';
  } else if (state.goal === GOAL.CONTINENTAL) {
    title = `${state.targetContinent.toUpperCase()} DOMINATED!`;
  } else if (state.mode === MODE.SOURCE_TO_SEA) {
    title = `<span class="gc-icon">water</span>${state.river?.name?.toUpperCase() ?? 'RIVER'} COMPLETE!`;
  } else {
    title = 'YOU WIN!';
  }

  const html = `
    <div class="panel">
      <div class="panel-title" style="color:var(--accent)">${title}</div>
      ${isNewRecord ? '<div class="new-record-badge"><span class="gc-icon gc-icon-sm">emoji_events</span>NEW RECORD</div>' : ''}
      <div class="result-score amber" style="margin:16px 0">${score}</div>
      <div class="result-stats">
        <div class="result-stat">
          <span class="label">${label}</span>
          <span class="value">${score}</span>
        </div>
        <div class="result-stat">
          <span class="label">Errors</span>
          <span class="value" style="color:var(--accent3)">${state.errors}</span>
        </div>
        ${record?.current !== null && state.mode !== MODE.SOURCE_TO_SEA ? `
        <div class="result-stat">
          <span class="label">Record</span>
          <span class="value" style="color:var(--accent)">${record.current}</span>
        </div>` : ''}
      </div>
      <div class="panel-actions">
        <button class="btn btn-primary" id="win-again">Try Again</button>
        <button class="btn btn-primary" id="win-keep">Keep Playing</button>
        ${state.mode !== MODE.SOURCE_TO_SEA ? '<button class="btn btn-primary" id="win-mode">Switch Mode</button>' : ''}
        <button class="btn btn-ghost" id="win-menu">Menu</button>
      </div>
    </div>
  `;

  openPanel(html);
  const overlay = getPanel();

  overlay.querySelector('#win-again').addEventListener('click', () => { closePanel(); callbacks.again(); });
  overlay.querySelector('#win-keep').addEventListener('click',  () => { closePanel(); callbacks.keepPlaying(); });
  overlay.querySelector('#win-mode')?.addEventListener('click', () => { closePanel(); callbacks.switchMode(); });
  overlay.querySelector('#win-menu').addEventListener('click',  () => { closePanel(); callbacks.menu(); });
}
