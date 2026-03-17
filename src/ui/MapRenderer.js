import { TERRITORIES } from '../data/territories.js';
import { NATIONS } from '../data/nations.js';
import { getAllUnits } from '../data/units.js';

// Expose territories globally for App._getValidTargets
window.__TERRITORIES = TERRITORIES;

const NATION_COLORS = {
  ussr:    '#b02020',
  germany: '#707870',
  uk:      '#c8860a',
  japan:   '#c8b818',
  usa:     '#3a7030',
  neutral: '#7a7a5a',
};
const OCEAN_COLOR  = '#0a1e3a';
const SEA_COLOR    = '#0d2545';
const NEUTRAL_COLOR = '#5a5a3a';

// Min/max from territory data for viewBox
const VB_W = 1400, VB_H = 780;

export class MapRenderer {
  constructor(container, app) {
    this.container = container;
    this.app = app;
    this.state = app.state;
    this.selectedId = null;
    this.validTargets = new Set();
    this.svg = null;
    this._scale = 1;
    this._offsetX = 0;
    this._offsetY = 0;
    this._pinching = false;
  }

  render() {
    if (!this.svg) {
      this._build();
    } else {
      this._update();
    }
  }

  setSelection(territoryId, validTargets = []) {
    this.selectedId = territoryId;
    this.validTargets = new Set(validTargets);
    this._update();
  }

  clearSelection() {
    this.selectedId = null;
    this.validTargets.clear();
    this._update();
  }

  // ── BUILD (first render) ────────────────────────────────────────────────────

  _build() {
    this.container.innerHTML = `<style>${MAP_CSS}</style>`;
    const wrap = document.createElement('div');
    wrap.className = 'map-wrap';
    this.container.appendChild(wrap);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${VB_W} ${VB_H}`);
    svg.setAttribute('class', 'map-svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    this.svg = svg;
    wrap.appendChild(svg);

    // Ocean background
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', VB_W); bg.setAttribute('height', VB_H);
    bg.setAttribute('fill', OCEAN_COLOR);
    svg.appendChild(bg);

    // Group for connections (behind territories)
    this._connGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this._connGroup.setAttribute('class', 'connections');
    svg.appendChild(this._connGroup);

    // Group for territories
    this._terrGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this._terrGroup.setAttribute('class', 'territories');
    svg.appendChild(this._terrGroup);

    // Draw connections
    this._drawConnections();
    // Draw territory nodes
    this._drawTerritories();

    // Touch/click handling
    this._attachInteraction(wrap);
  }

  _drawConnections() {
    const drawn = new Set();
    Object.values(TERRITORIES).forEach(t => {
      (t.adjacent || []).forEach(adjId => {
        const key = [t.id, adjId].sort().join('|');
        if (drawn.has(key)) return;
        drawn.add(key);
        const adj = TERRITORIES[adjId];
        if (!adj) return;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', t.x); line.setAttribute('y1', t.y);
        line.setAttribute('x2', adj.x); line.setAttribute('y2', adj.y);
        line.setAttribute('class', `conn ${t.type === 'sea' || adj.type === 'sea' ? 'sea-conn' : 'land-conn'}`);
        this._connGroup.appendChild(line);
      });
    });
  }

  _drawTerritories() {
    Object.values(TERRITORIES).forEach(t => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', `terr-node ${t.type}`);
      g.setAttribute('data-id', t.id);

      if (t.type === 'sea') {
        this._buildSeaNode(g, t);
      } else {
        this._buildLandNode(g, t);
      }

      g.addEventListener('click', (e) => { e.stopPropagation(); this.app.onTerritoryClick(t.id); });
      g.addEventListener('touchend', (e) => { e.preventDefault(); e.stopPropagation(); this.app.onTerritoryClick(t.id); });
      this._terrGroup.appendChild(g);
    });
  }

  _buildLandNode(g, t) {
    const owner = this.state.ownership[t.id];
    const color = NATION_COLORS[owner] || NEUTRAL_COLOR;
    const r = Math.max(10, Math.min(22, 8 + (t.ipc || 0) * 1.5));

    // Shadow
    const shadow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    shadow.setAttribute('cx', t.x + 1); shadow.setAttribute('cy', t.y + 1);
    shadow.setAttribute('r', r + 1); shadow.setAttribute('fill', 'rgba(0,0,0,0.5)');
    g.appendChild(shadow);

    // Main circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', t.x); circle.setAttribute('cy', t.y);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', color);
    circle.setAttribute('stroke', '#1a1a1a');
    circle.setAttribute('stroke-width', '1');
    circle.setAttribute('class', 'terr-circle');
    g.appendChild(circle);

    // Capital star
    if (Object.values(NATIONS).some(n => n.capital === t.id && n.id !== 'neutral')) {
      const star = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      star.setAttribute('x', t.x); star.setAttribute('y', t.y + 1);
      star.setAttribute('text-anchor', 'middle'); star.setAttribute('dominant-baseline', 'middle');
      star.setAttribute('font-size', Math.max(8, r * 0.7)); star.setAttribute('fill', '#fff');
      star.setAttribute('class', 'capital-star'); star.textContent = '★';
      g.appendChild(star);
    }

    // IPC value
    if (t.ipc > 0) {
      const ipcText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      ipcText.setAttribute('x', t.x); ipcText.setAttribute('y', t.y + 1);
      ipcText.setAttribute('text-anchor', 'middle'); ipcText.setAttribute('dominant-baseline', 'middle');
      ipcText.setAttribute('font-size', Math.max(6, r * 0.55)); ipcText.setAttribute('fill', '#fff');
      ipcText.setAttribute('font-weight', 'bold'); ipcText.setAttribute('class', 'ipc-label');
      ipcText.textContent = t.ipc;
      g.appendChild(ipcText);
    }

    // Neutral tag
    if (t.neutral) {
      const ntag = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ntag.setAttribute('cx', t.x + r - 3); ntag.setAttribute('cy', t.y - r + 3);
      ntag.setAttribute('r', 4); ntag.setAttribute('fill', '#c8c880'); ntag.setAttribute('class', 'neutral-dot');
      g.appendChild(ntag);
    }

    // Industrial complex marker
    if (this.state.industrialComplexes?.[t.id]) {
      const ic = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      ic.setAttribute('x', t.x - 4); ic.setAttribute('y', t.y - r - 8);
      ic.setAttribute('width', 8); ic.setAttribute('height', 5);
      ic.setAttribute('fill', '#aaaaee'); ic.setAttribute('rx', 1);
      g.appendChild(ic);
    }

    // Territory name label
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', t.x); label.setAttribute('y', t.y + r + 9);
    label.setAttribute('text-anchor', 'middle'); label.setAttribute('dominant-baseline', 'hanging');
    label.setAttribute('font-size', '7'); label.setAttribute('fill', '#c8c8a8');
    label.setAttribute('class', 'terr-label');
    label.textContent = t.name.length > 14 ? t.name.slice(0, 13) + '…' : t.name;
    g.appendChild(label);
  }

  _buildSeaNode(g, t) {
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', t.x); dot.setAttribute('cy', t.y);
    dot.setAttribute('r', 5); dot.setAttribute('fill', SEA_COLOR);
    dot.setAttribute('stroke', '#1a3a6a'); dot.setAttribute('stroke-width', '1');
    dot.setAttribute('class', 'sea-dot');
    g.appendChild(dot);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', t.x + 7); label.setAttribute('y', t.y);
    label.setAttribute('dominant-baseline', 'middle');
    label.setAttribute('font-size', '6'); label.setAttribute('fill', '#2a5a8a');
    label.setAttribute('class', 'sz-label');
    label.textContent = t.id.replace('sz_', 'SZ');
    g.appendChild(label);
  }

  // ── UPDATE (subsequent renders) ─────────────────────────────────────────────

  _update() {
    if (!this.svg) return;
    const nation = this.state.currentNation;
    const phase = this.state.phase;

    Object.values(TERRITORIES).forEach(t => {
      const g = this.svg.querySelector(`[data-id="${t.id}"]`);
      if (!g) return;

      if (t.type === 'sea') {
        this._updateSeaNode(g, t);
      } else {
        this._updateLandNode(g, t, nation, phase);
      }
    });
  }

  _updateLandNode(g, t, nation, phase) {
    const owner = this.state.ownership[t.id];
    const color = NATION_COLORS[owner] || NEUTRAL_COLOR;
    const units = this.state.getUnits(t.id);
    const myUnits = this.state.getUnits(t.id, nation);
    const combatPending = (this.turnEngine?.pendingCombats || []).includes(t.id);

    const circle = g.querySelector('.terr-circle');
    const r = parseFloat(circle?.getAttribute('r') || 12);

    if (circle) {
      circle.setAttribute('fill', color);
      circle.setAttribute('stroke-width', '1');
      circle.setAttribute('stroke', '#1a1a1a');
      circle.setAttribute('opacity', '1');
    }

    // Selected
    if (t.id === this.selectedId && circle) {
      circle.setAttribute('stroke', '#ffffff');
      circle.setAttribute('stroke-width', '3');
    }

    // Valid target highlight
    if (this.validTargets.has(t.id) && circle) {
      circle.setAttribute('stroke', '#40ff80');
      circle.setAttribute('stroke-width', '2.5');
      const pulse = g.querySelector('.pulse');
      if (!pulse) {
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        p.setAttribute('cx', t.x); p.setAttribute('cy', t.y);
        p.setAttribute('r', r + 4); p.setAttribute('fill', 'none');
        p.setAttribute('stroke', '#40ff80'); p.setAttribute('stroke-width', '1.5');
        p.setAttribute('class', 'pulse'); p.setAttribute('opacity', '0.6');
        g.insertBefore(p, circle);
      }
    } else {
      g.querySelector('.pulse')?.remove();
    }

    // Pending combat indicator
    if (combatPending && circle) {
      circle.setAttribute('stroke', '#ff4040');
      circle.setAttribute('stroke-width', '2');
    }

    // Unit counter badge
    let badge = g.querySelector('.unit-badge');
    const totalUnits = units.length;
    if (totalUnits > 0) {
      if (!badge) {
        badge = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        badge.setAttribute('class', 'unit-badge');
        g.appendChild(badge);
      }
      badge.innerHTML = '';
      const bx = t.x + r - 2; const by = t.y - r + 2;
      const bg2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      bg2.setAttribute('cx', bx); bg2.setAttribute('cy', by);
      bg2.setAttribute('r', 7); bg2.setAttribute('fill', '#111'); bg2.setAttribute('stroke', '#666'); bg2.setAttribute('stroke-width', '0.5');
      badge.appendChild(bg2);
      const bt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      bt.setAttribute('x', bx); bt.setAttribute('y', by + 0.5);
      bt.setAttribute('text-anchor', 'middle'); bt.setAttribute('dominant-baseline', 'middle');
      bt.setAttribute('font-size', '7'); bt.setAttribute('fill', '#fff'); bt.setAttribute('font-weight', 'bold');
      bt.textContent = totalUnits > 9 ? '9+' : totalUnits;
      badge.appendChild(bt);
    } else if (badge) {
      badge.remove();
    }

    // IPC label update
    const ipcEl = g.querySelector('.ipc-label');
    if (ipcEl) {
      ipcEl.setAttribute('visibility', totalUnits === 0 ? 'visible' : 'hidden');
    }
  }

  _updateSeaNode(g, t) {
    const units = this.state.getUnits(t.id);
    let badge = g.querySelector('.unit-badge');
    if (units.length > 0) {
      if (!badge) {
        badge = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        badge.setAttribute('class', 'unit-badge');
        g.appendChild(badge);
      }
      badge.innerHTML = '';
      const bg2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      bg2.setAttribute('cx', t.x - 3); bg2.setAttribute('cy', t.y - 3);
      bg2.setAttribute('r', 6); bg2.setAttribute('fill', '#1a3a6a'); bg2.setAttribute('stroke', '#2a5a9a'); bg2.setAttribute('stroke-width', '0.5');
      badge.appendChild(bg2);
      const bt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      bt.setAttribute('x', t.x - 3); bt.setAttribute('y', t.y - 2.5);
      bt.setAttribute('text-anchor', 'middle'); bt.setAttribute('dominant-baseline', 'middle');
      bt.setAttribute('font-size', '6'); bt.setAttribute('fill', '#88aaff');
      bt.textContent = units.length;
      badge.appendChild(bt);
    } else if (badge) {
      badge.remove();
    }
  }

  // ── TOUCH / ZOOM ─────────────────────────────────────────────────────────────

  _attachInteraction(wrap) {
    let lastTap = 0;

    // Pan support
    let panning = false, panStart = null;
    let tx = 0, ty = 0, scale = 1;
    const svg = this.svg;

    const applyTransform = () => {
      svg.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`;
    };

    wrap.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        panning = true;
        panStart = { x: e.touches[0].clientX - tx, y: e.touches[0].clientY - ty };
      } else if (e.touches.length === 2) {
        panning = false;
        this._pinching = true;
        this._pinchStart = {
          dist: Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          ),
          scale
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
        scale = Math.max(0.5, Math.min(3, this._pinchStart.scale * (dist / this._pinchStart.dist)));
        applyTransform();
      }
    }, { passive: true });

    wrap.addEventListener('touchend', (e) => {
      panning = false;
      if (e.touches.length < 2) this._pinching = false;
    }, { passive: true });

    // Double-tap to reset zoom
    wrap.addEventListener('dblclick', () => {
      tx = 0; ty = 0; scale = 1; applyTransform();
    });
  }
}

const MAP_CSS = `
  .map-wrap {
    width: 100%; height: 100%;
    overflow: hidden; position: relative;
    background: #0a1e3a;
  }
  .map-svg {
    width: 100%; height: 100%;
    display: block;
    transform-origin: top left;
    transition: none;
    cursor: default;
  }
  .land-conn { stroke: #1a2a1a; stroke-width: 0.7; opacity: 0.5; }
  .sea-conn  { stroke: #0a2a5a; stroke-width: 0.5; opacity: 0.4; stroke-dasharray: 3,4; }
  .terr-node { cursor: pointer; }
  .terr-node:hover .terr-circle { filter: brightness(1.2); }
  .terr-label { pointer-events: none; font-family: Georgia, serif; }
  .ipc-label  { pointer-events: none; font-family: Georgia, serif; }
  .sz-label   { pointer-events: none; font-family: monospace; }
  .capital-star { pointer-events: none; }
  .neutral-dot { pointer-events: none; }
  @keyframes pulse-ring {
    0%   { r: 14; opacity: 0.8; }
    100% { r: 22; opacity: 0; }
  }
`;
