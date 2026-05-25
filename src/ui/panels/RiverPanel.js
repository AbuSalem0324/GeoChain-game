import { openPanel, closePanel, getPanel } from './PanelManager.js';
import { getAllRivers } from '../../data/rivers.js';

export function showRiverPanel(mode, onSelect) {
  const rivers = getAllRivers(mode);

  const riverButtons = rivers.map(r => {
    const hasForeign = r.foreign?.length;
    return `
      <button class="river-btn" data-river="${r.id}">
        <span><span class="gc-icon gc-icon-sm">water</span>${r.name.toUpperCase()}</span>
        ${hasForeign ? `<span class="river-warning"><span class="gc-icon gc-icon-sm">warning</span>crosses foreign territory</span>` : ''}
      </button>
    `;
  }).join('');

  const html = `
    <div class="panel">
      <button class="panel-close" id="close-river">✕</button>
      <div class="panel-title">SELECT RIVER</div>
      <div class="river-list">
        <button class="river-btn random" data-river="random">
          <span class="gc-icon gc-icon-sm">casino</span> RANDOM
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
      <div class="panel-title"><span class="gc-icon">water</span>SOURCE TO SEA</div>
      <div style="font-size:0.8rem;color:var(--text-dim);line-height:1.6;margin-bottom:20px;">
        <p>A river appears on the map. Follow it from source to sea.</p>
        <br/>
        <p><span class="gc-icon gc-icon-sm">check</span>Name any place the river flows through — order doesn't matter.</p>
        <p><span class="gc-icon gc-icon-sm">check</span>Only river places count toward your progress.</p>
        <p><span class="gc-icon gc-icon-sm">close</span>Typing a place not on the river = error.</p>
      </div>
      <button class="btn btn-primary" style="width:100%;white-space:normal;text-align:center;justify-content:center" id="sts-pick"><span class="gc-icon gc-icon-sm">public</span>Pick River</button>
    </div>
  `;

  openPanel(html);
  const overlay = getPanel();
  overlay.querySelector('#close-sts').addEventListener('click', closePanel);
  overlay.querySelector('#sts-pick').addEventListener('click', () => { closePanel(); onContinue(); });
}
