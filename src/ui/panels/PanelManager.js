const overlay = document.getElementById('panel-overlay');

let _onClose = null;

overlay.addEventListener('click', e => {
  if (e.target === overlay) closePanel();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePanel();
});

export function openPanel(html, onClose) {
  overlay.innerHTML = html;
  overlay.classList.remove('hidden');
  _onClose = onClose ?? null;
  const input = overlay.querySelector('input');
  if (input) setTimeout(() => input.focus(), 50);
}

export function closePanel() {
  overlay.classList.add('hidden');
  overlay.innerHTML = '';
  if (_onClose) { _onClose(); _onClose = null; }
}

export function getPanel() { return overlay; }
