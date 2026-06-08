import { openPanel, closePanel, getPanel } from './PanelManager.js';
import { GOAL, MODE } from '../../engine/GameState.js';
import { t, riverName } from '../../i18n/index.js';

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function showGameOverPanel(state, record, callbacks) {
  const score = state.placed.length;
  const isNewRecord = record?.isNewRecord;
  const label = state.mode === MODE.STATES ? t('result.label.states') : t('result.label.countries');

  const html = `
    <div class="panel">
      <div class="panel-title" style="color:var(--accent3)">${t('result.gameOver')}</div>
      ${isNewRecord ? `<div class="new-record-badge"><span class="gc-icon gc-icon-sm">emoji_events</span>${t('result.newRecord')}</div>` : ''}
      <div class="result-score" style="margin:16px 0">${score}</div>
      <div class="result-stats">
        <div class="result-stat">
          <span class="label">${label}</span>
          <span class="value">${score}</span>
        </div>
        <div class="result-stat">
          <span class="label">${t('result.label.errors')}</span>
          <span class="value" style="color:var(--accent3)">${state.errors}</span>
        </div>
        <div class="result-stat">
          <span class="label">${t('result.label.time')}</span>
          <span class="value">${formatTime(state.elapsed)}</span>
        </div>
        ${record?.current !== null ? `
        <div class="result-stat">
          <span class="label">${t('result.label.best')}</span>
          <span class="value" style="color:var(--accent)">${record.current}</span>
        </div>` : ''}
      </div>
      <div class="panel-actions">
        <button class="btn btn-primary" id="res-again">${t('result.btn.playAgain')}</button>
        ${state.mode !== MODE.SOURCE_TO_SEA ? `<button class="btn btn-primary" id="res-mode">${t('result.btn.switchMode')}</button>` : ''}
        <button class="btn btn-ghost" id="res-menu">${t('result.btn.menu')}</button>
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
  const label = state.mode === MODE.STATES ? t('result.label.statesPlaced') : t('result.label.countriesPlaced');

  let title = '';
  if (state.goal === GOAL.WORLD_DOMINATION) {
    title = `<span class="gc-icon">travel_explore</span>${t('result.worldDominated')}`;
  } else if (state.goal === GOAL.NATIONAL_DOMINATION) {
    title = `<span class="gc-icon">star</span>${t('result.nationDominated')}`;
  } else if (state.goal === GOAL.CONTINENTAL) {
    title = t('result.continentDominated', { continent: state.targetContinent.toUpperCase() });
  } else if (state.mode === MODE.SOURCE_TO_SEA) {
    title = `<span class="gc-icon">water</span>${t('result.riverComplete', { river: state.river ? riverName(state.river).toUpperCase() : 'RIVER' })}`;
  } else {
    title = t('result.youWin');
  }

  const html = `
    <div class="panel">
      <div class="panel-title" style="color:var(--accent)">${title}</div>
      ${isNewRecord ? `<div class="new-record-badge"><span class="gc-icon gc-icon-sm">emoji_events</span>${t('result.newRecord')}</div>` : ''}
      <div class="result-score amber" style="margin:16px 0">${score}</div>
      <div class="result-stats">
        <div class="result-stat">
          <span class="label">${label}</span>
          <span class="value">${score}</span>
        </div>
        <div class="result-stat">
          <span class="label">${t('result.label.errors')}</span>
          <span class="value" style="color:var(--accent3)">${state.errors}</span>
        </div>
        ${record?.current !== null && state.mode !== MODE.SOURCE_TO_SEA ? `
        <div class="result-stat">
          <span class="label">${t('result.label.record')}</span>
          <span class="value" style="color:var(--accent)">${record.current}</span>
        </div>` : ''}
      </div>
      <div class="panel-actions">
        <button class="btn btn-primary" id="win-again">${t('result.btn.tryAgain')}</button>
        <button class="btn btn-primary" id="win-keep">${t('result.btn.keepPlaying')}</button>
        ${state.mode !== MODE.SOURCE_TO_SEA ? `<button class="btn btn-primary" id="win-mode">${t('result.btn.switchMode')}</button>` : ''}
        <button class="btn btn-ghost" id="win-menu">${t('result.btn.menu')}</button>
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
