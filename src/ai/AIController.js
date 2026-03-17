import { TERRITORIES } from '../data/territories.js';
import { NATIONS, TURN_ORDER, areEnemies } from '../data/nations.js';
import { getAllUnits } from '../data/units.js';
import { CombatEngine } from '../engine/CombatEngine.js';

/**
 * AI Controller — heuristic-based opponent.
 * Handles all phases for AI-controlled nations.
 */
export class AIController {
  constructor(gameState) {
    this.state = gameState;
    this.thinkDelay = 600; // ms between AI actions (so human can watch)
    this.difficulty = 'easy'; // easy | normal | hard
  }

  /** Main entry point — called by TurnEngine when it's an AI nation's turn */
  async takeTurn(turnEngine) {
    const nation = this.state.currentNation;
    const phase = this.state.phase;

    try {
    await this._delay(this.thinkDelay);

    if (phase === 'purchase') {
      this._doPurchase(nation);
      turnEngine.advancePhase();
    } else if (phase === 'combat_move') {
      this._doCombatMove(nation);
      turnEngine.advancePhase();
    } else if (phase === 'conduct_combat') {
      await this._doCombat(nation, turnEngine);
      turnEngine.advancePhase();
    } else if (phase === 'noncombat_move') {
      this._doNonCombatMove(nation);
      turnEngine.advancePhase();
    } else if (phase === 'place') {
      this._doPlace(nation);
      turnEngine.advancePhase();
    } else if (phase === 'collect') {
      turnEngine.advancePhase();
    }
    } catch (e) {
      console.error('[AI] takeTurn error — skipping phase:', e);
      try { turnEngine.advancePhase(); } catch {}
    }
  }

  // ── PURCHASE PHASE ─────────────────────────────────────────────────────────

  _doPurchase(nation) {
    const ipc = this.state.ipc[nation];
    const units = getAllUnits();
    const isAxis = NATIONS[nation].side === 'axis';

    // Strategy: mix of infantry (cheapest, most) + some armor + occasional fighter
    const budget = ipc;
    let spent = 0;
    const toBuy = [];

    // Threat assessment: are we being attacked?
    const underThreat = this._isCapitalThreatened(nation);

    if (underThreat) {
      // Buy mostly infantry for defense
      while (spent + units.infantry.cost <= budget && toBuy.filter(u=>u==='infantry').length < 8) {
        toBuy.push('infantry'); spent += units.infantry.cost;
      }
    } else {
      // Balanced: 2:1 infantry to armor, occasional air
      let infCount = 0, armCount = 0;
      while (spent < budget) {
        const remaining = budget - spent;
        if (remaining >= units.armor.cost && armCount < infCount / 2) {
          toBuy.push('armor'); spent += units.armor.cost; armCount++;
        } else if (remaining >= units.infantry.cost) {
          toBuy.push('infantry'); spent += units.infantry.cost; infCount++;
        } else if (remaining >= units.artillery.cost) {
          toBuy.push('artillery'); spent += units.artillery.cost;
        } else {
          break;
        }
      }
      // Buy a fighter if enough IPC left and we don't have many air
      const myAir = this._getAllUnitsOfNation(nation).filter(u => getAllUnits()[u.type]?.type === 'air').length;
      if (budget - spent >= units.fighter.cost && myAir < 3) {
        toBuy.push('fighter'); spent += units.fighter.cost;
      }
    }

    toBuy.forEach(unitType => this.state.purchaseUnit(unitType, nation));
  }

  // ── COMBAT MOVEMENT ────────────────────────────────────────────────────────

  _doCombatMove(nation) {
    // Find all friendly territories with units that can attack
    const myTerritories = this._getMyTerritories(nation);

    myTerritories.forEach(tid => {
      const myUnits = this.state.getUnits(tid, nation);
      if (myUnits.length === 0) return;

      // Find adjacent enemy territories worth attacking
      const territory = TERRITORIES[tid];
      if (!territory) return;

      territory.adjacent.forEach(adjId => {
        const adjTerritory = TERRITORIES[adjId];
        if (!adjTerritory || adjTerritory.type === 'sea') return;
        const adjOwner = this.state.ownership[adjId];
        if (!adjOwner || adjOwner === nation || !areEnemies(adjOwner, nation)) return;

        const enemyUnits = this.state.getUnits(adjId);
        const odds = CombatEngine.estimateOdds(myUnits, enemyUnits);

        // Attack if we have > 60% odds or it's a capital
        const isCapital = Object.values(NATIONS).some(n => n.capital === adjId);
        if (odds > 0.60 || (isCapital && odds > 0.40)) {
          // Move half our attacking units (keep some to defend)
          const attackWith = myUnits.slice(0, Math.ceil(myUnits.length * 0.7));
          if (attackWith.length > 0) {
            this.state.moveUnits(attackWith.map(u => u.id), tid, adjId);
          }
        }
      });
    });
  }

  // ── CONDUCT COMBAT ─────────────────────────────────────────────────────────

  async _doCombat(nation, turnEngine) {
    const combats = turnEngine.pendingCombats || [];

    for (const tid of combats) {
      await this._delay(400);
      let round = 0;
      let isFirstRound = true;

      while (round < 20) { // max 20 rounds to prevent infinite loop
        const attackers = this.state.getUnits(tid, nation);
        const defenders = this.state.getUnits(tid).filter(u => u.nation !== nation);

        if (attackers.length === 0) break; // attackers retreated/destroyed
        if (defenders.length === 0) {
          // Capture territory
          this.state.captureTerritory(tid, nation);
          break;
        }

        const result = CombatEngine.resolveCombatRound(attackers, defenders, isFirstRound);

        // Apply defender hits to attackers
        const attackerCasualties = CombatEngine.selectCasualties(attackers, result.defenderHits, true);
        attackerCasualties.filter(c => c.killed).forEach(c => {
          this.state.units[tid] = this.state.units[tid].filter(u => u.id !== c.unit.id);
        });

        // Apply attacker hits to defenders
        const defenderCasualties = CombatEngine.selectCasualties(defenders, result.attackerHits, false);
        defenderCasualties.filter(c => c.killed).forEach(c => {
          this.state.units[tid] = this.state.units[tid].filter(u => u.id !== c.unit.id);
        });

        isFirstRound = false;
        round++;
      }
    }
  }

  // ── NON-COMBAT MOVEMENT ────────────────────────────────────────────────────

  _doNonCombatMove(nation) {
    // Move reinforcements toward front lines (simplified: move units toward capital threats)
    const myTerritories = this._getMyTerritories(nation);
    const capital = NATIONS[nation].capital;

    myTerritories.forEach(tid => {
      if (tid === capital) return;
      const myUnits = this.state.getUnits(tid, nation).filter(u => !u.moved);
      if (myUnits.length <= 1) return;

      // Check if there's a neighboring friendly territory that needs reinforcement
      const territory = TERRITORIES[tid];
      territory?.adjacent.forEach(adjId => {
        const adjOwner = this.state.ownership[adjId];
        if (adjOwner !== nation) return;
        const adjUnits = this.state.getUnits(adjId, nation);
        // Move infantry to reinforce if neighboring territory has fewer units
        if (adjUnits.length < myUnits.length - 1) {
          const toMove = myUnits.filter(u => !u.moved).slice(0, 1);
          if (toMove.length > 0) {
            this.state.moveUnits(toMove.map(u => u.id), tid, adjId);
          }
        }
      });
    });
  }

  // ── PLACE NEW UNITS ────────────────────────────────────────────────────────

  _doPlace(nation) {
    const pending = [...this.state.pendingPlacements[nation]];
    const capital = NATIONS[nation].capital;

    // Place all units at capital (simplified)
    pending.forEach(unitType => {
      this.state.placeUnit(unitType, nation, capital);
    });
  }

  // ── HELPERS ────────────────────────────────────────────────────────────────

  _getMyTerritories(nation) {
    return Object.entries(this.state.ownership)
      .filter(([, owner]) => owner === nation)
      .map(([tid]) => tid);
  }

  _getAllUnitsOfNation(nation) {
    return Object.values(this.state.units).flat().filter(u => u.nation === nation);
  }

  _isCapitalThreatened(nation) {
    const capital = NATIONS[nation].capital;
    const capitalTerritory = TERRITORIES[capital];
    if (!capitalTerritory) return false;

    return capitalTerritory.adjacent.some(adjId => {
      const units = this.state.getUnits(adjId);
      return units.some(u => areEnemies(u.nation, nation));
    });
  }

  _delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
}
