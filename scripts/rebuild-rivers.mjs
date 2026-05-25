// Regenerates line + detailLine arrays for known-broken rivers using
// Natural Earth 10m river centerlines from public/topo/rivers-10m.geojson.
// Patches src/data/rivers.js in place.
//
// Run: node scripts/rebuild-rivers.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const NE_PATH = path.join(ROOT, 'public/topo/rivers-10m.geojson');
const RIVERS_JS = path.join(ROOT, 'src/data/rivers.js');

const ne = JSON.parse(fs.readFileSync(NE_PATH, 'utf8'));

// Greedy chain: starting from the longest sub-segment, repeatedly attach any other
// sub-segment whose nearest endpoint is within `joinTol` degrees of the current
// chain's endpoints. Sub-segments that don't touch the chain (distributaries,
// ox-bows) are dropped. Avoids both the `.flat()` problem (arbitrary-order glue
// across discontinuities) and the "longest only" problem (truncates rivers
// represented as several connecting subsegments).
function chainSubsegments(subs, joinTol = 0.5) {
  if (!subs.length) return [];
  // Drop sub-segments whose endpoints are duplicates of a longer sub-segment.
  // (NE sometimes ships parallel detail copies; greedy chain can attach them
  // and accidentally truncate the rest of the river.)
  const sorted = subs.slice().sort((a, b) => b.length - a.length);
  const kept = [];
  for (const s of sorted) {
    const a = s[0], b = s[s.length-1];
    const isDupe = kept.some(k => {
      const ka = k[0], kb = k[k.length-1];
      const sameAB = Math.hypot(a[0]-ka[0], a[1]-ka[1]) < 0.1 && Math.hypot(b[0]-kb[0], b[1]-kb[1]) < 0.1;
      const sameBA = Math.hypot(a[0]-kb[0], a[1]-kb[1]) < 0.1 && Math.hypot(b[0]-ka[0], b[1]-ka[1]) < 0.1;
      return sameAB || sameBA;
    });
    if (!isDupe) kept.push(s);
  }
  const remaining = kept;
  let chain = remaining.shift().slice();
  let progress = true;
  while (progress) {
    progress = false;
    for (let i = 0; i < remaining.length; i++) {
      const seg = remaining[i];
      const head = chain[0], tail = chain[chain.length-1];
      const a = seg[0], b = seg[seg.length-1];
      const dHA = Math.hypot(head[0]-a[0], head[1]-a[1]);
      const dHB = Math.hypot(head[0]-b[0], head[1]-b[1]);
      const dTA = Math.hypot(tail[0]-a[0], tail[1]-a[1]);
      const dTB = Math.hypot(tail[0]-b[0], tail[1]-b[1]);
      const minD = Math.min(dHA, dHB, dTA, dTB);
      if (minD > joinTol) continue;
      // Attach: pick the orientation that's closest
      if (minD === dTA)      chain = chain.concat(seg);
      else if (minD === dTB) chain = chain.concat(seg.slice().reverse());
      else if (minD === dHA) chain = seg.slice().reverse().concat(chain);
      else                   chain = seg.slice().concat(chain);
      remaining.splice(i, 1);
      progress = true;
      break;
    }
  }
  return chain;
}

// Pull a feature by name. Without a bbox filter, all features sharing the name
// are merged: each feature's MultiLineString is flattened into its sub-segments,
// then ALL sub-segments are chained together greedily — handles NE rivers split
// across multiple features (e.g. two "Murat" features for the same river).
function getByName(name, bboxFilter = null) {
  const matches = ne.features.filter(f => (f.properties?.name ?? '') === name);
  if (!matches.length) return null;

  if (bboxFilter) {
    // Per-feature mode: pick first feature whose chained coords match the bbox
    for (const f of matches) {
      const g = f.geometry;
      const coords = g.type === 'LineString' ? g.coordinates : chainSubsegments(g.coordinates);
      if (!coords.length) continue;
      let minx=Infinity,miny=Infinity,maxx=-Infinity,maxy=-Infinity;
      for (const c of coords) { minx=Math.min(minx,c[0]); maxx=Math.max(maxx,c[0]); miny=Math.min(miny,c[1]); maxy=Math.max(maxy,c[1]); }
      if (bboxFilter(minx,miny,maxx,maxy)) return coords;
    }
    return null;
  }

  // Combined mode: chain ALL sub-segments from ALL matching features.
  const allSubs = [];
  for (const f of matches) {
    const g = f.geometry;
    if (g.type === 'LineString') allSubs.push(g.coordinates);
    else                         for (const sub of g.coordinates) allSubs.push(sub);
  }
  return chainSubsegments(allSubs);
}

// Reverse a polyline if its first point is closer to `target` than its last
// (i.e. orient it source→mouth based on which end matches the upstream tail).
function orientToward(coords, downstreamPoint) {
  if (!coords?.length) return coords;
  const a = coords[0], b = coords[coords.length-1];
  const dA = Math.hypot(a[0]-downstreamPoint[0], a[1]-downstreamPoint[1]);
  const dB = Math.hypot(b[0]-downstreamPoint[0], b[1]-downstreamPoint[1]);
  return dA < dB ? coords.slice().reverse() : coords;
}

// Concatenate segments source→mouth. Brute-forces over all 2^N orientations
// and picks the combination that minimises total inter-segment gap length.
// (For N≤6 this is fine — N=64 max.)
function chain(segments) {
  if (!segments.length) return [];
  if (segments.length === 1) return segments[0].slice();
  const N = segments.length;
  const ends = segments.map(s => [s[0], s[s.length-1]]); // [head, tail]
  let bestMask = 0, bestCost = Infinity;
  for (let mask = 0; mask < (1 << N); mask++) {
    let cost = 0;
    for (let i = 0; i < N - 1; i++) {
      const flipI = (mask >> i) & 1;
      const flipJ = (mask >> (i+1)) & 1;
      const tail = ends[i][flipI ? 0 : 1];   // if flipped, tail is original head
      const head = ends[i+1][flipJ ? 1 : 0]; // if flipped, head is original tail
      cost += Math.hypot(tail[0]-head[0], tail[1]-head[1]);
    }
    if (cost < bestCost) { bestCost = cost; bestMask = mask; }
  }
  let result = [];
  for (let i = 0; i < N; i++) {
    const seg = (bestMask >> i) & 1 ? segments[i].slice().reverse() : segments[i].slice();
    result = result.concat(seg);
  }
  return result;
}

// Douglas-Peucker simplification — tolerance in degrees lon/lat.
function simplify(points, tol) {
  if (points.length < 3) return points.slice();
  const sqTol = tol * tol;
  const keep = new Uint8Array(points.length);
  keep[0] = 1; keep[points.length-1] = 1;
  const stack = [[0, points.length-1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let maxD = 0, idx = -1;
    const [ax, ay] = points[a], [bx, by] = points[b];
    const dx = bx-ax, dy = by-ay;
    const len2 = dx*dx + dy*dy || 1;
    for (let i = a+1; i < b; i++) {
      const [px, py] = points[i];
      const t = ((px-ax)*dx + (py-ay)*dy) / len2;
      const tc = Math.max(0, Math.min(1, t));
      const cx = ax + tc*dx, cy = ay + tc*dy;
      const d2 = (px-cx)*(px-cx) + (py-cy)*(py-cy);
      if (d2 > maxD) { maxD = d2; idx = i; }
    }
    if (maxD > sqTol && idx !== -1) {
      keep[idx] = 1;
      stack.push([a, idx]); stack.push([idx, b]);
    }
  }
  const out = [];
  for (let i = 0; i < points.length; i++) if (keep[i]) out.push(points[i]);
  return out;
}

// Format as 1-decimal coordinate array literal lines, indented 6 spaces.
function formatLine(points) {
  return points.map(p => `      [${(+p[0]).toFixed(1)},${(+p[1]).toFixed(1)}]`).join(',\n');
}

// ── Build coords for each broken river ────────────────────────────────────

// Helper: bbox filters that distinguish multi-feature rivers
const bbox = {
  congoUpper: (minx,miny,maxx,maxy) => minx > 26 && minx < 27 && miny < -8 && maxy < -5,   // 26.4,-8.3 → 27.0,-5.6
  congoLower: (minx,miny,maxx,maxy) => minx < 14 && maxx > 24,                              // big great-loop feature
  amazonMain: (minx,miny,maxx,maxy) => minx < -70,                                           // 701-pt main stem
  columbiaMain: (minx,miny,maxx,maxy) => minx < -120 && maxx < -115,                         // long Canada-to-Pacific
  muratEast: (minx,miny,maxx,maxy) => minx > 39.5,                                           // 39.9..43.7 (Murat upper)
  muratWest: (minx,miny,maxx,maxy) => maxx < 40,                                             // 38.8..39.9 (Murat lower)
};

const sources = {
  congo: () => {
    const lualaba = getByName('Lualaba', (minx,_my,maxx,_My) => maxx < 26.5 && maxx > 26 && minx > 25);
    const upper   = getByName('Congo', bbox.congoUpper);
    const lower   = getByName('Congo', bbox.congoLower);
    if (!lualaba || !upper || !lower) throw new Error('Congo segments missing: '+[!!lualaba,!!upper,!!lower]);
    // Lualaba ends ~(26.4,-8.3); upper Congo starts there and ends ~(27,-5.6); lower Congo
    // begins at (24.3,0.8) and ends at the Atlantic mouth (13.2,-5.9). There's a gap between
    // upper end (27,-5.6) and lower start (24.3,0.8) — that's the segment NE represents
    // through the Lualaba feature 2 / "Congo (Boyoma Falls)" area. We accept the small gap
    // (jump ≤3° handled by renderer) — actually we need to fill it. Lualaba feat 2 covers it.
    const lualaba2 = getByName('Lualaba', (minx,miny,maxx,maxy) => miny > -6 && maxy > 0);
    if (!lualaba2) throw new Error('Lualaba upper feature missing');
    return chain([lualaba, upper, lualaba2, lower]);
  },
  amazon: () => {
    const maranon = getByName('Marañón');
    const main    = getByName('Amazonas', bbox.amazonMain);
    if (!maranon || !main) throw new Error('Amazon segments missing');
    return chain([maranon, main]);
  },
  rhine: () => {
    // NE labels the Rhine in three languages along its course:
    //   Rhein (German) — Swiss Alps through Lake Constance to Basel
    //   Rhin  (French) — Basel up the Rhine valley to ~Karlsruhe
    //   Rhine (English) — from Black Forest area down to North Sea
    const rhein = getByName('Rhein');  // upper, Swiss/Liechtenstein/Austrian
    const rhin  = getByName('Rhin');   // middle, French border / Alsace
    const rhine = getByName('Rhine');  // lower, Germany / Netherlands
    if (!rhein || !rhin || !rhine) throw new Error('Rhine segments missing');
    return chain([rhein, rhin, rhine]);
  },
  euphrates: () => {
    // NE labels the Euphrates in four languages along its course:
    //   Murat — Turkish headwater branch (we keep this)
    //   Firat (Turkish) — main stem from Karasu junction down to Syrian border.
    //                     NE's "Firat" feature also includes the Karasu tributary
    //                     coming from the north — we drop that sub-segment to
    //                     avoid an upside-down V shape.
    //   Al Furat (Arabic) — Syria
    //   Euphrates (English) — Iraq down to Persian Gulf
    const murat   = getByName('Murat');
    // Firat — manually filter out the Karasu loop (long sub-segment ending at the
    // Murat junction near (38.74, 39.08) but starting up at (41.5, 40.2))
    const firatSubs = [];
    for (const f of ne.features.filter(x => x.properties.name === 'Firat')) {
      const g = f.geometry;
      const subs = g.type === 'LineString' ? [g.coordinates] : g.coordinates;
      for (const s of subs) {
        const a = s[0], b = s[s.length-1];
        // Drop any sub-segment that reaches above 39.5°N (the Karasu loop and friends)
        const reachesNorth = s.some(p => p[1] > 39.5);
        if (reachesNorth) continue;
        firatSubs.push(s);
      }
    }
    const firat = chainSubsegments(firatSubs);
    const alFurat = getByName('Al Furat');
    const euph    = getByName('Euphrates');
    // Shatt al-Arab — the combined Tigris–Euphrates from their confluence to
    // the Persian Gulf. Forms the Iran/Iraq border on its lower reaches.
    const shatt   = getByName('Shatt al Arab');
    if (!murat || !firat?.length || !alFurat || !euph || !shatt) throw new Error('Euphrates segments missing');
    return chain([murat, firat, alFurat, euph, shatt]);
  },
  columbia: () => {
    const main = getByName('Columbia', bbox.columbiaMain);
    if (!main) throw new Error('Columbia main missing');
    return main;
  },
  mekong: () => {
    const lan = getByName('Lancang');
    const mek = getByName('Mekong');
    if (!lan || !mek) throw new Error('Mekong segments missing');
    return chain([lan, mek]);
  },
  indus: () => {
    // Tibetan headwaters (Shiquan, Chinese name) → Indus main stem (India + Pakistan).
    const shiquan = getByName('Shiquan');
    const indus   = getByName('Indus');
    if (!shiquan || !indus) throw new Error('Indus segments missing');
    return chain([shiquan, indus]);
  },
  parana: () => {
    // NE's Paraná is split awkwardly:
    //   - One feature (1317 pts) is mislabeled — its 964-pt sub follows the
    //     Paraguay River through the Pantanal, NOT the Paraná. We drop it.
    //   - Two smaller features cover the real upper main stem from the
    //     Paranaíba/Rio Grande confluence southwest to Corrientes.
    //   - The lower stretch (Corrientes → Río de la Plata) is the 202-pt
    //     sub-segment of the mislabeled feature.
    // We collect all sub-segments and drop the Pantanal one explicitly.
    const subs = [];
    for (const f of ne.features.filter(x => x.properties.name === 'Paraná')) {
      const arr = f.geometry.type === 'LineString' ? [f.geometry.coordinates] : f.geometry.coordinates;
      for (const s of arr) {
        // Drop the mislabeled Pantanal/Paraguay-river sub (starts way north at lat ~-14)
        const reachesFarNorth = s.some(p => p[1] > -16);
        if (reachesFarNorth) continue;
        subs.push(s);
      }
    }
    if (!subs.length) throw new Error('Paraná segments missing');
    return chainSubsegments(subs);
  },
};

// Sanity: orient each result so the longer end of the bbox matches expected direction.
// We don't strictly need this — the chain logic above handles continuity — but log endpoints.
const built = {};
for (const [id, fn] of Object.entries(sources)) {
  const coords = fn();
  built[id] = coords;
  const f = coords[0], l = coords[coords.length-1];
  console.log(`${id.padEnd(10)} ${coords.length} pts  src=[${f[0].toFixed(2)},${f[1].toFixed(2)}]  mouth=[${l[0].toFixed(2)},${l[1].toFixed(2)}]`);
}

// Simplify per-river. Aim ≈100 pts for line, ≈220 pts for detailLine.
function simpToCount(coords, target) {
  // Binary search tolerance to hit point count
  let lo = 0.001, hi = 1.0;
  for (let i = 0; i < 22; i++) {
    const mid = (lo + hi) / 2;
    const s = simplify(coords, mid);
    if (s.length > target) lo = mid; else hi = mid;
  }
  return simplify(coords, hi);
}

const out = {};
for (const [id, coords] of Object.entries(built)) {
  const line       = simpToCount(coords, 100);
  const detailLine = simpToCount(coords, 220);
  out[id] = { line, detailLine };
  console.log(`${id.padEnd(10)} simplified  line=${line.length}  detailLine=${detailLine.length}`);
}

// ── Patch rivers.js ───────────────────────────────────────────────────────

let src = fs.readFileSync(RIVERS_JS, 'utf8');

function replaceArrayField(src, riverId, fieldName, newPoints) {
  // Find the river block
  const idMatch = new RegExp(`id:\\s*'${riverId}'`).exec(src);
  if (!idMatch) throw new Error(`river ${riverId} not found`);
  const blockStart = idMatch.index;
  // Find the field inside the block
  const fieldRe = new RegExp(`(\\n\\s*${fieldName}:\\s*\\[)([\\s\\S]*?)(\\n\\s*\\],?)`, 'g');
  fieldRe.lastIndex = blockStart;
  const fm = fieldRe.exec(src);
  if (!fm) throw new Error(`field ${fieldName} not found in ${riverId}`);
  const replacement = fm[1] + '\n' + formatLine(newPoints) + fm[3];
  return src.slice(0, fm.index) + replacement + src.slice(fm.index + fm[0].length);
}

for (const [id, {line, detailLine}] of Object.entries(out)) {
  src = replaceArrayField(src, id, 'line', line);
  src = replaceArrayField(src, id, 'detailLine', detailLine);
  console.log(`patched ${id}`);
}

fs.writeFileSync(RIVERS_JS, src);
console.log('rivers.js updated');
