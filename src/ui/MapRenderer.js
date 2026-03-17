import { TERRITORIES } from '../data/territories.js';
import { NATIONS } from '../data/nations.js';
import { TERRITORY_PATHS } from '../data/territory-paths.js';

window.__TERRITORIES = TERRITORIES;

// ── NATION COLORS — vintage board-game map palette ──────────────────────────
// Colors tuned to match the App Store reference screenshots:
// lighter, more desaturated tones — aged paper/cartographic style
const NATION_FILL = {
  ussr:      '#bf9888',  // muted dusty rose / terracotta (much lighter)
  germany:   '#7090a8',  // medium steel blue-gray (lighter, cleaner)
  uk:        '#909848',  // olive / khaki
  japan:     '#c8a050',  // warm amber-tan
  usa:       '#8a9c38',  // yellow-olive
  australia: '#508040',  // medium olive green
  neutral:   '#c8c0a0',  // light cream / parchment
};
const NATION_BORDER = {
  ussr:      '#906870',  // darker dusty rose
  germany:   '#4a6880',  // darker steel blue
  uk:        '#5a6428',  // darker olive
  japan:     '#987030',  // darker amber
  usa:       '#506820',  // darker yellow-olive
  australia: '#305828',  // darker olive green
  neutral:   '#9a9070',  // medium warm gray-brown
};

const OCEAN_COLOR = '#607888';  // medium steel blue-gray (vintage map ocean)
const VB_W = 1400, VB_H = 780;

// Unit symbols — short codes + Unicode for air units
const UNIT_CODE = {
  infantry:        'I',
  artillery:       'ART',
  armor:           'ARM',
  antiair:         'AA',
  fighter:         '✈',
  bomber:          '✈B',
  tactical_bomber: '✈T',
  submarine:       'SUB',
  destroyer:       'DD',
  cruiser:         'CA',
  carrier:         'CV',
  battleship:      'BB',
  transport:       'TRN',
};

// Darker token background color per nation (tinted faction — stays dark for contrast)
const NATION_TOKEN_BG = {
  ussr:      '#6a3830',  // dark dusty crimson
  germany:   '#283858',  // dark slate blue
  uk:        '#484e18',  // dark olive
  japan:     '#6a4818',  // dark amber-brown
  usa:       '#3a5010',  // dark yellow-olive
  australia: '#204820',  // dark olive green
  neutral:   '#504830',  // dark warm tan
};

// ── VORONOI GEOMETRY ─────────────────────────────────────────────────────────

/**
 * Sutherland-Hodgman polygon clipping by a half-plane.
 * Keeps points where dot(normal, p - linePoint) >= 0.
 */
function clipByHalfplane(poly, linePoint, nx, ny) {
  if (poly.length < 3) return [];
  const dot = p => nx * (p.x - linePoint.x) + ny * (p.y - linePoint.y);
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const curr = poly[i];
    const next = poly[(i + 1) % poly.length];
    const dc = dot(curr), dn = dot(next);
    if (dc >= 0) {
      out.push(curr);
      if (dn < 0) {
        const t = dc / (dc - dn);
        out.push({ x: curr.x + t * (next.x - curr.x), y: curr.y + t * (next.y - curr.y) });
      }
    } else if (dn >= 0) {
      const t = dc / (dc - dn);
      out.push({ x: curr.x + t * (next.x - curr.x), y: curr.y + t * (next.y - curr.y) });
    }
  }
  return out;
}

/**
 * Compute Voronoi cells for all land territories.
 * Each cell is the set of points closer to this territory centroid
 * than to any other territory centroid within MAX_DIST.
 */
function computeVoronoiCells(territories) {
  const MAX_DIST = 380; // only clip against territories within this distance
  const PAD = 120;
  const startPoly = [
    { x: -PAD, y: -PAD },
    { x: VB_W + PAD, y: -PAD },
    { x: VB_W + PAD, y: VB_H + PAD },
    { x: -PAD, y: VB_H + PAD },
  ];

  const landTerrs = Object.values(territories).filter(t => t.type !== 'sea');
  const cells = {};

  landTerrs.forEach(t => {
    let cell = startPoly.map(p => ({ ...p }));

    landTerrs.forEach(other => {
      if (other.id === t.id || cell.length < 3) return;
      const dist = Math.hypot(other.x - t.x, other.y - t.y);
      if (dist > MAX_DIST) return;

      // Perpendicular bisector between t and other
      const mid = { x: (t.x + other.x) / 2, y: (t.y + other.y) / 2 };
      // Normal pointing from other → t  (keep t's side)
      const nx = t.x - other.x, ny = t.y - other.y;
      cell = clipByHalfplane(cell, mid, nx, ny);
    });

    if (cell.length >= 3) {
      // Clamp to viewbox so cells don't bleed far off the edges
      cell = cell.map(p => ({
        x: Math.max(-PAD, Math.min(VB_W + PAD, p.x)),
        y: Math.max(-PAD, Math.min(VB_H + PAD, p.y)),
      }));
      cells[t.id] = cell;
    }
  });

  return cells;
}

function cellToPath(cell) {
  if (!cell || cell.length < 3) return '';
  return 'M ' + cell.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ') + ' Z';
}

// ── MAP RENDERER ─────────────────────────────────────────────────────────────

export class MapRenderer {
  constructor(container, app) {
    this.container    = container;
    this.app          = app;
    this.state        = app.state;
    this.selectedId   = null;
    this.validTargets = new Set();
    this.svg          = null;
    this._cells       = null;   // Voronoi cells (computed once)
    this._terrPaths   = {};     // territoryId → <path> element
    this._icElems     = {};     // territoryId → IC gear text element (for live updates)
    this._pinching    = false;
  }

  render() {
    if (!this.svg) this._build();
    else           this._update();
  }

  setSelection(territoryId, validTargets = []) {
    this.selectedId   = territoryId;
    this.validTargets = new Set(validTargets);
    this._updateSelections();
  }

  clearSelection() {
    this.selectedId = null;
    this.validTargets.clear();
    this._updateSelections();
  }

  // ── BUILD ────────────────────────────────────────────────────────────────────

  _build() {
    this.container.innerHTML = `<style>${MAP_CSS}</style>`;
    const wrap = document.createElement('div');
    wrap.className = 'map-wrap';
    this.container.appendChild(wrap);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${VB_W} ${VB_H}`);
    svg.setAttribute('class', 'map-svg');
    this.svg = svg;
    wrap.appendChild(svg);

    this._buildDefs(svg);

    // Ocean fill
    const bg = this._svgEl('rect');
    bg.setAttribute('width', VB_W); bg.setAttribute('height', VB_H);
    bg.setAttribute('fill', 'url(#ocean-grad)');
    svg.appendChild(bg);

    // Compute Voronoi cells ONCE (expensive but worth it)
    this._cells = computeVoronoiCells(TERRITORIES);

    // Coastline shadow layer (drawn before territories for depth)
    this._coastGroup = this._makeGroup(svg, 'coasts');

    // Territory polygon layer
    this._terrGroup = this._makeGroup(svg, 'territories');

    // Sea zone number labels
    this._seaGroup = this._makeGroup(svg, 'sea-labels');

    // Territory labels (name + IPC) rendered on top of polygons
    this._labelGroup = this._makeGroup(svg, 'terr-labels');

    // Selection highlight rings
    this._selGroup = this._makeGroup(svg, 'selections');

    // Unit tokens
    this._unitGroup = this._makeGroup(svg, 'unit-tokens');

    // Vignette overlay — dark edge fade, below hit targets
    this._vigGroup = this._makeGroup(svg, 'vignette');

    // Invisible click targets on top
    this._hitGroup = this._makeGroup(svg, 'hit-targets');

    // Movement arrow layer — drawn above selections, below units
    this._arrowGroup = this._makeGroup(svg, 'move-arrows');

    this._drawOceanGrid();
    this._drawTerritories();
    this._drawSeaLabels();
    this._drawStaticLabels();
    this._drawVignette();
    this._drawHitTargets();
    this._drawCompassRose();
    this._updateUnits();
    this._updateSelections();
    this._attachInteraction(wrap);
  }

  _buildDefs(svg) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <!-- Vintage map ocean: medium steel blue-gray, lighter cartographic style -->
      <radialGradient id="ocean-grad" cx="52%" cy="40%" r="78%">
        <stop offset="0%"   stop-color="#8aacbe"/>
        <stop offset="50%"  stop-color="#7098ae"/>
        <stop offset="100%" stop-color="#527888"/>
      </radialGradient>
      <!-- Subtle paper grain for territories — vintage map feel -->
      <filter id="paper" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4"
          stitchTiles="stitch" result="noise"/>
        <feColorMatrix type="saturate" values="0" in="noise" result="gray"/>
        <feBlend in="SourceGraphic" in2="gray" mode="multiply" result="blend"/>
        <feComposite in="blend" in2="SourceGraphic" operator="in"/>
      </filter>
      <!-- Arrowhead marker for movement arrows -->
      <marker id="arrow-head" markerWidth="6" markerHeight="6" refX="5" refY="3"
              orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L6,3 Z" fill="#f0c840" opacity="0.9"/>
      </marker>
      <!-- Text shadow for label readability -->
      <filter id="txt-sh" x="-25%" y="-25%" width="150%" height="150%">
        <feDropShadow dx="0" dy="0" stdDeviation="2"
          flood-color="rgba(0,0,0,0.85)" flood-opacity="1"/>
      </filter>
      <!-- Glow for selected territory -->
      <filter id="sel-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    `;
    svg.appendChild(defs);
  }

  _makeGroup(parent, id) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('id', id);
    parent.appendChild(g);
    return g;
  }

  _svgEl(tag) { return document.createElementNS('http://www.w3.org/2000/svg', tag); }

  // ── TERRITORY POLYGONS ───────────────────────────────────────────────────────

  /** Returns the SVG path d-string for a territory: geographic if available, else Voronoi */
  _getTerrPath(tid) {
    const geo = TERRITORY_PATHS[tid];
    if (geo?.path) return geo.path;
    const cell = this._cells[tid];
    return cell ? cellToPath(cell) : null;
  }

  /** Returns the visual centre [cx, cy] for a territory: geographic if available, else territory centroid */
  _getTerrCenter(t) {
    const geo = TERRITORY_PATHS[t.id];
    if (geo?.cx) return [geo.cx, geo.cy];
    return [t.x, t.y];
  }

  // ── OCEAN GRID LINES ─────────────────────────────────────────────────────────
  // Vintage cartographic latitude/longitude grid overlay on the ocean

  _drawOceanGrid() {
    const g = this._makeGroup(this.svg, 'ocean-grid');
    // Insert grid right after the ocean background rect (before coast group)
    this.svg.insertBefore(g, this._coastGroup);

    const STEP_X = VB_W / 14;   // ~14 vertical lines
    const STEP_Y = VB_H / 7;    // ~7 horizontal lines
    const STROKE = 'rgba(65,110,140,0.22)';
    const SW     = '0.6';

    // Horizontal lines (latitude)
    for (let y = STEP_Y; y < VB_H; y += STEP_Y) {
      const l = this._svgEl('line');
      l.setAttribute('x1', 0);   l.setAttribute('y1', y.toFixed(1));
      l.setAttribute('x2', VB_W); l.setAttribute('y2', y.toFixed(1));
      l.setAttribute('stroke', STROKE); l.setAttribute('stroke-width', SW);
      l.setAttribute('pointer-events', 'none');
      g.appendChild(l);
    }

    // Vertical lines (longitude)
    for (let x = STEP_X; x < VB_W; x += STEP_X) {
      const l = this._svgEl('line');
      l.setAttribute('x1', x.toFixed(1)); l.setAttribute('y1', 0);
      l.setAttribute('x2', x.toFixed(1)); l.setAttribute('y2', VB_H);
      l.setAttribute('stroke', STROKE); l.setAttribute('stroke-width', SW);
      l.setAttribute('pointer-events', 'none');
      g.appendChild(l);
    }
  }

  _drawTerritories() {
    this._coastGroup.innerHTML = '';
    this._terrGroup.innerHTML = '';
    this._terrPaths = {};
    const own = this.state.ownership || {};

    Object.values(TERRITORIES).forEach(t => {
      if (t.type === 'sea') return;
      const d = this._getTerrPath(t.id);
      if (!d) return;

      // Coast outline: thick dark stroke behind territory for land/sea contrast
      const coast = this._svgEl('path');
      coast.setAttribute('d', d);
      coast.setAttribute('fill', 'none');
      coast.setAttribute('stroke', 'rgba(15,20,15,0.45)');
      coast.setAttribute('stroke-width', '3');
      coast.setAttribute('stroke-linejoin', 'round');
      coast.setAttribute('pointer-events', 'none');
      this._coastGroup.appendChild(coast);

      const owner = own[t.id] || 'neutral';
      const fill  = NATION_FILL[owner]   || NATION_FILL.neutral;
      const stroke = NATION_BORDER[owner] || NATION_BORDER.neutral;

      const path = this._svgEl('path');
      path.setAttribute('d', d);
      path.setAttribute('fill', fill);
      path.setAttribute('stroke', stroke);
      path.setAttribute('stroke-width', '1.5');
      path.setAttribute('stroke-linejoin', 'round');
      path.setAttribute('filter', 'url(#paper)');
      path.setAttribute('data-id', t.id);
      this._terrGroup.appendChild(path);
      this._terrPaths[t.id] = path;
    });
  }

  _updateTerritoryColors() {
    const own = this.state.ownership || {};
    Object.values(TERRITORIES).forEach(t => {
      if (t.type === 'sea') return;
      const path = this._terrPaths[t.id];
      if (!path) return;
      const owner = own[t.id] || 'neutral';
      path.setAttribute('fill',   NATION_FILL[owner]   || NATION_FILL.neutral);
      path.setAttribute('stroke', NATION_BORDER[owner] || NATION_BORDER.neutral);
    });
  }

  // ── SEA ZONE LABELS ─────────────────────────────────────────────────────────

  _drawSeaLabels() {
    Object.values(TERRITORIES).forEach(t => {
      if (t.type !== 'sea') return;
      const num = t.id.replace('sz_', '');
      const txt = this._svgEl('text');
      txt.setAttribute('x', t.x); txt.setAttribute('y', t.y);
      txt.setAttribute('text-anchor', 'middle');
      txt.setAttribute('dominant-baseline', 'middle');
      txt.setAttribute('font-size', '11');
      txt.setAttribute('fill', 'rgba(20,50,75,0.65)');
      txt.setAttribute('font-family', 'Arial Narrow, Arial, sans-serif');
      txt.setAttribute('font-weight', 'bold');
      txt.setAttribute('letter-spacing', '0.5');
      txt.setAttribute('pointer-events', 'none');
      txt.textContent = num;
      this._seaGroup.appendChild(txt);
    });
  }

  // ── TERRITORY LABELS (name + IPC, drawn on top of polygons) ────────────────
  // Styled to match vintage board-game aesthetic: minimal text, subtle labels

  _drawStaticLabels() {
    const capitalIds = new Set(
      Object.values(NATIONS).filter(n => n.capital).map(n => n.capital)
    );
    // Non-capital Victory Cities — get a smaller gold diamond marker
    const ALL_VCS = new Set([
      'germany', 'western_europe', 'southern_europe', 'japan', 'manchuria',
      'russia', 'united_kingdom', 'eastern_us', 'india', 'australia',
    ]);
    const nonCapVCs = new Set([...ALL_VCS].filter(id => !capitalIds.has(id)));

    Object.values(TERRITORIES).forEach(t => {
      if (t.type === 'sea') return;

      const [lx, ly] = this._getTerrCenter(t);

      const g = this._svgEl('g');
      g.setAttribute('data-lbl', t.id);
      g.setAttribute('pointer-events', 'none');

      // Approximate territory visual radius for layout
      const r = t.ipc === 0 ? 16 : Math.max(20, Math.min(50, 12 + t.ipc * 3.2));
      const isLarge = r >= 36;

      // Capital star — gold ★
      if (capitalIds.has(t.id)) {
        const star = this._svgEl('text');
        star.setAttribute('x', lx); star.setAttribute('y', ly - r * 0.5);
        star.setAttribute('text-anchor', 'middle');
        star.setAttribute('dominant-baseline', 'middle');
        star.setAttribute('font-size', isLarge ? '11' : '9');
        star.setAttribute('fill', '#e8c838');
        star.setAttribute('filter', 'url(#txt-sh)');
        star.textContent = '★';
        g.appendChild(star);
      }
      // Non-capital Victory City — small gold diamond ◆
      if (nonCapVCs.has(t.id)) {
        const vc = this._svgEl('text');
        vc.setAttribute('x', lx); vc.setAttribute('y', ly - r * 0.5);
        vc.setAttribute('text-anchor', 'middle');
        vc.setAttribute('dominant-baseline', 'middle');
        vc.setAttribute('font-size', isLarge ? '8' : '6.5');
        vc.setAttribute('fill', '#d4a820');
        vc.setAttribute('filter', 'url(#txt-sh)');
        vc.textContent = '◆';
        g.appendChild(vc);
      }

      // Factory icon — small, right of center (visibility updated dynamically)
      {
        const ic = this._svgEl('text');
        ic.setAttribute('x', lx + (isLarge ? 12 : 9));
        ic.setAttribute('y', ly - r * 0.45);
        ic.setAttribute('font-size', isLarge ? '9' : '7.5');
        ic.setAttribute('opacity', '0.85');
        ic.setAttribute('pointer-events', 'none');
        ic.textContent = '⚙';
        ic.style.display = this.state.industrialComplexes?.[t.id] ? '' : 'none';
        g.appendChild(ic);
        this._icElems[t.id] = ic;
      }

      // Territory name — small, semi-transparent, uppercase
      const maxChars = isLarge ? 18 : 13;
      const shortName = t.name.length > maxChars ? t.name.slice(0, maxChars - 1) + '…' : t.name;
      const nm = this._svgEl('text');
      nm.setAttribute('x', lx);
      nm.setAttribute('y', capitalIds.has(t.id) ? ly + 2 : ly - (t.ipc > 0 ? 3 : 0));
      nm.setAttribute('text-anchor', 'middle');
      nm.setAttribute('dominant-baseline', 'middle');
      nm.setAttribute('font-size', isLarge ? '7.5' : '6');
      nm.setAttribute('fill', 'rgba(255,248,220,0.72)');
      nm.setAttribute('font-family', 'Arial Narrow, Arial, sans-serif');
      nm.setAttribute('font-weight', 'bold');
      nm.setAttribute('letter-spacing', '0.3');
      nm.setAttribute('filter', 'url(#txt-sh)');
      nm.textContent = shortName;
      g.appendChild(nm);

      // IPC value — circled badge, gold on dark background
      if (t.ipc > 0) {
        const badgeY = capitalIds.has(t.id) ? ly + r * 0.42 : ly + r * 0.38;
        const badgeR = isLarge ? 7 : 5.5;
        // Dark circle behind the number
        const circle = this._svgEl('circle');
        circle.setAttribute('cx', lx); circle.setAttribute('cy', badgeY);
        circle.setAttribute('r', badgeR);
        circle.setAttribute('fill', 'rgba(10,8,2,0.65)');
        circle.setAttribute('stroke', '#c8a030');
        circle.setAttribute('stroke-width', '0.9');
        circle.setAttribute('pointer-events', 'none');
        g.appendChild(circle);

        const ipc = this._svgEl('text');
        ipc.setAttribute('x', lx);
        ipc.setAttribute('y', badgeY + 0.5);
        ipc.setAttribute('text-anchor', 'middle');
        ipc.setAttribute('dominant-baseline', 'middle');
        ipc.setAttribute('font-size', isLarge ? '9' : '7');
        ipc.setAttribute('fill', '#f0cc38');
        ipc.setAttribute('font-family', 'Arial Narrow, Arial, sans-serif');
        ipc.setAttribute('font-weight', 'bold');
        ipc.setAttribute('class', 'ipc-val');
        ipc.textContent = String(t.ipc);
        g.appendChild(ipc);
      }

      this._labelGroup.appendChild(g);
    });
  }

  // ── VIGNETTE ─────────────────────────────────────────────────────────────────
  // NOTE: The CSS vignette in MAP_CSS handles this as a fixed overlay so it
  // stays at the screen edges and doesn't move with pan/zoom.
  _drawVignette() { /* handled by CSS ::after on .map-wrap */ }

  // ── HIT TARGETS ─────────────────────────────────────────────────────────────

  _drawHitTargets() {
    Object.values(TERRITORIES).forEach(t => {
      const geoPath = t.type !== 'sea' ? TERRITORY_PATHS[t.id]?.path : null;
      let el;
      if (geoPath) {
        el = this._svgEl('path');
        el.setAttribute('d', geoPath);
        el.setAttribute('fill', 'transparent');
        el.setAttribute('stroke', 'none');
      } else {
        const r = t.type === 'sea' ? 22 : Math.max(26, Math.min(55, 14 + t.ipc * 3.5));
        el = this._svgEl('circle');
        el.setAttribute('cx', t.x); el.setAttribute('cy', t.y);
        el.setAttribute('r', r);    el.setAttribute('fill', 'transparent');
      }
      el.setAttribute('data-id', t.id);
      el.setAttribute('class', 'hit-target');
      el.addEventListener('click',    e => { e.stopPropagation(); this.app.onTerritoryClick(t.id); });
      el.addEventListener('touchend', e => { e.preventDefault(); e.stopPropagation(); this.app.onTerritoryClick(t.id); });
      this._hitGroup.appendChild(el);
    });
  }

  // ── UNIT TOKENS ─────────────────────────────────────────────────────────────

  _updateUnits() {
    if (!this._unitGroup) return;
    this._unitGroup.innerHTML = '';

    Object.values(TERRITORIES).forEach(t => {
      const units = this.state.getUnits(t.id);
      if (units.length === 0) return;

      const byNation = {};
      units.forEach(u => {
        if (!byNation[u.nation]) byNation[u.nation] = {};
        byNation[u.nation][u.type] = (byNation[u.nation][u.type] || 0) + 1;
      });

      const slots = [];
      Object.entries(byNation).forEach(([nat, types]) => {
        Object.entries(types).forEach(([type, count]) => slots.push({ nat, type, count }));
      });

      const MAX_VIS = 4;
      const visible = slots.slice(0, MAX_VIS);
      const TW = 22;
      const [cx, cy] = this._getTerrCenter(t);
      const startX = cx - (visible.length * TW) / 2 + TW / 2;
      const baseY  = t.type === 'sea' ? cy : cy - (t.ipc === 0 ? 10 : Math.max(22, Math.min(50, 14 + t.ipc * 3.5)) * 0.38);

      const AIR_UNIT_TYPES = new Set(['fighter','bomber','tactical_bomber']);
      const NAV_UNIT_TYPES = new Set(['submarine','destroyer','cruiser','carrier','battleship','transport']);

      visible.forEach(({ nat, type, count }, i) => {
        const tx    = startX + i * TW;
        const ring  = NATION_BORDER[nat] || '#888';
        const bg    = NATION_TOKEN_BG[nat] || '#1a1a1a';
        const code  = UNIT_CODE[type] || type.slice(0, 3).toUpperCase();

        // Air units get a slightly lighter ring; naval get a blue tint ring
        const ringColor = AIR_UNIT_TYPES.has(type)
          ? '#d8d030'
          : NAV_UNIT_TYPES.has(type) ? '#4090c0' : ring;
        const ringWidth = AIR_UNIT_TYPES.has(type) ? 2.2 : 1.8;

        // Faction-colored token
        this._circle(this._unitGroup, tx, baseY, 9, bg, ringColor, ringWidth);

        const ct = this._svgEl('text');
        ct.setAttribute('x', tx); ct.setAttribute('y', baseY + 0.5);
        ct.setAttribute('text-anchor', 'middle'); ct.setAttribute('dominant-baseline', 'middle');
        ct.setAttribute('font-size', code.length > 2 ? '4.5' : '5.5');
        ct.setAttribute('fill', '#f0e8d0'); ct.setAttribute('font-weight', 'bold');
        ct.setAttribute('font-family', 'Arial Narrow, Arial, sans-serif');
        ct.setAttribute('pointer-events', 'none');
        ct.textContent = code;
        this._unitGroup.appendChild(ct);

        if (count > 1) {
          const bx = tx + 5.5, by = baseY - 5.5;
          this._circle(this._unitGroup, bx, by, 4.2, ring, '#000', 0.5);
          const bt = this._svgEl('text');
          bt.setAttribute('x', bx); bt.setAttribute('y', by + 0.5);
          bt.setAttribute('text-anchor', 'middle'); bt.setAttribute('dominant-baseline', 'middle');
          bt.setAttribute('font-size', '4.2'); bt.setAttribute('fill', '#fff');
          bt.setAttribute('font-weight', 'bold'); bt.setAttribute('pointer-events', 'none');
          bt.textContent = count > 9 ? '9+' : count;
          this._unitGroup.appendChild(bt);
        }
      });

      if (slots.length > MAX_VIS) {
        const bx = startX + MAX_VIS * TW;
        this._circle(this._unitGroup, bx, baseY, 8.5, '#303028', '#807858', 1.5);
        const et = this._svgEl('text');
        et.setAttribute('x', bx); et.setAttribute('y', baseY + 0.5);
        et.setAttribute('text-anchor', 'middle'); et.setAttribute('dominant-baseline', 'middle');
        et.setAttribute('font-size', '5'); et.setAttribute('fill', '#c8c0a0');
        et.setAttribute('pointer-events', 'none');
        et.textContent = `+${slots.length - MAX_VIS}`;
        this._unitGroup.appendChild(et);
      }
    });
  }

  _circle(parent, cx, cy, r, fill, stroke, sw) {
    const c = this._svgEl('circle');
    c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', r);
    c.setAttribute('fill', fill); c.setAttribute('stroke', stroke); c.setAttribute('stroke-width', sw);
    c.setAttribute('pointer-events', 'none');
    parent.appendChild(c);
    return c;
  }

  // ── SELECTIONS ───────────────────────────────────────────────────────────────

  _updateSelections() {
    if (!this._selGroup) return;
    this._selGroup.innerHTML = '';

    const addOverlay = (tid, fill, stroke, sw, dash, cssClass) => {
      const d = this._getTerrPath(tid);
      const t = TERRITORIES[tid];
      if (!t) return;
      if (d) {
        const p = this._svgEl('path');
        p.setAttribute('d', d);
        p.setAttribute('fill', fill);
        p.setAttribute('stroke', stroke);
        p.setAttribute('stroke-width', sw);
        if (dash) p.setAttribute('stroke-dasharray', dash);
        if (cssClass) p.setAttribute('class', cssClass);
        p.setAttribute('pointer-events', 'none');
        this._selGroup.appendChild(p);
      } else {
        const c = this._circle(this._selGroup, t.x, t.y, 26, fill, stroke, sw);
        if (cssClass) c.setAttribute('class', cssClass);
      }
    };

    // Valid target territories — green overlay
    this.validTargets.forEach(tid => {
      const t = TERRITORIES[tid];
      if (!t) return;
      if (t.type === 'sea') {
        this._circle(this._selGroup, t.x, t.y, 26, 'rgba(50,255,90,0.22)', '#40ff60', 2.5);
      } else {
        addOverlay(tid, 'rgba(50,255,90,0.22)', '#40ff60', 2.5, null, null);
      }
    });

    // Selected territory — white dashed outline with pulse animation
    if (this.selectedId) {
      const t = TERRITORIES[this.selectedId];
      if (t?.type === 'sea') {
        const c = this._circle(this._selGroup, t.x, t.y, 30, 'rgba(255,255,255,0.1)', '#ffffff', 3);
        c.setAttribute('class', 'sel-anim');
      } else {
        addOverlay(this.selectedId, 'rgba(255,255,255,0.10)', '#ffffff', 3, '8,4', 'sel-anim');
      }
    }

    // Pending combat — red flashing overlay
    const combats = this.app.turnEngine?.pendingCombats || [];
    combats.forEach(tid => {
      const t = TERRITORIES[tid];
      if (t?.type === 'sea') {
        const c = this._circle(this._selGroup, t.x, t.y, 28, 'rgba(255,40,40,0.15)', '#ff3030', 2.5);
        c.setAttribute('class', 'combat-anim');
      } else {
        addOverlay(tid, 'rgba(255,40,40,0.15)', '#ff3030', 2.5, '6,3', 'combat-anim');
      }
    });
  }

  // ── MOVEMENT ARROWS ──────────────────────────────────────────────────────────

  /** Draw a dashed arrow from fromId → toId (used when player selects a move target) */
  showMoveArrow(fromId, toId) {
    if (!this._arrowGroup) return;
    const tFrom = TERRITORIES[fromId];
    const tTo   = TERRITORIES[toId];
    if (!tFrom || !tTo) return;
    const [x1, y1] = this._getTerrCenter(tFrom);
    const [x2, y2] = this._getTerrCenter(tTo);

    // Shorten the line so it doesn't overlap territory labels
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const trim = 14; // px to trim at each end
    const sx = x1 + dx / len * trim;
    const sy = y1 + dy / len * trim;
    const ex = x2 - dx / len * trim;
    const ey = y2 - dy / len * trim;

    const line = this._svgEl('line');
    line.setAttribute('x1', sx); line.setAttribute('y1', sy);
    line.setAttribute('x2', ex); line.setAttribute('y2', ey);
    line.setAttribute('stroke', '#f0c840');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('stroke-dasharray', '6,4');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('marker-end', 'url(#arrow-head)');
    line.setAttribute('opacity', '0.85');
    line.setAttribute('pointer-events', 'none');
    this._arrowGroup.appendChild(line);
  }

  clearArrows() {
    if (this._arrowGroup) this._arrowGroup.innerHTML = '';
  }

  /** Reset map pan and zoom to default view */
  resetZoom() {
    if (this._resetView) {
      // Add smooth transition for the reset
      if (this.svg) {
        this.svg.style.transition = 'transform 0.35s ease';
        setTimeout(() => { if (this.svg) this.svg.style.transition = ''; }, 380);
      }
      this._resetView();
    }
  }

  // ── COMPASS ROSE ─────────────────────────────────────────────────────────────
  // Vintage cartographic compass rose — fixed bottom-left corner of the map

  _drawCompassRose() {
    const g = this._makeGroup(this.svg, 'compass-rose');
    // Place in bottom-left
    const cx = 58, cy = VB_H - 60, R = 30;

    // Outer ring
    const ring = this._svgEl('circle');
    ring.setAttribute('cx', cx); ring.setAttribute('cy', cy); ring.setAttribute('r', R + 4);
    ring.setAttribute('fill', 'rgba(8,18,28,0.55)');
    ring.setAttribute('stroke', 'rgba(170,145,90,0.6)'); ring.setAttribute('stroke-width', '0.8');
    ring.setAttribute('pointer-events', 'none');
    g.appendChild(ring);

    // Cardinal spikes: N S E W (long) + intercardinals (short)
    const spikes = [
      { angle: -90, len: R,       wide: 5,   fill: '#d8c07a' },  // N — gold
      { angle:  90, len: R * 0.8, wide: 4,   fill: '#b0a060' },  // S
      { angle:   0, len: R * 0.8, wide: 4,   fill: '#b0a060' },  // E
      { angle: 180, len: R * 0.8, wide: 4,   fill: '#b0a060' },  // W
      { angle: -45, len: R * 0.55,wide: 2.5, fill: '#786840' },  // NE
      { angle:  45, len: R * 0.55,wide: 2.5, fill: '#786840' },  // SE
      { angle: 135, len: R * 0.55,wide: 2.5, fill: '#786840' },  // SW
      { angle:-135, len: R * 0.55,wide: 2.5, fill: '#786840' },  // NW
    ];

    spikes.forEach(({ angle, len, wide, fill }) => {
      const rad = (angle * Math.PI) / 180;
      const tx  = cx + Math.cos(rad) * len;
      const ty  = cy + Math.sin(rad) * len;
      // Perpendicular for diamond base width
      const prx = Math.cos(rad + Math.PI / 2) * wide;
      const pry = Math.sin(rad + Math.PI / 2) * wide;
      // Diamond: tip → right-base → tail → left-base
      const tailX = cx - Math.cos(rad) * (len * 0.18);
      const tailY = cy - Math.sin(rad) * (len * 0.18);
      const d = `M${tx.toFixed(1)},${ty.toFixed(1)} `
              + `L${(cx+prx).toFixed(1)},${(cy+pry).toFixed(1)} `
              + `L${tailX.toFixed(1)},${tailY.toFixed(1)} `
              + `L${(cx-prx).toFixed(1)},${(cy-pry).toFixed(1)} Z`;
      const p = this._svgEl('path');
      p.setAttribute('d', d); p.setAttribute('fill', fill);
      p.setAttribute('stroke', 'rgba(0,0,0,0.4)'); p.setAttribute('stroke-width', '0.4');
      p.setAttribute('pointer-events', 'none');
      g.appendChild(p);
    });

    // Center dot
    const dot = this._svgEl('circle');
    dot.setAttribute('cx', cx); dot.setAttribute('cy', cy); dot.setAttribute('r', 3);
    dot.setAttribute('fill', '#d8c07a'); dot.setAttribute('stroke', '#000'); dot.setAttribute('stroke-width', '0.5');
    dot.setAttribute('pointer-events', 'none');
    g.appendChild(dot);

    // "N" label above
    const n = this._svgEl('text');
    n.setAttribute('x', cx); n.setAttribute('y', cy - R - 6);
    n.setAttribute('text-anchor', 'middle'); n.setAttribute('dominant-baseline', 'auto');
    n.setAttribute('font-size', '9'); n.setAttribute('fill', '#d8c07a');
    n.setAttribute('font-family', 'Arial Narrow, Arial, sans-serif');
    n.setAttribute('font-weight', 'bold'); n.setAttribute('pointer-events', 'none');
    n.textContent = 'N';
    g.appendChild(n);
  }

  // ── UPDATE ───────────────────────────────────────────────────────────────────

  _updateICIcons() {
    const ics = this.state.industrialComplexes || {};
    Object.entries(this._icElems).forEach(([tid, el]) => {
      el.style.display = ics[tid] ? '' : 'none';
    });
  }

  _update() {
    if (!this.svg) return;
    this._updateTerritoryColors();
    this._updateICIcons();
    this._updateUnits();
    this._updateSelections();
  }

  // ── TOUCH / PAN / ZOOM ───────────────────────────────────────────────────────

  _attachInteraction(wrap) {
    let dragging = false, panStart = null;
    let tx = 0, ty = 0, scale = 1;
    const svg = this.svg;

    const clampPan = () => {
      const ww = wrap.clientWidth, wh = wrap.clientHeight;
      const sw = ww * scale, sh = wh * scale;
      const maxX =  Math.max(0, (sw - ww) / 2 + ww * 0.15);
      const minX = -Math.max(0, (sw - ww) / 2 + ww * 0.15);
      const maxY =  Math.max(0, (sh - wh) / 2 + wh * 0.15);
      const minY = -Math.max(0, (sh - wh) / 2 + wh * 0.15);
      tx = Math.max(minX, Math.min(maxX, tx));
      ty = Math.max(minY, Math.min(maxY, ty));
    };

    const apply = () => {
      clampPan();
      svg.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`;
    };

    // ── Mouse drag to pan ──────────────────────────────────
    wrap.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      dragging = true;
      panStart = { x: e.clientX - tx, y: e.clientY - ty };
      wrap.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      tx = e.clientX - panStart.x;
      ty = e.clientY - panStart.y;
      apply();
    });
    window.addEventListener('mouseup', () => {
      dragging = false;
      wrap.style.cursor = '';
    });

    // ── Mouse wheel zoom (zoom toward cursor) ─────────────
    wrap.addEventListener('wheel', e => {
      e.preventDefault();
      const rect = wrap.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const delta = e.deltaY < 0 ? 1.12 : 0.89;
      const newScale = Math.max(0.4, Math.min(6, scale * delta));
      // Adjust translation so cursor stays fixed
      tx = cx - (cx - tx) * (newScale / scale);
      ty = cy - (cy - ty) * (newScale / scale);
      scale = newScale;
      apply();
    }, { passive: false });

    // ── Touch pan + pinch zoom ─────────────────────────────
    wrap.addEventListener('touchstart', e => {
      if (e.touches.length === 1) {
        dragging = true;
        panStart = { x: e.touches[0].clientX - tx, y: e.touches[0].clientY - ty };
      } else if (e.touches.length === 2) {
        dragging = false; this._pinching = true;
        this._pinchStart = {
          dist: Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY),
          scale,
          tx, ty,
          midX: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          midY: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        };
      }
    }, { passive: true });

    wrap.addEventListener('touchmove', e => {
      if (dragging && e.touches.length === 1) {
        tx = e.touches[0].clientX - panStart.x;
        ty = e.touches[0].clientY - panStart.y;
        apply();
      } else if (this._pinching && e.touches.length === 2) {
        const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        const newScale = Math.max(0.4, Math.min(6, this._pinchStart.scale * (dist / this._pinchStart.dist)));
        const { midX, midY } = this._pinchStart;
        const rect = wrap.getBoundingClientRect();
        const cx = midX - rect.left, cy = midY - rect.top;
        tx = cx - (cx - this._pinchStart.tx) * (newScale / this._pinchStart.scale);
        ty = cy - (cy - this._pinchStart.ty) * (newScale / this._pinchStart.scale);
        scale = newScale;
        apply();
      }
    }, { passive: true });

    wrap.addEventListener('touchend', e => {
      dragging = false;
      if (e.touches.length < 2) this._pinching = false;
    }, { passive: true });

    // Double-click / double-tap resets view
    wrap.addEventListener('dblclick', e => {
      // If mouse is dragging, ignore
      if (!dragging) { tx = 0; ty = 0; scale = 1; apply(); }
    });

    // Expose reset function so resetZoom() can call it externally
    this._resetView = () => { tx = 0; ty = 0; scale = 1; apply(); };
  }
}

const MAP_CSS = `
  .map-wrap {
    width: 100%; height: 100%;
    overflow: hidden; position: relative;
    background: #527888;
    cursor: grab;
    user-select: none;
  }
  .map-wrap:active { cursor: grabbing; }
  /* Fixed vignette overlay — stays at screen edges regardless of pan/zoom */
  .map-wrap::after {
    content: '';
    position: absolute; inset: 0;
    pointer-events: none; z-index: 10;
    background:
      /* top edge — dark */
      linear-gradient(to bottom, rgba(0,3,12,0.70) 0%, transparent 14%),
      /* bottom fog — vintage map cloud/fog bank */
      linear-gradient(to top, rgba(210,200,175,0.88) 0%, rgba(160,150,120,0.45) 6%, transparent 16%),
      /* bottom dark under fog */
      linear-gradient(to top, rgba(0,3,12,0.55) 0%, transparent 8%),
      /* left edge */
      linear-gradient(to right, rgba(0,3,12,0.60) 0%, transparent 11%),
      /* right edge */
      linear-gradient(to left, rgba(0,3,12,0.60) 0%, transparent 11%);
  }
  .map-svg {
    width: 100%; height: 100%;
    display: block; transform-origin: top left;
    will-change: transform;
  }
  .hit-target { cursor: pointer; }
  /* Territory hover: brighten fill slightly */
  .hit-target:hover + * { filter: brightness(1.15); }
  #territories path:hover { filter: brightness(1.15) url(#paper); }

  /* Selection pulse animation — applied to the selected overlay path */
  @keyframes sel-pulse {
    0%   { opacity: 0.12; }
    50%  { opacity: 0.28; }
    100% { opacity: 0.12; }
  }
  .sel-anim { animation: sel-pulse 1.6s ease-in-out infinite; }

  /* Combat pending flash animation */
  @keyframes combat-flash {
    0%   { opacity: 0.1; }
    50%  { opacity: 0.35; }
    100% { opacity: 0.1; }
  }
  .combat-anim { animation: combat-flash 0.9s ease-in-out infinite; }
`;
