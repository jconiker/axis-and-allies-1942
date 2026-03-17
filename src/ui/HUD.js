import { NATIONS, TURN_ORDER } from '../data/nations.js';

const PHASE_LABELS = {
  setup:           'Setup',
  purchase:        'Purchase',
  combat_move:     'Combat Move',
  conduct_combat:  'Combat',
  noncombat_move:  'Move',
  place:           'Place Units',
  collect:         'Collect IPC',
};

export class HUD {
  constructor(container, app) {
    this.container = container;
    this.app = app;
    this.state = app.state;
    this._built = false;
  }

  render() {
    if (!this._built) {
      this.container.innerHTML = `<style>${HUD_CSS}</style><div id="hud" class="hud"></div>`;
      this._built = true;
    }
    this._update();
  }

  _update() {
    const hud = this.container.querySelector('#hud');
    if (!hud) return;

    const nation = this.state.currentNation;
    const nationDef = NATIONS[nation];
    const phase = this.state.phase;
    const round = this.state.round;
    const ipc = this.state.ipc[nation] || 0;
    const income = this.state.calculateIncome(nation);
    const isHuman = this.state.players[nation] === 'human';

    hud.innerHTML = `
      <div class="hud-nation" style="border-left: 4px solid ${nationDef?.color || '#888'}">
        <span class="hud-flag">${nationDef?.flag || ''}</span>
        <div class="hud-nation-info">
          <span class="hud-name">${nationDef?.name || nation}</span>
          <span class="hud-player">${isHuman ? '👤 You' : '🤖 AI'}</span>
        </div>
      </div>

      <div class="hud-phase">
        <span class="hud-phase-label">${PHASE_LABELS[phase] || phase}</span>
        <span class="hud-round">Round ${round}</span>
      </div>

      <div class="hud-ipc">
        <span class="hud-ipc-val">${ipc}</span>
        <span class="hud-ipc-sub">IPC (+${income}/turn)</span>
      </div>

      <div class="hud-nations-bar">
        ${TURN_ORDER.map(n => {
          const nd = NATIONS[n];
          const isActive = n === nation;
          const ipcVal = this.state.ipc[n] || 0;
          const isPlayer = this.state.players[n] === 'human';
          return `
            <div class="hud-nation-pip ${isActive ? 'active' : ''} ${nd.side}"
                 title="${nd.name}: ${ipcVal} IPC">
              <span class="pip-flag">${nd.flag}</span>
              <span class="pip-ipc">${ipcVal}</span>
              <span class="pip-type">${isPlayer ? '●' : '○'}</span>
            </div>`;
        }).join('')}
      </div>
    `;
  }
}

const HUD_CSS = `
  .hud {
    display: flex; align-items: center; gap: 12px;
    padding: 6px 12px;
    background: #0d1925;
    border-bottom: 1px solid #1e3a5a;
    height: 52px;
    overflow: hidden;
    flex-shrink: 0;
  }

  .hud-nation {
    display: flex; align-items: center; gap: 8px;
    padding-left: 8px;
    flex-shrink: 0;
  }
  .hud-flag { font-size: 1.4rem; }
  .hud-nation-info { display: flex; flex-direction: column; }
  .hud-name  { font-size: 0.85rem; font-weight: bold; color: #d4c9a8; }
  .hud-player { font-size: 0.7rem; color: #6a7a8a; }

  .hud-phase {
    display: flex; flex-direction: column; align-items: center;
    background: #111e30; border: 1px solid #1e3a5a;
    border-radius: 6px; padding: 4px 12px;
    flex-shrink: 0;
  }
  .hud-phase-label { font-size: 0.8rem; color: #c8a040; font-weight: bold; letter-spacing: 0.5px; }
  .hud-round       { font-size: 0.7rem; color: #6a7a8a; }

  .hud-ipc {
    display: flex; flex-direction: column; align-items: center;
    flex-shrink: 0;
  }
  .hud-ipc-val { font-size: 1.3rem; color: #c8a040; font-weight: bold; line-height: 1; }
  .hud-ipc-sub { font-size: 0.65rem; color: #6a7a8a; }

  .hud-nations-bar {
    display: flex; gap: 6px; margin-left: auto;
    overflow-x: auto; flex-shrink: 0;
  }
  .hud-nation-pip {
    display: flex; flex-direction: column; align-items: center;
    padding: 2px 6px; border-radius: 5px;
    border: 1px solid #1e3a5a;
    background: #0d1925;
    cursor: default;
    opacity: 0.6;
    min-width: 42px;
  }
  .hud-nation-pip.active { opacity: 1; border-color: #c8a040; background: #1a2a3a; }
  .pip-flag { font-size: 0.9rem; }
  .pip-ipc  { font-size: 0.65rem; color: #c8a040; font-weight: bold; }
  .pip-type { font-size: 0.5rem; color: #6a7a8a; }
`;
