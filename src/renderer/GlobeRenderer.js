import * as THREE from 'three';
import { feature } from 'topojson-client';

const RADIUS = 2;
const ATMOSPHERE_RADIUS = 2.08;
const STAR_COUNT = 2000;
const DEG = Math.PI / 180;

const COLORS = {
  ocean:              0x04080f,
  starter:            0x0a2e1e,
  strokeStarter:      0x3de8a0,
  placed:             0x0a1e2e,
  strokePlaced:       0x1e4a6e,
  starterAmber:       0x2e1a00,
  strokeStarterAmber: 0xf7b731,
  oceanLight:         0xccd8e8,
  placedLight:        0xd0dce8,
  strokePlacedLight:  0x6090c0,
};

// Convert geographic lon/lat → 3-D point on sphere surface
// Convention: Y = north pole, prime meridian (lon 0) = +Z, lon 90°E = +X
function lonLatToXYZ(lon, lat, r = RADIUS + 0.002) {
  const phi   = (90 - lat) * DEG;   // colatitude, 0 = north pole
  const theta = lon * DEG;
  return new THREE.Vector3(
     r * Math.sin(phi) * Math.sin(theta),  // X: east
     r * Math.cos(phi),                     // Y: north
     r * Math.sin(phi) * Math.cos(theta),  // Z: prime meridian
  );
}


export class GlobeRenderer {
  constructor(canvas) {
    this._canvas    = canvas;
    this._scene     = null;
    this._camera    = null;
    this._renderer  = null;
    this._pivot     = null;
    this._atmosphere = null;
    this._globe     = null;
    this._countryMeshes = new Map();
    this._riverLines    = [];
    this._animFrameId   = null;

    this._isDragging  = false;
    this._prevMouse   = { x: 0, y: 0 };
    this._autoRotate  = true;
    this._theme       = 'dark';

    // Yaw/pitch rotation state (degrees). Roll is always 0.
    this._yaw   = 0;   // longitude spin, unbounded
    this._pitch = 0;   // latitude tilt, clamped ±30°
    this._vyaw  = 0;   // inertia velocity (deg/frame)
    this._vpitch = 0;

    this._init();
  }

  // ── Setup ─────────────────────────────────────────────────────────────────

  _init() {
    const w = this._canvas.clientWidth  || 800;
    const h = this._canvas.clientHeight || 600;

    this._renderer = new THREE.WebGLRenderer({ canvas: this._canvas, antialias: true, alpha: true });
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this._renderer.setSize(w, h);

    this._scene = new THREE.Scene();

    this._camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    this._camera.position.z = 5.5;

    this._scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const sun = new THREE.DirectionalLight(0xffffff, 1.0);
    sun.position.set(5, 3, 5);
    this._scene.add(sun);

    this._buildStars();
    this._buildAtmosphere();

    // Everything geographic lives inside this single pivot group
    this._pivot = new THREE.Group();
    this._pivot.rotation.order = 'YXZ';
    this._scene.add(this._pivot);

    // Ocean sphere
    this._globe = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 64, 64),
      new THREE.MeshPhongMaterial({ color: COLORS.ocean, shininess: 30 }),
    );
    this._pivot.add(this._globe);

    // Reference lines (equator + poles) — always visible, inside pivot
    this._buildReferenceLines();

    this._bindEvents();
    new ResizeObserver(() => this._onResize()).observe(this._canvas.parentElement);
    this._animate();
  }

  _buildStars() {
    const pos = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 40 + Math.random() * 20;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this._scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x8899bb, size: 0.12, sizeAttenuation: true })));
  }

  _buildAtmosphere() {
    this._atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(ATMOSPHERE_RADIUS, 32, 32),
      new THREE.MeshPhongMaterial({ color: 0x0a1f3e, transparent: true, opacity: 0.18, side: THREE.BackSide }),
    );
    this._scene.add(this._atmosphere);
  }

  _buildReferenceLines() {
    const SEGS = 128;

    // ── Equator ──
    const eqPts = [];
    for (let i = 0; i <= SEGS; i++) {
      const lon = (i / SEGS) * 360 - 180;
      eqPts.push(lonLatToXYZ(lon, 0, RADIUS + 0.004));
    }
    const eqGeo = new THREE.BufferGeometry().setFromPoints(eqPts);
    const eqMat = new THREE.LineBasicMaterial({ color: 0x1a4060, transparent: true, opacity: 0.7 });
    this._pivot.add(new THREE.Line(eqGeo, eqMat));

    // ── North pole dot ──
    const npDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x3de8a0 }),
    );
    npDot.position.copy(lonLatToXYZ(0, 90, RADIUS + 0.01));
    this._pivot.add(npDot);

    // "N" label – tiny sprite using canvas texture
    this._pivot.add(this._makeTextSprite('N', lonLatToXYZ(0, 90, RADIUS + 0.28), 0x3de8a0));

    // ── South pole dot ──
    const spDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x4a90d9 }),
    );
    spDot.position.copy(lonLatToXYZ(0, -90, RADIUS + 0.01));
    this._pivot.add(spDot);

    this._pivot.add(this._makeTextSprite('S', lonLatToXYZ(0, -90, RADIUS + 0.28), 0x4a90d9));
  }

  _makeTextSprite(text, position, color) {
    const size  = 128;
    const cv    = document.createElement('canvas');
    cv.width    = size;
    cv.height   = size;
    const ctx   = cv.getContext('2d');
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    ctx.font      = `bold ${size * 0.7}px "Bebas Neue", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, size / 2, size / 2);

    const tex     = new THREE.CanvasTexture(cv);
    const mat     = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    const sprite  = new THREE.Sprite(mat);
    sprite.scale.set(0.35, 0.35, 1);
    sprite.position.copy(position);
    return sprite;
  }

  // ── TopoJSON loading ──────────────────────────────────────────────────────

  async loadWorld(topoData, countryNames) {
    for (const { fill, line } of this._countryMeshes.values()) {
      this._pivot.remove(fill);
      this._pivot.remove(line);
    }
    this._countryMeshes.clear();

    const { features } = feature(topoData, topoData.objects.countries);
    for (const f of features) {
      const name = this._matchName(f.properties?.name ?? '', countryNames);
      if (name) this._buildCountryMesh(f, name);
    }

    this._renderer.render(this._scene, this._camera);
  }

  _matchName(raw, names) {
    // Explicit overrides: canonical game name → TopoJSON name
    const TOPO_MAP = {
      'democratic republic of the congo': 'Dem. Rep. Congo',
      'republic of the congo':            'Congo',
      'central african republic':         'Central African Rep.',
      'north macedonia':                  'Macedonia',
      'south sudan':                      'S. Sudan',
      'western sahara':                   'W. Sahara',
      'cape verde':                       'Cabo Verde',
      'eswatini':                         'eSwatini',
      'czech republic':                   'Czechia',
      'united states':                    'United States of America',
      'french guiana':                    null, // not in 50m topo
      'equatorial guinea':                'Eq. Guinea',
      'guinea-bissau':                    'Guinea-Bissau',
      'trinidad and tobago':              'Trinidad and Tobago',
      'sao tome and principe':            'São Tomé and Principe',
      'são tomé and príncipe':            'São Tomé and Principe',
      'dominican republic':               'Dominican Rep.',
      'bosnia and herzegovina':           'Bosnia and Herz.',
      'timor-leste':                      'Timor-Leste',
      'marshall islands':                 'Marshall Is.',
      'solomon islands':                  'Solomon Is.',
      "cote d'ivoire":                    "Côte d'Ivoire",
    };

    const key = raw.toLowerCase().trim();
    if (key in TOPO_MAP) {
      const mapped = TOPO_MAP[key];
      if (mapped === null) return null;
      return names.has ? (names.has(mapped) ? mapped : null) : (names.includes(mapped) ? mapped : null);
    }

    // Exact match first
    const nameArr = names.has ? [...names] : names;
    for (const cn of nameArr) if (cn.toLowerCase() === key) return cn;
    return null;
  }

  _buildCountryMesh(feat, name) {
    const shapes = this._featureToShapes(feat);
    if (!shapes.length) return;

    const fillGroup = new THREE.Group();
    const lineGroup = new THREE.Group();

    for (const pts of shapes) {
      const mesh = this._buildSphereMesh(pts, COLORS.placed);
      if (mesh) fillGroup.add(mesh);

      const verts = new Float32Array(pts.length * 3);
      pts.forEach((p, i) => { verts[i * 3] = p.x; verts[i * 3 + 1] = p.y; verts[i * 3 + 2] = p.z; });
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
      lineGroup.add(new THREE.LineLoop(geo, new THREE.LineBasicMaterial({ color: COLORS.strokePlaced })));
    }

    fillGroup.visible = false;
    lineGroup.visible = false;
    this._pivot.add(fillGroup, lineGroup);
    this._countryMeshes.set(name, { fill: fillGroup, line: lineGroup, feature: feat });
  }

  _buildSphereMesh(pts, color) {
    if (pts.length < 3) return null;
    let cx = 0, cy = 0, cz = 0;
    for (const p of pts) { cx += p.x; cy += p.y; cz += p.z; }
    cx /= pts.length; cy /= pts.length; cz /= pts.length;

    const verts = [];
    const n = pts.length;
    for (let i = 0; i < n; i++) {
      const nx = pts[(i + 1) % n];
      verts.push(cx, cy, cz, pts[i].x, pts[i].y, pts[i].z, nx.x, nx.y, nx.z);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3));
    geo.computeVertexNormals();
    return new THREE.Mesh(geo, new THREE.MeshPhongMaterial({ color, side: THREE.DoubleSide, shininess: 10 }));
  }

  // ── Coordinate helpers ────────────────────────────────────────────────────

  _featureToShapes(feat) {
    const shapes = [];
    const geom   = feat.geometry;
    if (!geom) return shapes;

    const processRing = ring => {
      const lons = ring.map(([lo]) => lo);
      if (Math.max(...lons) - Math.min(...lons) > 270) return null;
      return ring.map(([lo, la]) => lonLatToXYZ(lo, la));
    };

    if (geom.type === 'Polygon') {
      const pts = processRing(geom.coordinates[0]);
      if (pts) shapes.push(pts);
    } else if (geom.type === 'MultiPolygon') {
      const areas   = geom.coordinates.map(p => this._ringArea(p[0]));
      const maxArea = Math.max(...areas);
      geom.coordinates.forEach((poly, i) => {
        if (areas[i] < maxArea * 0.01) return;
        const pts = processRing(poly[0]);
        if (pts) shapes.push(pts);
      });
    }
    return shapes;
  }

  _ringArea(ring) {
    let a = 0;
    for (let i = 0; i < ring.length - 1; i++)
      a += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
    return Math.abs(a) / 2;
  }

  // ── Country status ────────────────────────────────────────────────────────

  setCountryStatus(name, status) {
    const d = this._countryMeshes.get(name);
    if (!d) return;

    const visible = status !== 'unplaced';
    d.fill.visible = visible;
    d.line.visible = visible;
    if (!visible) return;

    const fc = this._fillColor(status);
    const lc = this._strokeColor(status);
    d.fill.children.forEach(m => m.material?.color.setHex(fc));
    d.line.children.forEach(l => l.material?.color.setHex(lc));
  }

  _fillColor(s) {
    if (this._theme === 'light') return s === 'starter' ? 0xc8f0e0 : COLORS.placedLight;
    if (s === 'starter')        return COLORS.starter;
    if (s === 'starter-amber')  return COLORS.starterAmber;
    return COLORS.placed;
  }

  _strokeColor(s) {
    if (this._theme === 'light') return s === 'starter' ? 0x18a870 : COLORS.strokePlacedLight;
    if (s === 'starter')        return COLORS.strokeStarter;
    if (s === 'starter-amber')  return COLORS.strokeStarterAmber;
    return COLORS.strokePlaced;
  }

  // ── View reset ────────────────────────────────────────────────────────────

  // Compute centroid [lon, lat] of a feature using 3D vector mean (antimeridian-safe)
  _featureCentroid(feat) {
    if (!feat?.geometry) return null;
    const geom = feat.geometry;
    const candidates = geom.type === 'Polygon'
      ? [geom.coordinates[0]]
      : geom.type === 'MultiPolygon'
        ? geom.coordinates.map(p => p[0])
        : [];
    if (!candidates.length) return null;

    // Pick the ring with the largest 2D lon/lat area as the "main" polygon
    let bestRing = candidates[0], bestArea = -1;
    for (const ring of candidates) {
      const area = this._ringArea(ring);
      if (area > bestArea) { bestArea = area; bestRing = ring; }
    }

    // 3D vector mean — handles antimeridian wrap correctly
    let sx = 0, sy = 0, sz = 0;
    for (const [lo, la] of bestRing) {
      const phi = (90 - la) * DEG;
      const theta = lo * DEG;
      sx += Math.sin(phi) * Math.sin(theta);
      sy += Math.cos(phi);
      sz += Math.sin(phi) * Math.cos(theta);
    }
    const len = Math.sqrt(sx*sx + sy*sy + sz*sz);
    if (len < 1e-10) return null;
    sx /= len; sy /= len; sz /= len;
    const meanLon = Math.atan2(sx, sz) / DEG;
    const meanLat = 90 - Math.acos(Math.max(-1, Math.min(1, sy))) / DEG;
    return [meanLon, meanLat];
  }

  resetView(names = null) {
    const lons = [], lats = [];
    for (const [name, { fill, feature: feat }] of this._countryMeshes.entries()) {
      const include = names ? names.includes(name) : fill.visible;
      if (!include) continue;
      const c = this._featureCentroid(feat);
      if (c) { lons.push(c[0]); lats.push(c[1]); }
    }

    let targetYaw = 0, targetPitch = 0;
    if (lons.length) {
      const sinSum = lons.reduce((s, lo) => s + Math.sin(lo * DEG), 0);
      const cosSum = lons.reduce((s, lo) => s + Math.cos(lo * DEG), 0);
      targetYaw   = Math.atan2(sinSum, cosSum) / DEG;
      targetPitch = lats.reduce((s, la) => s + la, 0) / lats.length;
    }

    const delta = ((targetYaw - this._yaw) % 360 + 540) % 360 - 180;
    this._yaw    += delta;
    this._pitch   = Math.max(-30, Math.min(30, targetPitch));
    // Reset camera to default position so the full globe is visible
    this._camera.position.set(0, 0, 5.5);
    this._vyaw    = 0;
    this._vpitch  = 0;
    this._autoRotate = false;
  }

  // ── River lines ───────────────────────────────────────────────────────────

  setRiverLine(coords, color = 0x00aaff, opacity = 0.9) {
    this.clearRiverLines();
    if (!coords?.length) return;
    const pts = coords.map(([lo, la]) => lonLatToXYZ(lo, la));
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color, opacity, transparent: true }));
    this._pivot.add(line);
    this._riverLines.push(line);
  }

  clearRiverLines() {
    this._riverLines.forEach(l => this._pivot.remove(l));
    this._riverLines = [];
  }

  setRiverLinesVisible(v) { this._riverLines.forEach(l => l.visible = v); }

  // ── Rotation ──────────────────────────────────────────────────────────────

  // ── Trackball helpers ─────────────────────────────────────────────────────

  // ── Events ────────────────────────────────────────────────────────────────

  _bindEvents() {
    const canvas = this._canvas;
    // Scale drag pixels → degrees. At default zoom (z=5.5) one canvas-width ≈ 180°.
    const SENS = 0.35;

    const applyDrag = (dx, dy) => {
      this._vyaw   = -dx * SENS;
      this._vpitch =  dy * SENS;
      this._yaw   += this._vyaw;
      this._pitch  = Math.max(-30, Math.min(30, this._pitch + this._vpitch));
    };

    canvas.addEventListener('mousedown', e => {
      this._isDragging = true;
      this._prevMouse  = { x: e.clientX, y: e.clientY };
      this._autoRotate = false;
      this._vyaw = this._vpitch = 0;
    });

    window.addEventListener('mousemove', e => {
      if (!this._isDragging) return;
      const dx = e.clientX - this._prevMouse.x;
      const dy = e.clientY - this._prevMouse.y;
      this._prevMouse = { x: e.clientX, y: e.clientY };
      applyDrag(dx, dy);
    });

    window.addEventListener('mouseup', () => { this._isDragging = false; });

    canvas.addEventListener('wheel', e => {
      e.preventDefault();
      const rect  = canvas.getBoundingClientRect();
      const ndcX  = ((e.clientX - rect.left)  / rect.width)  * 2 - 1;
      const ndcY  = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const ray = new THREE.Ray();
      ray.origin.copy(this._camera.position);
      ray.direction.set(ndcX, ndcY, 0.5).unproject(this._camera).sub(this._camera.position).normalize();

      const sphere   = new THREE.Sphere(new THREE.Vector3(0, 0, 0), RADIUS);
      const hitPoint = new THREE.Vector3();
      const hit      = ray.intersectSphere(sphere, hitPoint);

      const oldZ = this._camera.position.z;
      const newZ = Math.max(1.5, Math.min(10, oldZ + e.deltaY * 0.008));
      if (hit) {
        const ratio = 1 - newZ / oldZ;
        this._camera.position.x += hitPoint.x * ratio;
        this._camera.position.y += hitPoint.y * ratio;
      }
      this._camera.position.z = newZ;
    }, { passive: false });

    let lastTouch = null;
    canvas.addEventListener('touchstart', e => {
      if (e.touches.length !== 1) return;
      lastTouch        = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      this._autoRotate = false;
      this._vyaw = this._vpitch = 0;
    });
    canvas.addEventListener('touchmove', e => {
      if (e.touches.length !== 1 || !lastTouch) return;
      const dx = e.touches[0].clientX - lastTouch.x;
      const dy = e.touches[0].clientY - lastTouch.y;
      lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      applyDrag(dx, dy);
    });
  }

  _onResize() {
    const w = this._canvas.clientWidth;
    const h = this._canvas.clientHeight;
    if (!w || !h) return;
    this._renderer.setSize(w, h);
    this._camera.aspect = w / h;
    this._camera.updateProjectionMatrix();
  }

  // ── Animation loop ────────────────────────────────────────────────────────

  _animate() {
    this._animFrameId = requestAnimationFrame(() => this._animate());

    if (this._autoRotate) {
      this._yaw -= 0.08;
    } else if (!this._isDragging) {
      // Inertia: velocity decays by 5% each frame
      this._vyaw   *= 0.92;
      this._vpitch *= 0.92;
      this._yaw   += this._vyaw;
      this._pitch  = Math.max(-30, Math.min(30, this._pitch + this._vpitch));
    }

    // Rebuild pivot from yaw+pitch — Z is always 0, roll is impossible
    this._pivot.rotation.x = this._pitch * DEG;
    this._pivot.rotation.y = -this._yaw * DEG;
    this._pivot.rotation.z = 0;

    this._renderer.render(this._scene, this._camera);
  }

  // ── Theme ─────────────────────────────────────────────────────────────────

  setTheme(theme) {
    this._theme = theme;
    this._globe.material.color.setHex(theme === 'light' ? COLORS.oceanLight : COLORS.ocean);
    this._atmosphere.material.color.setHex(theme === 'light' ? 0xd0e4f8 : 0x0a1f3e);
  }

  dispose() {
    cancelAnimationFrame(this._animFrameId);
    this._renderer.dispose();
  }
}
