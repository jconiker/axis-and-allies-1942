import { GameState } from '../engine/GameState.js';
import { TurnEngine } from '../engine/TurnEngine.js';
import { AIController } from '../ai/AIController.js';
import { SCENARIO_1942 } from '../data/scenarios.js';
import { NATIONS, TURN_ORDER, areEnemies } from '../data/nations.js';
import { TERRITORIES } from '../data/territories.js';
import { MapRenderer } from './MapRenderer.js';
import { HUD } from './HUD.js';
import { PurchasePanel } from './PurchasePanel.js';
import { CombatModal } from './CombatModal.js';
import { RulesPanel } from './RulesPanel.js';

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
      <div id="game-wrap" style="display:none;width:100%;height:100%;flex-direction:column;">
        <div id="hud-root"></div>
        <div id="map-root" style="flex:1;overflow:hidden;position:relative;"></div>
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
    const NAT_INFO = {
      ussr:      { sym: '★',  label: 'SOVIET UNION', side: 'allies', color: '#c02828' },
      germany:   { sym: '✚',  label: 'GERMANY',      side: 'axis',   color: '#6090a0' },
      uk:        { sym: '⊕',  label: 'U.K.',          side: 'allies', color: '#c88018' },
      japan:     { sym: '✿',  label: 'JAPAN',         side: 'axis',   color: '#d0a020' },
      usa:       { sym: '★',  label: 'U.S.A.',         side: 'allies', color: '#3a8030' },
      australia: { sym: '🦘', label: 'AUSTRALIA',     side: 'allies', color: '#2a9a68' },
    };

    this._showOverlay(`
      <div class="ns-screen">
        <h1 class="ns-title">AXIS &amp; ALLIES</h1>
        <p class="ns-sub">1942 — SECOND EDITION</p>

        <div class="ns-combatants">
          <div class="ns-side">
            <div class="ns-side-label axis-lbl">AXIS</div>
            ${['germany','japan'].map(n => `
              <div class="ns-card ${n}" data-nation="${n}">
                <div class="ns-card-sym" style="color:${NAT_INFO[n].color}">${NAT_INFO[n].sym}</div>
                <div class="ns-card-name">${NAT_INFO[n].label}</div>
                <div class="ns-card-type">
                  <button class="ns-type-btn human" data-nation="${n}" data-type="human">HUMAN</button>
                  <button class="ns-type-btn ai active" data-nation="${n}" data-type="ai">AI</button>
                </div>
              </div>`).join('')}
          </div>

          <div class="ns-vs">VS</div>

          <div class="ns-side">
            <div class="ns-side-label allies-lbl">ALLIES</div>
            ${['ussr','uk','usa','australia'].map(n => `
              <div class="ns-card ${n}" data-nation="${n}">
                <div class="ns-card-sym" style="color:${NAT_INFO[n].color}">${NAT_INFO[n].sym}</div>
                <div class="ns-card-name">${NAT_INFO[n].label}</div>
                <div class="ns-card-type">
                  <button class="ns-type-btn human" data-nation="${n}" data-type="human">HUMAN</button>
                  <button class="ns-type-btn ai active" data-nation="${n}" data-type="ai">AI</button>
                </div>
              </div>`).join('')}
          </div>
        </div>

        <div class="ns-settings">
          <div class="ns-row">
            <span class="ns-row-label">⚙ AI DIFFICULTY</span>
            <div class="ns-diff">
              <button class="ns-diff-btn" data-diff="easy">EASY</button>
              <button class="ns-diff-btn active" data-diff="normal">NORMAL</button>
              <button class="ns-diff-btn" data-diff="hard">HARD</button>
            </div>
          </div>
          <div class="ns-row">
            <span class="ns-row-label">⚑ SCENARIO</span>
            <span class="ns-row-val">1942 SECOND EDITION</span>
          </div>
        </div>

        <button class="ns-start" id="btn-start">START CAMPAIGN →</button>
      </div>
    `);

    const playerNations = new Set();
    let difficulty = 'normal';

    // Per-nation human/ai toggle
    document.querySelectorAll('.ns-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const nation = btn.dataset.nation;
        const type   = btn.dataset.type;
        // Update buttons for this nation
        document.querySelectorAll(`.ns-type-btn[data-nation="${nation}"]`).forEach(b => {
          b.classList.toggle('active', b.dataset.type === type);
        });
        if (type === 'human') playerNations.add(nation);
        else                  playerNations.delete(nation);
      });
    });

    document.querySelectorAll('.ns-diff-btn').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.ns-diff-btn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        difficulty = b.dataset.diff;
      });
    });

    document.getElementById('btn-start').addEventListener('click', () => {
      if (playerNations.size === 0) {
        // Default: play as Allies if nothing chosen
        playerNations.add('ussr'); playerNations.add('uk'); playerNations.add('usa'); playerNations.add('australia');
      }
      this._startNewGame([...playerNations], difficulty);
    });
  }

  _startNewGame(playerNations, difficulty) {
    TURN_ORDER.forEach(n => {
      this.state.players[n] = playerNations.includes(n) ? 'human' : 'ai';
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

    this.rulesPanel = new RulesPanel(document.body);
    this._buildPhaseBar();
    this._wireEvents();

    this.hud.render();
    this.map.render();

    // Wire rules button (rendered by HUD)
    document.getElementById('btn-rules')?.addEventListener('click', () => this.rulesPanel?.show());

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

  // ── FLOATING CONTROLS ───────────────────────────────────────────────────────

  _buildPhaseBar() {
    // Remove any previous floating controls
    document.getElementById('float-controls')?.remove();

    const fc = document.createElement('div');
    fc.id = 'float-controls';
    fc.innerHTML = `
      <style>${FLOAT_CSS}</style>
      <!-- Round END PHASE button bottom-right -->
      <button class="float-end-btn" id="btn-end-phase">
        <span>END</span><span>PHASE</span>
      </button>
      <!-- Research button (shown only during purchase) -->
      <button class="float-research-btn" id="btn-research" style="display:none">🔬</button>
      <!-- Phase hint bottom-center -->
      <div class="float-hint" id="phase-hint"></div>
      <!-- AI thinking banner -->
    `;
    document.body.appendChild(fc);

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
        // Re-wire rules button (HUD innerHTML is rebuilt each render)
        document.getElementById('btn-rules')?.addEventListener('click', () => this.rulesPanel?.show());
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

        // Research button only during purchase (handled inside purchase panel instead)
        const resBtn = document.getElementById('btn-research');
        if (resBtn) resBtn.style.display = 'none';

        // Floating End Phase button — always visible so player can end phase
        // even if purchase panel was closed with X
        const endBtn = document.getElementById('btn-end-phase');
        if (endBtn) {
          endBtn.style.display = 'flex';
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
    // game_over fires on TurnEngine's bus (not state) — wire both to be safe
    this.state.on('game_over', (data) => {
      try { this._showVictoryScreen(data.winner); } catch {}
    });
    this.turnEngine.on('game_over', (data) => {
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
      const nation = this.state.currentNation;

      // Determine the dominant unit type in the selection
      // (mixed stacks use the most restrictive movement)
      const LAND_TYPES  = new Set(['infantry','artillery','armor','antiair']);
      const AIR_TYPES   = new Set(['fighter','bomber']);
      const NAVAL_TYPES = new Set(['submarine','destroyer','cruiser','carrier','battleship','transport']);

      const UNIT_MOVE = {
        infantry:1, artillery:1, armor:2, antiair:1,
        fighter:4,  bomber:6,
        submarine:2, destroyer:2, cruiser:2,
        carrier:2,  battleship:2, transport:2,
      };

      // Figure out unit categories
      let hasLand = false, hasAir = false, hasNaval = false;
      units.forEach(u => {
        if (LAND_TYPES.has(u.type))  hasLand  = true;
        if (AIR_TYPES.has(u.type))   hasAir   = true;
        if (NAVAL_TYPES.has(u.type)) hasNaval = true;
      });

      // AA guns may not move in combat phase
      if (phase === 'combat_move' && units.every(u => u.type === 'antiair')) return [];

      // Use the movement range of the MOST RESTRICTIVE unit type in the stack.
      // Mixed land+air stacks show land range — air units must be moved separately.
      // This prevents "whole map goes green" from fighters dragging along infantry.
      let maxMove = 1;
      units.forEach(u => {
        if (hasLand && AIR_TYPES.has(u.type)) return; // skip air if land present
        maxMove = Math.max(maxMove, UNIT_MOVE[u.type] || 1);
      });

      // BFS to find all reachable territory IDs within maxMove steps
      const reachable = new Set();
      // frontier: [{id, movesLeft, enteredEnemy}]
      const frontier  = [{ id: fromId, movesLeft: maxMove, enteredEnemy: false }];
      const visited   = new Map(); // id → movesLeft (prune if already visited with more moves)

      while (frontier.length > 0) {
        const { id, movesLeft, enteredEnemy } = frontier.shift();
        const t = TERRITORIES[id];
        if (!t) continue;

        for (const adjId of (t.adjacent || [])) {
          const adj = TERRITORIES[adjId];
          if (!adj) continue;

          // Type constraints
          if (hasLand  && !hasAir && adj.type === 'sea')  continue; // land can't enter sea
          if (hasNaval && !hasAir && adj.type !== 'sea')  continue; // naval can't enter land

          const owner    = this.state.ownership[adjId];
          const isEnemy  = owner && owner !== 'neutral' && areEnemies(owner, nation);
          const isFriendly = !isEnemy;

          if (phase === 'combat_move') {
            // Can move to any adjacent territory in combat move
            // Land/naval stop when entering enemy territory (no passing through)
            // Air units can fly over territory freely
            reachable.add(adjId);

            const prevMoves = visited.get(adjId);
            if (movesLeft > 1 && (prevMoves === undefined || prevMoves < movesLeft - 1)) {
              visited.set(adjId, movesLeft - 1);
              // Land stops when it enters enemy territory (can't pass through)
              if (!enteredEnemy && (!isEnemy || hasAir)) {
                frontier.push({ id: adjId, movesLeft: movesLeft - 1, enteredEnemy: isEnemy });
              }
            }

          } else if (phase === 'noncombat_move') {
            // Non-combat: can only enter friendly or neutral territories
            if (isEnemy) continue;

            reachable.add(adjId);
            const prevMoves = visited.get(adjId);
            if (movesLeft > 1 && (prevMoves === undefined || prevMoves < movesLeft - 1)) {
              visited.set(adjId, movesLeft - 1);
              frontier.push({ id: adjId, movesLeft: movesLeft - 1, enteredEnemy: false });
            }
          }
        }
      }

      // Remove the source territory itself
      reachable.delete(fromId);
      return [...reachable];
    } catch (e) {
      console.error('[App] _getValidTargets error:', e);
      return [];
    }
  }

  _handlePlaceClick(territoryId) {
    const nation = this.state.currentNation;
    const pending = this.state.pendingPlacements[nation];
    if (pending.length === 0) return;

    const nextUnit = pending[0];
    const isPlacingIC = nextUnit === 'industrial_complex';
    const hasIC = this.state.industrialComplexes[territoryId] === nation;
    const ownsTerritory = this.state.ownership[territoryId] === nation;

    if (isPlacingIC) {
      // Build IC on owned territory (3+ IPC, no existing IC)
      const ipcVal = TERRITORIES[territoryId]?.ipc ?? 0;
      if (!ownsTerritory) { this._toast('You must own the territory to build an industrial complex.'); return; }
      if (hasIC) { this._toast('Territory already has an industrial complex.'); return; }
      if (ipcVal < 3) { this._toast('Industrial complexes require 3+ IPC territory.'); return; }
    } else {
      // Normal units must be placed at existing IC
      if (!hasIC) { this._toast('Units must be placed at industrial complexes.'); return; }
    }

    this.state.placeUnit(nextUnit, nation, territoryId);
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
  /* ── Overlay / base ── */
  .screen-overlay {
    position: fixed; inset: 0;
    background: rgba(5,8,14,0.95);
    display: flex; align-items: center; justify-content: center;
    z-index: 500;
    font-family: 'Arial Narrow', Arial, sans-serif;
  }

  /* ── Resume screen ── */
  .screen-card {
    background: #141810; border: 1px solid #2c3018;
    border-radius: 10px; padding: 32px 40px; text-align: center;
    max-width: 420px; width: 90%;
    box-shadow: 0 8px 48px rgba(0,0,0,0.9);
    font-family: 'Arial Narrow', Arial, sans-serif;
  }
  .screen-card h1  { font-size: 1.8rem; color: #c8a040; letter-spacing: 3px; font-weight: 900; }
  .screen-card .sub { color: #5a6840; margin: 4px 0 20px; font-size: 0.8rem; letter-spacing: 2px; }
  .resume-info { background: #0e1208; border-radius: 6px; padding: 14px; margin: 14px 0; border: 1px solid #2c3018; }
  .resume-info p   { color: #c0b880; margin: 4px 0; font-size: 0.9rem; }
  .resume-info .dim { color: #5a6040; font-size: 0.8rem; }
  .btn-group { display: flex; gap: 10px; margin-top: 14px; }

  .btn {
    padding: 12px 20px; border: none; border-radius: 5px;
    font-family: inherit; font-size: 0.88rem; font-weight: 900; letter-spacing: 1px;
    cursor: pointer; flex: 1; min-height: 46px;
    -webkit-tap-highlight-color: transparent;
  }
  .btn-primary   { background: #b83010; color: #fff; }
  .btn-secondary { background: #1e2814; color: #a0a880; border: 1px solid #2c3820; }
  .victory h1    { color: #c8a040; font-size: 2rem; margin-bottom: 12px; }

  /* ── NEW GAME setup screen ── */
  .ns-screen {
    width: min(720px, 95vw);
    background: #111408;
    border: 1px solid #2a2c18;
    border-radius: 10px;
    padding: 24px 28px 20px;
    box-shadow: 0 8px 64px rgba(0,0,0,0.95);
    font-family: 'Arial Narrow', Arial, sans-serif;
  }
  .ns-title {
    font-size: 2rem; color: #c8a040; letter-spacing: 4px; font-weight: 900;
    text-align: center; margin: 0 0 4px;
  }
  .ns-sub {
    text-align: center; font-size: 0.72rem; color: #5a6040;
    letter-spacing: 3px; margin: 0 0 20px;
  }

  /* Combatants grid */
  .ns-combatants {
    display: flex; align-items: flex-start; gap: 16px;
    margin-bottom: 18px;
  }
  .ns-side       { flex: 1; display: flex; flex-direction: column; gap: 8px; }
  .ns-side-label { font-size: 0.72rem; font-weight: 900; letter-spacing: 2px; text-align: center; margin-bottom: 4px; }
  .axis-lbl      { color: #d06060; }
  .allies-lbl    { color: #6090d0; }
  .ns-vs {
    font-size: 1.1rem; font-weight: 900; color: #5a5840;
    align-self: center; padding: 0 4px;
  }

  /* Nation card */
  .ns-card {
    background: #0e1008; border: 1px solid #282a18;
    border-radius: 6px; padding: 10px 12px;
    display: flex; align-items: center; gap: 10px;
  }
  .ns-card-sym  { font-size: 1.4rem; flex-shrink: 0; width: 28px; text-align: center; }
  .ns-card-name { flex: 1; font-size: 0.72rem; font-weight: 900; color: #c0b880; letter-spacing: 1px; }
  .ns-card-type { display: flex; gap: 3px; }
  .ns-type-btn {
    padding: 4px 8px; border: 1px solid #2c2c18;
    background: #0a0c06; color: #5a5a40;
    font-family: inherit; font-size: 0.6rem; font-weight: 900;
    letter-spacing: 0.5px; cursor: pointer; border-radius: 3px;
    -webkit-tap-highlight-color: transparent;
  }
  .ns-type-btn.active.human { background: #1a2a10; color: #60e840; border-color: #40a820; }
  .ns-type-btn.active.ai   { background: #2a1a10; color: #e87840; border-color: #a04810; }

  /* Settings */
  .ns-settings { border-top: 1px solid #2a2c18; padding-top: 14px; margin-bottom: 16px; }
  .ns-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
  .ns-row-label { font-size: 0.72rem; color: #7a7850; letter-spacing: 1px; flex: 1; }
  .ns-row-val   { font-size: 0.72rem; color: #c0b060; font-weight: bold; }
  .ns-diff { display: flex; gap: 4px; }
  .ns-diff-btn {
    padding: 5px 12px; border: 1px solid #2c2c18;
    background: #0e0e08; color: #5a5840;
    font-family: inherit; font-size: 0.65rem; font-weight: 900;
    letter-spacing: 1px; cursor: pointer; border-radius: 3px;
  }
  .ns-diff-btn.active { background: #1e2010; color: #e8c040; border-color: #a08020; }

  /* Start button */
  .ns-start {
    width: 100%; padding: 14px; border: none; border-radius: 6px;
    background: #b83010; color: #fff;
    font-family: inherit; font-size: 0.95rem; font-weight: 900; letter-spacing: 2px;
    cursor: pointer; min-height: 50px;
    -webkit-tap-highlight-color: transparent;
  }
  .ns-start:hover  { background: #d84020; }
  .ns-start:active { background: #902808; }

  /* Toast */
  .toast {
    position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%) translateY(16px);
    background: #1c1808; color: #c0b060; border: 1px solid #3a3420;
    border-radius: 6px; padding: 10px 20px; font-size: 0.85rem;
    opacity: 0; transition: all 0.25s; z-index: 900; white-space: nowrap;
    pointer-events: none; font-family: 'Arial Narrow', Arial, sans-serif;
  }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
`;

// ── FLOATING CONTROLS CSS ────────────────────────────────────────────────────
const FLOAT_CSS = `
  /* Round END PHASE button — bottom right, like App Store */
  .float-end-btn {
    position: fixed; bottom: 22px; right: 22px;
    width: 64px; height: 64px; border-radius: 50%;
    background: #b82010; border: 3px solid #e03020;
    color: #fff;
    font-family: 'Arial Narrow', Arial, sans-serif;
    font-size: 0.54rem; font-weight: 900; letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 1px; z-index: 400;
    box-shadow: 0 4px 20px rgba(180,30,10,0.7);
    -webkit-tap-highlight-color: transparent;
  }
  .float-end-btn:disabled { opacity: 0.25; cursor: not-allowed; box-shadow: none; }
  .float-end-btn:not(:disabled):hover  { background: #d03020; }
  .float-end-btn:not(:disabled):active { transform: scale(0.93); }

  /* Research button */
  .float-research-btn {
    position: fixed; bottom: 96px; right: 22px;
    width: 48px; height: 48px; border-radius: 50%;
    background: #1a1a3a; border: 2px solid #4040a0;
    color: #aaaaee; font-size: 1.1rem;
    cursor: pointer; z-index: 400;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 12px rgba(0,0,120,0.5);
    -webkit-tap-highlight-color: transparent;
  }

  /* Phase hint */
  .float-hint {
    position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
    color: #5a6040; font-size: 0.78rem; font-family: 'Arial Narrow', Arial, sans-serif;
    pointer-events: none; z-index: 399; white-space: nowrap;
    text-shadow: 0 1px 4px #000;
  }
`;
