import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { chainRelation } from './chain-osm-relation.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const data50 = JSON.parse(readFileSync(join(root, 'public/topo/rivers-50m.geojson'), 'utf8'));
const data10 = JSON.parse(readFileSync(join(root, 'public/topo/rivers-10m.geojson'), 'utf8'));

// OSM full-relation data for the Nile system
const osmMain  = JSON.parse(readFileSync(join(root, 'public/topo/nile-main-osm.json'),  'utf8'));
const osmWhite = JSON.parse(readFileSync(join(root, 'public/topo/nile-white-osm.json'), 'utf8'));
const osmBlue  = JSON.parse(readFileSync(join(root, 'public/topo/nile-blue-osm.json'),  'utf8'));

// ── Ramer-Douglas-Peucker simplification ──────────────────────────────────

function rdp(pts, epsilon) {
  if (pts.length <= 2) return pts;
  // Find the point with maximum distance from the line between first and last
  const [x1, y1] = pts[0], [x2, y2] = pts[pts.length - 1];
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  let maxDist = 0, maxIdx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const dist = len === 0
      ? Math.hypot(pts[i][0] - x1, pts[i][1] - y1)
      : Math.abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / len;
    if (dist > maxDist) { maxDist = dist; maxIdx = i; }
  }
  if (maxDist > epsilon) {
    const left  = rdp(pts.slice(0, maxIdx + 1), epsilon);
    const right = rdp(pts.slice(maxIdx), epsilon);
    return [...left.slice(0, -1), ...right];
  }
  return [pts[0], pts[pts.length - 1]];
}

// ── Helpers ────────────────────────────────────────────────────────────────

function featuresNamed(data, names, nameEns = []) {
  return data.features.filter(f => {
    const n  = f.properties.name    ?? '';
    const en = f.properties.name_en ?? '';
    return names.some(s => n === s || en === s) ||
           nameEns.some(s => en === s);
  });
}

function allSegments(feats) {
  // MultiLineString.coordinates is an array of line arrays
  return feats.flatMap(f => f.geometry.coordinates);
}

/**
 * Sort segments along a primary axis, orient each in the flow direction,
 * concatenate, thin to maxPts.
 * axis: 'lon'|'lat', ascending: true = source has smaller value
 */
function buildLine(segments, { axis = 'lon', ascending = true, maxPts = 120, bbox, minSegPts = 0, minLatSpan = 0 } = {}) {
  let segs = segments;
  if (minSegPts > 0) segs = segs.filter(s => s.length >= minSegPts);
  if (minLatSpan > 0) segs = segs.filter(s => {
    const lats = s.map(p => p[1]);
    return Math.max(...lats) - Math.min(...lats) >= minLatSpan;
  });
  if (bbox) {
    segs = segs.filter(seg => {
      const all = seg.flat ? seg : seg;
      const mLon = all.reduce((s,[lon]) => s+lon, 0) / all.length;
      const mLat = all.reduce((s,[,lat]) => s+lat, 0) / all.length;
      return mLon >= bbox[0] && mLon <= bbox[2] && mLat >= bbox[1] && mLat <= bbox[3];
    });
  }
  if (!segs.length) return [];

  const idx = axis === 'lon' ? 0 : 1;
  segs = [...segs].sort((a, b) => {
    const ma = a.reduce((s,p) => s+p[idx], 0) / a.length;
    const mb = b.reduce((s,p) => s+p[idx], 0) / b.length;
    return ascending ? ma - mb : mb - ma;
  });

  const oriented = segs.map(seg => {
    const first = seg[0][idx], last = seg[seg.length-1][idx];
    return (ascending ? first > last : first < last) ? [...seg].reverse() : seg;
  });

  const all = oriented.flat();
  const step = Math.max(1, Math.floor(all.length / maxPts));
  const thinned = all.filter((_, i) => i % step === 0 || i === all.length - 1);
  return thinned.map(([lon, lat]) => [Math.round(lon * 10) / 10, Math.round(lat * 10) / 10]);
}

function get50(names, opts) {
  const segs = allSegments(featuresNamed(data50, names));
  return buildLine(segs, { maxPts: 80, ...opts });
}

function get10(names, nameEns, opts = {}) {
  const segs = allSegments(featuresNamed(data10, names, nameEns));
  return buildLine(segs, { maxPts: 200, ...opts });
}

// ── Build all river lines ──────────────────────────────────────────────────

const C = {};

// NILE SYSTEM — full OSM relation data, complete coverage, no tributaries
C.nile         = get50(['Nile'], { bbox:[25,15,40,32], axis:'lat', ascending:true });
const nile10chain = chainRelation(osmMain, 250);
// Prepend two points to close the gap between Khartoum (~15.6°N) and where the OSM relation starts (~16.3°N)
C.nile10       = [[32.53, 15.60], [32.55, 15.90], [32.57, 16.10], ...nile10chain];
C.nileWhite    = get50(['Bahr el Jebel','Albert Nile','Victoria Nile'], { axis:'lat', ascending:true, maxPts:50 });
C.nileWhite10  = chainRelation(osmWhite, 250);
C.nileBlue10Ethiopia = chainRelation(osmBlue, 250);
C.nileBlue10Sudan    = [];
C.nileBlue10Bridge   = [];

// GAMBIA — source in Guinea (east), mouth in The Gambia (west).
// 10m Natural Earth covers the eastern stretch; OSM fills the western estuary to the ocean.
// RDP simplification (epsilon=0.06°) removes micro-meanders while keeping major bends.
const GAMBIA_MOUTH = JSON.parse(readFileSync(join(root, 'public/topo/gambia-mouth-osm.json'), 'utf8'));
const gambiaRaw = [...get10(['Gambia'], ['Gambia'], { axis:'lon', ascending:false }), ...GAMBIA_MOUTH];
C.gambia10  = rdp(gambiaRaw, 0.06).map(([lon,lat]) => [Math.round(lon*10)/10, Math.round(lat*10)/10]);
C.gambia    = C.gambia10;

// CONGO — Lualaba (source) + Congo main stem
C.congo     = get50(['Lualaba','Congo'], { axis:'lat', ascending:true });
C.congo10   = get10(['Lualaba','Congo'], ['Congo'], { axis:'lat', ascending:true });

// NIGER
C.niger     = get50(['Niger'], { bbox:[-15,4,7,18], axis:'lon', ascending:true });
C.niger10   = get10(['Niger'], ['Niger'], { bbox:[-15,4,7,18], axis:'lon', ascending:true });

// ZAMBEZI
C.zambezi   = get50(['Zambezi'], { axis:'lon', ascending:true });
C.zambezi10 = get10(['Zambezi'], ['Zambezi'], { axis:'lon', ascending:true });

// AMAZON
C.amazon    = get50(['Amazonas'], { axis:'lon', ascending:true });
C.amazon10  = get10(['Amazonas'], ['Amazon'], { axis:'lon', ascending:true });

// DANUBE
C.danube    = get50(['Danube','Donau'], { axis:'lon', ascending:true });
C.danube10  = get10(['Danube'], ['Danube'], { axis:'lon', ascending:true });

// RHINE
C.rhine     = get50(['Rhine','Rhein'], { axis:'lat', ascending:true });
C.rhine10   = get10(['Rhine'], ['Rhine'], { axis:'lat', ascending:true });

// DNIEPER
C.dnieper   = get50(['Dnipro','Dnepre'], { axis:'lat', ascending:false });
C.dnieper10 = get10(['Dnipro','Dnepre'], ['Dnieper'], { axis:'lat', ascending:false });

// MEKONG
C.mekong    = get50(['Mekong'], { axis:'lat', ascending:false });
C.mekong10  = get10(['Mekong'], ['Mekong'], { axis:'lat', ascending:false });

// EUPHRATES
C.euphrates   = get50(['Euphrates','Al Furat'], { axis:'lon', ascending:true });
C.euphrates10 = get10(['Euphrates'], ['Euphrates'], { axis:'lon', ascending:true });

// US RIVERS
C.mississippi   = get50(['Mississippi'], { bbox:[-95,28,-85,49], axis:'lat', ascending:false });
C.mississippi10 = get10(['Mississippi'], ['Mississippi'], { bbox:[-95,28,-85,49], axis:'lat', ascending:false });

C.missouri      = get50(['Missouri'], { bbox:[-115,36,-92,49], axis:'lon', ascending:true });
C.missouri10    = get10(['Missouri'], ['Missouri'], { bbox:[-115,36,-92,49], axis:'lon', ascending:true });

C.colorado      = get50(['Colorado'], { bbox:[-115,31,-105,42], axis:'lat', ascending:false });
C.colorado10    = get10(['Colorado'], ['Colorado'], { bbox:[-115,31,-105,42], axis:'lat', ascending:false });

C.tennessee     = get50(['Tennessee'], { axis:'lon', ascending:false });
C.tennessee10   = get10(['Tennessee'], ['Tennessee'], { axis:'lon', ascending:false });

C.ohio          = get50(['Ohio'], { axis:'lon', ascending:false });
C.ohio10        = get10(['Ohio'], ['Ohio'], { axis:'lon', ascending:false });

C.arkansas      = get50(['Arkansas'], { axis:'lon', ascending:true });
C.arkansas10    = get10(['Arkansas'], ['Arkansas'], { axis:'lon', ascending:true });

C.columbia      = get50(['Columbia'], { axis:'lon', ascending:false });
C.columbia10    = get10(['Columbia'], ['Columbia'], { axis:'lon', ascending:false });

C.riogrande     = get50(['Rio Grande'], { bbox:[-107,25,-97,38], axis:'lat', ascending:false });
C.riogrande10   = get10(['Rio Grande'], ['Rio Grande'], { bbox:[-107,25,-97,38], axis:'lat', ascending:false });

// ── Report ─────────────────────────────────────────────────────────────────
for (const [k, v] of Object.entries(C)) {
  if (!v.length) { console.warn('EMPTY:', k); continue; }
  const lons = v.map(p=>p[0]), lats = v.map(p=>p[1]);
  console.log(`${k.padEnd(16)} ${String(v.length).padStart(4)} pts  lon:${Math.min(...lons).toFixed(1)}–${Math.max(...lons).toFixed(1)}  lat:${Math.min(...lats).toFixed(1)}–${Math.max(...lats).toFixed(1)}`);
}

// ── Format helpers ─────────────────────────────────────────────────────────
const fmt = arr =>
  '[\n      ' + arr.map(p => JSON.stringify(p)).join(',\n      ') + '\n    ]';

// ── Output ─────────────────────────────────────────────────────────────────
const out = `// River definitions for Source to Sea mode
// Coordinates sourced from Natural Earth 50m (line) and 10m (detailLine) datasets.
// detailLine / detailSecondaryLines are only used in Source to Sea rendering.

export const WORLD_RIVERS = [
  {
    id: 'nile',
    name: 'Nile',
    emoji: '🌊',
    countries: ['Ethiopia', 'Uganda', 'South Sudan', 'Sudan', 'Egypt'],
    source: 'Ethiopia',
    mouth: 'Egypt',
    line: ${fmt(C.nile)},
    detailLine: ${fmt(C.nile10)},
    secondaryLine: {
      name: 'White Nile',
      color: '#00cfff',
      coords: ${fmt(C.nileWhite)},
    },
    detailSecondaryLines: [
      {
        name: 'White Nile',
        color: '#00aaff',
        coords: ${fmt(C.nileWhite10)},
      },
      {
        name: 'Blue Nile',
        color: '#00aaff',
        coords: ${fmt([...C.nileBlue10Ethiopia, ...C.nileBlue10Bridge, ...C.nileBlue10Sudan])},
      },
    ],
  },
  {
    id: 'gambia',
    name: 'Gambia',
    emoji: '🌊',
    countries: ['Guinea', 'Senegal', 'Gambia'],
    source: 'Guinea',
    mouth: 'Gambia',
    line: ${fmt(C.gambia)},
    detailLine: ${fmt(C.gambia10)},
  },
  {
    id: 'congo',
    name: 'Congo',
    emoji: '🌊',
    countries: ['Zambia', 'Democratic Republic of the Congo', 'Republic of the Congo'],
    source: 'Zambia',
    mouth: 'Democratic Republic of the Congo',
    line: ${fmt(C.congo)},
    detailLine: ${fmt(C.congo10)},
  },
  {
    id: 'niger',
    name: 'Niger',
    emoji: '🌊',
    countries: ['Guinea', 'Mali', 'Niger', 'Benin', 'Nigeria'],
    source: 'Guinea',
    mouth: 'Nigeria',
    line: ${fmt(C.niger)},
    detailLine: ${fmt(C.niger10)},
  },
  {
    id: 'zambezi',
    name: 'Zambezi',
    emoji: '🌊',
    countries: ['Zambia', 'Angola', 'Namibia', 'Botswana', 'Zimbabwe', 'Mozambique'],
    source: 'Zambia',
    mouth: 'Mozambique',
    line: ${fmt(C.zambezi)},
    detailLine: ${fmt(C.zambezi10)},
  },
  {
    id: 'amazon',
    name: 'Amazon',
    emoji: '🌊',
    countries: ['Peru', 'Colombia', 'Brazil'],
    source: 'Peru',
    mouth: 'Brazil',
    line: ${fmt(C.amazon)},
    detailLine: ${fmt(C.amazon10)},
  },
  {
    id: 'danube',
    name: 'Danube',
    emoji: '🌊',
    countries: ['Germany', 'Austria', 'Slovakia', 'Hungary', 'Croatia', 'Serbia', 'Romania', 'Bulgaria', 'Moldova', 'Ukraine'],
    source: 'Germany',
    mouth: 'Romania',
    line: ${fmt(C.danube)},
    detailLine: ${fmt(C.danube10)},
  },
  {
    id: 'rhine',
    name: 'Rhine',
    emoji: '🌊',
    countries: ['Switzerland', 'Liechtenstein', 'Austria', 'Germany', 'France', 'Netherlands'],
    source: 'Switzerland',
    mouth: 'Netherlands',
    line: ${fmt(C.rhine)},
    detailLine: ${fmt(C.rhine10)},
  },
  {
    id: 'dnieper',
    name: 'Dnieper',
    emoji: '🌊',
    countries: ['Russia', 'Belarus', 'Ukraine'],
    source: 'Russia',
    mouth: 'Ukraine',
    line: ${fmt(C.dnieper)},
    detailLine: ${fmt(C.dnieper10)},
  },
  {
    id: 'mekong',
    name: 'Mekong',
    emoji: '🌊',
    countries: ['China', 'Myanmar', 'Laos', 'Thailand', 'Cambodia', 'Vietnam'],
    source: 'China',
    mouth: 'Vietnam',
    line: ${fmt(C.mekong)},
    detailLine: ${fmt(C.mekong10)},
  },
  {
    id: 'euphrates',
    name: 'Euphrates',
    emoji: '🌊',
    countries: ['Turkey', 'Syria', 'Iraq'],
    source: 'Turkey',
    mouth: 'Iraq',
    line: ${fmt(C.euphrates)},
    detailLine: ${fmt(C.euphrates10)},
  },
];

export const US_RIVERS = [
  {
    id: 'mississippi',
    name: 'Mississippi',
    emoji: '🌊',
    states: ['Minnesota', 'Wisconsin', 'Iowa', 'Illinois', 'Missouri', 'Kentucky', 'Tennessee', 'Arkansas', 'Mississippi', 'Louisiana'],
    source: 'Minnesota',
    mouth: 'Louisiana',
    line: ${fmt(C.mississippi)},
    detailLine: ${fmt(C.mississippi10)},
  },
  {
    id: 'missouri',
    name: 'Missouri',
    emoji: '🌊',
    states: ['Montana', 'North Dakota', 'South Dakota', 'Nebraska', 'Iowa', 'Kansas', 'Missouri'],
    source: 'Montana',
    mouth: 'Missouri',
    line: ${fmt(C.missouri)},
    detailLine: ${fmt(C.missouri10)},
  },
  {
    id: 'colorado',
    name: 'Colorado',
    emoji: '🌊',
    states: ['Colorado', 'Utah', 'Arizona', 'Nevada', 'California'],
    source: 'Colorado',
    mouth: 'California',
    line: ${fmt(C.colorado)},
    detailLine: ${fmt(C.colorado10)},
  },
  {
    id: 'tennessee',
    name: 'Tennessee',
    emoji: '🌊',
    states: ['Virginia', 'North Carolina', 'Tennessee', 'Georgia', 'Alabama', 'Mississippi', 'Kentucky'],
    source: 'Virginia',
    mouth: 'Kentucky',
    line: ${fmt(C.tennessee)},
    detailLine: ${fmt(C.tennessee10)},
  },
  {
    id: 'ohio',
    name: 'Ohio',
    emoji: '🌊',
    states: ['Pennsylvania', 'West Virginia', 'Ohio', 'Indiana', 'Kentucky', 'Illinois'],
    source: 'Pennsylvania',
    mouth: 'Illinois',
    line: ${fmt(C.ohio)},
    detailLine: ${fmt(C.ohio10)},
  },
  {
    id: 'arkansas',
    name: 'Arkansas',
    emoji: '🌊',
    states: ['Colorado', 'Kansas', 'Oklahoma', 'Arkansas'],
    source: 'Colorado',
    mouth: 'Arkansas',
    line: ${fmt(C.arkansas)},
    detailLine: ${fmt(C.arkansas10)},
  },
  {
    id: 'columbia',
    name: 'Columbia',
    emoji: '🌊',
    states: ['Montana', 'Idaho', 'Washington', 'Oregon', 'Canada'],
    source: 'Canada',
    mouth: 'Canada',
    foreign: ['Canada'],
    line: ${fmt(C.columbia)},
    detailLine: ${fmt(C.columbia10)},
  },
  {
    id: 'riogrande',
    name: 'Rio Grande',
    emoji: '🌊',
    states: ['Colorado', 'New Mexico', 'Texas', 'Mexico'],
    source: 'Colorado',
    mouth: 'Mexico',
    foreign: ['Mexico'],
    line: ${fmt(C.riogrande)},
    detailLine: ${fmt(C.riogrande10)},
  },
];

export function getRiver(id, mode) {
  const list = mode === 'states' ? US_RIVERS : WORLD_RIVERS;
  return list.find(r => r.id === id) ?? null;
}

export function getAllRivers(mode) {
  return mode === 'states' ? US_RIVERS : WORLD_RIVERS;
}
`;

writeFileSync(join(root, 'src/data/rivers.js'), out, 'utf8');
console.log('rivers.js written successfully');
