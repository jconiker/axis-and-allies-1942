import { TERRITORIES } from '../data/territories.js';
import { NATIONS, TURN_ORDER, areEnemies } from '../data/nations.js';
import { getAllUnits } from '../data/units.js';
import { CombatEngine } from '../engine/CombatEngine.js';

// Victory Cities — high-value strategic targets
const VICTORY_CITIES = new Set([
  'germany', 'western_europe', 'southern_europe', 'japan', 'manchuria',
  'russia', 'united_kingdom', 'eastern_us', 'india', 'australia',
]);

// High-IPC territories worth prioritizing
const HIGH_VALUE_IPC = 6;

/**
 * AI Controller — heuristic-based opponent.
 * Handles all phases for AI-controlled nations.
 * Difficulty: easy (passive), normal (balanced), hard (aggressive VC-focused)
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
    const side = NATIONS[nation].side;
    const budget = ipc;
    let spent = 0;
    const toBuy = [];

    // Threat assessment: are we being attacked?
    const underThreat = this._isCapitalThreatened(nation);
    const myAir = this._getAllUnitsOfNation(nation).filter(u => getAllUnits()[u.type]?.type === 'air').length;
    const myNaval = this._getAllUnitsOfNation(nation).filter(u => {
      const t = getAllUnits()[u.type]?.type;
      return t === 'sea' || t === 'naval';
    }).length;

    // Difficulty modifiers
    const wantsNaval = (this.difficulty !== 'easy') && (side === 'axis' ? nation === 'japan' : nation === 'usa' || nation === 'uk');
    const wantsAir   = this.difficulty === 'hard';

    if (underThreat) {
      // Defensive: buy infantry + some artillery
      while (spent + units.infantry.cost <= budget && toBuy.filter(u=>u==='infantry').length < 8) {
        toBuy.push('infantry'); spent += units.infantry.cost;
      }
      if (budget - spent >= units.artillery.cost) {
        toBuy.push('artillery'); spent += units.artillery.cost;
      }
    } else {
      let infCount = 0, armCount = 0, artCount = 0;

      // Hard mode: buy a fighter or destroyer first if we have budget
      if (wantsAir && myAir < 4 && budget - spent >= units.fighter.cost) {
        toBuy.push('fighter'); spent += units.fighter.cost; myAir + 1;
      }
      if (wantsNaval && myNaval < 4 && budget - spent >= units.destroyer.cost) {
        toBuy.push('destroyer'); spent += units.destroyer.cost;
      }

      while (spent < budget) {
        const remaining = budget - spent;
        // Normal/Hard: armor ratio goes up
        const armRatio = this.difficulty === 'hard' ? 0.4 : this.difficulty === 'normal' ? 0.35 : 0.25;
        if (remaining >= units.armor.cost && armCount < Math.floor(infCount * armRatio) + 1) {
          toBuy.push('armor'); spent += units.armor.cost; armCount++;
        } else if (remaining >= units.artillery.cost && artCount < Math.floor(infCount * 0.3) && infCount > 0) {
          // Artillery boosts infantry — buy up to 30% ratio
          toBuy.push('artillery'); spent += units.artillery.cost; artCount++;
        } else if (remaining >= units.infantry.cost) {
          toBuy.push('infantry'); spent += units.infantry.cost; infCount++;
        } else if (remaining >= units.artillery.cost) {
          toBuy.push('artillery'); spent += units.artillery.cost; artCount++;
        } else {
          break;
        }
      }

      // Hard: buy fighter if budget allows and we have few air
      if (wantsAir && budget - spent >= units.fighter.cost && myAir < 5) {
        toBuy.push('fighter'); spent += units.fighter.cost;
      }
    }

    toBuy.forEach(unitType => this.state.purchaseUnit(unitType, nation));
  }

  // ── COMBAT MOVEMENT ────────────────────────────────────────────────────────

  _doCombatMove(nation) {
    const myTerritories = this._getMyTerritories(nation);

    // Odds thresholds by difficulty
    const attackThreshold = this.difficulty === 'easy'   ? 0.70
                          : this.difficulty === 'normal' ? 0.58
                          : 0.48;  // hard is more aggressive
    const capitalBonus = this.difficulty === 'easy' ? 0.55 : 0.35;

    // Build a set of high-priority targets (VCs + high IPC)
    const highPriority = new Set();
    Object.entries(this.state.ownership).forEach(([tid, owner]) => {
      if (owner && areEnemies(owner, nation)) {
        if (VICTORY_CITIES.has(tid)) highPriority.add(tid);
        if ((TERRITORIES[tid]?.ipc || 0) >= HIGH_VALUE_IPC) highPriority.add(tid);
      }
    });

    const LAND_TYPES  = new Set(['infantry','artillery','armor','antiair']);
    const AIR_TYPES   = new Set(['fighter','bomber','tactical_bomber']);
    const NAVAL_TYPES = new Set(['submarine','destroyer','cruiser','carrier','battleship','transport']);

    myTerritories.forEach(tid => {
      const myUnits = this.state.getUnits(tid, nation).filter(u => !u.moved);
      if (myUnits.length === 0) return;

      const territory = TERRITORIES[tid];
      if (!territory) return;

      const hasLand  = myUnits.some(u => LAND_TYPES.has(u.type));
      const hasNaval = myUnits.some(u => NAVAL_TYPES.has(u.type));
      const hasAir   = myUnits.some(u => AIR_TYPES.has(u.type));

      territory.adjacent.forEach(adjId => {
        const adjTerritory = TERRITORIES[adjId];
        if (!adjTerritory) return;

        // Type constraints
        const isSea = adjTerritory.type === 'sea';
        if (hasLand && !hasAir && !hasNaval && isSea) return;
        if (hasNaval && !hasLand && !hasAir && !isSea) return;

        const adjOwner = this.state.ownership[adjId];
        if (!adjOwner || adjOwner === nation || !areEnemies(adjOwner, nation)) return;

        const enemyUnits = this.state.getUnits(adjId);
        const odds = CombatEngine.estimateOdds(myUnits, enemyUnits);

        const isVC      = VICTORY_CITIES.has(adjId);
        const isCapital = Object.values(NATIONS).some(n => n.capital === adjId);
        const iHP       = highPriority.has(adjId);

        // Attack threshold — lower for high-priority targets
        const threshold = isCapital ? capitalBonus
                        : isVC      ? attackThreshold - 0.08
                        : iHP       ? attackThreshold - 0.05
                        : attackThreshold;

        if (odds >= threshold) {
          // Percentage of units to attack with depends on difficulty + target priority
          const pct = isCapital || isVC ? 0.85 : (this.difficulty === 'hard' ? 0.80 : 0.70);

          const landAttackers  = myUnits.filter(u => LAND_TYPES.has(u.type));
          const navalAttackers = myUnits.filter(u => NAVAL_TYPES.has(u.type));
          const airAttackers   = myUnits.filter(u => AIR_TYPES.has(u.type));

          let pool = isSea ? navalAttackers : landAttackers;
          // Air always joins attacks
          const allAttackers = [...pool, ...airAttackers].filter(u => !u.moved);
          const attackWith = allAttackers.slice(0, Math.ceil(allAttackers.length * pct));

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

        // Apply AA gun casualties first (air units shot down before main combat)
        if (result.aaResults?.targets?.length > 0) {
          this.state.units[tid] = this.state.units[tid].filter(u => !result.aaResults.targets.includes(u.id));
        }

        // Re-fetch attackers after AA removal
        const survivingAttackers = this.state.getUnits(tid, nation);

        // Apply defender hits to attackers
        const attackerCasualties = CombatEngine.selectCasualties(survivingAttackers, result.defenderHits, true);
        attackerCasualties.filter(c => c.killed).forEach(c => {
          this.state.units[tid] = this.state.units[tid].filter(u => u.id !== c.unit.id);
        });

        // Apply attacker hits to defenders
        const currentDefenders = this.state.getUnits(tid).filter(u => u.nation !== nation);
        const defenderCasualties = CombatEngine.selectCasualties(currentDefenders, result.attackerHits, false);
        defenderCasualties.filter(c => c.killed).forEach(c => {
          this.state.units[tid] = this.state.units[tid].filter(u => u.id !== c.unit.id);
        });

        // AI retreat logic: if odds have dropped badly, retreat (normal/hard only)
        if (this.difficulty !== 'easy' && round >= 1) {
          const remAtk = this.state.getUnits(tid, nation);
          const remDef = this.state.getUnits(tid).filter(u => u.nation !== nation);
          if (remAtk.length > 0 && remDef.length > 0) {
            const remOdds = CombatEngine.estimateOdds(remAtk, remDef);
            // Retreat if odds drop below 25% after at least 1 round
            if (remOdds < 0.25) {
              // Move attackers back to an adjacent friendly territory
              const terrDef = TERRITORIES[tid];
              const retreatTo = terrDef?.adjacent.find(adjId => {
                const owner = this.state.ownership[adjId];
                return owner === nation || (NATIONS[owner]?.side === NATIONS[nation]?.side);
              });
              if (retreatTo) {
                const retreaters = this.state.getUnits(tid, nation);
                if (retreaters.length > 0) {
                  this.state.moveUnits(retreaters.map(u => u.id), tid, retreatTo);
                }
              }
              break;
            }
          }
        }

        isFirstRound = false;
        round++;
      }
    }
  }

  // ── NON-COMBAT MOVEMENT ────────────────────────────────────────────────────

  _doNonCombatMove(nation) {
    const myTerritories = this._getMyTerritories(nation);
    const capital = NATIONS[nation].capital;

    // For normal/hard: move units toward front lines (toward enemy capitals)
    // Find the closest enemy capital for direction
    const enemyCapitals = Object.values(NATIONS)
      .filter(n => n.capital && areEnemies(n.id, nation))
      .map(n => ({ id: n.id, cap: n.capital }));

    myTerritories.forEach(tid => {
      if (tid === capital) return;
      const myUnits = this.state.getUnits(tid, nation).filter(u => !u.moved);
      if (myUnits.length <= 1) return; // keep 1 unit for defense

      const territory = TERRITORIES[tid];
      territory?.adjacent.forEach(adjId => {
        const adjOwner = this.state.ownership[adjId];
        if (adjOwner !== nation) return;

        const adjUnits = this.state.getUnits(adjId, nation);

        // Move to reinforce if the neighbor has fewer units
        // Normal/Hard: prefer moving toward enemy border
        const shouldReinforce = this.difficulty === 'easy'
          ? adjUnits.length < myUnits.length - 1
          : adjUnits.length < myUnits.length - 1 && this._isTowardEnemy(adjId, tid, nation);

        if (shouldReinforce) {
          const toMove = myUnits.filter(u => !u.moved).slice(0, Math.floor(myUnits.length / 2));
          if (toMove.length > 0) {
            this.state.moveUnits(toMove.map(u => u.id), tid, adjId);
          }
        }
      });
    });
  }

  /** Returns true if adjId is "closer" to enemy territory than fromId */
  _isTowardEnemy(adjId, fromId, nation) {
    try {
      const adjT = TERRITORIES[adjId];
      if (!adjT) return false;
      // Check if adjId has any enemy neighbors that fromId doesn't
      return adjT.adjacent.some(n2 => {
        const o = this.state.ownership[n2];
        return o && areEnemies(o, nation);
      });
    } catch { return false; }
  }

  // ── PLACE NEW UNITS ────────────────────────────────────────────────────────

  _doPlace(nation) {
    const pending = [...this.state.pendingPlacements[nation]];
    const capital = NATIONS[nation].capital;

    // Find all ICs owned by this nation
    const myICs = Object.entries(this.state.industrialComplexes)
      .filter(([, owner]) => owner === nation)
      .map(([tid]) => tid);

    // For normal/hard: prefer placing at ICs near the front line
    // For easy: just place at capital
    let primaryIC = myICs.includes(capital) ? capital : (myICs[0] || capital);

    if (this.difficulty !== 'easy' && myICs.length > 1) {
      // Find IC closest to enemy territory
      const icsByThreat = myICs.map(ic => ({
        ic,
        threat: this._getThreatLevel(ic, nation),
      })).sort((a, b) => b.threat - a.threat);
      // Place at the most-threatened IC that still has friendly neighbors
      primaryIC = icsByThreat[0]?.ic || primaryIC;
    }

    pending.forEach(unitType => {
      if (unitType === 'industrial_complex') {
        // AI doesn't build ICs (too complex to place correctly)
        this.state.refundUnit(unitType, nation);
        return;
      }
      this.state.placeUnit(unitType, nation, primaryIC);
    });
  }

  /** Returns a threat level for an IC based on nearby enemies */
  _getThreatLevel(tid, nation) {
    try {
      const t = TERRITORIES[tid];
      if (!t) return 0;
      let threat = 0;
      t.adjacent.forEach(adjId => {
        const units = this.state.getUnits(adjId);
        const enemyUnits = units.filter(u => areEnemies(u.nation, nation));
        threat += enemyUnits.length * 2;
        const owner = this.state.ownership[adjId];
        if (owner && areEnemies(owner, nation)) threat += 1;
      });
      return threat;
    } catch { return 0; }
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
