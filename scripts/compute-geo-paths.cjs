/**
 * Pre-computes SVG path strings and centroids for all A&A territories from TopoJSON world data.
 * Run once with: node scripts/compute-geo-paths.cjs
 * Outputs: src/data/territory-paths.js
 */

const topojson = require('topojson-client');
const d3geo   = require('d3-geo');
const fs      = require('fs');
const path    = require('path');

// ── Load world data ───────────────────────────────────────────────────────────
const worldFile = path.join(__dirname, '../public/world-110m.json');
const world = JSON.parse(fs.readFileSync(worldFile, 'utf8'));

const countries = topojson.feature(world, world.objects.countries);
const byId = {};
countries.features.forEach(f => { byId[String(f.id).padStart(3,'0')] = f; });

// ── Projection: Equirectangular, calibrated to 1400×780 ─────────────────────
const VB_W = 1400, VB_H = 780;
const projection = d3geo.geoEquirectangular()
  .scale(VB_W / (2 * Math.PI))
  .translate([VB_W / 2, VB_H / 2])
  .center([10, 15]);

const pathGen = d3geo.geoPath(projection);

// ── Helper: merge multiple country features into one ─────────────────────────
function buildFC(ids) {
  const feats = ids.map(id => byId[id]).filter(Boolean);
  if (!feats.length) return null;
  if (feats.length === 1) return feats[0];
  return { type: 'FeatureCollection', features: feats };
}

function toPath(geom) {
  if (!geom) return '';
  return pathGen(geom) || '';
}

// ── Clip a FeatureCollection/Feature to lon/lat bounding box ─────────────────
function pathMergedClipped(ids, lonMin, latMin, lonMax, latMax) {
  const feats = ids.map(id => byId[id]).filter(Boolean);
  if (!feats.length) return { path: '', cx: 0, cy: 0 };
  const fc = feats.length === 1 ? feats[0] : { type: 'FeatureCollection', features: feats };

  // Project corner points — clamp latitude to avoid projection singularities
  const safeLatMin = Math.max(latMin, -89);
  const safeLatMax = Math.min(latMax, 89);
  const nw = projection([lonMin, safeLatMax]);
  const se = projection([lonMax, safeLatMin]);
  if (!nw || !se) { return { path: toPath(fc), cx: 0, cy: 0 }; }
  const [x0, y0] = nw;
  const [x1, y1] = se;

  // Use clipExtent to crop to the lon/lat box
  projection.clipExtent([
    [Math.min(x0,x1) - 1, Math.min(y0,y1) - 1],
    [Math.max(x0,x1) + 1, Math.max(y0,y1) + 1],
  ]);
  const p = pathGen(fc) || '';
  projection.clipExtent(null);

  // Centroid of the clip box midpoint
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  return { path: p, cx: Math.round(cx), cy: Math.round(cy) };
}

function computeCentroid(fc) {
  if (!fc) return [0, 0];
  try {
    const lonLat = d3geo.geoCentroid(fc);
    return projection(lonLat) || [0, 0];
  } catch { return [0, 0]; }
}

// ── Raw SVG hexagon for tiny island territories ───────────────────────────────
function rawHex(cx, cy, r) {
  // 6-point regular hexagon centered at (cx, cy) with given radius
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return `M ${pts[0]} L ${pts.slice(1).join(' L ')} Z`;
}

// ── Hand-crafted polygon path (lon/lat coords → SVG) for game-board-style shapes
// Used for territories where rectangular clip produces unrealistic straight borders.
function polyPath(lonLatRing) {
  const feature = {
    type: 'Feature',
    geometry: { type: 'Polygon', coordinates: [lonLatRing] },
    properties: {}
  };
  const d = pathGen(feature) || '';
  const [cx, cy] = computeCentroid(feature);
  return { path: d, cx: Math.round(cx), cy: Math.round(cy) };
}

// ── Territory definitions ─────────────────────────────────────────────────────
const TERRITORY_DEFS = {
  // ── Americas ───────────────────────────────────────────────────────────────
  alaska:         { ids: ['840'], clip: [-180, 54, -128, 72] },
  western_us:     { ids: ['840'], clip: [-125, 31, -103, 49] },
  central_us:     { ids: ['840'], clip: [-103, 28, -88, 49] },
  eastern_us:     { ids: ['840'], clip: [-88, 25, -67, 49] },
  western_canada: { ids: ['124'], clip: [-141, 48, -103, 72] },
  central_canada: { ids: ['124'], clip: [-103, 48, -76, 75] },
  eastern_canada: { ids: ['124'], clip: [-76, 43, -52, 75] },
  central_america:{ ids: ['484','320','188','222','558','591','340','214','044','052','659','388','084','192','332'] },
  brazil:         { ids: ['076','604','858','600','068','032','152','740','328','218','862','170'] },

  // ── Pacific Islands (approximate - no good TopoJSON) ─────────────────────
  // These will be handled as small circles in MapRenderer

  // ── Europe ────────────────────────────────────────────────────────────────
  united_kingdom: { ids: ['826','372'] },
  western_europe: { ids: ['250','056','528','442'] },
  germany:        { ids: ['276'] },
  southern_europe:{ ids: ['380','300','191','705'] },
  norway:         { ids: ['578'] },
  sweden:         { ids: ['752'] },
  finland:        { ids: ['246'] },
  spain:          { ids: ['724','620'] },
  austria:        { ids: ['040','203','703'] },
  yugoslavia:     { ids: ['070','807','499','008','688'] },
  romania_bulgaria:{ ids: ['642','100','498'] },
  baltic_states:  { ids: ['233','428','440'] },
  eastern_europe: { ids: ['616'] },
  belorussia:     { ids: ['112'] },
  ukraine:        { ids: ['804'] },

  // ── Middle East / Africa ──────────────────────────────────────────────────
  turkey:         { ids: ['792'] },
  trans_jordan:   { ids: ['400','760','422','368'] },
  persia:         { ids: ['364','586'], clip: [44, 20, 76, 44] },
  egypt:          { ids: ['818'] },
  north_africa:   { ids: ['504','788','434','012'] },
  west_africa:    { ids: ['566','288','686','384','324','466','768','478','204','140','120','626','148','800','446'], clip: [-20, -5, 30, 22] },
  anglo_egypt_sudan:{ ids: ['729','231','706','262'] },
  east_africa:    { ids: ['834','404','646','454'], clip: [27, -12, 52, 5] },
  south_africa:   { ids: ['710','516','716','426','748','072','508'], clip: [15, -36, 40, -8] },

  // ── USSR ──────────────────────────────────────────────────────────────────
  karelia:        { ids: ['643'], clip: [24, 58, 52, 72] },
  archangel:      { ids: ['643'], clip: [32, 64, 68, 80] },
  russia:         { ids: ['643'], clip: [28, 50, 62, 64] },
  caucasus:       { ids: ['643','268','031','051','795','762','860'], clip: [38, 36, 72, 52] },
  kazakh:         { ids: ['398'], clip: [50, 40, 87, 56] },
  // Siberian territories — hand-crafted polygons so borders are diagonal, not rectangular
  novosibirsk:    { poly: [[62,70],[72,72],[84,71],[90,66],[92,60],[88,55],[80,51],[68,50],[60,52],[59,61],[62,70]] },
  evenki:         { poly: [[90,66],[96,72],[108,74],[120,72],[123,65],[122,58],[114,56],[100,56],[90,58],[88,62],[90,66]] },
  buryatia:       { poly: [[90,58],[100,56],[114,56],[122,58],[126,54],[126,48],[118,47],[106,47],[96,49],[88,53],[88,56],[90,58]] },
  yakut:          { poly: [[120,72],[130,75],[144,75],[154,72],[157,65],[155,58],[147,57],[135,56],[124,56],[122,62],[120,66],[120,72]] },
  soviet_far_east:{ poly: [[124,56],[135,56],[147,57],[155,58],[160,54],[165,50],[163,42],[153,42],[140,42],[130,44],[127,50],[124,56]] },

  // ── Asia ─────────────────────────────────────────────────────────────────
  india:          { ids: ['356','050','144','524','064'] },
  burma:          { ids: ['104'] },
  french_indochina:{ ids: ['704','116','418'] },
  malaya:         { ids: ['458','702'] },
  dutch_east_indies:{ ids: ['360'] },
  borneo:         { ids: ['096','458'], clip: [109, -5, 120, 8] },
  philippines:    { ids: ['608'] },
  korea:          { ids: ['410','408'] },
  manchuria:      { ids: ['156'], clip: [116, 38, 136, 55] },
  kiangsu:        { ids: ['156'], clip: [108, 28, 125, 42] },
  kwangtung:      { ids: ['156'], clip: [104, 18, 122, 30] },
  szechwan:       { ids: ['156'], clip: [96, 26, 114, 40] },
  yunnan:         { ids: ['156'], clip: [97, 21, 107, 29] },

  // ── Japan + Pacific ───────────────────────────────────────────────────────
  japan:          { ids: ['392'] },
  australia:      { ids: ['036'] },
  new_zealand:    { ids: ['554'] },
  new_guinea:     { ids: ['598'] },
  solomon_islands:{ ids: ['090'] },

  // ── Pacific Islands — raw SVG hexagon shapes (no good TopoJSON coverage) ─────
  hawaii:          { raw: { cx: 95,  cy: 355, r: 10 } },
  midway:          { raw: { cx: 50,  cy: 290, r:  7 } },
  wake_island:     { raw: { cx:1310, cy: 355, r:  6 } },
  guam:            { raw: { cx:1270, cy: 415, r:  8 } },
  iwo_jima:        { raw: { cx:1295, cy: 335, r:  6 } },
  marianas:        { raw: { cx:1285, cy: 390, r:  8 } },
  caroline_islands:{ raw: { cx:1235, cy: 465, r: 12 } },
};

// ── Compute paths + centroids ─────────────────────────────────────────────────
console.log('Computing geographic territory paths...');
const RESULT = {};
let computed = 0, missing = 0;

Object.entries(TERRITORY_DEFS).forEach(([tid, def]) => {
  let pathStr, cx, cy;

  if (def.raw) {
    // Raw SVG hexagon for tiny island territories
    pathStr = rawHex(def.raw.cx, def.raw.cy, def.raw.r);
    cx = def.raw.cx;
    cy = def.raw.cy;
  } else if (def.poly) {
    // Hand-crafted polygon (lon/lat ring) — gives game-board-style diagonal borders
    const r = polyPath(def.poly);
    pathStr = r.path;
    cx = r.cx;
    cy = r.cy;
  } else if (def.clip) {
    const r = pathMergedClipped(def.ids, ...def.clip);
    pathStr = r.path;
    cx = r.cx;
    cy = r.cy;
  } else {
    const fc = buildFC(def.ids);
    if (!fc) { missing++; console.warn(`  MISSING: ${tid}`); return; }
    pathStr = toPath(fc);
    [cx, cy] = computeCentroid(fc);
  }

  if (pathStr && pathStr.length > 5) {
    RESULT[tid] = { path: pathStr, cx: Math.round(cx), cy: Math.round(cy) };
    computed++;
  } else {
    missing++;
    console.warn(`  EMPTY PATH: ${tid}`);
  }
});

console.log(`Computed ${computed} territory paths, ${missing} missing.`);

// Print centroid comparison vs existing territory positions
const terrsFile = fs.readFileSync(path.join(__dirname, '../src/data/territories.js'), 'utf8');
const centroidDiffs = [];
Object.entries(RESULT).forEach(([tid, { cx, cy }]) => {
  const m = terrsFile.match(new RegExp(`id:'${tid}'.*?x:(\\d+),\\s*y:(\\d+)`));
  if (m) {
    const dx = Math.abs(cx - parseInt(m[1]));
    const dy = Math.abs(cy - parseInt(m[2]));
    if (dx > 50 || dy > 50) centroidDiffs.push(`${tid}: geo=(${cx},${cy}) vs territory=(${m[1]},${m[2]}) delta=(${dx},${dy})`);
  }
});
if (centroidDiffs.length) {
  console.log('\nCentroid deltas >50px (these territories may need centroid updates):');
  centroidDiffs.forEach(d => console.log(' ', d));
}

// ── Write output ──────────────────────────────────────────────────────────────
const outFile = path.join(__dirname, '../src/data/territory-paths.js');
const content = `// Auto-generated by scripts/compute-geo-paths.cjs — DO NOT EDIT MANUALLY
// Geographic SVG paths + centroids for each A&A territory.
// Projection: equirectangular, center=[10,15], scale=${VB_W/(2*Math.PI)|0}, translate=[${VB_W/2},${VB_H/2}]
// Coordinate space: ${VB_W}×${VB_H} (same as VB_W × VB_H in MapRenderer.js)
//
// Each entry: { path: SVG d-string, cx: label-x, cy: label-y }
// Territories NOT listed here fall back to Voronoi rendering.

export const TERRITORY_PATHS = ${JSON.stringify(RESULT, null, 2)};
`;
fs.writeFileSync(outFile, content, 'utf8');
console.log(`\nWritten to ${outFile}`);
