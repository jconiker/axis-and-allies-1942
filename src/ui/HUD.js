import { NATIONS, TURN_ORDER } from '../data/nations.js';

const PHASE_LABELS = {
  setup:           'SETUP',
  purchase:        'PURCHASE',
  combat_move:     'COMBAT MOVE',
  conduct_combat:  'COMBAT',
  noncombat_move:  'NON-COMBAT',
  place:           'MOBILIZE',
  collect:         'INCOME',
};

// Victory Cities — territory IDs
const ALL_VCS = [
  'germany', 'western_europe', 'southern_europe', 'japan', 'manchuria',
  'russia',  'united_kingdom', 'eastern_us',       'india', 'australia',
];
const AXIS_WIN  = 9;  // Axis needs 9/10 to win
const ALLY_WIN  = ALL_VCS.length - AXIS_WIN + 1; // = 2 (allies win if axis can't reach 9)

// Faction symbols matching the App Store style
const NAT_SYMBOL = {
  ussr:      '★',
  germany:   '✚',
  uk:        '⊕',
  japan:     '✿',
  usa:       '★',
  australia: '🦘',
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

  _countVCs() {
    const own = this.state.ownership || {};
    let axisVC = 0, alliedVC = 0;
    ALL_VCS.forEach(tid => {
      const nd = NATIONS[own[tid]];
      if (nd?.side === 'axis')   axisVC++;
      else if (nd?.side === 'allies') alliedVC++;
    });
    return { axisVC, alliedVC };
  }

  _update() {
    const hud = this.container.querySelector('#hud');
    if (!hud) return;

    const nation  = this.state.currentNation;
    const nd      = NATIONS[nation];
    const phase   = this.state.phase;
    const round   = this.state.round;
    const ipc     = this.state.ipc[nation] || 0;
    const { axisVC, alliedVC } = this._countVCs();
    const own = this.state.ownership || {};

    hud.innerHTML = `
      <!-- Round counter -->
      <div class="h-round">
        <div class="h-round-label">ROUND</div>
        <div class="h-round-num">${round}</div>
      </div>

      <!-- Nation turn-order icons -->
      <div class="h-nations">
        ${TURN_ORDER.map(n => {
          const nDef   = NATIONS[n];
          const active = n === nation;
          const nIpc   = this.state.ipc[n] || 0;
          const human  = this.state.players[n] === 'human';
          return `
            <div class="h-nat ${active ? 'active' : ''} ${nDef.side}"
                 title="${nDef.name}: ${nIpc} IPC ${human ? '(You)' : '(AI)'}">
              <span class="h-nat-sym">${NAT_SYMBOL[n] || nDef.flag}</span>
              ${active ? '<div class="h-nat-pip"></div>' : ''}
            </div>`;
        }).join('')}
      </div>

      <!-- Phase + current nation -->
      <div class="h-center">
        <div class="h-phase-name">${PHASE_LABELS[phase] || phase}</div>
        <div class="h-nation-lbl" style="color:${nd?.color || '#888'}">${nd?.name || nation}</div>
      </div>

      <!-- Victory Cities tracker -->
      <div class="h-vc">
        <div class="h-vc-row">
          <span class="h-vc-count axis">AXIS ${axisVC}/${AXIS_WIN}</span>
          <div class="h-vc-bar">
            ${ALL_VCS.map(tid => {
              const side = NATIONS[own[tid]]?.side || 'neutral';
              return `<span class="h-vc-sq ${side}"></span>`;
            }).join('')}
          </div>
          <span class="h-vc-count allies">ALLIES ${alliedVC}</span>
        </div>
        <div class="h-vc-label">VICTORY CITIES · AXIS WINS AT ${AXIS_WIN}</div>
      </div>

      <!-- Current-nation IPC -->
      <div class="h-ipc">
        <div class="h-ipc-val">${ipc}</div>
        <div class="h-ipc-lbl">IPC</div>
      </div>

      <!-- Rules button -->
      <button class="h-rules-btn" id="btn-rules" title="Rules Reference">📖</button>
    `;
  }
}

const HUD_CSS = `
  .hud {
    display: flex; align-items: center; gap: 8px;
    padding: 0 10px;
    background: #1a1e14;
    border-bottom: 2px solid #2e3222;
    height: 52px; flex-shrink: 0;
    font-family: 'Arial Narrow', Arial, sans-serif;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.5);
  }

  /* ── Round box ── */
  .h-round {
    display: flex; flex-direction: column; align-items: center;
    background: #c8a040; color: #0a0a05;
    padding: 3px 8px; border-radius: 3px;
    min-width: 44px; flex-shrink: 0;
  }
  .h-round-label { font-size: 0.52rem; font-weight: 900; letter-spacing: 1.5px; line-height: 1; }
  .h-round-num   { font-size: 1.1rem;  font-weight: 900; line-height: 1; }

  /* ── Nation icons ── */
  .h-nations { display: flex; gap: 4px; flex-shrink: 0; }
  .h-nat {
    width: 30px; height: 30px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid transparent; cursor: default;
    opacity: 0.4; position: relative; transition: opacity 0.2s;
  }
  .h-nat.active  { opacity: 1; border-color: #e8a820; }
  .h-nat.axis    { background: #2a1414; }
  .h-nat.allies  { background: #141828; }
  .h-nat-sym     { font-size: 0.82rem; line-height: 1; }
  .h-nat-pip {
    position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%);
    width: 4px; height: 4px; border-radius: 50%; background: #e8a820;
  }

  /* ── Phase block ── */
  .h-center {
    display: flex; flex-direction: column; align-items: center;
    padding: 0 6px; flex-shrink: 0;
  }
  .h-phase-name {
    font-size: 0.82rem; font-weight: 900; color: #e8e0c8;
    letter-spacing: 1.5px; text-transform: uppercase; line-height: 1;
  }
  .h-nation-lbl { font-size: 0.6rem; font-weight: bold; line-height: 1.4; }

  /* ── Victory Cities ── */
  .h-vc {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    gap: 2px; min-width: 0;
  }
  .h-vc-row     { display: flex; align-items: center; gap: 6px; }
  .h-vc-count   { font-size: 0.66rem; font-weight: bold; white-space: nowrap; }
  .h-vc-count.axis   { color: #e07060; }
  .h-vc-count.allies { color: #70a8e8; }
  .h-vc-bar     { display: flex; gap: 2px; flex-wrap: nowrap; }
  .h-vc-sq {
    width: 11px; height: 11px; border-radius: 2px;
    background: #333; border: 1px solid #444;
  }
  .h-vc-sq.axis    { background: #b02820; border-color: #d04030; }
  .h-vc-sq.allies  { background: #1848a0; border-color: #2868c0; }
  .h-vc-sq.neutral { background: #404030; border-color: #606050; }
  .h-vc-label {
    font-size: 0.48rem; color: #5a6840; letter-spacing: 1px; text-transform: uppercase;
  }

  /* ── IPC block ── */
  .h-ipc {
    display: flex; flex-direction: column; align-items: center;
    background: #0e1408; border: 1px solid #2a3820;
    border-radius: 4px; padding: 3px 10px; flex-shrink: 0;
  }
  .h-ipc-val { font-size: 1.2rem; color: #c8a040; font-weight: 900; line-height: 1; }
  .h-ipc-lbl { font-size: 0.52rem; color: #5a6a3a; letter-spacing: 1px; }

  /* ── Rules button ── */
  .h-rules-btn {
    background: #1a1e14; border: 1px solid #3a4028;
    color: #8a9060; font-size: 1rem;
    width: 32px; height: 32px; border-radius: 5px;
    cursor: pointer; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    -webkit-tap-highlight-color: transparent;
  }
  .h-rules-btn:hover { background: #2a2e1c; color: #c0b880; }
`;
