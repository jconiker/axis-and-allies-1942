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
    return this._floodFill(fromId, def.movement, unit.nation, false);
  }

  /** Get all territories a unit can ATTACK from (combat movement) */
  getCombatMoves(unit, fromId) {
    const def = getAllUnits()[unit.type];
    if (!def) return [];
    return this._floodFill(fromId, def.movement, unit.nation, true);
  }

  /** BFS flood fill for reachable territories */
  _floodFill(startId, maxMove, nation, allowCombat) {
    const reachable = new Set();
    const queue = [{ id: startId, movesLeft: maxMove }];
    const visited = new Set([startId]);

    while (queue.length > 0) {
      const { id, movesLeft } = queue.shift();
      const territory = TERRITORIES[id];
      if (!territory) continue;

      territory.adjacent.forEach(adjId => {
        if (visited.has(adjId)) return;
        const adj = TERRITORIES[adjId];
        if (!adj) return;

        const ownedByEnemy = adj.startOwner && this._isEnemy(this.state.ownership[adjId], nation);
        const hasEnemyUnits = (this.state.units[adjId] || []).some(u => this._isEnemy(u.nation, nation));

        // Land units can't enter sea zones (except transported)
        const unitDef = getAllUnits()[/* unit.type - need it */ id] || {};
        // Simplified: check territory type compatibility
        const fromTerr = TERRITORIES[id];
        if (!this._canEnter(id, adjId, nation, allowCombat)) return;

        visited.add(adjId);
        reachable.add(adjId);

        // Can continue through friendly territory
        if (movesLeft > 1 && !hasEnemyUnits && !ownedByEnemy) {
          queue.push({ id: adjId, movesLeft: movesLeft - 1 });
        }
      });
    }

    return [...reachable];
  }

  _canEnter(fromId, toId, nation, allowCombat) {
    const from = TERRITORIES[fromId];
    const to = TERRITORIES[toId];
    if (!from || !to) return false;
    // Sea units can't enter land, land units can't enter sea (simplified)
    return true; // detailed validation in full implementation
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
