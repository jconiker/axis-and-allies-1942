import { TERRITORIES } from '../data/territories.js';
import { NATIONS } from '../data/nations.js';

window.__TERRITORIES = TERRITORIES;

// ── NATION COLORS ────────────────────────────────────────────────────────────
const NATION_FILL = {
  ussr:    '#8a1818',
  germany: '#2a4858',
  uk:      '#7a5008',
  japan:   '#a07010',
  usa:     '#1c4a18',
  neutral: '#4a4830',
};
const NATION_BORDER = {
  ussr:    '#c02828',
  germany: '#5898b0',
  uk:      '#d89020',
  japan:   '#d8b020',
  usa:     '#38a030',
  neutral: '#8a8860',
};

const OCEAN_COLOR = '#0b1a30';
const VB_W = 1400, VB_H = 780;

const UNIT_CODE = {
  infantry:'INF', artillery:'ART', armor:'ARM', antiair:'AA',
  fighter:'FTR', bomber:'BMB',
  submarine:'SUB', destroyer:'DD', cruiser:'CA',
  carrier:'CV', battleship:'BB', transport:'TRN',
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

    // Invisible click targets on top
    this._hitGroup = this._makeGroup(svg, 'hit-targets');

    this._drawTerritories();
    this._drawSeaLabels();
    this._drawStaticLabels();
    this._drawHitTargets();
    this._updateUnits();
    this._updateSelections();
    this._attachInteraction(wrap);
  }

  _buildDefs(svg) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <radialGradient id="ocean-grad" cx="50%" cy="45%" r="70%">
        <stop offset="0%"   stop-color="#1c3858"/>
        <stop offset="100%" stop-color="#080f1c"/>
      </radialGradient>
      <!-- Text shadow filter for readability -->
      <filter id="txt-sh" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="2.5"
          flood-color="rgba(0,0,0,1)" flood-opacity="1"/>
      </filter>
      <!-- Glow filter for selected territory -->
      <filter id="sel-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="4" result="blur"/>
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

  _drawTerritories() {
    this._terrGroup.innerHTML = '';
    this._terrPaths = {};
    const own = this.state.ownership || {};

    Object.values(TERRITORIES).forEach(t => {
      if (t.type === 'sea') return;
      const cell = this._cells[t.id];
      if (!cell) return;

      const owner = own[t.id] || 'neutral';
      const fill  = NATION_FILL[owner]   || NATION_FILL.neutral;
      const stroke = NATION_BORDER[owner] || NATION_BORDER.neutral;

      const path = this._svgEl('path');
      path.setAttribute('d', cellToPath(cell));
      path.setAttribute('fill', fill);
      path.setAttribute('stroke', stroke);
      path.setAttribute('stroke-width', '1.5');
      path.setAttribute('stroke-linejoin', 'round');
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
      txt.setAttribute('fill', '#2a5878');
      txt.setAttribute('font-family', 'Arial, sans-serif');
      txt.setAttribute('font-weight', 'bold');
      txt.setAttribute('pointer-events', 'none');
      txt.textContent = num;
      this._seaGroup.appendChild(txt);
    });
  }

  // ── TERRITORY LABELS (name + IPC, drawn on top of polygons) ────────────────

  _drawStaticLabels() {
    const capitalIds = new Set(
      Object.values(NATIONS).filter(n => n.capital).map(n => n.capital)
    );

    Object.values(TERRITORIES).forEach(t => {
      if (t.type === 'sea') return;

      const g = this._svgEl('g');
      g.setAttribute('data-lbl', t.id);
      g.setAttribute('pointer-events', 'none');

      // Approximate territory visual radius for layout
      const r = t.ipc === 0 ? 22 : Math.max(28, Math.min(60, 16 + t.ipc * 4));

      // Capital star
      if (capitalIds.has(t.id)) {
        const star = this._svgEl('text');
        star.setAttribute('x', t.x); star.setAttribute('y', t.y - r * 0.5);
        star.setAttribute('text-anchor', 'middle');
        star.setAttribute('dominant-baseline', 'middle');
        star.setAttribute('font-size', '14'); star.setAttribute('fill', '#f0d040');
        star.setAttribute('filter', 'url(#txt-sh)');
        star.textContent = '★';
        g.appendChild(star);
      }

      // Factory badge
      if (this.state.industrialComplexes?.[t.id]) {
        const ic = this._svgEl('text');
        ic.setAttribute('x', t.x + r * 0.5); ic.setAttribute('y', t.y - r * 0.5);
        ic.setAttribute('font-size', '12');
        ic.textContent = '🏭';
        g.appendChild(ic);
      }

      // Territory name
      const shortName = t.name.length > 14 ? t.name.slice(0, 13) + '…' : t.name;
      const nm = this._svgEl('text');
      nm.setAttribute('x', t.x);
      nm.setAttribute('y', capitalIds.has(t.id) ? t.y : t.y - (t.ipc > 0 ? r * 0.15 : 0));
      nm.setAttribute('text-anchor', 'middle');
      nm.setAttribute('dominant-baseline', 'middle');
      nm.setAttribute('font-size', r >= 44 ? '9' : '7.5');
      nm.setAttribute('fill', 'rgba(255,248,215,0.95)');
      nm.setAttribute('font-family', 'Arial Narrow, Arial, sans-serif');
      nm.setAttribute('font-weight', 'bold');
      nm.setAttribute('filter', 'url(#txt-sh)');
      nm.textContent = shortName;
      g.appendChild(nm);

      // IPC value
      if (t.ipc > 0) {
        const ipc = this._svgEl('text');
        ipc.setAttribute('x', t.x); ipc.setAttribute('y', t.y + r * 0.32);
        ipc.setAttribute('text-anchor', 'middle');
        ipc.setAttribute('dominant-baseline', 'middle');
        ipc.setAttribute('font-size', r >= 44 ? '14' : '11');
        ipc.setAttribute('fill', '#f8d840');
        ipc.setAttribute('font-family', 'Arial Narrow, Arial, sans-serif');
        ipc.setAttribute('font-weight', 'bold');
        ipc.setAttribute('filter', 'url(#txt-sh)');
        ipc.setAttribute('class', 'ipc-val');
        ipc.textContent = `+${t.ipc}`;
        g.appendChild(ipc);
      }

      this._labelGroup.appendChild(g);
    });
  }

  // ── HIT TARGETS ─────────────────────────────────────────────────────────────

  _drawHitTargets() {
    Object.values(TERRITORIES).forEach(t => {
      const r = t.type === 'sea' ? 22 : Math.max(28, Math.min(60, 16 + t.ipc * 4));
      const c = this._svgEl('circle');
      c.setAttribute('cx', t.x); c.setAttribute('cy', t.y);
      c.setAttribute('r', r);    c.setAttribute('fill', 'transparent');
      c.setAttribute('data-id', t.id); c.setAttribute('class', 'hit-target');
      c.addEventListener('click',    e => { e.stopPropagation(); this.app.onTerritoryClick(t.id); });
      c.addEventListener('touchend', e => { e.preventDefault(); e.stopPropagation(); this.app.onTerritoryClick(t.id); });
      this._hitGroup.appendChild(c);
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
      const TW = 20;
      const startX = t.x - (visible.length * TW) / 2 + TW / 2;
      const baseY  = t.type === 'sea' ? t.y : t.y - (t.ipc === 0 ? 10 : Math.max(22, Math.min(50, 14 + t.ipc * 3.5)) * 0.38);

      visible.forEach(({ nat, type, count }, i) => {
        const tx    = startX + i * TW;
        const ring  = NATION_BORDER[nat] || '#666';
        const code  = UNIT_CODE[type] || type.slice(0, 3).toUpperCase();

        this._circle(this._unitGroup, tx, baseY, 9, '#080c12', ring, 2);

        const ct = this._svgEl('text');
        ct.setAttribute('x', tx); ct.setAttribute('y', baseY + 0.5);
        ct.setAttribute('text-anchor', 'middle'); ct.setAttribute('dominant-baseline', 'middle');
        ct.setAttribute('font-size', code.length > 2 ? '4.5' : '5.5');
        ct.setAttribute('fill', '#e8ddc0'); ct.setAttribute('font-weight', 'bold');
        ct.setAttribute('font-family', 'Arial, sans-serif'); ct.setAttribute('pointer-events', 'none');
        ct.textContent = code;
        this._unitGroup.appendChild(ct);

        if (count > 1) {
          const bx = tx + 6, by = baseY - 6;
          this._circle(this._unitGroup, bx, by, 4.5, '#c02020', '#080c12', 0.8);
          const bt = this._svgEl('text');
          bt.setAttribute('x', bx); bt.setAttribute('y', by + 0.5);
          bt.setAttribute('text-anchor', 'middle'); bt.setAttribute('dominant-baseline', 'middle');
          bt.setAttribute('font-size', '4.5'); bt.setAttribute('fill', '#fff');
          bt.setAttribute('font-weight', 'bold'); bt.setAttribute('pointer-events', 'none');
          bt.textContent = count > 9 ? '9+' : count;
          this._unitGroup.appendChild(bt);
        }
      });

      if (slots.length > MAX_VIS) {
        const bx = startX + MAX_VIS * TW;
        this._circle(this._unitGroup, bx, baseY, 9, '#252518', '#888', 1);
        const et = this._svgEl('text');
        et.setAttribute('x', bx); et.setAttribute('y', baseY + 0.5);
        et.setAttribute('text-anchor', 'middle'); et.setAttribute('dominant-baseline', 'middle');
        et.setAttribute('font-size', '5'); et.setAttribute('fill', '#bbb');
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

    // Highlight valid target territories with fill overlay
    this.validTargets.forEach(tid => {
      const cell = this._cells[tid];
      const t    = TERRITORIES[tid];
      if (!cell || !t) return;

      const p = this._svgEl('path');
      p.setAttribute('d', cellToPath(cell));
      p.setAttribute('fill', 'rgba(50,255,90,0.22)');
      p.setAttribute('stroke', '#40ff60');
      p.setAttribute('stroke-width', '2.5');
      p.setAttribute('pointer-events', 'none');
      this._selGroup.appendChild(p);

      // Sea zone valid targets (no voronoi cell) — use circle
      if (!this._cells[tid]) {
        this._circle(this._selGroup, t.x, t.y, 26, 'rgba(50,255,90,0.22)', '#40ff60', 2.5);
      }
    });

    // Also highlight sea zone targets with circles
    this.validTargets.forEach(tid => {
      const t = TERRITORIES[tid];
      if (t && t.type === 'sea') {
        this._circle(this._selGroup, t.x, t.y, 26, 'rgba(50,255,90,0.22)', '#40ff60', 2.5);
      }
    });

    // Selected territory — white outline over polygon
    if (this.selectedId) {
      const cell = this._cells[this.selectedId];
      const t    = TERRITORIES[this.selectedId];
      if (cell) {
        const p = this._svgEl('path');
        p.setAttribute('d', cellToPath(cell));
        p.setAttribute('fill', 'rgba(255,255,255,0.10)');
        p.setAttribute('stroke', '#ffffff');
        p.setAttribute('stroke-width', '3');
        p.setAttribute('stroke-dasharray', '8,4');
        p.setAttribute('pointer-events', 'none');
        this._selGroup.appendChild(p);
      } else if (t) {
        this._circle(this._selGroup, t.x, t.y, 30, 'rgba(255,255,255,0.1)', '#ffffff', 3);
      }
    }

    // Pending combat — red dashed overlay
    const combats = this.app.turnEngine?.pendingCombats || [];
    combats.forEach(tid => {
      const cell = this._cells[tid];
      const t    = TERRITORIES[tid];
      if (cell) {
        const p = this._svgEl('path');
        p.setAttribute('d', cellToPath(cell));
        p.setAttribute('fill', 'rgba(255,40,40,0.15)');
        p.setAttribute('stroke', '#ff3030');
        p.setAttribute('stroke-width', '2.5');
        p.setAttribute('stroke-dasharray', '6,3');
        p.setAttribute('pointer-events', 'none');
        this._selGroup.appendChild(p);
      } else if (t) {
        this._circle(this._selGroup, t.x, t.y, 28, 'rgba(255,40,40,0.15)', '#ff3030', 2.5);
      }
    });
  }

  // ── UPDATE ───────────────────────────────────────────────────────────────────

  _update() {
    if (!this.svg) return;
    this._updateTerritoryColors();
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
  }
}

const MAP_CSS = `
  .map-wrap {
    width: 100%; height: 100%;
    overflow: hidden; position: relative;
    background: ${OCEAN_COLOR};
    cursor: grab;
    user-select: none;
  }
  .map-wrap:active { cursor: grabbing; }
  .map-svg {
    width: 100%; height: 100%;
    display: block; transform-origin: top left;
    will-change: transform;
  }
  .hit-target { cursor: pointer; }
`;
