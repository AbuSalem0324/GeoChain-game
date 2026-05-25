import { normalise } from '../data/aliases.js';

const MAX_ITEMS = 8;

export class Autocomplete {
  constructor(inputEl, ghostEl, getCandidates) {
    this._input = inputEl;
    this._ghost = ghostEl;
    this._getCandidates = getCandidates;
    this._suggestion = '';
    this._matches = [];
    this._activeIdx = -1;

    // Dropdown list element — anchored to .search-wrapper so it sits below the full row
    this._list = document.createElement('div');
    this._list.id = 'autocomplete-list';
    inputEl.closest('.search-wrapper').appendChild(this._list);

    this._input.addEventListener('input', () => this._update());
    this._input.addEventListener('keydown', e => this._onKey(e));
    this._input.addEventListener('blur', () => setTimeout(() => this._closeList(), 150));
  }

  _update() {
    const val = this._input.value;
    if (!val) { this._clear(); return; }

    const norm = normalise(val);
    const candidates = this._getCandidates();

    this._matches = candidates
      .filter(c => normalise(c).startsWith(norm))
      .sort((a, b) => a.length - b.length)
      .slice(0, MAX_ITEMS);

    this._activeIdx = -1;

    if (this._matches.length === 0) {
      this._clearGhost();
      this._closeList();
      this._suggestion = '';
      return;
    }

    // Ghost hint from the top match (only when it's a strict prefix of the canonical name)
    const top = this._matches[0];
    const normTop = normalise(top);
    if (normTop !== norm) {
      this._suggestion = top;
      this._renderGhost(val, top);
    } else {
      this._suggestion = top;
      this._clearGhost();
    }

    this._renderList(val);
  }

  _renderGhost(typed, match) {
    const normTyped = normalise(typed);
    const normMatch = normalise(match);
    const offset    = normMatch.startsWith(normTyped) ? typed.length : 0;
    const hint      = offset > 0 ? match.slice(offset) : '';

    if (!hint) { this._clearGhost(); return; }
    this._ghost.innerHTML =
      `<span class="ghost-typed">${this._esc(typed)}</span><span class="ghost-hint">${this._esc(hint)}</span>`;
  }

  _clearGhost() {
    this._ghost.innerHTML = '';
  }

  _renderList(typed) {
    const norm = normalise(typed);
    this._list.innerHTML = this._matches.map((name, i) => {
      const normName = normalise(name);
      // Bold the matched prefix, show the rest normally
      const matchLen = norm.length;
      const display  = name;
      const pre  = this._esc(display.slice(0, matchLen));
      const rest = this._esc(display.slice(matchLen));
      return `<div class="ac-item${i === this._activeIdx ? ' ac-active' : ''}" data-idx="${i}"><mark>${pre}</mark>${rest}</div>`;
    }).join('');

    this._list.querySelectorAll('.ac-item').forEach(item => {
      item.addEventListener('mousedown', e => {
        e.preventDefault();
        const idx = Number(item.dataset.idx);
        this._select(this._matches[idx]);
      });
    });
  }

  _closeList() {
    this._list.innerHTML = '';
    this._matches = [];
    this._activeIdx = -1;
  }

  _select(name) {
    this._input.value = name;
    this._suggestion = name;
    this._clearGhost();
    this._closeList();
    this._input.focus();
  }

  _clear() {
    this._suggestion = '';
    this._matches = [];
    this._activeIdx = -1;
    this._clearGhost();
    this._closeList();
    this._input.value = '';
  }

  _onKey(e) {
    if (this._matches.length > 0 && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      if (e.key === 'ArrowDown') {
        this._activeIdx = Math.min(this._activeIdx + 1, this._matches.length - 1);
      } else {
        this._activeIdx = Math.max(this._activeIdx - 1, -1);
      }
      this._suggestion = this._activeIdx >= 0 ? this._matches[this._activeIdx] : this._matches[0];
      this._renderList(this._input.value);
      return;
    }

    if ((e.key === 'Tab' || e.key === 'ArrowRight') && this._suggestion) {
      e.preventDefault();
      this._select(this._suggestion);
      return;
    }

    if (e.key === 'Enter' && this._activeIdx >= 0) {
      e.preventDefault();
      this._select(this._matches[this._activeIdx]);
    }
  }

  _esc(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  getSuggestion() { return this._suggestion; }
  clear() { this._clearGhost(); this._closeList(); this._suggestion = ''; this._matches = []; this._input.value = ''; }
}
