import { openPanel, closePanel, getPanel } from './PanelManager.js';
import { getAllRivers } from '../../data/rivers.js';
import { t } from '../../i18n/index.js';

export function showRiverPanel(mode, onSelect) {
  const rivers = getAllRivers(mode);

  const riverButtons = rivers.map(r => {
    const hasForeign = r.foreign?.length;
    return `
      <button class="river-btn" data-river="${r.id}">
        <span><span class="gc-icon gc-icon-sm">water</span>${r.name.toUpperCase()}</span>
        ${hasForeign ? `<span class="river-warning"><span class="gc-icon gc-icon-sm">warning</span>${t('river.warning.foreign')}</span>` : ''}
      </button>
    `;
  }).join('');

  const html = `
    <div class="panel">
      <button class="panel-close" id="close-river">✕</button>
      <div class="panel-title">${t('river.title')}</div>
      <div class="river-list">
        <button class="river-btn random" data-river="random">
          <span class="gc-icon gc-icon-sm">casino</span> ${t('river.random')}
        </button>
        ${riverButtons}
      </div>
    </div>
  `;

  openPanel(html);
  const overlay = getPanel();
  overlay.querySelector('#close-river').addEventListener('click', closePanel);

  overlay.querySelectorAll('.river-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.river;
      closePanel();
      if (id === 'random') {
        const r = rivers[Math.floor(Math.random() * rivers.length)];
        onSelect(r);
      } else {
        onSelect(rivers.find(r => r.id === id));
      }
    });
  });
}

export function showRiverRulesPanel(onContinue) {
  const html = `
    <div class="panel" style="max-width:520px">
      <button class="panel-close" id="close-sts">✕</button>
      <div class="panel-title"><span class="gc-icon">water</span>${t('sts.title')}</div>
      <div style="font-size:0.8rem;color:var(--text-dim);line-height:1.6;margin-bottom:20px;">
        <p>${t('sts.intro')}</p>
        <br/>
        <p><span class="gc-icon gc-icon-sm">check</span>${t('sts.rule.1')}</p>
        <p><span class="gc-icon gc-icon-sm">check</span>${t('sts.rule.2')}</p>
        <p><span class="gc-icon gc-icon-sm">close</span>${t('sts.rule.3')}</p>
      </div>
      <button class="btn btn-primary" style="width:100%;white-space:normal;text-align:center;justify-content:center" id="sts-pick"><span class="gc-icon gc-icon-sm">public</span>${t('sts.pickRiver')}</button>
    </div>
  `;

  openPanel(html);
  const overlay = getPanel();
  overlay.querySelector('#close-sts').addEventListener('click', closePanel);
  overlay.querySelector('#sts-pick').addEventListener('click', () => { closePanel(); onContinue(); });
}
