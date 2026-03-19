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
  // US + Canada inland divisions — organic polygons to avoid purely rectangular borders
  western_us:     { poly: [[-124,49],[-112,50],[-102,49],[-102,38],[-110,31],[-120,31],[-124,36],[-124,49]] },
  central_us:     { poly: [[-102,49],[-90,50],[-84,46],[-80,36],[-88,29],[-96,28],[-102,38],[-102,49]] },
  eastern_us:     { poly: [[-84,46],[-74,48],[-67,46],[-67,38],[-80,25],[-88,29],[-80,36],[-84,46]] },
  western_canada: { poly: [[-140,70],[-120,72],[-102,68],[-102,52],[-112,50],[-124,49],[-130,56],[-140,60],[-140,70]] },
  central_canada: { poly: [[-102,68],[-84,72],[-76,70],[-76,48],[-84,46],[-90,50],[-102,49],[-102,68]] },
  eastern_canada: { poly: [[-76,70],[-60,72],[-52,66],[-56,46],[-67,46],[-74,48],[-76,48],[-76,70]] },
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
  persia:         { poly: [[44,36],[52,38],[64,36],[74,32],[76,26],[72,22],[64,20],[54,20],[46,22],[42,28],[44,36]] },
  egypt:          { ids: ['818'] },
  north_africa:   { ids: ['504','788','434','012'] },
  west_africa:    { ids: ['566','288','686','384','324','466','768','478','204','140','120','626','148','800','446'] },
  anglo_egypt_sudan:{ ids: ['729','231','706','262'] },
  east_africa:    { ids: ['834','404','646','454'] },
  south_africa:   { ids: ['710','516','716','426','748','072','508'] },

  // ── USSR ──────────────────────────────────────────────────────────────────
  // All USSR polygons use exact shared vertices at territory borders.
  // Key junction points:
  //   [50,62] = Karelia/Archangel/Russia triple point
  //   [62,66] = Archangel/Novosibirsk shared (Archangel SE = Novosibirsk NW)
  //   [62,62] = Russia/Archangel/Novosibirsk triple point
  //   [62,52] = Russia/Novosibirsk/Kazakh triple point
  //   [88,52] = Novosibirsk/Evenki/Kazakh/Buryatia quad point
  //   [122,58] = Evenki/Buryatia/Yakut triple point
  //   [124,54] = Buryatia/Yakut/SFE triple point
  //   [155,58] = Yakut/SFE shared NE
  karelia:        { poly: [[22,66],[24,72],[36,74],[50,74],[50,62],[36,62],[24,62],[22,66]] },
  archangel:      { poly: [[50,62],[50,74],[50,82],[68,80],[72,72],[62,66],[62,62],[50,62]] },
  russia:         { poly: [[22,62],[36,62],[50,62],[62,62],[62,52],[54,48],[40,48],[28,50],[22,56],[22,62]] },
  caucasus:       { poly: [[40,48],[54,48],[62,44],[68,40],[72,36],[66,32],[56,32],[44,34],[36,38],[34,44],[40,48]] },
  // Kazakh extends east through Mongolia to close the gap north of China territories
  // Shared vertices: [88,52]=Novosibirsk/Buryatia quad point, [116,52]=Manchuria NW, [116,42]=China triple point
  kazakh:         { poly: [[62,52],[76,52],[88,52],[116,52],[116,42],[109,44],[96,42],[88,42],[86,40],[72,36],[62,44],[54,48],[62,52]] },
  // Siberian territories — exact shared edges eliminate seam gaps
  novosibirsk:    { poly: [[62,66],[72,68],[86,66],[88,58],[88,52],[76,52],[62,52],[62,58],[62,66]] },
  evenki:         { poly: [[86,66],[96,72],[108,74],[122,72],[124,64],[122,58],[110,54],[88,52],[88,58],[86,66]] },
  buryatia:       { poly: [[88,52],[110,54],[122,58],[124,54],[126,48],[118,46],[106,46],[96,48],[90,46],[88,52]] },
  yakut:          { poly: [[122,72],[130,76],[144,76],[154,72],[157,64],[155,58],[147,56],[135,54],[124,54],[122,58],[124,64],[122,72]] },
  soviet_far_east:{ poly: [[124,54],[135,54],[147,56],[155,58],[160,52],[165,48],[163,40],[153,40],[140,40],[130,42],[127,48],[124,54]] },

  // ── Asia ─────────────────────────────────────────────────────────────────
  india:          { ids: ['356','050','144','524','064'] },
  burma:          { ids: ['104'] },
  french_indochina:{ ids: ['704','116','418'] },
  malaya:         { ids: ['458','702'] },
  dutch_east_indies:{ ids: ['360'] },
  borneo:         { ids: ['096','458'], clip: [109, -5, 120, 8] },
  philippines:    { ids: ['608'] },
  korea:          { ids: ['410','408'] },
  // China clip territories → organic polygons to avoid rectangular borders
  // China territories — shared vertices at [116,42] (triple point) and [113,28] (south)
  // Manchuria: NW=[116,52] matches Kazakh NE; shares [124,54] with Buryatia; [116,42]=China triple point
  manchuria:      { poly: [[116,52],[124,54],[130,58],[136,54],[140,46],[134,40],[126,38],[118,40],[116,42],[116,52]] },
  kiangsu:        { poly: [[116,42],[126,44],[132,42],[132,36],[128,30],[122,28],[113,28],[116,32],[114,36],[116,42]] },
  kwangtung:      { poly: [[113,28],[122,28],[128,24],[126,18],[116,18],[108,20],[106,24],[113,28]] },
  szechwan:       { poly: [[96,42],[109,44],[116,42],[116,34],[113,28],[104,24],[96,26],[93,34],[96,42]] },
  yunnan:         { poly: [[96,26],[104,24],[113,28],[116,22],[108,18],[99,18],[95,22],[96,26]] },

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
