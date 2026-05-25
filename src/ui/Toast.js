const container = document.getElementById('toast-container');

export function showToast(message, type = 'info', duration = 2800) {
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = message;

  // Override the CSS animation duration to match the requested display duration
  el.style.animation = `toastIn 0.2s ease, toastOut 0.2s ease ${duration / 1000}s forwards`;

  container.appendChild(el);
  setTimeout(() => el.remove(), duration + 300);
}
