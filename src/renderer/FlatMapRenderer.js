import { feature } from 'topojson-client';

const COLORS = {
  ocean: '#04080f',
  unplaced: '#0d1a2e',
  strokeUnplaced: '#1e3a5f',
  starter: '#2e1a00',
  strokeStarter: '#f7b731',
  placed: '#0d1e30',
  strokePlaced: '#f7b731',  // amber border matching starter theme, dark fill
};

const COLORS_LIGHT = {
  ocean: '#ccd8e8',
  unplaced: '#e0e8f0',
  strokeUnplaced: '#b0c4d8',
  starter: '#f5c560',   // saturated amber — strongest fill
  strokeStarter: '#a36800',
  placed: '#fde6b0',    // softer amber — clearly visible but lighter than starter
  strokePlaced: '#d4920a',
};

export class FlatMapRenderer {
  constructor(container) {
    this._container = container;
    this._svg = null;
    this._paths = new Map(); // name → <path>
    this._theme = 'dark';
    this._topoData = null;
    this._riverGroup = null;
    this._dragging = false;
    this._panX = 0;
    this._panY = 0;
    this._startPan = { x: 0, y: 0 };
    this._scale = 1;
    this._viewGroup = null;
    this._tooltipMode = 'none';
    this._tooltip = null;

    this._buildSVG();
    this._buildTooltip();
    this._bindEvents();
  }

  _buildTooltip() {
    this._tooltip = document.createElement('div');
    this._tooltip.className = 'map-tooltip';
    this._tooltip.style.display = 'none';
    this._container.style.position = 'relative';
    this._container.appendChild(this._tooltip);
  }

  setTooltipMode(mode) {
    this._tooltipMode = mode;
    if (mode === 'none') this._tooltip.style.display = 'none';
  }

  setStarterMystery(on) { this._starterMystery = !!on; }

  _attachTooltip(el, name) {
    el.addEventListener('mouseenter', (e) => {
      const mode = this._tooltipMode;
      if (mode === 'none') return;
      if (mode === 'placed' && el.dataset.status !== 'placed' && el.dataset.status !== 'starter') return;
      const hideName = this._starterMystery && el.dataset.status === 'starter';
      this._tooltip.textContent = hideName ? '???' : name;
      this._tooltip.style.display = 'block';
      this._moveTooltip(e);
    });
    el.addEventListener('mousemove', (e) => {
      if (this._tooltip.style.display === 'none') return;
      this._moveTooltip(e);
    });
    el.addEventListener('mouseleave', () => {
      this._tooltip.style.display = 'none';
    });
  }

  _moveTooltip(e) {
    const rect = this._container.getBoundingClientRect();
    this._tooltip.style.left = `${e.clientX - rect.left + 12}px`;
    this._tooltip.style.top  = `${e.clientY - rect.top  - 28}px`;
  }

  // US map bounds in projected coordinates (equirectangular, world-scale)
  // lon -180..-65, lat 18..72 → x -180..-33, y -106..-34, with 4-unit padding
  static get BOUNDS() {
    return { x: -184, y: -110, w: 155, h: 80 };
  }

  _buildSVG() {
    const { x, y, w, h } = FlatMapRenderer.BOUNDS;
    this._svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this._svg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
    this._svg.style.cssText = 'width:100%;height:100%;display:block;cursor:grab;';
    this._svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    this._viewGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this._viewGroup.setAttribute('id', 'view-group');
    this._svg.appendChild(this._viewGroup);

    // Ocean background — exactly the US map bounds
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('x', String(x));
    bg.setAttribute('y', String(y));
    bg.setAttribute('width', String(w));
    bg.setAttribute('height', String(h));
    bg.setAttribute('fill', this._c('ocean'));
    bg.setAttribute('id', 'ocean-bg');
    this._viewGroup.appendChild(bg);

    const statesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    statesGroup.setAttribute('id', 'states-group');
    this._viewGroup.appendChild(statesGroup);
    this._statesGroup = statesGroup;

    this._riverGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this._riverGroup.setAttribute('id', 'river-group');
    this._viewGroup.appendChild(this._riverGroup);

    // Map border on top
    const border = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    border.setAttribute('x', String(x));
    border.setAttribute('y', String(y));
    border.setAttribute('width', String(w));
    border.setAttribute('height', String(h));
    border.setAttribute('fill', 'none');
    border.setAttribute('stroke', '#2a3f5f');
    border.setAttribute('stroke-width', '0.5');
    border.setAttribute('pointer-events', 'none');
    this._viewGroup.appendChild(border);

    this._container.appendChild(this._svg);
  }

  _c(key) {
    const palette = this._theme === 'light' ? COLORS_LIGHT : COLORS;
    return palette[key] ?? '#888';
  }

  async loadStates(topoData, stateNames) {
    this._topoData = topoData;

    // Support both 'states' and 'states-10m' object names
    const objKey = topoData.objects.states ? 'states' : Object.keys(topoData.objects)[0];
    const { features } = feature(topoData, topoData.objects[objKey]);

    this._statesGroup.innerHTML = '';
    this._paths.clear();

    for (const f of features) {
      const name = f.properties?.name ?? '';
      const match = stateNames.find(s => s === name);
      if (!match) continue;

      const d = this._featureToPath(f);
      if (!d) continue;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'none');
      path.setAttribute('stroke-width', '0.2');
      path.setAttribute('data-name', match);
      path.style.display = 'none';
      path.style.transition = 'fill 0.2s ease, stroke 0.2s ease';
      this._statesGroup.appendChild(path);
      this._paths.set(match, path);
      this._attachTooltip(path, match);
    }
  }

  _featureToPath(feature) {
    const geom = feature.geometry;
    if (!geom) return null;

    const projectPt = ([lon, lat]) => {
      // Albers USA-style flat projection
      const x = (lon + 180) * (460 / 360) - 180;
      const y = (90 - lat) * (240 / 180) - 130;
      return [x, y];
    };

    const ringToD = (ring) => {
      const pts = ring.map(projectPt);
      return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ') + ' Z';
    };

    if (geom.type === 'Polygon') {
      return geom.coordinates.map(ringToD).join(' ');
    }
    if (geom.type === 'MultiPolygon') {
      return geom.coordinates.map(poly => poly.map(ringToD).join(' ')).join(' ');
    }
    return null;
  }

  setStateStatus(name, status) {
    const path = this._paths.get(name);
    if (!path) return;

    if (status === 'unplaced') {
      path.style.display = 'none';
      delete path.dataset.status;
      return;
    }
    path.style.display = '';
    path.dataset.status = status;
    const fills   = { starter: 'starter', placed: 'placed' };
    const strokes = { starter: 'strokeStarter', placed: 'strokePlaced' };
    path.setAttribute('fill',   this._c(fills[status]   ?? 'placed'));
    path.setAttribute('stroke', this._c(strokes[status] ?? 'strokePlaced'));
    path.setAttribute('stroke-width', status === 'starter' ? '0.20' : '0.14');
  }

  setRiverLine(coords, color = '#00aaff', strokeWidth = '0.4') {
    if (!coords?.length) return;

    const projectPt = ([lon, lat]) => {
      const x = (lon + 180) * (460 / 360) - 180;
      const y = (90 - lat) * (240 / 180) - 130;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    };

    // Split at long jumps so phantom diagonals between disjoint segments don't render.
    const JUMP_DEG = 3;
    const segments = [];
    let current = [];
    for (const c of coords) {
      if (current.length) {
        const prev = current[current.length - 1];
        if (Math.hypot(c[0] - prev[0], c[1] - prev[1]) > JUMP_DEG) {
          if (current.length > 1) segments.push(current);
          current = [];
        }
      }
      current.push(c);
    }
    if (current.length > 1) segments.push(current);

    for (const seg of segments) {
      const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      polyline.setAttribute('points', seg.map(projectPt).join(' '));
      polyline.setAttribute('fill', 'none');
      polyline.setAttribute('stroke', color);
      polyline.setAttribute('stroke-width', strokeWidth);
      polyline.setAttribute('opacity', '0.9');
      this._riverGroup.appendChild(polyline);
    }
  }

  clearRiverLines() { this._riverGroup.innerHTML = ''; }
  setRiverLinesVisible(v) { this._riverGroup.style.display = v ? '' : 'none'; }

  setTheme(theme) {
    if (this._theme === theme) return;
    this._theme = theme;
    const bg = this._svg.querySelector('#ocean-bg');
    if (bg) bg.setAttribute('fill', this._c('ocean'));
    for (const [name, el] of this._paths) {
      if (el.style.display === 'none') continue;
      this.setStateStatus(name, el.dataset.status ?? 'placed');
    }
  }

  _bindEvents() {
    const svg = this._svg;

    // Coalesce viewBox writes into one update per animation frame so
    // panning/pinching stays smooth even with all 50 state paths visible.
    let pendingVB = null;
    let rafId = null;
    const flushVB = () => {
      rafId = null;
      if (!pendingVB) return;
      const { x, y, w, h } = pendingVB;
      svg.setAttribute('viewBox', `${x.toFixed(3)} ${y.toFixed(3)} ${w.toFixed(3)} ${h.toFixed(3)}`);
      pendingVB = null;
    };
    const queueVB = (x, y, w, h) => {
      pendingVB = { x, y, w, h };
      if (rafId == null) rafId = requestAnimationFrame(flushVB);
    };

    svg.addEventListener('mousedown', e => {
      this._dragging = true;
      this._startPan = { x: e.clientX, y: e.clientY };
      svg.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', e => {
      if (!this._dragging) return;
      const dx = e.clientX - this._startPan.x;
      const dy = e.clientY - this._startPan.y;
      this._startPan = { x: e.clientX, y: e.clientY };
      const rect = svg.getBoundingClientRect();
      const vb   = pendingVB ?? svg.viewBox.baseVal;
      const ndx  = -(dx / rect.width)  * vb.width;
      const ndy  = -(dy / rect.height) * vb.height;
      const [nx, ny] = this._clamp(vb.x + ndx, vb.y + ndy, vb.width, vb.height);
      queueVB(nx, ny, vb.width, vb.height);
    });
    window.addEventListener('mouseup', () => {
      this._dragging = false;
      svg.style.cursor = 'grab';
    });

    // ── Touch: 1-finger pan, 2-finger pinch zoom ──
    let lastTouch = null;
    let pinch = null;
    svg.style.touchAction = 'none';

    // iOS Safari fires gesturestart/change for two-finger pinch; preventDefault
    // here stops the browser from zooming the whole page.
    ['gesturestart', 'gesturechange', 'gestureend'].forEach(evt => {
      svg.addEventListener(evt, e => e.preventDefault());
    });

    svg.addEventListener('touchstart', e => {
      if (e.touches.length === 1) {
        lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        pinch = null;
      } else if (e.touches.length === 2) {
        const [a, b] = e.touches;
        pinch = {
          dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
        };
        lastTouch = null;
      }
    }, { passive: false });

    svg.addEventListener('touchmove', e => {
      e.preventDefault();
      const { w: BW, h: BH } = FlatMapRenderer.BOUNDS;
      if (e.touches.length === 1 && lastTouch) {
        const t = e.touches[0];
        const dx = t.clientX - lastTouch.x;
        const dy = t.clientY - lastTouch.y;
        lastTouch = { x: t.clientX, y: t.clientY };
        const rect = svg.getBoundingClientRect();
        const vb   = pendingVB ?? svg.viewBox.baseVal;
        const ndx  = -(dx / rect.width)  * vb.width;
        const ndy  = -(dy / rect.height) * vb.height;
        const [nx, ny] = this._clamp(vb.x + ndx, vb.y + ndy, vb.width, vb.height);
        queueVB(nx, ny, vb.width, vb.height);
      } else if (e.touches.length === 2 && pinch) {
        const [a, b] = e.touches;
        const newDist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        const cx = (a.clientX + b.clientX) / 2;
        const cy = (a.clientY + b.clientY) / 2;

        const rect = svg.getBoundingClientRect();
        const vb   = pendingVB ?? svg.viewBox.baseVal;
        const mx = vb.x + ((cx - rect.left) / rect.width)  * vb.width;
        const my = vb.y + ((cy - rect.top)  / rect.height) * vb.height;

        const factor = pinch.dist / newDist;
        const newW = Math.max(2, Math.min(BW, vb.width  * factor));
        const newH = Math.max(1, Math.min(BH, vb.height * factor));
        const rawX = mx - (mx - vb.x) * (newW / vb.width);
        const rawY = my - (my - vb.y) * (newH / vb.height);
        const [nX, nY] = this._clamp(rawX, rawY, newW, newH);
        queueVB(nX, nY, newW, newH);

        pinch = { dist: newDist };
      }
    }, { passive: false });

    svg.addEventListener('touchend', e => {
      if (e.touches.length === 0) { lastTouch = null; pinch = null; }
      else if (e.touches.length === 1) {
        lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        pinch = null;
      }
    });

    svg.addEventListener('wheel', e => {
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      const vb   = pendingVB ?? svg.viewBox.baseVal;
      const mx = vb.x + ((e.clientX - rect.left) / rect.width)  * vb.width;
      const my = vb.y + ((e.clientY - rect.top)  / rect.height) * vb.height;
      const { w: BW, h: BH } = FlatMapRenderer.BOUNDS;
      const factor = e.deltaY > 0 ? 1.15 : 1 / 1.15;
      const newW = Math.max(2, Math.min(BW, vb.width  * factor));
      const newH = Math.max(1, Math.min(BH, vb.height * factor));
      const rawX = mx - (mx - vb.x) * (newW / vb.width);
      const rawY = my - (my - vb.y) * (newH / vb.height);
      const [newX, newY] = this._clamp(rawX, rawY, newW, newH);
      queueVB(newX, newY, newW, newH);
    }, { passive: false });
  }

  _clamp(x, y, w, h) {
    const { x: bx, y: by, w: bw, h: bh } = FlatMapRenderer.BOUNDS;
    const cx = w >= bw ? bx + (bw - w) / 2 : Math.max(bx, Math.min(bx + bw - w, x));
    const cy = h >= bh ? by + (bh - h) / 2 : Math.max(by, Math.min(by + bh - h, y));
    return [cx, cy];
  }

  _panInViewBox(dx, dy) {
    const vb = this._svg.viewBox.baseVal;
    const [nx, ny] = this._clamp(vb.x + dx, vb.y + dy, vb.width, vb.height);
    this._svg.setAttribute('viewBox',
      `${nx.toFixed(3)} ${ny.toFixed(3)} ${vb.width.toFixed(3)} ${vb.height.toFixed(3)}`
    );
  }

  _applyTransform() {
    // Pan/zoom handled via viewBox; no transform needed
  }

  resetView(names = null) {
    const { x: bx, y: by, w: bw, h: bh } = FlatMapRenderer.BOUNDS;
    let sumX = 0, sumY = 0, count = 0;
    for (const [name, path] of this._paths.entries()) {
      const include = names ? names.includes(name) : path.style.display !== 'none';
      if (!include) continue;
      try {
        const bb = path.getBBox();
        if (!bb || bb.width === 0) continue;
        sumX += bb.x + bb.width / 2;
        sumY += bb.y + bb.height / 2;
        count++;
      } catch { /* ignore */ }
    }

    if (count > 0) {
      const cx = sumX / count;
      const cy = sumY / count;
      const hw = bw / (2 * 3);
      const hh = bh / (2 * 3);
      const [nx, ny] = this._clamp(cx - hw, cy - hh, hw * 2, hh * 2);
      this._svg.setAttribute('viewBox', `${nx} ${ny} ${hw * 2} ${hh * 2}`);
    } else {
      this._svg.setAttribute('viewBox', `${bx} ${by} ${bw} ${bh}`);
    }
  }

  dispose() {
    this._svg.remove();
    this._tooltip?.remove();
  }
}
