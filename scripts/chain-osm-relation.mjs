// Chains an OSM relation's member ways into an ordered polyline.
// Returns thinned [lon, lat] array.
export function chainRelation(data, maxPts = 200) {
  const relation = data.elements.find(e => e.type === 'relation');
  if (!relation) throw new Error('No relation found');

  const ways = relation.members
    .filter(m => m.type === 'way' && m.geometry?.length >= 2)
    .map(m => m.geometry.map(p => [p.lon, p.lat]));

  if (!ways.length) throw new Error('No way members with geometry');

  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const used = new Array(ways.length).fill(false);

  // Start from the way whose endpoint is furthest from the centroid (likely a source or mouth)
  const allEnds = ways.flatMap(w => [w[0], w[w.length - 1]]);
  const cx = allEnds.reduce((s, p) => s + p[0], 0) / allEnds.length;
  const cy = allEnds.reduce((s, p) => s + p[1], 0) / allEnds.length;

  let startIdx = 0, maxDist = -1;
  ways.forEach((w, i) => {
    for (const end of [w[0], w[w.length - 1]]) {
      const d = dist(end, [cx, cy]);
      if (d > maxDist) { maxDist = d; startIdx = i; }
    }
  });

  // Orient start segment: furthest endpoint goes first
  const s0 = ways[startIdx];
  if (dist(s0[s0.length - 1], [cx, cy]) > dist(s0[0], [cx, cy])) {
    ways[startIdx] = [...s0].reverse();
  }

  const chain = [...ways[startIdx]];
  used[startIdx] = true;

  for (let iter = 0; iter < ways.length; iter++) {
    const tail = chain[chain.length - 1];
    let best = -1, bestDist = 0.5, bestRev = false;
    for (let i = 0; i < ways.length; i++) {
      if (used[i]) continue;
      const w = ways[i];
      const d1 = dist(tail, w[0]), d2 = dist(tail, w[w.length - 1]);
      if (d1 < bestDist) { bestDist = d1; best = i; bestRev = false; }
      if (d2 < bestDist) { bestDist = d2; best = i; bestRev = true; }
    }
    if (best === -1) break;
    used[best] = true;
    const seg = bestRev ? [...ways[best]].reverse() : ways[best];
    chain.push(...seg.slice(1));
  }

  const step = Math.max(1, Math.floor(chain.length / maxPts));
  return chain
    .filter((_, i) => i % step === 0 || i === chain.length - 1)
    .map(([lon, lat]) => [Math.round(lon * 100) / 100, Math.round(lat * 100) / 100]);
}
