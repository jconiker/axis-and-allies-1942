import { TERRITORIES } from '../data/territories.js';
import { NATIONS } from '../data/nations.js';
import { getAllUnits } from '../data/units.js';

export class TerritoryDetail {
  constructor(container, app) {
    this.container = container;
    this.app = app;
    this.state = app.state;
    this._el = null;
  }

  show(territoryId) {
    // Remove any existing detail
    this._el?.remove();

    const t = TERRITORIES[territoryId];
    if (!t) return;

    const owner = this.state.ownership[territoryId];
    const ownerDef = NATIONS[owner] || NATIONS.neutral;
    const units = this.state.getUnits(territoryId);
    const allUnits = getAllUnits();
    const isCapital = Object.values(NATIONS).some(n => n.capital === territoryId);
    const hasIC = !!this.state.industrialComplexes?.[territoryId];
    const icDmg = this.state.icDamage?.[territoryId] || 0;
    const icCap = hasIC ? this.state.getICCapacity(territoryId) : 0;

    // Group units by nation then type
    const byNation = {};
    units.forEach(u => {
      if (!byNation[u.nation]) byNation[u.nation] = {};
      byNation[u.nation][u.type] = (byNation[u.nation][u.type] || 0) + 1;
    });

    const unitsHtml = Object.entries(byNation).map(([nat, types]) => {
      const nd = NATIONS[nat];
      return `
        <div class="td-nation-block">
          <span class="td-nat-label" style="color:${nd?.color || '#888'}">${nd?.flag || ''} ${nd?.name || nat}</span>
          <div class="td-unit-chips">
            ${Object.entries(types).map(([type, cnt]) => {
              const def = allUnits[type];
              return `<span class="td-chip" title="Atk:${def?.attack} Def:${def?.defense} Move:${def?.movement}">
                ${def?.icon || '?'} ${def?.name || type} ×${cnt}
              </span>`;
            }).join('')}
          </div>
        </div>`;
    }).join('');

    this._el = document.createElement('div');
    this._el.innerHTML = `
      <style>${TD_CSS}</style>
      <div class="td-backdrop" id="td-backdrop"></div>
      <div class="td-panel">
        <div class="td-header" style="border-left:4px solid ${ownerDef.color}">
          <div>
            <div class="td-name">${t.name}${isCapital ? ' ★' : ''}</div>
            <div class="td-owner">${ownerDef.flag} ${ownerDef.name}${t.neutral && owner === 'neutral' ? ' (Neutral)' : ''}</div>
          </div>
          <div class="td-ipc-block">
            ${t.ipc > 0 ? `<span class="td-ipc">${t.ipc}</span><span class="td-ipc-lbl">IPC</span>` : ''}
            ${hasIC ? `<span class="td-ic-badge" title="IC capacity: ${icCap}/${t.ipc}">🏭 IC${icDmg > 0 ? ` <span style="color:#e04;font-size:0.8em">⚠ ${icDmg} dmg</span>` : ''}</span>` : ''}
          </div>
          <button class="td-close" id="td-close">✕</button>
        </div>

        ${units.length > 0 ? `
          <div class="td-units">
            <div class="td-section-label">Units Present</div>
            ${unitsHtml}
          </div>
        ` : `<div class="td-empty">No units</div>`}

        ${t.type === 'land' && t.adjacent?.length ? `
          <div class="td-adj">
            <div class="td-section-label">Adjacent</div>
            <div class="td-adj-list">
              ${t.adjacent.slice(0,8).map(adjId => {
                const adj = TERRITORIES[adjId];
                const adjOwner = this.state.ownership[adjId];
                const adjNd = NATIONS[adjOwner];
                return `<span class="td-adj-chip" style="border-color:${adjNd?.color || '#444'}">
                  ${adjNd?.flag || ''} ${adj?.name || adjId}
                </span>`;
              }).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    this.container.appendChild(this._el);

    document.getElementById('td-close')?.addEventListener('click', () => this._el?.remove());
    document.getElementById('td-backdrop')?.addEventListener('click', () => this._el?.remove());
  }
}

const TD_CSS = `
  .td-backdrop {
    position: fixed; inset: 0; z-index: 200;
    background: transparent;
  }
  .td-panel {
    position: fixed; bottom: 64px; left: 50%;
    transform: translateX(-50%);
    background: #111e30; border: 1px solid #1e3a5a;
    border-radius: 10px; padding: 14px 16px;
    min-width: 280px; max-width: 380px; width: 90%;
    z-index: 201;
    font-family: Georgia, serif; color: #d4c9a8;
    box-shadow: 0 4px 24px rgba(0,0,0,0.7);
  }
  .td-header {
    display: flex; align-items: flex-start; gap: 10px;
    padding-left: 10px; margin-bottom: 12px;
  }
  .td-name  { font-size: 1rem; font-weight: bold; color: #c8a040; }
  .td-owner { font-size: 0.75rem; color: #6a7a8a; margin-top: 2px; }
  .td-ipc-block { margin-left: auto; display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .td-ipc   { font-size: 1.4rem; color: #c8a040; font-weight: bold; line-height: 1; }
  .td-ipc-lbl { font-size: 0.6rem; color: #6a7a8a; }
  .td-ic-badge { font-size: 0.7rem; color: #aaaaee; margin-top: 2px; }
  .td-close {
    background: none; border: none; color: #6a7a8a;
    font-size: 1rem; cursor: pointer; padding: 2px 6px; flex-shrink: 0;
  }
  .td-section-label {
    font-size: 0.65rem; letter-spacing: 1.2px; text-transform: uppercase;
    color: #6a7a8a; margin-bottom: 6px;
  }
  .td-units { margin-bottom: 10px; }
  .td-nation-block { margin-bottom: 6px; }
  .td-nat-label { font-size: 0.78rem; font-weight: bold; }
  .td-unit-chips { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
  .td-chip {
    background: #0d1925; border: 1px solid #1e3a5a;
    border-radius: 5px; padding: 3px 7px; font-size: 0.78rem;
  }
  .td-empty { color: #6a7a8a; font-size: 0.85rem; margin-bottom: 8px; }
  .td-adj { margin-top: 4px; }
  .td-adj-list { display: flex; flex-wrap: wrap; gap: 4px; }
  .td-adj-chip {
    background: #0a1422; border: 1px solid #1e3a5a;
    border-radius: 4px; padding: 2px 6px; font-size: 0.72rem; color: #8a9aaa;
  }
`;
