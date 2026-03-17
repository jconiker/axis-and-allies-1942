import { TURN_ORDER, NATIONS, areEnemies } from '../data/nations.js';
import { TERRITORIES } from '../data/territories.js';
import { getAllUnits } from '../data/units.js';
import { CombatEngine } from './CombatEngine.js';

export const PHASES = ['purchase', 'combat_move', 'conduct_combat', 'noncombat_move', 'place', 'collect'];

export const PHASE_LABELS = {
  purchase: 'Purchase Units',
  combat_move: 'Combat Movement',
  conduct_combat: 'Conduct Combat',
  noncombat_move: 'Non-Combat Movement',
  place: 'Place New Units',
  collect: 'Collect Income',
};

/**
 * Manages turn flow and phase transitions.
 * Coordinates between GameState, CombatEngine, and AI.
 */
export class TurnEngine {
  constructor(gameState, aiController) {
    this.state = gameState;
    this.ai = aiController;
    this.pendingCombats = []; // territories where combat must be resolved
    this._phaseListeners = [];
  }

  /** Start the game from the beginning */
  startGame() {
    this.state.phase = 'purchase';
    const nation = this.state.currentNation;
    const round  = this.state.round;
    this._emit('turn_start',    { nation, round });
    // Fire phase_changed so listeners (purchase panel, HUD) react immediately
    this._emit('phase_changed', { phase: 'purchase', nation, round });
    this._checkAI();
  }

  /** Advance to the next phase (called by UI when human confirms) */
  advancePhase() {
    const current = this.state.phase;

    if (current === 'purchase') {
      this._endPurchase();
    } else if (current === 'combat_move') {
      this._endCombatMove();
    } else if (current === 'conduct_combat') {
      this._endCombat();
    } else if (current === 'noncombat_move') {
      this._endNonCombatMove();
    } else if (current === 'place') {
      this._endPlace();
    } else if (current === 'collect') {
      this._endCollect();
    }
  }

  _endPurchase() {
    this.state.nextPhase(); // → combat_move
    this._emit('phase_changed', { phase: 'combat_move', nation: this.state.currentNation });
    this._checkAI();
  }

  _endCombatMove() {
    this.pendingCombats = this._findCombats();
    this.state.nextPhase(); // → conduct_combat
    this._emit('phase_changed', { phase: 'conduct_combat', nation: this.state.currentNation, combats: this.pendingCombats });
    // Emit combat_needed for each pending battle so UI can react
    if (this.pendingCombats.length > 0) {
      this._emit('combat_needed', { territoryId: this.pendingCombats[0] });
    }
    this._checkAI();
  }

  _endCombat() {
    this.pendingCombats = [];
    this.state.nextPhase(); // → noncombat_move
    this._emit('phase_changed', { phase: 'noncombat_move', nation: this.state.currentNation });
    this._checkAI();
  }

  _endNonCombatMove() {
    this.state.nextPhase(); // → place
    this._emit('phase_changed', { phase: 'place', nation: this.state.currentNation });
    this._checkAI();
  }

  _endPlace() {
    this.state.nextPhase(); // → collect
    this._emit('phase_changed', { phase: 'collect', nation: this.state.currentNation });
    this._checkAI();
  }

  _endCollect() {
    const nation = this.state.currentNation;
    const income = this.state.collectIncome(nation);
    this._emit('income_collected', { nation, income });
    this.state.nextPhase(); // → next nation's purchase (or new round)

    if (this.state.checkVictory()) {
      this._emit('game_over', { winner: this.state.winner });
      return;
    }

    this._emit('turn_start', { nation: this.state.currentNation, round: this.state.round });
    this._checkAI();
  }

  /** Find all territories that have enemy units and need combat */
  _findCombats() {
    const nation = this.state.currentNation;
    const combats = [];
    Object.keys(this.state.units).forEach(tid => {
      const units = this.state.units[tid];
      const hasOwn = units.some(u => u.nation === nation);
      const hasEnemy = units.some(u => u.nation !== nation && u.nation !== null && areEnemies(u.nation, nation));
      if (hasOwn && hasEnemy) combats.push(tid);
    });
    return combats;
  }

  /** If current nation is AI, trigger AI turn */
  _checkAI() {
    if (this.state.players[this.state.currentNation] === 'ai') {
      setTimeout(() => this.ai?.takeTurn(this), 500);
    }
  }

  on(event, fn) { this._phaseListeners.push({ event, fn }); }
  _emit(event, data) {
    this._phaseListeners.filter(l => l.event === event).forEach(l => l.fn(data));
  }
}
