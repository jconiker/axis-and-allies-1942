import { getAllUnits, getUnitsForNation, ADVANCED_UNITS } from '../data/units.js';
import { NATIONS } from '../data/nations.js';

// Short codes matching the map token display style
const UNIT_CODE = {
  infantry:          'I',
  artillery:         'A',
  armor:             'T',
  antiair:           'AA',
  fighter:           'F',
  bomber:            'B',
  tactical_bomber:   'TB',
  submarine:         'S',
  destroyer:         'D',
  cruiser:           'C',
  carrier:           'CV',
  battleship:        'BB',
  transport:         'TP',
  industrial_complex:'IC',
};

// Built-in IC unit for the INDUSTRY tab
const IC_UNIT = {
  id: 'industrial_complex', name: 'Industrial Complex',
  cost: 15, attack: 0, defense: 0, movement: 0,
  type: 'building',
  description: 'Produces units each round. Build in captured territory with 3+ IPC.',
};

// 3-char codes for advanced units
const ADV_UNIT_CODE = {
  b52:'B52', stealth_fighter:'SF', ford_carrier:'FCV',
  tiger_tank:'TIG', zero_fighter:'A6M', t34_tank:'T34',
  spitfire:'SPT', digger_inf:'ANZ',
};
Object.assign(UNIT_CODE, ADV_UNIT_CODE);

export class PurchasePanel {
  constructor(container, app) {
    this.container = container;
    this.app = app;
    this.state = app.state;
    this._el = null;
    this._tab = 'land';
  }

  show() {
    if (this._el) { this._render(); return; }
    this._el = document.createElement('div');
    this._el.innerHTML = `<style>${PANEL_CSS}</style><div class="pp-panel" id="pp-panel"></div>`;
    this.container.appendChild(this._el);
    this._render();
  }

  hide() { this._el?.remove(); this._el = null; }

  _render() {
    const panel = this._el?.querySelector('#pp-panel');
    if (!panel) return;

    const nation   = this.state.currentNation;
    const nd       = NATIONS[nation];
    const ipc      = this.state.ipc[nation] || 0;
    const pending  = this.state.pendingPlacements[nation] || [];
    const allUnits = getAllUnits();
    const spent    = pending.reduce((s, t) => s + (allUnits[t]?.cost || IC_UNIT.cost || 0), 0);

    // Count pending by type
    const pendingCounts = {};
    pending.forEach(t => { pendingCounts[t] = (pendingCounts[t] || 0) + 1; });

    // Nation-filtered units
    const nationUnits = getUnitsForNation(nation);

    // Organize standard units by tab (land/sea/air), advanced tab = nation-specific only
    const byTab = { land: [], sea: [], air: [], industry: [IC_UNIT], advanced: [] };
    Object.values(nationUnits).forEach(u => {
      if (u.type === 'building') { byTab.industry.push(u); return; }
      // Advanced units (restricted to certain nations or custom) go to advanced tab
      if (u.availableFor !== null && u.availableFor !== undefined) {
        byTab.advanced.push(u);
        return;
      }
      if (byTab[u.type]) byTab[u.type].push(u);
    });

    const units = byTab[this._tab] || [];
    const hasAdvanced = byTab.advanced.length > 0;

    panel.innerHTML = `
      <div class="pp-hdr">
        <button class="pp-x" id="pp-x">✕</button>
        <div class="pp-title">PURCHASE UNITS</div>
        <div class="pp-subtitle">Units mobilized during mobilization phase</div>
      </div>

      <div class="pp-ipc-bar">
        <div class="pp-ipc-item">
          <span class="pp-ipc-label">REMAINING IPC</span>
          <span class="pp-ipc-val ${ipc < 5 ? 'low' : ''}">${ipc}</span>
        </div>
        <div class="pp-ipc-sep"></div>
        <div class="pp-ipc-item right">
          <span class="pp-ipc-label">PURCHASED</span>
          <span class="pp-ipc-val">${pending.length}</span>
        </div>
      </div>

      <div class="pp-tabs">
        ${['land','sea','air','industry'].map(t => `
          <button class="pp-tab ${this._tab === t ? 'active' : ''}" data-tab="${t}">
            ${t.toUpperCase()}
          </button>`).join('')}
        ${hasAdvanced ? `<button class="pp-tab adv-tab ${this._tab === 'advanced' ? 'active' : ''}" data-tab="advanced" title="Nation-specific & custom units">★ ADV</button>` : ''}
      </div>

      <div class="pp-col-hdr">
        <span class="pp-col-unit">UNIT</span>
        <span class="pp-col-stat">ATK</span>
        <span class="pp-col-stat">DEF</span>
        <span class="pp-col-stat">MOV</span>
        <span class="pp-col-stat cost">COST</span>
        <span class="pp-col-buy">PURCHASE</span>
      </div>

      <div class="pp-list">
        ${units.map(u => this._unitRow(u, ipc, pendingCounts[u.id] || 0, nd)).join('')}
        ${this._tab === 'industry' ? this._renderRepairSection(nation, ipc) : ''}
      </div>

      <div class="pp-footer">
        <div class="pp-spent-lbl">SPENT: <b>${spent} IPC</b></div>
        <button class="pp-custom-btn" id="pp-custom" title="Create custom unit">⚙ CUSTOM</button>
        <button class="pp-end" id="pp-end">END PHASE</button>
      </div>
    `;

    // Tab switching
    panel.querySelectorAll('.pp-tab').forEach(b =>
      b.addEventListener('click', () => { this._tab = b.dataset.tab; this._render(); }));

    // Buy / refund buttons
    panel.querySelectorAll('.pp-plus').forEach(b =>
      b.addEventListener('click', () => { this.state.purchaseUnit(b.dataset.type, nation); this._render(); }));
    panel.querySelectorAll('.pp-minus').forEach(b =>
      b.addEventListener('click', () => { this.state.refundUnit(b.dataset.type, nation); this._render(); }));

    // IC repair buttons
    panel.querySelectorAll('.pp-repair-btn').forEach(b =>
      b.addEventListener('click', () => {
        this.state.repairIC(b.dataset.tid, nation, 1);
        this._render();
      }));

    // Close + end phase
    panel.querySelector('#pp-x')?.addEventListener('click', () => this.hide());
    panel.querySelector('#pp-end')?.addEventListener('click', () => {
      this.hide();
      this.app.turnEngine.advancePhase();
    });
    // Custom unit editor
    panel.querySelector('#pp-custom')?.addEventListener('click', () => {
      import('./CustomUnitEditor.js').then(({ CustomUnitEditor }) => {
        new CustomUnitEditor(document.getElementById('overlay-root'), this.app).show();
      }).catch(() => {});
    });
  }

  _renderRepairSection(nation, ipc) {
    const damagedICs = Object.entries(this.state.icDamage)
      .filter(([tid, dmg]) => dmg > 0 && this.state.industrialComplexes[tid] === nation);
    if (damagedICs.length === 0) return '';

    return `
      <div class="pp-repair-section">
        <div class="pp-repair-title">🏭 IC REPAIR (1 IPC per damage token)</div>
        ${damagedICs.map(([tid, dmg]) => {
          const base = this.state.getTerritoryIPC(tid);
          const cap  = this.state.getICCapacity(tid);
          const canRepair = ipc >= 1 && dmg > 0;
          const label = tid.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          return `
            <div class="pp-repair-row">
              <span class="pp-repair-name">${label}</span>
              <span class="pp-repair-dmg">⚠ ${dmg} dmg — cap ${cap}/${base}</span>
              <button class="pp-repair-btn" data-tid="${tid}" ${!canRepair ? 'disabled' : ''}>
                Repair −1 (1 IPC)
              </button>
            </div>`;
        }).join('')}
      </div>`;
  }

  _unitRow(u, ipc, qty, nd) {
    const canBuy = ipc >= u.cost;
    const isBuilding = u.type === 'building';
    const atk = (u.attack === 0 && (isBuilding || u.shootsAtAir)) ? '—' : u.attack;
    const def = (u.defense === 0 && isBuilding) ? '—' : u.defense;
    const mov = (u.movement === 0 && isBuilding) ? '—' : u.movement;
    const code = UNIT_CODE[u.id] || u.id.slice(0, 3).toUpperCase();
    // Use nation color for the unit circle border (matches map token color scheme)
    const natColor = nd?.color || '#4a6a8a';

    return `
      <div class="pp-row ${!canBuy && qty === 0 ? 'dim' : ''}">
        <div class="pp-unit-art">
          <div class="pp-art-circle" style="border-color:${natColor}40;box-shadow:0 0 6px ${natColor}30" title="${u.description || ''}">
            <span class="pp-art-code" style="color:${natColor}">${code}</span>
          </div>
          <span class="pp-unit-name">${u.name.toUpperCase()}</span>
        </div>
        <span class="pp-stat">${atk}</span>
        <span class="pp-stat">${def}</span>
        <span class="pp-stat">${mov}</span>
        <span class="pp-stat cost">${u.cost}</span>
        <div class="pp-buy">
          <button class="pp-minus" data-type="${u.id}" ${qty === 0 ? 'disabled' : ''}>−</button>
          <span class="pp-qty ${qty > 0 ? 'has' : ''}">${qty}</span>
          <button class="pp-plus" data-type="${u.id}" ${!canBuy ? 'disabled' : ''}>+</button>
        </div>
      </div>`;
  }
}

const PANEL_CSS = `
  .pp-panel {
    position: fixed; right: 0; top: 52px; bottom: 0;
    width: min(360px, 46vw);
    background: #161616;
    border-left: 2px solid #2c2c2c;
    display: flex; flex-direction: column;
    font-family: 'Arial Narrow', Arial, sans-serif;
    color: #d0d0c0; z-index: 300;
    box-shadow: -4px 0 24px rgba(0,0,0,0.8);
    overflow: hidden;
  }

  /* Header */
  .pp-hdr {
    background: #1c1c1c;
    border-bottom: 1px solid #2c2c2c;
    padding: 10px 14px 8px;
    position: relative; flex-shrink: 0;
  }
  .pp-x {
    position: absolute; top: 8px; right: 10px;
    background: #2a2a2a; border: none; color: #888;
    width: 28px; height: 28px; border-radius: 50%;
    font-size: 0.9rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }
  .pp-x:hover { background: #c83018; color: #fff; }
  .pp-title    { font-size: 0.88rem; font-weight: 900; color: #e0d8c0; letter-spacing: 1.5px; }
  .pp-subtitle { font-size: 0.62rem; color: #555; margin-top: 2px; }

  /* IPC row */
  .pp-ipc-bar {
    display: flex; align-items: center;
    background: #111; border-bottom: 1px solid #2c2c2c;
    padding: 8px 14px; flex-shrink: 0;
  }
  .pp-ipc-item       { display: flex; flex-direction: column; flex: 1; }
  .pp-ipc-item.right { align-items: flex-end; }
  .pp-ipc-label { font-size: 0.56rem; color: #555; letter-spacing: 1px; }
  .pp-ipc-val   { font-size: 1.3rem; font-weight: 900; color: #c8a040; line-height: 1; }
  .pp-ipc-val.low { color: #e04030; }
  .pp-ipc-sep   { width: 1px; background: #2c2c2c; height: 30px; margin: 0 10px; }

  /* Tabs */
  .pp-tabs {
    display: flex; background: #111;
    border-bottom: 2px solid #2c2c2c; flex-shrink: 0;
  }
  .pp-tab {
    flex: 1; padding: 8px 0; border: none;
    background: transparent; color: #555;
    font-family: inherit; font-size: 0.68rem; font-weight: 900;
    letter-spacing: 1px; cursor: pointer;
    border-bottom: 2px solid transparent; margin-bottom: -2px;
  }
  .pp-tab.active       { color: #e8c060; border-bottom-color: #e8c060; }
  .pp-tab:hover:not(.active) { color: #999; }
  .pp-tab.adv-tab      { color: #7080d0; }
  .pp-tab.adv-tab.active { color: #a0b8f8; border-bottom-color: #a0b8f8; }

  /* Column headers */
  .pp-col-hdr {
    display: flex; align-items: center;
    padding: 5px 14px; background: #0e0e0e;
    border-bottom: 1px solid #222; flex-shrink: 0;
  }
  .pp-col-unit { flex: 1; font-size: 0.56rem; color: #444; letter-spacing: 1px; }
  .pp-col-stat { width: 28px; text-align: center; font-size: 0.56rem; color: #444; }
  .pp-col-stat.cost { color: #888; }
  .pp-col-buy  { width: 82px; text-align: center; font-size: 0.56rem; color: #444; }

  /* Unit list */
  .pp-list { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; }
  .pp-row {
    display: flex; align-items: center;
    padding: 7px 14px; border-bottom: 1px solid #1c1c1c;
  }
  .pp-row:hover { background: #1e1e1e; }
  .pp-row.dim   { opacity: 0.38; }

  .pp-unit-art {
    flex: 1; display: flex; align-items: center; gap: 8px; min-width: 0;
  }
  .pp-art-circle {
    width: 38px; height: 38px; border-radius: 50%;
    background: #111118; border: 2px solid #3a3a52;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; position: relative; overflow: hidden;
  }
  .pp-art-code {
    font-size: 0.6rem; font-weight: 900; letter-spacing: -0.3px;
    line-height: 1; z-index: 1; text-align: center;
    font-family: 'Arial Narrow', Arial, sans-serif;
  }
  .pp-unit-name {
    font-size: 0.72rem; font-weight: bold; color: #c0b890;
    letter-spacing: 0.5px; white-space: nowrap; overflow: hidden;
    text-overflow: ellipsis;
  }

  .pp-stat      { width: 28px; text-align: center; font-size: 0.82rem; color: #c8c8b0; font-weight: bold; }
  .pp-stat.cost { color: #c8a040; font-size: 0.88rem; }

  /* Buy controls */
  .pp-buy {
    width: 82px; display: flex; align-items: center;
    justify-content: center; gap: 4px;
  }
  .pp-minus, .pp-plus {
    width: 24px; height: 24px; border-radius: 50%;
    border: 1px solid #3a3a22; background: #2a2a14;
    color: #c8a040; font-size: 1rem; font-weight: bold;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    line-height: 1; -webkit-tap-highlight-color: transparent;
    flex-shrink: 0;
  }
  .pp-minus:disabled, .pp-plus:disabled { opacity: 0.2; cursor: not-allowed; }
  .pp-minus:not(:disabled):hover,
  .pp-plus:not(:disabled):hover  { background: #c8a040; color: #0a0a05; }
  .pp-qty     { width: 20px; text-align: center; font-size: 0.88rem; color: #808060; font-weight: bold; }
  .pp-qty.has { color: #ffd840; }

  /* Footer */
  .pp-footer {
    background: #111; border-top: 2px solid #2c2c2c;
    padding: 10px 14px 14px; flex-shrink: 0;
    display: flex; align-items: center; gap: 10px;
  }
  .pp-spent-lbl { font-size: 0.68rem; color: #555; flex: 1; }
  .pp-spent-lbl b { color: #c8a040; }
  .pp-custom-btn {
    background: #1a2040; color: #8898c8; border: 1px solid #303868;
    border-radius: 4px; padding: 6px 10px; font-size: 0.62rem; font-weight: 900;
    letter-spacing: 1px; cursor: pointer; font-family: inherit;
    -webkit-tap-highlight-color: transparent;
  }
  .pp-custom-btn:hover { background: #242860; color: #c0d0f8; }

  .pp-pp-nation-badge {
    font-size: 0.52rem; color: #607090; margin-left: 4px;
    letter-spacing: 0.5px; text-transform: uppercase;
  }

  /* IC Repair section */
  .pp-repair-section {
    padding: 10px 14px 6px;
    border-top: 1px solid #2a2a20;
    margin-top: 4px;
  }
  .pp-repair-title {
    font-size: 0.6rem; color: #7a6020; letter-spacing: 1px; font-weight: bold;
    margin-bottom: 8px; text-transform: uppercase;
  }
  .pp-repair-row {
    display: flex; align-items: center; gap: 6px;
    padding: 5px 0; border-bottom: 1px solid #1e1e18;
  }
  .pp-repair-name { font-size: 0.65rem; font-weight: bold; color: #c0a860; flex: 1; }
  .pp-repair-dmg  { font-size: 0.6rem; color: #c05030; white-space: nowrap; }
  .pp-repair-btn {
    background: #1e2a10; color: #80b840; border: 1px solid #3a5020;
    border-radius: 4px; padding: 4px 8px; font-size: 0.6rem; font-weight: bold;
    cursor: pointer; font-family: inherit; white-space: nowrap;
    -webkit-tap-highlight-color: transparent;
  }
  .pp-repair-btn:hover:not(:disabled) { background: #2e4018; color: #a0d860; }
  .pp-repair-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  .pp-end {
    background: #b83010; color: #fff;
    border: none; border-radius: 5px;
    padding: 10px 18px; font-size: 0.82rem; font-weight: 900;
    letter-spacing: 1.5px; cursor: pointer; font-family: inherit;
    min-height: 44px; -webkit-tap-highlight-color: transparent;
  }
  .pp-end:hover  { background: #d84020; }
  .pp-end:active { background: #902808; }
`;
