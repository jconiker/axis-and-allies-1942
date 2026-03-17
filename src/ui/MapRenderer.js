import { TERRITORIES } from '../data/territories.js';
import { NATIONS } from '../data/nations.js';
import { getAllUnits } from '../data/units.js';

// Expose territories globally for App._getValidTargets
window.__TERRITORIES = TERRITORIES;

// Nation fill colors — rich painterly tones
const NATION_FILL = {
  ussr:    '#8a1a1a',
  germany: '#2e4a58',
  uk:      '#7a5008',
  japan:   '#a07010',
  usa:     '#1c4a1a',
  neutral: '#4a4830',
};

const NATION_FILL_LIGHT = {
  ussr:    '#c02828',
  germany: '#5090a8',
  uk:      '#c88020',
  japan:   '#d0a828',
  usa:     '#2a7028',
  neutral: '#7a7850',
};

// Stroke color for selection rings
const NATION_RING = {
  ussr:    '#e03030',
  germany: '#70b0c8',
  uk:      '#e8a030',
  japan:   '#e8c030',
  usa:     '#40a838',
  neutral: '#9a9870',
};

const OCEAN_DEEP = '#0b1a30';
const VB_W = 1400, VB_H = 780;

const UNIT_CODE = {
  infantry: 'INF', artillery: 'ART', armor: 'ARM', antiair: 'AA',
  fighter: 'FTR', bomber: 'BMB',
  submarine: 'SUB', destroyer: 'DD', cruiser: 'CA',
  carrier: 'CV', battleship: 'BB', transport: 'TRN',
};

export class MapRenderer {
  constructor(container, app) {
    this.container   = container;
    this.app         = app;
    this.state       = app.state;
    this.selectedId  = null;
    this.validTargets = new Set();
    this.svg         = null;
    this._pinching   = false;
    this._blobGroups = {};
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

    // Ocean background
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', VB_W); bg.setAttribute('height', VB_H);
    bg.setAttribute('fill', 'url(#ocean-grad)');
    svg.appendChild(bg);

    // Nation blob layers — one per nation so territories merge into painted regions
    ['neutral','ussr','germany','uk','japan','usa'].forEach(n => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('id', `blobs-${n}`);
      g.setAttribute('filter', 'url(#goo)');
      svg.appendChild(g);
      this._blobGroups[n] = g;
    });

    this._seaGroup   = this._makeGroup(svg, 'sea-labels');
    this._labelGroup = this._makeGroup(svg, 'terr-labels');
    this._selGroup   = this._makeGroup(svg, 'selections');
    this._unitGroup  = this._makeGroup(svg, 'unit-tokens');
    this._hitGroup   = this._makeGroup(svg, 'hit-targets');

    this._drawSeaLabels();
    this._drawStaticLabels();
    this._drawHitTargets();
    this._updateBlobs();
    this._updateUnits();
    this._updateSelections();
    this._attachInteraction(wrap);
  }

  _makeGroup(parent, id) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('id', id);
    parent.appendChild(g);
    return g;
  }

  _buildDefs(svg) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <radialGradient id="ocean-grad" cx="50%" cy="42%" r="65%">
        <stop offset="0%"   stop-color="#1c3858"/>
        <stop offset="100%" stop-color="${OCEAN_DEEP}"/>
      </radialGradient>

      <!-- Goo/metaball: adjacent same-nation blobs merge into painted regions -->
      <filter id="goo" x="-30%" y="-30%" width="160%" height="160%"
              color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="18" result="blur"/>
        <feColorMatrix type="matrix" result="cm"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 28 -11"/>
      </filter>

      <!-- Drop shadow for text readability over blobs -->
      <filter id="txt-shadow" x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="0" dy="0" stdDeviation="2"
          flood-color="rgba(0,0,0,1)" flood-opacity="1"/>
      </filter>
    `;
    svg.appendChild(defs);
  }

  _blobR(t) {
    if (t.ipc === 0) return 30;
    return Math.max(34, Math.min(76, 18 + t.ipc * 5));
  }

  // ── BLOB TERRITORIES ────────────────────────────────────────────────────────

  _updateBlobs() {
    const own = this.state.ownership || {};
    Object.values(this._blobGroups).forEach(g => { g.innerHTML = ''; });

    Object.values(TERRITORIES).forEach(t => {
      if (t.type === 'sea') return;
      const owner = own[t.id] || 'neutral';
      const g     = this._blobGroups[owner] || this._blobGroups['neutral'];
      if (!g) return;

      const r    = this._blobR(t);
      const fill = NATION_FILL[owner] || NATION_FILL.neutral;
      const c    = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', t.x); c.setAttribute('cy', t.y);
      c.setAttribute('r',  r);   c.setAttribute('fill', fill);
      g.appendChild(c);
    });
  }

  // ── SEA ZONE NUMBERS ────────────────────────────────────────────────────────

  _drawSeaLabels() {
    Object.values(TERRITORIES).forEach(t => {
      if (t.type !== 'sea') return;
      const num = t.id.replace('sz_', '');
      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      txt.setAttribute('x', t.x); txt.setAttribute('y', t.y);
      txt.setAttribute('text-anchor', 'middle'); txt.setAttribute('dominant-baseline', 'middle');
      txt.setAttribute('font-size', '11'); txt.setAttribute('fill', '#2a5878');
      txt.setAttribute('font-family', 'Arial, sans-serif');
      txt.setAttribute('font-weight', 'bold'); txt.setAttribute('pointer-events', 'none');
      txt.textContent = num;
      this._seaGroup.appendChild(txt);
    });
  }

  // ── TERRITORY LABELS (name + IPC, drawn AFTER blobs so they appear on top) ──

  _drawStaticLabels() {
    const capitalIds = new Set(
      Object.values(NATIONS).filter(n => n.capital).map(n => n.capital)
    );

    Object.values(TERRITORIES).forEach(t => {
      if (t.type === 'sea') return;

      const r = this._blobR(t);
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('data-lbl', t.id);

      // ── Capital star (top of blob) ──
      if (capitalIds.has(t.id)) {
        const star = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        star.setAttribute('x', t.x);
        star.setAttribute('y', t.y - r * 0.52);
        star.setAttribute('text-anchor', 'middle');
        star.setAttribute('dominant-baseline', 'middle');
        star.setAttribute('font-size', '14');
        star.setAttribute('fill', '#f0d040');
        star.setAttribute('filter', 'url(#txt-shadow)');
        star.setAttribute('pointer-events', 'none');
        star.textContent = '★';
        g.appendChild(star);
      }

      // ── IC factory badge ──
      if (this.state.industrialComplexes?.[t.id]) {
        const ic = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        ic.setAttribute('x', t.x + r * 0.58);
        ic.setAttribute('y', t.y - r * 0.55);
        ic.setAttribute('font-size', '12');
        ic.setAttribute('pointer-events', 'none');
        ic.textContent = '🏭';
        g.appendChild(ic);
      }

      // ── Territory name — INSIDE blob, readable ──
      const shortName = t.name.length > 14 ? t.name.slice(0, 13) + '…' : t.name;
      const nm = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      nm.setAttribute('x', t.x);
      // Shift up slightly if there's a capital star; shift down if ipc label below
      const nameY = capitalIds.has(t.id) ? t.y - r * 0.1 : t.y - (t.ipc > 0 ? r * 0.18 : 0);
      nm.setAttribute('y', nameY);
      nm.setAttribute('text-anchor', 'middle');
      nm.setAttribute('dominant-baseline', 'middle');
      nm.setAttribute('font-size', r >= 50 ? '9' : '7.5');
      nm.setAttribute('fill', 'rgba(255,248,215,0.95)');
      nm.setAttribute('font-family', 'Arial Narrow, Arial, sans-serif');
      nm.setAttribute('font-weight', 'bold');
      nm.setAttribute('filter', 'url(#txt-shadow)');
      nm.setAttribute('pointer-events', 'none');
      nm.textContent = shortName;
      g.appendChild(nm);

      // ── IPC value — INSIDE blob, gold, ALWAYS visible ──
      if (t.ipc > 0) {
        const ipc = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        ipc.setAttribute('x', t.x);
        ipc.setAttribute('y', t.y + r * 0.30);
        ipc.setAttribute('text-anchor', 'middle');
        ipc.setAttribute('dominant-baseline', 'middle');
        ipc.setAttribute('font-size', r >= 50 ? '14' : '11');
        ipc.setAttribute('fill', '#f8d840');
        ipc.setAttribute('font-family', 'Arial Narrow, Arial, sans-serif');
        ipc.setAttribute('font-weight', 'bold');
        ipc.setAttribute('filter', 'url(#txt-shadow)');
        ipc.setAttribute('pointer-events', 'none');
        ipc.setAttribute('class', 'ipc-val');
        ipc.textContent = `₊${t.ipc}`;
        g.appendChild(ipc);
      }

      this._labelGroup.appendChild(g);
    });
  }

  // ── HIT TARGETS ──────────────────────────────────────────────────────────────

  _drawHitTargets() {
    Object.values(TERRITORIES).forEach(t => {
      const r = t.type === 'sea' ? 22 : this._blobR(t);
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', t.x); c.setAttribute('cy', t.y);
      c.setAttribute('r', r);    c.setAttribute('fill', 'transparent');
      c.setAttribute('data-id', t.id); c.setAttribute('class', 'hit-target');
      c.addEventListener('click',    (e) => { e.stopPropagation(); this.app.onTerritoryClick(t.id); });
      c.addEventListener('touchend', (e) => { e.preventDefault(); e.stopPropagation(); this.app.onTerritoryClick(t.id); });
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

      // Group by nation → type → count
      const byNation = {};
      units.forEach(u => {
        if (!byNation[u.nation]) byNation[u.nation] = {};
        byNation[u.nation][u.type] = (byNation[u.nation][u.type] || 0) + 1;
      });

      const slots = [];
      Object.entries(byNation).forEach(([nat, types]) => {
        Object.entries(types).forEach(([type, count]) => {
          slots.push({ nat, type, count });
        });
      });

      const MAX_VISIBLE = 4;
      const visible     = slots.slice(0, MAX_VISIBLE);
      const tokenW      = 20;
      const totalW      = visible.length * tokenW;
      const startX      = t.x - totalW / 2 + tokenW / 2;
      // Units sit in the upper portion of the blob
      const r           = this._blobR(t);
      const baseY       = t.type === 'sea' ? t.y : t.y - r * 0.35;

      visible.forEach(({ nat, type, count }, i) => {
        const tx    = startX + i * tokenW;
        const color = NATION_RING[nat] || '#666';
        const code  = UNIT_CODE[type] || type.slice(0,3).toUpperCase();

        // Outer ring + dark fill
        this._svgCircle(this._unitGroup, tx, baseY, 9, '#080c12', color, '2');

        // Unit code
        const ct = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        ct.setAttribute('x', tx); ct.setAttribute('y', baseY + 0.5);
        ct.setAttribute('text-anchor', 'middle'); ct.setAttribute('dominant-baseline', 'middle');
        ct.setAttribute('font-size', code.length > 2 ? '4.5' : '5.5');
        ct.setAttribute('fill', '#e8ddc0'); ct.setAttribute('font-weight', 'bold');
        ct.setAttribute('font-family', 'Arial, sans-serif');
        ct.setAttribute('pointer-events', 'none');
        ct.textContent = code;
        this._unitGroup.appendChild(ct);

        // Count badge (top-right of token)
        if (count > 1) {
          const bx = tx + 6, by = baseY - 6;
          this._svgCircle(this._unitGroup, bx, by, 4.5, '#c02020', '#080c12', '0.8');
          const bt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          bt.setAttribute('x', bx); bt.setAttribute('y', by + 0.5);
          bt.setAttribute('text-anchor', 'middle'); bt.setAttribute('dominant-baseline', 'middle');
          bt.setAttribute('font-size', '4.5'); bt.setAttribute('fill', '#fff'); bt.setAttribute('font-weight', 'bold');
          bt.setAttribute('pointer-events', 'none');
          bt.textContent = count > 9 ? '9+' : count;
          this._unitGroup.appendChild(bt);
        }
      });

      // Overflow "+N" badge
      if (slots.length > MAX_VISIBLE) {
        const bx = startX + MAX_VISIBLE * tokenW;
        this._svgCircle(this._unitGroup, bx, baseY, 9, '#252518', '#888', '1');
        const et = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        et.setAttribute('x', bx); et.setAttribute('y', baseY + 0.5);
        et.setAttribute('text-anchor', 'middle'); et.setAttribute('dominant-baseline', 'middle');
        et.setAttribute('font-size', '5'); et.setAttribute('fill', '#bbb');
        et.setAttribute('pointer-events', 'none');
        et.textContent = `+${slots.length - MAX_VISIBLE}`;
        this._unitGroup.appendChild(et);
      }
    });
  }

  _svgCircle(parent, cx, cy, r, fill, stroke, sw) {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', r);
    c.setAttribute('fill', fill); c.setAttribute('stroke', stroke); c.setAttribute('stroke-width', sw);
    c.setAttribute('pointer-events', 'none');
    parent.appendChild(c);
    return c;
  }

  // ── SELECTIONS / HIGHLIGHTS ─────────────────────────────────────────────────

  _updateSelections() {
    if (!this._selGroup) return;
    this._selGroup.innerHTML = '';

    // Selected — dashed white ring
    if (this.selectedId) {
      const t = TERRITORIES[this.selectedId];
      if (t) {
        const r = (t.type === 'sea' ? 22 : this._blobR(t)) + 8;
        const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        ring.setAttribute('cx', t.x); ring.setAttribute('cy', t.y); ring.setAttribute('r', r);
        ring.setAttribute('fill', 'rgba(255,255,255,0.08)');
        ring.setAttribute('stroke', '#ffffff'); ring.setAttribute('stroke-width', '2.5');
        ring.setAttribute('stroke-dasharray', '7,3'); ring.setAttribute('pointer-events', 'none');
        this._selGroup.appendChild(ring);
      }
    }

    // Valid move/attack targets — green glow
    this.validTargets.forEach(tid => {
      const t = TERRITORIES[tid];
      if (!t) return;
      const r = (t.type === 'sea' ? 22 : this._blobR(t)) + 6;
      // Glow fill
      const fill = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      fill.setAttribute('cx', t.x); fill.setAttribute('cy', t.y); fill.setAttribute('r', r);
      fill.setAttribute('fill', 'rgba(50,255,90,0.18)');
      fill.setAttribute('stroke', '#40ff60'); fill.setAttribute('stroke-width', '2.5');
      fill.setAttribute('pointer-events', 'none');
      this._selGroup.appendChild(fill);
    });

    // Pending combat — red dashed ring
    const combats = this.app.turnEngine?.pendingCombats || [];
    combats.forEach(tid => {
      const t = TERRITORIES[tid];
      if (!t) return;
      const r = (t.type === 'sea' ? 22 : this._blobR(t)) + 6;
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ring.setAttribute('cx', t.x); ring.setAttribute('cy', t.y); ring.setAttribute('r', r);
      ring.setAttribute('fill', 'rgba(255,40,40,0.12)');
      ring.setAttribute('stroke', '#ff3030'); ring.setAttribute('stroke-width', '2.5');
      ring.setAttribute('stroke-dasharray', '6,3'); ring.setAttribute('pointer-events', 'none');
      this._selGroup.appendChild(ring);
    });
  }

  // ── UPDATE ───────────────────────────────────────────────────────────────────

  _update() {
    if (!this.svg) return;
    this._updateBlobs();
    this._updateUnits();
    this._updateSelections();
  }

  // ── TOUCH / PAN / ZOOM ───────────────────────────────────────────────────────

  _attachInteraction(wrap) {
    let panning = false, panStart = null;
    let tx = 0, ty = 0, scale = 1;
    const svg = this.svg;

    const apply = () => { svg.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`; };

    wrap.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        panning  = true;
        panStart = { x: e.touches[0].clientX - tx, y: e.touches[0].clientY - ty };
      } else if (e.touches.length === 2) {
        panning = false; this._pinching = true;
        this._pinchStart = {
          dist: Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          ), scale,
        };
      }
    }, { passive: true });

    wrap.addEventListener('touchmove', (e) => {
      if (panning && e.touches.length === 1) {
        tx = e.touches[0].clientX - panStart.x;
        ty = e.touches[0].clientY - panStart.y;
        apply();
      } else if (this._pinching && e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        scale = Math.max(0.4, Math.min(5, this._pinchStart.scale * (dist / this._pinchStart.dist)));
        apply();
      }
    }, { passive: true });

    wrap.addEventListener('touchend', (e) => {
      panning = false;
      if (e.touches.length < 2) this._pinching = false;
    }, { passive: true });

    wrap.addEventListener('dblclick', () => { tx = 0; ty = 0; scale = 1; apply(); });
  }
}

const MAP_CSS = `
  .map-wrap {
    width: 100%; height: 100%;
    overflow: hidden; position: relative;
    background: ${OCEAN_DEEP};
  }
  .map-svg {
    width: 100%; height: 100%;
    display: block; transform-origin: top left;
  }
  .hit-target { cursor: pointer; }
`;
