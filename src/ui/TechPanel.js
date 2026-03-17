import { TECHNOLOGIES, TECH_CATEGORIES } from '../data/technologies.js';
import { NATIONS } from '../data/nations.js';

export class TechPanel {
  constructor(container, app) {
    this.container = container;
    this.app = app;
    this.state = app.state;
    this._el = null;
    this._dice = 1;
  }

  show() {
    this._el = document.createElement('div');
    this._el.innerHTML = `<style>${TECH_CSS}</style><div class="tech-panel-wrap"><div class="tech-panel" id="tech-panel"></div></div>`;
    this.container.appendChild(this._el);
    this._render();
  }

  hide() { this._el?.remove(); this._el = null; }

  _render() {
    const panel = this._el?.querySelector('#tech-panel');
    if (!panel) return;

    const nation = this.state.currentNation;
    const nationDef = NATIONS[nation];
    const ipc = this.state.ipc[nation] || 0;
    const researched = this.state.technologies[nation] || [];
    const maxDice = Math.floor(ipc / 5);

    const byCategory = {};
    Object.values(TECHNOLOGIES).forEach(t => {
      if (!byCategory[t.category]) byCategory[t.category] = [];
      byCategory[t.category].push(t);
    });

    panel.innerHTML = `
      <div class="tp-header">
        <span>🔬 Research &amp; Development</span>
        <button class="tp-close" id="tp-close">✕</button>
      </div>
      <p class="tp-sub">Roll research dice (5 IPC each). Roll a 6 = breakthrough!</p>

      <div class="tp-dice-row">
        <span class="tp-dice-label">Dice: ${this._dice}</span>
        <input type="range" id="tp-dice-range" min="1" max="${Math.max(1,maxDice)}" value="${this._dice}"
               style="flex:1;accent-color:#c8a040;" ${maxDice < 1 ? 'disabled' : ''} />
        <span class="tp-dice-cost">${this._dice * 5} IPC</span>
      </div>

      <button class="tp-btn tp-btn-roll" id="tp-roll" ${maxDice < 1 ? 'disabled' : ''}>
        🎲 Roll ${this._dice} ${this._dice === 1 ? 'die' : 'dice'} (${this._dice * 5} IPC)
      </button>

      <div class="tp-tree">
        ${Object.entries(byCategory).map(([cat, techs]) => `
          <div class="tp-category">
            <div class="tp-cat-label" style="color:${TECH_CATEGORIES[cat]?.color || '#888'}">
              ${TECH_CATEGORIES[cat]?.label || cat}
            </div>
            <div class="tp-techs">
              ${techs.map(t => {
                const owned = researched.includes(t.id);
                return `
                  <div class="tp-tech ${owned ? 'owned' : ''}" title="${t.description}">
                    <span class="tp-tech-icon">${t.icon}</span>
                    <div class="tp-tech-info">
                      <span class="tp-tech-name">${t.name}</span>
                      <span class="tp-tech-desc">${t.description}</span>
                    </div>
                    ${owned ? '<span class="tp-owned-badge">✓</span>' : ''}
                  </div>`;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    panel.querySelector('#tp-close')?.addEventListener('click', () => this.hide());
    panel.querySelector('#tp-dice-range')?.addEventListener('input', (e) => {
      this._dice = parseInt(e.target.value);
      this._render();
    });
    panel.querySelector('#tp-roll')?.addEventListener('click', () => this._doRoll());
  }

  _doRoll() {
    const nation = this.state.currentNation;
    const ipc = this.state.ipc[nation] || 0;
    if (ipc < this._dice * 5) { alert('Not enough IPC!'); return; }

    const eligible = Object.keys(TECHNOLOGIES).filter(t => !(this.state.technologies[nation] || []).includes(t));
    const result = this.state.rollResearch(nation, this._dice, eligible);

    const diceStr = result.dice.map(d => d === 6 ? `<b style="color:#c8a040">${d}</b>` : d).join(' ');

    let msg = `Dice rolled: ${diceStr}<br>`;
    if (result.breakthroughs.length === 0) {
      msg += 'No breakthrough this time. Keep researching!';
    } else {
      msg += `🎉 Breakthrough! You discovered: ${result.breakthroughs.map(t => TECHNOLOGIES[t]?.name).join(', ')}`;
    }

    // Show result overlay
    const res = document.createElement('div');
    res.className = 'tp-result';
    res.innerHTML = `<div class="tp-result-box">
      <h3>Research Results</h3>
      <div style="margin:12px 0;font-size:1.1rem">${msg}</div>
      <button class="tp-btn tp-btn-roll" onclick="this.closest('.tp-result').remove()">OK</button>
    </div>`;
    this._el.appendChild(res);
    this._render();
  }
}

const TECH_CSS = `
  .tech-panel-wrap {
    position: fixed; inset: 0;
    background: rgba(5,10,20,0.88);
    z-index: 450; display: flex; align-items: flex-end;
  }
  .tech-panel {
    width: 100%; max-height: 80vh; background: #111e30;
    border-top: 2px solid #1e3a5a; border-radius: 16px 16px 0 0;
    padding: 16px; overflow-y: auto; font-family: Georgia, serif; color: #d4c9a8;
    -webkit-overflow-scrolling: touch;
  }
  .tp-header {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 1rem; font-weight: bold; color: #c8a040; margin-bottom: 6px;
  }
  .tp-close {
    background: none; border: none; color: #6a7a8a; font-size: 1.1rem; cursor: pointer;
  }
  .tp-sub { font-size: 0.78rem; color: #6a7a8a; margin-bottom: 12px; }

  .tp-dice-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .tp-dice-label { color: #d4c9a8; font-size: 0.85rem; white-space: nowrap; }
  .tp-dice-cost { color: #c8a040; font-size: 0.85rem; white-space: nowrap; }

  .tp-btn {
    width: 100%; padding: 12px; border: none; border-radius: 8px;
    font-family: Georgia, serif; font-size: 0.95rem; font-weight: bold;
    cursor: pointer; margin-bottom: 12px; min-height: 48px;
  }
  .tp-btn-roll { background: #3a5a8a; color: #d4c9a8; }
  .tp-btn-roll:disabled { opacity: 0.4; cursor: not-allowed; }
  .tp-btn-roll:active { background: #2a4a7a; }

  .tp-tree { margin-top: 4px; }
  .tp-category { margin-bottom: 12px; }
  .tp-cat-label { font-size: 0.7rem; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 6px; }
  .tp-techs { display: flex; flex-direction: column; gap: 5px; }
  .tp-tech {
    display: flex; align-items: flex-start; gap: 10px;
    background: #0d1925; border: 1px solid #1e3a5a;
    border-radius: 7px; padding: 8px 10px; opacity: 0.75;
  }
  .tp-tech.owned { opacity: 1; border-color: #c8a040; background: #1a2a1a; }
  .tp-tech-icon { font-size: 1.2rem; flex-shrink: 0; }
  .tp-tech-info { flex: 1; }
  .tp-tech-name { display: block; font-size: 0.85rem; color: #c8a040; }
  .tp-tech-desc { display: block; font-size: 0.72rem; color: #6a7a8a; margin-top: 2px; }
  .tp-owned-badge { color: #3aaa44; font-size: 1rem; font-weight: bold; }

  .tp-result {
    position: absolute; inset: 0;
    background: rgba(5,10,20,0.9); display: flex; align-items: center; justify-content: center;
  }
  .tp-result-box {
    background: #111e30; border: 1px solid #c8a040; border-radius: 12px;
    padding: 24px; max-width: 340px; text-align: center; color: #d4c9a8;
  }
  .tp-result-box h3 { color: #c8a040; margin-bottom: 8px; }
`;
