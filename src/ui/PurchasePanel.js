import { getAllUnits } from '../data/units.js';
import { NATIONS } from '../data/nations.js';

export class PurchasePanel {
  constructor(container, app) {
    this.container = container;
    this.app = app;
    this.state = app.state;
    this._el = null;
  }

  show() {
    if (this._el) { this._render(); return; }
    this._el = document.createElement('div');
    this._el.className = 'purchase-panel-wrap';
    this._el.innerHTML = `<style>${PANEL_CSS}</style><div class="purchase-panel" id="purchase-panel"></div>`;
    this.container.appendChild(this._el);
    this._render();
  }

  hide() {
    this._el?.remove();
    this._el = null;
  }

  _render() {
    const panel = this._el?.querySelector('#purchase-panel');
    if (!panel) return;

    const nation = this.state.currentNation;
    const nationDef = NATIONS[nation];
    const ipc = this.state.ipc[nation] || 0;
    const pending = this.state.pendingPlacements[nation] || [];
    const allUnits = getAllUnits();

    const totalPendingCost = pending.reduce((s, t) => s + (allUnits[t]?.cost || 0), 0);
    const remaining = ipc; // ipc is already decremented on purchase

    const unitsByType = { land: [], air: [], sea: [] };
    Object.values(allUnits).forEach(u => {
      if (unitsByType[u.type]) unitsByType[u.type].push(u);
    });

    panel.innerHTML = `
      <div class="pp-header">
        <span style="color:${nationDef?.color};">${nationDef?.flag} ${nationDef?.name}</span>
        <div class="pp-ipc">
          <span class="pp-ipc-num">${remaining}</span>
          <span class="pp-ipc-lbl"> IPC remaining</span>
        </div>
        <button class="pp-close" id="pp-close">✕</button>
      </div>

      ${['land','air','sea'].map(cat => `
        <div class="pp-section">
          <div class="pp-cat-label">${cat.toUpperCase()}</div>
          <div class="pp-units">
            ${unitsByType[cat].map(u => `
              <button class="pp-unit ${remaining < u.cost ? 'disabled' : ''}"
                      data-type="${u.id}" title="${u.description}">
                <span class="pp-unit-icon">${u.icon}</span>
                <span class="pp-unit-name">${u.name}</span>
                <div class="pp-unit-stats">
                  <span title="Cost">💰${u.cost}</span>
                  <span title="Attack">⚔${u.attack}</span>
                  <span title="Defense">🛡${u.defense}</span>
                  <span title="Move">🚀${u.movement}</span>
                </div>
              </button>
            `).join('')}
          </div>
        </div>
      `).join('')}

      ${pending.length > 0 ? `
        <div class="pp-queue">
          <div class="pp-cat-label">PURCHASE QUEUE (${pending.length})</div>
          <div class="pp-queue-items">
            ${pending.map((t, i) => {
              const u = allUnits[t];
              return `<div class="pp-queue-item" data-idx="${i}">
                <span>${u?.icon || ''} ${u?.name || t}</span>
                <span class="pp-queue-cost">${u?.cost || 0} IPC</span>
                <button class="pp-refund" data-type="${t}">↩</button>
              </div>`;
            }).join('')}
          </div>
          <div class="pp-total">Total: ${totalPendingCost} IPC spent</div>
        </div>
      ` : ''}

      <button class="btn pp-done" id="pp-done">Done Purchasing →</button>
    `;

    // Events
    panel.querySelectorAll('.pp-unit:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.purchaseUnit(btn.dataset.type, nation);
        this._render();
      });
      btn.addEventListener('touchend', (e) => { e.preventDefault(); btn.click(); });
    });
    panel.querySelectorAll('.pp-refund').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.refundUnit(btn.dataset.type, nation);
        this._render();
      });
    });
    panel.getElementById?.('pp-close') || panel.querySelector('#pp-close')?.addEventListener('click', () => {
      this.hide();
    });
    panel.querySelector('#pp-done')?.addEventListener('click', () => {
      this.hide();
      this.app.turnEngine.advancePhase();
    });
  }
}

const PANEL_CSS = `
  .purchase-panel-wrap {
    position: fixed; inset: 0;
    background: rgba(5,10,20,0.85);
    z-index: 300;
    display: flex; align-items: flex-end;
  }
  .purchase-panel {
    width: 100%; max-height: 75vh;
    background: #111e30; border-top: 2px solid #1e3a5a;
    border-radius: 16px 16px 0 0;
    overflow-y: auto; padding: 16px;
    font-family: Georgia, serif;
    -webkit-overflow-scrolling: touch;
  }
  .pp-header {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 12px; font-size: 1rem; font-weight: bold; color: #d4c9a8;
  }
  .pp-ipc { margin-left: auto; display: flex; align-items: baseline; gap: 4px; }
  .pp-ipc-num { font-size: 1.4rem; color: #c8a040; font-weight: bold; }
  .pp-ipc-lbl { font-size: 0.75rem; color: #6a7a8a; }
  .pp-close {
    background: none; border: none; color: #6a7a8a; font-size: 1.1rem;
    cursor: pointer; padding: 4px 8px;
  }

  .pp-section { margin-bottom: 12px; }
  .pp-cat-label {
    font-size: 0.7rem; letter-spacing: 1.5px; color: #6a7a8a;
    text-transform: uppercase; margin-bottom: 6px;
  }
  .pp-units { display: flex; flex-wrap: wrap; gap: 6px; }
  .pp-unit {
    background: #0d1925; border: 1px solid #1e3a5a;
    border-radius: 8px; padding: 8px 10px;
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    cursor: pointer; min-width: 72px; min-height: 80px;
    font-family: Georgia, serif; color: #d4c9a8;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.1s;
  }
  .pp-unit:active { background: #1a3050; }
  .pp-unit.disabled { opacity: 0.35; cursor: not-allowed; }
  .pp-unit-icon { font-size: 1.4rem; }
  .pp-unit-name { font-size: 0.65rem; text-align: center; color: #c8a040; }
  .pp-unit-stats { display: flex; gap: 4px; font-size: 0.6rem; color: #6a8aaa; }

  .pp-queue { margin-top: 8px; background: #0d1925; border-radius: 8px; padding: 10px; }
  .pp-queue-items { display: flex; flex-direction: column; gap: 4px; margin-top: 6px; }
  .pp-queue-item {
    display: flex; align-items: center; gap: 8px;
    color: #d4c9a8; font-size: 0.85rem;
  }
  .pp-queue-cost { margin-left: auto; color: #c8a040; }
  .pp-refund {
    background: #2a1a1a; border: 1px solid #5a2a2a; border-radius: 4px;
    color: #ff8a8a; padding: 2px 6px; cursor: pointer; font-size: 0.8rem;
  }
  .pp-total { margin-top: 8px; font-size: 0.75rem; color: #6a7a8a; text-align: right; }

  .pp-done {
    width: 100%; margin-top: 12px; padding: 14px;
    background: #c8a040; color: #0a1628;
    border: none; border-radius: 8px; font-size: 1rem; font-weight: bold;
    font-family: Georgia, serif; cursor: pointer;
    min-height: 52px;
    -webkit-tap-highlight-color: transparent;
  }
  .pp-done:active { background: #a88030; }
`;
