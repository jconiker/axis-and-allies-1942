import { TERRITORIES } from '../data/territories.js';
import { NATIONS } from '../data/nations.js';
import { getAllUnits } from '../data/units.js';

// Expose territories globally for App._getValidTargets
window.__TERRITORIES = TERRITORIES;

// Nation fill colors — richer, painterly tones matching App Store game
const NATION_FILL = {
  ussr:    '#7a1818',
  germany: '#3a5050',
  uk:      '#6a4406',
  japan:   '#9a6808',
  usa:     '#1e4a1c',
  neutral: '#4a4830',
};

// Stroke color for territory rings / selection
const NATION_RING = {
  ussr:    '#c02828',
  germany: '#6090a0',
  uk:      '#c88018',
  japan:   '#d0a020',
  usa:     '#3a8030',
  neutral: '#7a7850',
};

const OCEAN_DEEP = '#0e1e38';
const VB_W = 1400, VB_H = 780;

// One-char unit codes — matches App Store shorthand
const UNIT_CODE = {
  infantry: 'I', artillery: 'A', armor: 'T', antiair: 'AA',
  fighter: 'F', bomber: 'B', tactical_bomber: 'TB',
  submarine: 'S', destroyer: 'D', cruiser: 'C',
  carrier: 'V', battleship: 'W', transport: 'P',
};

export class MapRenderer {
  constructor(container, app) {
    this.container  = container;
    this.app        = app;
    this.state      = app.state;
    this.selectedId = null;
    this.validTargets = new Set();
    this.svg        = null;
    this._pinching  = false;
    this._blobGroups = {};   // nation id → <g> element
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

    // ── Painted territory blob layers (bottom, one per nation) ──
    ['neutral','ussr','germany','uk','japan','usa'].forEach(n => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('id', `blobs-${n}`);
      g.setAttribute('filter', 'url(#goo)');
      svg.appendChild(g);
      this._blobGroups[n] = g;
    });

    // Sea zone number labels (below territory labels)
    this._seaGroup = this._makeGroup(svg, 'sea-labels');

    // Static territory labels + capital stars
    this._labelGroup = this._makeGroup(svg, 'terr-labels');

    // Selection / highlight rings
    this._selGroup = this._makeGroup(svg, 'selections');

    // Unit token layer
    this._unitGroup = this._makeGroup(svg, 'unit-tokens');

    // Invisible hit targets (on top so they always receive clicks)
    this._hitGroup = this._makeGroup(svg, 'hit-targets');

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

    // Ocean radial gradient
    defs.innerHTML = `
      <radialGradient id="ocean-grad" cx="50%" cy="42%" r="60%">
        <stop offset="0%"   stop-color="#1a3452"/>
        <stop offset="100%" stop-color="#090e1c"/>
      </radialGradient>

      <!-- Goo/metaball filter — makes adjacent same-nation territory circles merge -->
      <filter id="goo" x="-25%" y="-25%" width="150%" height="150%"
              color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="20" result="blur"/>
        <feColorMatrix type="matrix" result="cm"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 26 -10"/>
      </filter>

      <!-- Subtle vignette over ocean -->
      <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
        <stop offset="60%"  stop-color="transparent"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.55)"/>
      </radialGradient>
    `;
    svg.appendChild(defs);
  }

  // Radius of the territory blob circle — larger IPC = larger blob
  _blobR(t) {
    if (t.ipc === 0) return 32;
    return Math.max(36, Math.min(78, 20 + t.ipc * 5));
  }

  // ── BLOB TERRITORIES ────────────────────────────────────────────────────────

  _updateBlobs() {
    const own = this.state.ownership || {};

    // Clear all blob groups
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
      txt.setAttribute('font-size', '10'); txt.setAttribute('fill', '#2a5272');
      txt.setAttribute('font-family', 'Arial, sans-serif');
      txt.setAttribute('font-weight', 'bold');
      txt.textContent = num;
      this._seaGroup.appendChild(txt);
    });
  }

  // ── STATIC TERRITORY LABELS ─────────────────────────────────────────────────

  _drawStaticLabels() {
    const capitalIds = new Set(
      Object.values(NATIONS).filter(n => n.capital).map(n => n.capital)
    );

    Object.values(TERRITORIES).forEach(t => {
      if (t.type === 'sea') return;

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('data-lbl', t.id);

      // IPC value (hidden when units present — toggled in _updateIpcVis)
      if (t.ipc > 0) {
        const ipcTxt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        ipcTxt.setAttribute('x', t.x); ipcTxt.setAttribute('y', t.y);
        ipcTxt.setAttribute('text-anchor', 'middle'); ipcTxt.setAttribute('dominant-baseline', 'middle');
        ipcTxt.setAttribute('font-size', '12'); ipcTxt.setAttribute('fill', '#c0b880');
        ipcTxt.setAttribute('font-family', 'Arial, sans-serif');
        ipcTxt.setAttribute('font-weight', 'bold');
        ipcTxt.setAttribute('class', 'ipc-val');
        ipcTxt.textContent = t.ipc;
        g.appendChild(ipcTxt);
      }

      // Capital star
      if (capitalIds.has(t.id)) {
        const star = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        star.setAttribute('x', t.x); star.setAttribute('y', t.y - 22);
        star.setAttribute('text-anchor', 'middle'); star.setAttribute('dominant-baseline', 'middle');
        star.setAttribute('font-size', '14'); star.setAttribute('fill', '#e8c840');
        star.setAttribute('pointer-events', 'none');
        star.textContent = '★';
        g.appendChild(star);
      }

      // IC badge
      if (this.state.industrialComplexes?.[t.id]) {
        const ic = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        ic.setAttribute('x', t.x + 18); ic.setAttribute('y', t.y - 18);
        ic.setAttribute('font-size', '11'); ic.setAttribute('class', 'ic-badge');
        ic.textContent = '🏭';
        g.appendChild(ic);
      }

      // Territory name (short)
      const nm = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      nm.setAttribute('x', t.x); nm.setAttribute('y', t.y + this._blobR(t) + 8);
      nm.setAttribute('text-anchor', 'middle'); nm.setAttribute('dominant-baseline', 'hanging');
      nm.setAttribute('font-size', '7'); nm.setAttribute('fill', '#8a8a6a');
      nm.setAttribute('font-family', 'Arial, sans-serif');
      nm.setAttribute('pointer-events', 'none');
      nm.textContent = t.name.length > 13 ? t.name.slice(0, 12) + '…' : t.name;
      g.appendChild(nm);

      this._labelGroup.appendChild(g);
    });
  }

  // ── HIT TARGETS (invisible click circles) ────────────────────────────────────

  _drawHitTargets() {
    Object.values(TERRITORIES).forEach(t => {
      const r = t.type === 'sea' ? 18 : this._blobR(t);
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

      // Build slot list: [{nation, type, count}]
      const slots = [];
      Object.entries(byNation).forEach(([nat, types]) => {
        Object.entries(types).forEach(([type, count]) => {
          slots.push({ nat, type, count });
        });
      });

      const MAX_VISIBLE = 4;
      const visible = slots.slice(0, MAX_VISIBLE);
      const totalW  = Math.min(slots.length, MAX_VISIBLE + (slots.length > MAX_VISIBLE ? 1 : 0)) * 22;
      const startX  = t.x - totalW / 2 + 11;
      const baseY   = t.y - (t.type === 'sea' ? 10 : 16);

      visible.forEach(({ nat, type, count }, i) => {
        const tx    = startX + i * 22;
        const color = NATION_RING[nat] || '#666';
        const code  = UNIT_CODE[type] || type.slice(0, 2).toUpperCase();

        // Token circle
        this._svgCircle(this._unitGroup, tx, baseY, 10, '#0c1018', color, '1.8');

        // Unit code
        const ct = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        ct.setAttribute('x', tx); ct.setAttribute('y', baseY + 0.5);
        ct.setAttribute('text-anchor', 'middle'); ct.setAttribute('dominant-baseline', 'middle');
        ct.setAttribute('font-size', code.length > 1 ? '5' : '7');
        ct.setAttribute('fill', '#d8d0b0'); ct.setAttribute('font-weight', 'bold');
        ct.setAttribute('font-family', 'Arial, sans-serif');
        ct.textContent = code;
        this._unitGroup.appendChild(ct);

        // Count badge
        if (count > 1) {
          const bx = tx + 7, by = baseY - 7;
          this._svgCircle(this._unitGroup, bx, by, 5, '#c02020', '#0c1018', '0.8');
          const bt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          bt.setAttribute('x', bx); bt.setAttribute('y', by + 0.5);
          bt.setAttribute('text-anchor', 'middle'); bt.setAttribute('dominant-baseline', 'middle');
          bt.setAttribute('font-size', '5'); bt.setAttribute('fill', '#fff'); bt.setAttribute('font-weight', 'bold');
          bt.textContent = count > 9 ? '9+' : count;
          this._unitGroup.appendChild(bt);
        }
      });

      // "+N more" overflow badge
      if (slots.length > MAX_VISIBLE) {
        const excess = slots.length - MAX_VISIBLE;
        const bx = startX + MAX_VISIBLE * 22;
        this._svgCircle(this._unitGroup, bx, baseY, 10, '#252518', '#888', '1');
        const et = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        et.setAttribute('x', bx); et.setAttribute('y', baseY + 0.5);
        et.setAttribute('text-anchor', 'middle'); et.setAttribute('dominant-baseline', 'middle');
        et.setAttribute('font-size', '6'); et.setAttribute('fill', '#bbb');
        et.textContent = `+${excess}`;
        this._unitGroup.appendChild(et);
      }
    });

    // Update IPC label visibility
    this._updateIpcVis();
  }

  _svgCircle(parent, cx, cy, r, fill, stroke, sw) {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', r);
    c.setAttribute('fill', fill); c.setAttribute('stroke', stroke); c.setAttribute('stroke-width', sw);
    parent.appendChild(c);
    return c;
  }

  // ── SELECTIONS / HIGHLIGHTS ─────────────────────────────────────────────────

  _updateSelections() {
    if (!this._selGroup) return;
    this._selGroup.innerHTML = '';

    // Selected territory — dashed white ring
    if (this.selectedId) {
      const t = TERRITORIES[this.selectedId];
      if (t) {
        const r = this._blobR(t) + 7;
        const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        ring.setAttribute('cx', t.x); ring.setAttribute('cy', t.y);
        ring.setAttribute('r',  r);   ring.setAttribute('fill',   'none');
        ring.setAttribute('stroke', '#ffffff'); ring.setAttribute('stroke-width', '2.5');
        ring.setAttribute('stroke-dasharray', '6,3'); ring.setAttribute('opacity', '0.9');
        this._selGroup.appendChild(ring);
      }
    }

    // Valid move/attack targets — green glow rings
    this.validTargets.forEach(tid => {
      const t = TERRITORIES[tid];
      if (!t) return;
      const r = this._blobR(t) + 5;
      const fill = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      fill.setAttribute('cx', t.x); fill.setAttribute('cy', t.y); fill.setAttribute('r', r);
      fill.setAttribute('fill', 'rgba(40,255,80,0.12)');
      fill.setAttribute('stroke', '#30e060'); fill.setAttribute('stroke-width', '2');
      this._selGroup.appendChild(fill);
    });

    // Pending combat — red dashed ring
    const combats = this.app.turnEngine?.pendingCombats || [];
    combats.forEach(tid => {
      const t = TERRITORIES[tid];
      if (!t) return;
      const r = this._blobR(t) + 5;
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ring.setAttribute('cx', t.x); ring.setAttribute('cy', t.y); ring.setAttribute('r', r);
      ring.setAttribute('fill', 'rgba(255,40,40,0.1)');
      ring.setAttribute('stroke', '#ff4040'); ring.setAttribute('stroke-width', '2.5');
      ring.setAttribute('stroke-dasharray', '5,2');
      this._selGroup.appendChild(ring);
    });
  }

  _updateIpcVis() {
    Object.values(TERRITORIES).forEach(t => {
      if (t.type === 'sea') return;
      const lg = this._labelGroup?.querySelector(`[data-lbl="${t.id}"]`);
      if (!lg) return;
      const units = this.state.getUnits(t.id);
      const ipcEl = lg.querySelector('.ipc-val');
      if (ipcEl) ipcEl.setAttribute('visibility', units.length > 0 ? 'hidden' : 'visible');
    });
  }

  // ── UPDATE ───────────────────────────────────────────────────────────────────

  _update() {
    if (!this.svg) return;
    this._updateBlobs();
    this._updateUnits();
    this._updateSelections();
  }

  // ── TOUCH / ZOOM ─────────────────────────────────────────────────────────────

  _attachInteraction(wrap) {
    let panning = false, panStart = null;
    let tx = 0, ty = 0, scale = 1;
    const svg = this.svg;

    const applyTransform = () => {
      svg.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`;
    };

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
          ),
          scale,
        };
      }
    }, { passive: true });

    wrap.addEventListener('touchmove', (e) => {
      if (panning && e.touches.length === 1) {
        tx = e.touches[0].clientX - panStart.x;
        ty = e.touches[0].clientY - panStart.y;
        applyTransform();
      } else if (this._pinching && e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        scale = Math.max(0.4, Math.min(4, this._pinchStart.scale * (dist / this._pinchStart.dist)));
        applyTransform();
      }
    }, { passive: true });

    wrap.addEventListener('touchend', (e) => {
      panning = false;
      if (e.touches.length < 2) this._pinching = false;
    }, { passive: true });

    wrap.addEventListener('dblclick', () => { tx = 0; ty = 0; scale = 1; applyTransform(); });
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
  .hit-target  { cursor: pointer; }
  .hit-target:hover { opacity: 0.01; }
`;
