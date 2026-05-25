import { openPanel, closePanel, getPanel } from './PanelManager.js';
import { CONTINENTS } from '../../data/continents.js';

const PLAYABLE_CONTINENTS = ['Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania'];

export function showContinentPicker(onPick, allowedContinents = null) {
  const list = allowedContinents ?? PLAYABLE_CONTINENTS;
  const buttons = list.map(name => {
    const count = CONTINENTS[name]?.size ?? 0;
    return `<button class="continent-btn" data-continent="${name}">${name}<span class="count">${count} countries</span></button>`;
  }).join('');

  const html = `
    <div class="panel">
      <div class="panel-title">CHOOSE CONTINENT</div>
      <p style="font-size:13px;color:var(--text-dim);margin-bottom:16px;">
        Your starter spans two continents — which one will you dominate?
      </p>
      <div class="continent-buttons">${buttons}</div>
    </div>
  `;

  openPanel(html);
  const overlay = getPanel();

  overlay.querySelectorAll('.continent-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      closePanel();
      onPick(btn.dataset.continent);
    });
  });
}
