import { GameState } from '../engine/GameState.js';
import { TurnEngine } from '../engine/TurnEngine.js';
import { AIController } from '../ai/AIController.js';
import { SCENARIO_1942 } from '../data/scenarios.js';
import { NATIONS, TURN_ORDER } from '../data/nations.js';
import { MapRenderer } from './MapRenderer.js';
import { HUD } from './HUD.js';
import { PurchasePanel } from './PurchasePanel.js';
import { CombatModal } from './CombatModal.js';

export class App {
  constructor(container) {
    this.container = container;
    this.state = new GameState();
    this.ai = new AIController(this.state);
    this.turnEngine = new TurnEngine(this.state, this.ai);

    this.map = null;
    this.hud = null;
    this.purchasePanel = null;
    this.combatModal = null;

    this.selectedTerritory = null;
    this.movingUnits = [];       // unit ids being moved
    this.validTargets = [];      // territory ids highlighted for current action
  }

  init() {
    this._buildShell();

    if (GameState.hasSave()) {
      this._showResumeScreen();
    } else {
      this._showSetupScreen();
    }
  }

  // ── SCREENS ─────────────────────────────────────────────────────────────────

  _buildShell() {
    this.container.innerHTML = `
      <style>${APP_CSS}</style>
      <div id="game-wrap" style="display:none;width:100%;height:100%;display:none;flex-direction:column;">
        <div id="hud-root"></div>
        <div id="map-root" style="flex:1;overflow:hidden;position:relative;"></div>
        <div id="phase-bar"></div>
      </div>
      <div id="overlay-root"></div>
    `;
  }

  _showResumeScreen() {
    const info = GameState.getSaveInfo();
    const d = new Date(info.timestamp);
    const when = d.toLocaleString();
    const nation = NATIONS[info.nation];

    this._showOverlay(`
      <div class="screen-card">
        <h1>⚔ AXIS &amp; ALLIES</h1>
        <p class="sub">1942 — Second Edition</p>
        <div class="resume-info">
          <p>Saved game found</p>
          <p><strong>${nation?.flag || ''} ${nation?.name || info.nation}</strong> — Round ${info.round}</p>
          <p class="dim">${when}</p>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" id="btn-resume">Resume Game</button>
          <button class="btn btn-secondary" id="btn-new">New Game</button>
        </div>
      </div>
    `);

    document.getElementById('btn-resume').addEventListener('click', () => {
      this._resumeGame();
    });
    document.getElementById('btn-new').addEventListener('click', () => {
      GameState.clearSave();
      this._showSetupScreen();
    });
  }

  _showSetupScreen() {
    this._showOverlay(`
      <div class="screen-card">
        <h1>⚔ AXIS &amp; ALLIES</h1>
        <p class="sub">1942 — Second Edition</p>

        <div class="setup-section">
          <h3>Choose Your Side</h3>
          <div class="side-btns">
            <button class="btn btn-allies" id="btn-allies">
              🤝 Play Allies<br>
              <small>USSR · UK · USA</small>
            </button>
            <button class="btn btn-axis" id="btn-axis">
              🎯 Play Axis<br>
              <small>Germany · Japan</small>
            </button>
          </div>
        </div>

        <div class="setup-section">
          <h3>AI Difficulty</h3>
          <div class="diff-btns">
            <button class="btn btn-diff active" data-diff="easy">Easy</button>
            <button class="btn btn-diff" data-diff="normal">Normal</button>
            <button class="btn btn-diff" data-diff="hard">Hard</button>
          </div>
        </div>

        <button class="btn btn-primary" id="btn-start" style="margin-top:16px;">
          Start Game
        </button>
      </div>
    `);

    let chosenSide = null;
    let difficulty = 'easy';

    document.getElementById('btn-allies').addEventListener('click', () => {
      chosenSide = 'allies';
      document.getElementById('btn-allies').classList.add('active');
      document.getElementById('btn-axis').classList.remove('active');
    });
    document.getElementById('btn-axis').addEventListener('click', () => {
      chosenSide = 'axis';
      document.getElementById('btn-axis').classList.add('active');
      document.getElementById('btn-allies').classList.remove('active');
    });
    document.querySelectorAll('.btn-diff').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.btn-diff').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        difficulty = b.dataset.diff;
      });
    });
    document.getElementById('btn-start').addEventListener('click', () => {
      if (!chosenSide) { alert('Please choose a side first!'); return; }
      this._startNewGame(chosenSide, difficulty);
    });
  }

  _startNewGame(playerSide, difficulty) {
    // Assign players vs AI
    TURN_ORDER.forEach(n => {
      const side = NATIONS[n].side;
      this.state.players[n] = (side === playerSide) ? 'human' : 'ai';
    });
    this.ai.difficulty = difficulty;

    this.state.loadScenario(SCENARIO_1942);
    this._launchGame();
  }

  _resumeGame() {
    const ok = this.state.loadSave();
    if (!ok) { this._showSetupScreen(); return; }
    this._launchGame();
  }

  _launchGame() {
    this._hideOverlay();

    const wrap = document.getElementById('game-wrap');
    wrap.style.display = 'flex';

    // Build sub-components
    this.hud = new HUD(document.getElementById('hud-root'), this);
    this.map = new MapRenderer(document.getElementById('map-root'), this);
    this.purchasePanel = new PurchasePanel(document.getElementById('overlay-root'), this);
    this.combatModal = new CombatModal(document.getElementById('overlay-root'), this);

    this._buildPhaseBar();
    this._wireEvents();

    this.hud.render();
    this.map.render();

    if (this.state.phase === 'setup') {
      this.turnEngine.startGame();
    } else {
      // Resumed — emit current state so AI can pick up
      this.state._emit('phase_changed', {
        phase: this.state.phase,
        nation: this.state.currentNation,
        round: this.state.round
      });
    }
  }

  // ── PHASE BAR ───────────────────────────────────────────────────────────────

  _buildPhaseBar() {
    const bar = document.getElementById('phase-bar');
    bar.innerHTML = `
      <div class="phase-bar">
        <button class="btn btn-phase" id="btn-end-phase">End Phase →</button>
        <div id="phase-hint" class="phase-hint"></div>
        <button class="btn btn-tech" id="btn-research" style="display:none">🔬 Research</button>
      </div>
    `;
    document.getElementById('btn-end-phase').addEventListener('click', () => this._handleEndPhase());
    document.getElementById('btn-research')?.addEventListener('click', () => this._showTechPanel());
  }

  _handleEndPhase() {
    this.selectedTerritory = null;
    this.movingUnits = [];
    this.validTargets = [];
    this.map.clearSelection();
    this.turnEngine.advancePhase();
  }

  // ── EVENT WIRING ────────────────────────────────────────────────────────────

  _wireEvents() {
    // Single handler for phase changes — wired to BOTH state and turnEngine event buses
    const onPhaseChanged = (data) => {
      try {
        this.selectedTerritory = null;
        this.movingUnits = [];
        this.validTargets = [];
        this.hud.render();
        this.map.render();
        this._updatePhaseHint(data.phase);

        const isHumanTurn = this.state.players[this.state.currentNation] === 'human';

        // Show purchase panel for human purchase phase
        if (data.phase === 'purchase' && isHumanTurn) {
          this.purchasePanel.show();
        } else {
          this.purchasePanel.hide();
        }

        // Show AI thinking indicator for AI turns
        this._setAIIndicator(!isHumanTurn);

        // Research button visible during human purchase phase
        const resBtn = document.getElementById('btn-research');
        if (resBtn) resBtn.style.display = (data.phase === 'purchase' && isHumanTurn) ? 'block' : 'none';

        // End Phase button disabled during AI turns
        const endBtn = document.getElementById('btn-end-phase');
        if (endBtn) {
          endBtn.disabled = !isHumanTurn;
          endBtn.style.opacity = isHumanTurn ? '1' : '0.4';
        }
      } catch (e) { console.error('[App] phase_changed handler:', e); }
    };

    // Listen on both buses — GameState fires it for mid-game transitions,
    // TurnEngine fires it for startGame() and _endCombatMove() etc.
    this.state.on('phase_changed', onPhaseChanged);
    this.turnEngine.on('phase_changed', onPhaseChanged);

    this.state.on('territory_captured', () => {
      try { this.map.render(); this.hud.render(); } catch {}
    });
    this.state.on('units_moved', () => {
      try { this.map.render(); } catch {}
    });
    this.state.on('unit_placed', () => {
      try { this.map.render(); } catch {}
    });
    this.state.on('income_collected', () => {
      try { this.hud.render(); } catch {}
    });
    this.state.on('tech_researched', (data) => {
      try {
        this._toast(`🔬 ${data.nation} researched a new technology!`);
        this.hud.render();
      } catch {}
    });
    this.state.on('game_over', (data) => {
      try { this._showVictoryScreen(data.winner); } catch {}
    });

    this.turnEngine.on('combat_needed', (data) => {
      try {
        if (this.state.players[this.state.currentNation] === 'human') {
          this.combatModal.show(data.territoryId);
        }
      } catch {}
    });
  }

  _setAIIndicator(active) {
    let el = document.getElementById('ai-thinking');
    if (active) {
      if (!el) {
        el = document.createElement('div');
        el.id = 'ai-thinking';
        el.style.cssText = 'position:fixed;top:52px;left:50%;transform:translateX(-50%);background:#1a2a3a;border:1px solid #2a5a8a;border-radius:0 0 8px 8px;padding:4px 16px;font-size:0.75rem;color:#6ad4ff;z-index:100;pointer-events:none;';
        el.textContent = '🤖 AI is thinking…';
        document.body.appendChild(el);
      }
    } else {
      el?.remove();
    }
  }

  _updatePhaseHint(phase) {
    const hints = {
      purchase: 'Buy units — they will be placed at end of turn.',
      combat_move: 'Tap your units, then tap a territory to attack or move.',
      conduct_combat: 'Tap a battle to resolve it.',
      noncombat_move: 'Move remaining units to friendly territories.',
      place: 'Place newly purchased units on industrial territories.',
      collect: 'Collecting income…',
    };
    const el = document.getElementById('phase-hint');
    if (el) el.textContent = hints[phase] || '';
  }

  // ── TERRITORY SELECTION (called by MapRenderer) ──────────────────────────────

  onTerritoryClick(territoryId) {
    try {
      const phase = this.state.phase;
      const nation = this.state.currentNation;
      const isHuman = this.state.players[nation] === 'human';

      // Always show territory detail on second tap or when not in an action
      if (!isHuman) {
        this._showTerritoryDetail(territoryId);
        return;
      }

      if (phase === 'combat_move' || phase === 'noncombat_move') {
        this._handleMoveClick(territoryId, phase);
      } else if (phase === 'conduct_combat') {
        const combats = this.turnEngine.pendingCombats || [];
        if (combats.includes(territoryId)) {
          this.combatModal.show(territoryId);
        } else {
          this._showTerritoryDetail(territoryId);
        }
      } else if (phase === 'place') {
        this._handlePlaceClick(territoryId);
      } else {
        this._showTerritoryDetail(territoryId);
      }
    } catch (e) {
      console.error('[App] onTerritoryClick:', e);
    }
  }

  _showTerritoryDetail(territoryId) {
    // Lazy import to keep initial bundle smaller
    import('./TerritoryDetail.js').then(({ TerritoryDetail }) => {
      new TerritoryDetail(document.getElementById('overlay-root'), this).show(territoryId);
    }).catch(() => {});
  }

  _handleMoveClick(territoryId, phase) {
    const nation = this.state.currentNation;

    if (this.movingUnits.length === 0) {
      // First click — select source territory
      const myUnits = this.state.getUnits(territoryId, nation).filter(u => !u.moved);
      if (myUnits.length === 0) return;
      this.selectedTerritory = territoryId;
      this.movingUnits = myUnits.map(u => u.id);
      // Highlight valid targets
      this.validTargets = this._getValidTargets(territoryId, myUnits, phase);
      this.map.setSelection(territoryId, this.validTargets);
    } else {
      // Second click — move to target
      if (this.validTargets.includes(territoryId)) {
        this.state.moveUnits(this.movingUnits, this.selectedTerritory, territoryId);
      }
      this.selectedTerritory = null;
      this.movingUnits = [];
      this.validTargets = [];
      this.map.clearSelection();
    }
  }

  _getValidTargets(fromId, units, phase) {
    try {
      const { MoveValidator } = window.__validators || {};
      // Simple adjacency fallback — a proper MoveValidator would be used here
      const territory = window.__TERRITORIES?.[fromId];
      return territory?.adjacent || [];
    } catch { return []; }
  }

  _handlePlaceClick(territoryId) {
    const nation = this.state.currentNation;
    const pending = this.state.pendingPlacements[nation];
    if (pending.length === 0) return;
    const hasIC = this.state.industrialComplexes[territoryId] === nation;
    if (!hasIC) { this._toast('Units must be placed at industrial complexes.'); return; }
    // Place first pending unit
    this.state.placeUnit(pending[0], nation, territoryId);
  }

  // ── TECH RESEARCH PANEL ──────────────────────────────────────────────────────

  _showTechPanel() {
    import('./TechPanel.js').then(({ TechPanel }) => {
      new TechPanel(document.getElementById('overlay-root'), this).show();
    }).catch(e => console.error('[App] TechPanel load failed:', e));
  }

  // ── VICTORY ─────────────────────────────────────────────────────────────────

  _showVictoryScreen(winner) {
    GameState.clearSave();
    const label = winner === 'allies' ? '🤝 ALLIES VICTORY!' : '🎯 AXIS VICTORY!';
    this._showOverlay(`
      <div class="screen-card victory">
        <h1>${label}</h1>
        <p>The ${winner} have conquered enough capitals to win the war.</p>
        <button class="btn btn-primary" onclick="location.reload()">Play Again</button>
      </div>
    `);
  }

  // ── HELPERS ─────────────────────────────────────────────────────────────────

  _showOverlay(html) {
    const root = document.getElementById('overlay-root');
    root.innerHTML = `<div class="screen-overlay">${html}</div>`;
  }

  _hideOverlay() {
    const root = document.getElementById('overlay-root');
    const overlay = root.querySelector('.screen-overlay');
    if (overlay) overlay.remove();
  }

  _toast(msg, duration = 2500) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, duration);
  }
}

// ── GLOBAL CSS ───────────────────────────────────────────────────────────────
const APP_CSS = `
  .screen-overlay {
    position: fixed; inset: 0;
    background: rgba(5,10,20,0.92);
    display: flex; align-items: center; justify-content: center;
    z-index: 500;
  }
  .screen-card {
    background: #111e30;
    border: 1px solid #1e3a5a;
    border-radius: 12px;
    padding: 32px 40px;
    text-align: center;
    max-width: 480px;
    width: 90%;
    box-shadow: 0 8px 48px rgba(0,0,0,0.8);
  }
  .screen-card h1 { font-size: 1.8rem; color: #c8a040; letter-spacing: 2px; }
  .screen-card .sub { color: #6a7a8a; margin: 4px 0 24px; font-size: 0.9rem; }
  .setup-section { margin: 16px 0; text-align: left; }
  .setup-section h3 { color: #d4c9a8; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
  .side-btns, .diff-btns { display: flex; gap: 10px; }
  .resume-info { background: #0d1925; border-radius: 8px; padding: 16px; margin: 16px 0; }
  .resume-info p { color: #d4c9a8; margin: 4px 0; }
  .resume-info .dim { color: #6a7a8a; font-size: 0.85rem; }
  .btn-group { display: flex; gap: 10px; margin-top: 16px; }

  .btn {
    padding: 12px 20px; border: none; border-radius: 8px;
    font-family: inherit; font-size: 0.95rem; font-weight: bold;
    cursor: pointer; transition: all 0.15s; flex: 1;
    -webkit-tap-highlight-color: transparent;
    min-height: 48px;
  }
  .btn:active { transform: scale(0.97); }
  .btn-primary   { background: #c8a040; color: #0a1628; }
  .btn-secondary { background: #1e3a5a; color: #d4c9a8; }
  .btn-allies    { background: #1e3a5a; color: #6ad4ff; border: 1px solid #2a5a8a; font-size: 0.9rem; }
  .btn-axis      { background: #2a1a1a; color: #ff8a8a; border: 1px solid #5a2a2a; font-size: 0.9rem; }
  .btn-diff      { background: #1a2a1a; color: #d4c9a8; border: 1px solid #2a3a2a; font-size: 0.85rem; }
  .btn.active    { outline: 2px solid #c8a040; }
  .btn-allies.active { background: #1e4a6a; }
  .btn-axis.active   { background: #4a1a1a; }
  .victory h1    { color: #c8a040; font-size: 2rem; margin-bottom: 12px; }

  .phase-bar {
    display: flex; align-items: center; gap: 12px;
    padding: 8px 16px;
    background: #0d1925;
    border-top: 1px solid #1e3a5a;
  }
  .btn-phase { flex: 0 0 auto; background: #c8a040; color: #0a1628; padding: 10px 20px; font-size: 0.9rem; }
  .btn-tech  { flex: 0 0 auto; background: #2a2a4a; color: #aaaaee; border: 1px solid #4a4a7a; padding: 10px 16px; font-size: 0.85rem; }
  .phase-hint { flex: 1; color: #6a7a8a; font-size: 0.85rem; }

  .toast {
    position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%) translateY(20px);
    background: #1e3a5a; color: #d4c9a8; border: 1px solid #2a5a8a;
    border-radius: 8px; padding: 10px 20px; font-size: 0.9rem;
    opacity: 0; transition: all 0.25s; z-index: 900; white-space: nowrap;
    pointer-events: none;
  }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
`;
