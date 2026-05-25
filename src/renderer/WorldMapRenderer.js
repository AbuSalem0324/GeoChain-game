import { feature, merge } from 'topojson-client';
import { geoPath, geoNaturalEarth1 } from 'd3-geo';

// Projected viewBox: d3-geo's geoNaturalEarth1 fits to (VW, VH) pixel space.
// All path strings, river coords and pan/zoom math live in this same space.
const VW = 1000;
const VH = 500;

const COLORS = {
  ocean:          '#04080f',
  unplaced:       '#0d1a2e',
  strokeUnplaced: '#1a2e4a',
  starter:        '#0a2e1e',
  strokeStarter:  '#3de8a0',
  placed:         '#0a2a28',
  strokePlaced:   '#3de8a0',
};

const COLORS_LIGHT = {
  ocean:          '#ccd8e8',
  unplaced:       '#e0e8f0',
  strokeUnplaced: '#b0c4d8',
  starter:        '#7fd9b3',   // saturated mint — strongest fill
  strokeStarter:  '#0f7a4f',
  placed:         '#b8e8d2',   // softer mint — clearly green but lighter than starter
  strokePlaced:   '#18a870',
};

export class WorldMapRenderer {
  constructor(container) {
    this._container = container;
    this._svg       = null;
    this._paths     = new Map(); // name → <path>
    this._theme     = 'dark';
    this._riverGroup = null;
    this._countriesGroup = null;
    this._tooltipMode = 'none'; // 'none' | 'placed' | 'all'
    this._tooltip = null;

    // Projection: d3-geo handles antimeridian clipping internally.
    this._projection = geoNaturalEarth1().fitSize([VW, VH], { type: 'Sphere' });
    this._geoPath    = geoPath(this._projection);

    // Pan/zoom state in viewBox space
    this._panX  = 0;
    this._panY  = 0;
    this._scale = 1;
    this._dragging = false;
    this._startPan = { x: 0, y: 0 };

    this._buildSVG();
    this._buildTooltip();
    this._bindEvents();
  }

  _buildTooltip() {
    this._tooltip = document.createElement('div');
    this._tooltip.className = 'map-tooltip';
    this._tooltip.style.display = 'none';
    this._container.style.position = 'relative';
    // Must be on the container (not just the svg) — otherwise the browser
    // may commit to page scrolling on the first touchmove, after which our
    // preventDefault is ignored ("cancelable=false" warning) and pinch
    // input degrades unpredictably.
    this._container.style.touchAction = 'none';
    this._container.appendChild(this._tooltip);
  }

  setTooltipMode(mode) { // 'none' | 'placed' | 'all'
    this._tooltipMode = mode;
    if (mode === 'none') this._tooltip.style.display = 'none';
  }

  setStarterMystery(on) { this._starterMystery = !!on; }

  _attachTooltip(el, name) {
    el.addEventListener('mouseenter', (e) => {
      const mode = this._tooltipMode;
      if (mode === 'none') return;
      if (mode === 'placed') {
        const isIsland = el.dataset.island !== undefined;
        const isPlaced = el.dataset.status === 'placed' || el.dataset.status === 'starter';
        if (!isIsland && !isPlaced) return;
      }
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
    const x = e.clientX - rect.left + 12;
    const y = e.clientY - rect.top - 28;
    this._tooltip.style.left = `${x}px`;
    this._tooltip.style.top  = `${y}px`;
  }

  _buildSVG() {
    this._svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this._svg.setAttribute('viewBox', `0 0 ${VW} ${VH}`);
    this._svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    this._svg.style.cssText = 'width:100%;height:100%;display:block;cursor:grab;';

    this._viewGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this._svg.appendChild(this._viewGroup);

    // Ocean background
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('x', '0');
    bg.setAttribute('y', '0');
    bg.setAttribute('width', String(VW));
    bg.setAttribute('height', String(VH));
    bg.setAttribute('fill', this._c('ocean'));
    bg.setAttribute('id', 'ocean-bg');
    this._viewGroup.appendChild(bg);

    this._countriesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this._viewGroup.appendChild(this._countriesGroup);

    this._riverGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this._viewGroup.appendChild(this._riverGroup);

    // Map border drawn on top
    const border = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    border.setAttribute('x', '0');
    border.setAttribute('y', '0');
    border.setAttribute('width', String(VW));
    border.setAttribute('height', String(VH));
    border.setAttribute('fill', 'none');
    border.setAttribute('stroke', '#2a3f5f');
    border.setAttribute('stroke-width', '2');
    border.setAttribute('id', 'map-border');
    border.setAttribute('pointer-events', 'none');
    this._viewGroup.appendChild(border);

    this._container.appendChild(this._svg);
  }

  _c(key) {
    return (this._theme === 'light' ? COLORS_LIGHT : COLORS)[key] ?? '#888';
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  // Island territories to extract from parent country geometry, keyed by TopoJSON country name
  static get _ISLAND_EXTRACTIONS() {
    return {
      'Norway': [
        { key: 'Svalbard',  box: { lonMin: 10,  latMin: 74, lonMax: 35,  latMax: 81 } },
        { key: 'Jan Mayen', box: { lonMin: -10, latMin: 70, lonMax: -6,  latMax: 72 } },
      ],
      'Yemen': [
        { key: 'Socotra',   box: { lonMin: 51,  latMin: 11, lonMax: 55,  latMax: 13 } },
      ],
      'Russia': [
        { key: 'Kaliningrad',  box: { lonMin: 19, latMin: 54, lonMax: 23, latMax: 56 } },
        { key: 'Sakhalin',     box: { lonMin: 141, latMin: 46, lonMax: 145, latMax: 55 } },
        { key: 'Kuril Islands',box: { lonMin: 145, latMin: 43, lonMax: 157, latMax: 51 } },
      ],
      'Spain': [
        { key: 'Canary Islands', box: { lonMin: -18, latMin: 27, lonMax: -13, latMax: 30 } },
      ],
      'Portugal': [
        { key: 'Azores',   box: { lonMin: -31, latMin: 36, lonMax: -24, latMax: 40 } },
        { key: 'Madeira',  box: { lonMin: -17, latMin: 32, lonMax: -16, latMax: 33 } },
      ],
      'Japan': [
        { key: 'Okinawa', box: { lonMin: 122, latMin: 24, lonMax: 130, latMax: 28 } },
      ],
      'New Zealand': [
        { key: 'Chatham Islands', box: { lonMin: -177, latMin: -45, lonMax: -175, latMax: -43 } },
      ],
    };
  }

  static get _ISLAND_LABELS() {
    return {
      // Norway
      'Svalbard':            'Svalbard (Norway)',
      'Jan Mayen':           'Jan Mayen (Norway)',
      // Portugal
      'Azores':              'Azores (Portugal)',
      'Madeira':             'Madeira (Portugal)',
      // Spain
      'Canary Islands':      'Canary Islands (Spain)',
      // United States
      'Hawaii':              'Hawaii (United States)',
      'Aleutian Islands':    'Aleutian Islands (United States)',
      // Japan
      'Okinawa':             'Okinawa (Japan)',
      'Ogasawara Islands':   'Ogasawara Islands (Japan)',
      // Russia
      'Kuril Islands':       'Kuril Islands (Russia)',
      'Sakhalin':            'Sakhalin (Russia)',
      // Yemen
      'Socotra':             'Socotra (Yemen)',
      // New Zealand
      'Chatham Islands':     'Chatham Islands (New Zealand)',
      // France
      'French Guiana':       'French Guiana (France)',
      'Martinique':          'Martinique (France)',
      'Guadeloupe':          'Guadeloupe (France)',
      'Réunion':             'Réunion (France)',
      'Mayotte':             'Mayotte (France)',
      'New Caledonia':       'New Caledonia (France)',
      'French Polynesia':    'French Polynesia (France)',
      // Denmark
      'Greenland':           'Greenland (Denmark)',
      'Faroe Islands':       'Faroe Islands (Denmark)',
      // United Kingdom
      'Falkland Islands':    'Falkland Islands (United Kingdom)',
      // Australia
      'Tasmania':            'Tasmania (Australia)',
    };
  }

  // Appends a decorative island path — visible always, not part of game logic
  _appendIslandPath(key, feat) {
    const d = this._geoPath(feat);
    if (!d) return;
    const label = WorldMapRenderer._ISLAND_LABELS[key] ?? key;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'rgba(0,0,0,0.01)'); // near-transparent so pointer-events work
    path.setAttribute('stroke', 'none');
    path.setAttribute('stroke-width', '0.4');
    path.setAttribute('data-island', key);
    path.setAttribute('pointer-events', 'all');
    path.style.display = 'block';
    path.style.transition = 'fill 0.2s, stroke 0.2s';
    this._countriesGroup.appendChild(path);
    this._islandPaths = this._islandPaths ?? new Map();
    this._islandPaths.set(key, path);
    this._attachTooltip(path, label);
  }

  _appendPath(name, d) {
    if (!d) return;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'none');
    path.setAttribute('stroke-width', '0.4');
    path.setAttribute('data-name', name);
    path.style.display = 'none';
    path.style.transition = 'fill 0.2s, stroke 0.2s';
    this._countriesGroup.appendChild(path);
    this._paths.set(name, path);
    const label = WorldMapRenderer._ISLAND_LABELS[name] ?? name;
    this._attachTooltip(path, label);
  }

  // Return a synthetic GeoJSON feature containing only polygons from feat
  // whose centroid falls inside the given bounding box.
  _extractPolygons(feat, box) {
    if (feat.geometry?.type !== 'MultiPolygon') return null;
    const polys = feat.geometry.coordinates.filter(poly => {
      const ring = poly[0];
      if (!ring?.length) return false;
      let sLon = 0, sLat = 0;
      for (const [lon, lat] of ring) { sLon += lon; sLat += lat; }
      const cLon = sLon / ring.length, cLat = sLat / ring.length;
      return cLon >= box.lonMin && cLon <= box.lonMax && cLat >= box.latMin && cLat <= box.latMax;
    });
    if (!polys.length) return null;
    return { type: 'Feature', geometry: { type: 'MultiPolygon', coordinates: polys }, properties: {} };
  }

  // ── Overseas territory filter ─────────────────────────────────────────────
  // Per-country bounding boxes: only polygons whose centroid falls inside the
  // box are rendered. Keeps mainland + nearby/notable islands, drops far-flung
  // territories that would appear as distracting dots far from the country body.
  // Norway/Denmark/Spain/UK/Colombia/Mexico need no filter — all their polygons
  // are already within a sensible depiction area.
  static get _RENDER_BOXES() {
    return {
      'France':        { lonMin: -10,  latMin: 40,  lonMax:  12,  latMax: 52  }, // metro + Corsica
      'Netherlands':   { lonMin:   3,  latMin: 50,  lonMax:   8,  latMax: 54  }, // mainland only
      'Portugal':      { lonMin: -32,  latMin: 30,  lonMax:  -6,  latMax: 42  }, // mainland + Madeira + Azores
      'Australia':     { lonMin: 112,  latMin: -54, lonMax: 158,  latMax: -10 }, // mainland + Tasmania; drops Heard Is.
      'Chile':         { lonMin: -76,  latMin: -56, lonMax: -65,  latMax: -17 }, // mainland; drops Easter Island
      'New Zealand':   { lonMin: 165,  latMin: -54, lonMax: -171, latMax: -33 }, // main islands + Chathams; drops Tokelau
      'Ecuador':       { lonMin: -92,  latMin:  -6, lonMax: -74,  latMax:  2  }, // mainland + Galápagos
      'United States': { lonMin:-180,  latMin:  18, lonMax: -65,  latMax: 72  }, // lower 48 + Alaska + Hawaii
    };
  }

  _trimOverseas(name, feat) {
    const box = WorldMapRenderer._RENDER_BOXES[name];
    if (!box || feat.geometry?.type !== 'MultiPolygon') return feat;

    const filtered = feat.geometry.coordinates.filter(poly => {
      const ring = poly[0];
      if (!ring?.length) return false;
      let sLon = 0, sLat = 0;
      for (const [lon, lat] of ring) { sLon += lon; sLat += lat; }
      const cLon = sLon / ring.length;
      const cLat = sLat / ring.length;
      // New Zealand box wraps the antimeridian: lonMin > lonMax
      const lonOk = box.lonMin <= box.lonMax
        ? cLon >= box.lonMin && cLon <= box.lonMax
        : cLon >= box.lonMin || cLon <= box.lonMax;
      return lonOk && cLat >= box.latMin && cLat <= box.latMax;
    });

    return { ...feat, geometry: { ...feat.geometry, coordinates: filtered } };
  }

  // ── Loading ───────────────────────────────────────────────────────────────

  async loadWorld(topoData, countryNames) {
    const { features } = feature(topoData, topoData.objects.countries);

    this._countriesGroup.innerHTML = '';
    this._paths.clear();

    // Topologically merge Somaliland into Somalia, dissolving the shared border.
    const somaliaGeoms = topoData.objects.countries.geometries
      .filter(g => g.properties?.name === 'Somalia' || g.properties?.name === 'Somaliland');
    const mergedSomalia = somaliaGeoms.length === 2
      ? merge(topoData, somaliaGeoms)
      : null;

    // Move Crimea (Russia poly 98, centroid ~34.6°E 45.3°N) from Russia to Ukraine.
    // We do this at the GeoJSON level: strip the polygon from Russia's coords and
    // append it to Ukraine's coords before rendering.
    const CRIMEA_BOX = { lonMin: 32, lonMax: 37, latMin: 44, latMax: 47 };
    const isCrimea = poly => {
      const ring = poly[0]; if (!ring?.length) return false;
      let sLon = 0, sLat = 0;
      for (const [lon, lat] of ring) { sLon += lon; sLat += lat; }
      const cLon = sLon / ring.length, cLat = sLat / ring.length;
      return cLon >= CRIMEA_BOX.lonMin && cLon <= CRIMEA_BOX.lonMax &&
             cLat >= CRIMEA_BOX.latMin && cLat <= CRIMEA_BOX.latMax;
    };

    // Build modified feature map
    const featureMap = new Map(features.map(f => [f.properties?.name ?? '', f]));

    const russiaF  = featureMap.get('Russia');
    const ukraineF = featureMap.get('Ukraine');
    if (russiaF && ukraineF) {
      const russiaPolys  = russiaF.geometry.type  === 'MultiPolygon' ? russiaF.geometry.coordinates  : [russiaF.geometry.coordinates];
      const ukrainePolys = ukraineF.geometry.type === 'MultiPolygon' ? ukraineF.geometry.coordinates : [ukraineF.geometry.coordinates];
      const crimeaPolys  = russiaPolys.filter(isCrimea);
      const russiaRest   = russiaPolys.filter(p => !isCrimea(p));
      featureMap.set('Russia',  { ...russiaF,  geometry: { type: 'MultiPolygon', coordinates: russiaRest } });
      featureMap.set('Ukraine', { ...ukraineF, geometry: { type: 'MultiPolygon', coordinates: [...ukrainePolys, ...crimeaPolys] } });
    }

    for (const f of featureMap.values()) {
      const raw  = f.properties?.name ?? '';
      if (raw === 'Somaliland') continue; // dissolved into Somalia

      const name = this._matchName(raw, countryNames);
      if (!name) continue;

      // French Guiana shares France's TopoJSON feature — extract it before trimming France.
      if (raw === 'France' && countryNames.includes('French Guiana')) {
        const fgFeat = this._extractPolygons(f, { lonMin: -55, latMin: 1, lonMax: -50, latMax: 7 });
        if (fgFeat) this._appendPath('French Guiana', this._geoPath(fgFeat));
      }

      // Extract island territories as separate labelled paths
      const islandExtractions = WorldMapRenderer._ISLAND_EXTRACTIONS[raw] ?? [];
      for (const { key, box } of islandExtractions) {
        const feat = this._extractPolygons(f, box);
        if (feat) this._appendIslandPath(key, feat);
      }

      const geomFeat = (raw === 'Somalia' && mergedSomalia)
        ? { ...f, geometry: mergedSomalia }
        : f;
      this._appendPath(name, this._geoPath(this._trimOverseas(name, geomFeat)));
    }

    // Micro-states — always use a dot marker (polygons in 50m TopoJSON are too small to see)
    const dotCountries = [
      { name: 'Vatican City',  lon: 12.4533, lat: 41.9033 },
      { name: 'San Marino',    lon: 12.4578, lat: 43.9424 },
      { name: 'Liechtenstein', lon:  9.5553, lat: 47.1660 },
      { name: 'Monaco',        lon:  7.4246, lat: 43.7384 },
    ];
    for (const { name, lon, lat } of dotCountries) {
      if (!countryNames.includes(name)) continue;
      if (this._paths.has(name)) {
        this._paths.get(name).remove();
        this._paths.delete(name);
      }
      const [cx, cy] = this._projection([lon, lat]);
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', cx.toFixed(2));
      dot.setAttribute('cy', cy.toFixed(2));
      dot.setAttribute('r', '0.5');
      dot.setAttribute('fill', 'none');
      dot.setAttribute('stroke', 'none');
      dot.setAttribute('data-name', name);
      dot.style.display = 'none';
      dot.style.transition = 'fill 0.2s, stroke 0.2s';
      this._countriesGroup.appendChild(dot);
      this._paths.set(name, dot);
      this._attachTooltip(dot, name);
    }
  }

  _matchName(raw, names) {
    // Maps TopoJSON name (lowercased) → canonical game name
    const TOPO_TO_GAME = {
      'dem. rep. congo':         'Democratic Republic of the Congo',
      'congo':                   'Republic of the Congo',
      'central african rep.':    'Central African Republic',
      'macedonia':               'North Macedonia',
      's. sudan':                'South Sudan',
      'w. sahara':               'Western Sahara',
      'cabo verde':              'Cape Verde',
      'eswatini':                'Eswatini',
      'czechia':                 'Czech Republic',
      'united states of america':'United States',
      'eq. guinea':              'Equatorial Guinea',
      'guinea-bissau':           'Guinea-Bissau',
      'dominican rep.':          'Dominican Republic',
      'bosnia and herz.':        'Bosnia and Herzegovina',
      'marshall is.':            'Marshall Islands',
      'solomon is.':             'Solomon Islands',
      "côte d'ivoire":           "Côte d'Ivoire",
      'são tomé and principe':   'São Tomé and Príncipe',
      'antigua and barb.':       'Antigua and Barbuda',
      'st. kitts and nevis':     'Saint Kitts and Nevis',
      'st. vin. and gren.':      'Saint Vincent and the Grenadines',
    };

    const key = raw.toLowerCase().trim();
    if (key in TOPO_TO_GAME) {
      const gameName = TOPO_TO_GAME[key];
      return names.find(n => n === gameName) ?? null;
    }
    return names.find(n => n.toLowerCase() === key) ?? null;
  }

  // ── Country status ────────────────────────────────────────────────────────

  static get _ISLAND_PARENT() {
    return {
      'Svalbard': 'Norway', 'Jan Mayen': 'Norway',
      'Socotra': 'Yemen',
      'Kaliningrad': 'Russia', 'Sakhalin': 'Russia', 'Kuril Islands': 'Russia',
      'Canary Islands': 'Spain',
      'Azores': 'Portugal', 'Madeira': 'Portugal',
      'Okinawa': 'Japan',
      'Chatham Islands': 'New Zealand',
    };
  }

  setCountryStatus(name, status) {
    const el = this._paths.get(name);
    if (!el) return;

    // Sync any island overlays that belong to this country
    if (this._islandPaths) {
      for (const [key, iPath] of this._islandPaths.entries()) {
        if (WorldMapRenderer._ISLAND_PARENT[key] === name) {
          if (status === 'unplaced') {
            iPath.setAttribute('fill', 'none');
            iPath.setAttribute('stroke', 'none');
          } else {
            const fills   = { starter: 'starter', placed: 'placed' };
            const strokes = { starter: 'strokeStarter', placed: 'strokePlaced' };
            iPath.setAttribute('fill',   this._c(fills[status]   ?? 'placed'));
            iPath.setAttribute('stroke', this._c(strokes[status] ?? 'strokePlaced'));
            iPath.setAttribute('stroke-width', status === 'starter' ? '0.32' : '0.25');
          }
          iPath.dataset.status = status;
        }
      }
    }

    if (status === 'unplaced') {
      el.style.display = 'none';
      delete el.dataset.status;
      return;
    }
    el.style.display = '';
    el.dataset.status = status;
    const fills   = { starter: 'starter', placed: 'placed' };
    const strokes = { starter: 'strokeStarter', placed: 'strokePlaced' };

    if (el.tagName === 'circle') {
      el.setAttribute('fill', this._c(fills[status] ?? 'placed'));
      el.setAttribute('stroke', this._c(strokes[status] ?? 'strokePlaced'));
      el.setAttribute('stroke-width', '0.18');
    } else {
      el.setAttribute('fill',   this._c(fills[status]   ?? 'placed'));
      el.setAttribute('stroke', this._c(strokes[status] ?? 'strokePlaced'));
      el.setAttribute('stroke-width', status === 'starter' ? '0.32' : '0.25');
    }
  }

  // ── River lines ───────────────────────────────────────────────────────────

  // Call clearRiverLines() before the first setRiverLine() to reset.
  // Multiple calls append additional lines (needed for Nile branches).
  setRiverLine(coords, color = '#00aaff', strokeWidth = '0.5') {
    if (!coords?.length) return;
    // Split the polyline at long jumps in lon/lat space (data sometimes
    // concatenates separate river segments without a break — render each
    // contiguous run as its own <polyline> so we don't draw straight
    // diagonals between them).
    const JUMP_DEG = 3;
    const segments = [];
    let current = [];
    for (let i = 0; i < coords.length; i++) {
      const c = coords[i];
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
      const pts = seg
        .map(c => this._projection(c))
        .filter(p => p && Number.isFinite(p[0]) && Number.isFinite(p[1]))
        .map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`)
        .join(' ');
      if (!pts) continue;
      const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      poly.setAttribute('points', pts);
      poly.setAttribute('fill', 'none');
      poly.setAttribute('stroke', color);
      poly.setAttribute('stroke-width', strokeWidth);
      poly.setAttribute('stroke-linecap', 'round');
      poly.setAttribute('stroke-linejoin', 'round');
      poly.setAttribute('opacity', '0.85');
      this._riverGroup.appendChild(poly);
    }
  }

  clearRiverLines() { this._riverGroup.innerHTML = ''; }
  setRiverLinesVisible(v) { this._riverGroup.style.display = v ? '' : 'none'; }

  // ── View reset ────────────────────────────────────────────────────────────

  // Fit the viewBox to a set of lon/lat coordinates (e.g. a river line).
  resetViewToCoords(coordArrays) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const coords of coordArrays) {
      for (const lonlat of coords) {
        const p = this._projection(lonlat);
        if (!p || !Number.isFinite(p[0])) continue;
        minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0]);
        minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]);
      }
    }
    if (!Number.isFinite(minX)) return;
    const PAD = 0.15;
    const bw = (maxX - minX) * (1 + PAD * 2);
    const bh = (maxY - minY) * (1 + PAD * 2);
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    const scale = Math.min(VW / bw, VH / bh, 20);
    const vw = VW / scale, vh = VH / scale;
    const [x, y] = this._clamp(cx - vw / 2, cy - vh / 2, vw, vh);
    this._svg.setAttribute('viewBox', `${x.toFixed(3)} ${y.toFixed(3)} ${vw.toFixed(3)} ${vh.toFixed(3)}`);
  }

  resetView(names = null) {
    // Compute the union bounding box of all target paths
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let found = false;

    for (const [name, el] of this._paths.entries()) {
      const include = names ? names.includes(name) : el.style.display !== 'none';
      if (!include) continue;
      try {
        const bb = el.getBBox();
        if (!bb || bb.width === 0) continue;
        minX = Math.min(minX, bb.x);
        minY = Math.min(minY, bb.y);
        maxX = Math.max(maxX, bb.x + bb.width);
        maxY = Math.max(maxY, bb.y + bb.height);
        found = true;
      } catch { /* no-op */ }
    }

    if (!found) {
      this._svg.setAttribute('viewBox', `0 0 ${VW} ${VH}`);
      return;
    }

    // Fit the bounding box into the viewBox with padding, preserving aspect ratio
    const PAD = 0.3; // fraction of the bbox size added as padding on each side
    const bw = (maxX - minX) * (1 + PAD * 2);
    const bh = (maxY - minY) * (1 + PAD * 2);
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    // Scale to fit both dimensions; clamp so we never zoom out past the full map
    const scaleX = VW / bw;
    const scaleY = VH / bh;
    const scale  = Math.min(scaleX, scaleY, 20); // cap at 20× for tiny micro-states
    const vw = VW / scale;
    const vh = VH / scale;

    const [x, y] = this._clamp(cx - vw / 2, cy - vh / 2, vw, vh);
    this._svg.setAttribute('viewBox', `${x.toFixed(3)} ${y.toFixed(3)} ${vw.toFixed(3)} ${vh.toFixed(3)}`);
  }

  _pathCentroid(path) {
    try {
      const bb = path.getBBox();
      if (!bb || bb.width === 0) return null;
      return [bb.x + bb.width / 2, bb.y + bb.height / 2];
    } catch { return null; }
  }

  // ── Pan/zoom ──────────────────────────────────────────────────────────────

  _bindEvents() {
    const svg = this._svg;

    // viewBox writes are expensive (force re-layout of ~200 paths). Coalesce
    // them into one update per animation frame for smooth panning/pinching.
    let pendingVB = null;
    let rafId = null;
    const flushVB = () => {
      rafId = null;
      if (!pendingVB) return;
      const { x, y, w, h } = pendingVB;
      pendingVB = null;
      // Guard against NaN/Infinity that can sneak in from degenerate pinch
      // input (two touches at identical coords → newDist=0 → factor=Infinity).
      // Writing NaN to viewBox makes the whole map disappear until reload.
      if (!Number.isFinite(x) || !Number.isFinite(y) ||
          !Number.isFinite(w) || !Number.isFinite(h) ||
          w <= 0 || h <= 0) return;
      svg.setAttribute('viewBox', `${x.toFixed(3)} ${y.toFixed(3)} ${w.toFixed(3)} ${h.toFixed(3)}`);
    };
    const queueVB = (x, y, w, h) => {
      if (!Number.isFinite(x) || !Number.isFinite(y) ||
          !Number.isFinite(w) || !Number.isFinite(h) ||
          w <= 0 || h <= 0) return;
      pendingVB = { x, y, w, h };
      if (rafId == null) rafId = requestAnimationFrame(flushVB);
    };
    this._queueVB = queueVB;

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
          cx: (a.clientX + b.clientX) / 2,
          cy: (a.clientY + b.clientY) / 2,
        };
        lastTouch = null;
      }
    }, { passive: false });

    svg.addEventListener('touchmove', e => {
      e.preventDefault();
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
        // Skip degenerate frames: zero finger distance produces Infinity factor
        // and NaN viewBox, which makes the map vanish.
        if (newDist < 1 || pinch.dist < 1) {
          pinch = { dist: Math.max(newDist, 1), cx: pinch.cx, cy: pinch.cy };
          return;
        }
        const cx = (a.clientX + b.clientX) / 2;
        const cy = (a.clientY + b.clientY) / 2;

        const rect = svg.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        const vb   = pendingVB ?? svg.viewBox.baseVal;
        const mx = vb.x + ((cx - rect.left) / rect.width)  * vb.width;
        const my = vb.y + ((cy - rect.top)  / rect.height) * vb.height;

        const factor = pinch.dist / newDist;
        const newW = Math.max(VW / 60, Math.min(VW, vb.width  * factor));
        const newH = Math.max(VH / 60, Math.min(VH, vb.height * factor));
        const rawX = mx - (mx - vb.x) * (newW / vb.width);
        const rawY = my - (my - vb.y) * (newH / vb.height);
        const [nX, nY] = this._clamp(rawX, rawY, newW, newH);
        queueVB(nX, nY, newW, newH);

        pinch = { dist: newDist, cx, cy };
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

      const factor = e.deltaY > 0 ? 1.15 : 1 / 1.15;
      const newW   = Math.max(VW / 60, Math.min(VW, vb.width  * factor));
      const newH   = Math.max(VH / 60, Math.min(VH, vb.height * factor));

      const rawX = mx - (mx - vb.x) * (newW / vb.width);
      const rawY = my - (my - vb.y) * (newH / vb.height);
      const [newX, newY] = this._clamp(rawX, rawY, newW, newH);

      queueVB(newX, newY, newW, newH);
    }, { passive: false });
  }

  // Clamp viewBox origin so the map boundary is never exceeded.
  // If viewBox is larger than the map in a dimension, centre it instead.
  _clamp(x, y, w, h) {
    const cx = w >= VW ? (VW - w) / 2 : Math.max(0, Math.min(VW - w, x));
    const cy = h >= VH ? (VH - h) / 2 : Math.max(0, Math.min(VH - h, y));
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
    // Pan/zoom is handled entirely via viewBox; no transform needed
  }

  // ── Theme ─────────────────────────────────────────────────────────────────

  setTheme(theme) {
    if (this._theme === theme) return;
    this._theme = theme;
    const bg = this._svg.querySelector('#ocean-bg');
    if (bg) bg.setAttribute('fill', this._c('ocean'));
    // Repaint all visible paths with updated palette
    for (const [name, el] of this._paths) {
      if (el.style.display === 'none') continue;
      this.setCountryStatus(name, el.dataset.status ?? 'placed');
    }
  }

  dispose() {
    this._svg.remove();
    this._tooltip?.remove();
  }
}
