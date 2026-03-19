import { TERRITORIES } from '../data/territories.js';
import { getAllUnits } from '../data/units.js';
import { NATIONS } from '../data/nations.js';

/**
 * Validates whether a move or attack is legal under A&A 1942 rules.
 */
export class MoveValidator {
  constructor(gameState) {
    this.state = gameState;
  }

  /** Get all territories a unit can MOVE to (non-combat movement) */
  getNonCombatMoves(unit, fromId) {
    const def = getAllUnits()[unit.type];
    if (!def) return [];
    return this._floodFill(fromId, def.movement, unit.nation, false, unit.type);
  }

  /** Get all territories a unit can ATTACK from (combat movement) */
  getCombatMoves(unit, fromId) {
    const def = getAllUnits()[unit.type];
    if (!def) return [];
    return this._floodFill(fromId, def.movement, unit.nation, true, unit.type);
  }

  /** BFS flood fill for reachable territories */
  _floodFill(startId, maxMove, nation, allowCombat, unitType) {
    const reachable = new Set();
    const queue = [{ id: startId, movesLeft: maxMove, enteredEnemy: false }];
    const visited = new Map(); // id → movesLeft

    while (queue.length > 0) {
      const { id, movesLeft, enteredEnemy } = queue.shift();
      const territory = TERRITORIES[id];
      if (!territory) continue;

      territory.adjacent.forEach(adjId => {
        const adj = TERRITORIES[adjId];
        if (!adj) return;

        if (!this._canEnter(id, adjId, nation, allowCombat, unitType)) return;

        const ownedByEnemy = this._isEnemy(this.state.ownership[adjId], nation);
        const hasEnemyUnits = (this.state.units[adjId] || []).some(u => this._isEnemy(u.nation, nation));
        const isEnemy = ownedByEnemy || hasEnemyUnits;

        // Non-combat: can't enter enemy territories
        if (!allowCombat && isEnemy) return;

        reachable.add(adjId);

        if (movesLeft > 1) {
          const prev = visited.get(adjId);
          if (prev === undefined || prev < movesLeft - 1) {
            visited.set(adjId, movesLeft - 1);
            // Land/naval stop at enemy territory (can't pass through in combat)
            // Air units can fly over (but must still count movement)
            const unitDef = getAllUnits()[unitType] || {};
            const canPassThrough = unitDef.type === 'air' || (!isEnemy && !enteredEnemy);
            if (canPassThrough) {
              queue.push({ id: adjId, movesLeft: movesLeft - 1, enteredEnemy: isEnemy });
            }
          }
        }
      });
    }

    return [...reachable];
  }

  _canEnter(fromId, toId, nation, allowCombat, unitType) {
    const from = TERRITORIES[fromId];
    const to   = TERRITORIES[toId];
    if (!from || !to) return false;

    const unitDef = getAllUnits()[unitType];
    if (!unitDef) return true; // unknown unit type — allow

    const uType = unitDef.type; // 'land' | 'sea' | 'air'

    // Land units cannot enter sea zones
    if (uType === 'land' && to.type === 'sea') return false;

    // Sea units cannot enter land territories
    if (uType === 'sea' && to.type !== 'sea') return false;

    // Air units can enter any territory (landing restrictions handled separately)
    // Sub-specific: can enter sea zones even with enemy surface ships (special rule)

    // AA guns cannot move in combat phase (enforced in App._getValidTargets)

    return true;
  }

  _isEnemy(ownerOrNation, myNation) {
    if (!ownerOrNation || !myNation) return false;
    const myNationDef = NATIONS[myNation];
    const theirNationDef = NATIONS[ownerOrNation];
    if (!myNationDef || !theirNationDef) return false;
    return myNationDef.side !== theirNationDef.side;
  }

  /** Check if a territory can receive new unit placements */
  canPlaceUnit(unitType, nation, territoryId) {
    const territory = TERRITORIES[territoryId];
    if (!territory) return false;
    if (this.state.ownership[territoryId] !== nation) return false;
    // Land units need a territory with industrial complex (simplified: any owned territory for now)
    // Naval units need a sea zone adjacent to owned territory
    const unitDef = getAllUnits()[unitType];
    if (unitDef?.type === 'sea') {
      // Must place in sea zone adjacent to owned territory
      return territory.type === 'sea' && territory.adjacent.some(adjId => {
        return this.state.ownership[adjId] === nation;
      });
    }
    return territory.type === 'land';
  }
}
