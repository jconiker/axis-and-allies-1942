import { getAllUnits } from '../data/units.js';

/**
 * Handles all combat resolution for A&A 1942.
 * Pure functions — no side effects on GameState (caller updates state).
 */
export class CombatEngine {
  /**
   * Roll dice and return hits.
   * @param {number} count - number of dice
   * @param {number} hitOn - hit on this value or lower (1-6)
   * @returns {{ rolls: number[], hits: number }}
   */
  static rollDice(count, hitOn) {
    const rolls = Array.from({ length: count }, () => Math.ceil(Math.random() * 6));
    const hits = rolls.filter(r => r <= hitOn).length;
    return { rolls, hits };
  }

  /**
   * Compute combat round results.
   * @param {Object[]} attackers - array of unit objects
   * @param {Object[]} defenders - array of unit objects
   * @param {boolean} isFirstRound
   * @returns {{ attackerRolls, defenderRolls, attackerHits, defenderHits, aaResults }}
   */
  static resolveCombatRound(attackers, defenders, isFirstRound = false) {
    const unitDefs = getAllUnits();

    // AA fire (first round only): defenders' AA guns fire at attacking air
    let aaResults = null;
    if (isFirstRound) {
      const aaGuns = defenders.filter(u => unitDefs[u.type]?.shootsAtAir);
      const attackingAir = attackers.filter(u => unitDefs[u.type]?.type === 'air');
      if (aaGuns.length > 0 && attackingAir.length > 0) {
        // A&A 1942 SE rule: 1 die per attacking aircraft (AA guns don't stack)
        const shots = attackingAir.length;
        const { rolls, hits } = CombatEngine.rollDice(shots, 1);
        aaResults = { rolls, hits, targets: attackingAir.slice(0, hits).map(u => u.id) };
      }
    }

    // Remove AA casualties from attackers before main combat
    const survivingAttackers = aaResults
      ? attackers.filter(u => !aaResults.targets.includes(u.id))
      : [...attackers];

    // Submarine first strike
    const subAttackers = survivingAttackers.filter(u => unitDefs[u.type]?.firstStrike);
    const nonSubAttackers = survivingAttackers.filter(u => !unitDefs[u.type]?.firstStrike);
    const hasDefenderDestroyer = defenders.some(u => u.type === 'destroyer');

    let subRolls = [], subHits = 0;
    if (subAttackers.length > 0 && !hasDefenderDestroyer) {
      const result = CombatEngine.rollDice(subAttackers.length, unitDefs['submarine'].attack);
      subRolls = result.rolls; subHits = result.hits;
    }

    // Artillery support: each artillery boosts 1 infantry attack from 1 to 2
    const artilleryCount = nonSubAttackers.filter(u => u.type === 'artillery').length;
    let infantryBoosted = 0;

    // Build attacker dice pool
    let attackerRolls = [...subRolls];
    let attackerHits = subHits;

    nonSubAttackers.forEach(u => {
      const def = unitDefs[u.type];
      if (!def) return;
      let hitOn = def.attack;
      if (u.type === 'infantry' && infantryBoosted < artilleryCount) {
        hitOn = 2; infantryBoosted++;
      }
      if (hitOn > 0) {
        const { rolls, hits } = CombatEngine.rollDice(1, hitOn);
        attackerRolls.push(...rolls);
        attackerHits += hits;
      }
    });

    // Defender dice pool
    let defenderRolls = [], defenderHits = 0;
    defenders.forEach(u => {
      const def = unitDefs[u.type];
      if (!def || def.shootsAtAir) return; // AA guns don't roll in normal combat
      if (def.noFire) return;              // transports cannot fire
      if (def.defense > 0) {
        const { rolls, hits } = CombatEngine.rollDice(1, def.defense);
        defenderRolls.push(...rolls);
        defenderHits += hits;
      }
    });

    return { attackerRolls, defenderRolls, attackerHits, defenderHits, aaResults };
  }

  /**
   * Optimal casualty selection (AI & auto-select).
   * Remove cheapest non-2-hit units first, keep battleships alive if possible.
   */
  static selectCasualties(units, hits, isAttacker) {
    if (hits <= 0) return [];
    const unitDefs = getAllUnits();

    // Sort: damaged 2-hit first (sink them), then by attack/defense ascending (cheapest goes first)
    const sorted = [...units].sort((a, b) => {
      const aDmg = a.damaged && unitDefs[a.type]?.twoHit;
      const bDmg = b.damaged && unitDefs[b.type]?.twoHit;
      if (aDmg && !bDmg) return -1;
      if (!aDmg && bDmg) return 1;
      const aVal = isAttacker ? unitDefs[a.type]?.attack : unitDefs[a.type]?.defense;
      const bVal = isAttacker ? unitDefs[b.type]?.attack : unitDefs[b.type]?.defense;
      return (aVal || 0) - (bVal || 0);
    });

    const casualties = [];
    let remaining = hits;
    for (const unit of sorted) {
      if (remaining <= 0) break;
      const def = unitDefs[unit.type];
      if (def?.twoHit && !unit.damaged) {
        // First hit: damage it
        unit.damaged = true;
        remaining--;
        casualties.push({ unit, killed: false });
      } else {
        casualties.push({ unit, killed: true });
        remaining--;
      }
    }
    return casualties;
  }

  /**
   * Calculate approximate combat odds (for AI decision making).
   * Returns probability of attacker winning (0-1).
   */
  static estimateOdds(attackers, defenders) {
    const unitDefs = getAllUnits();
    const attackPower = attackers.reduce((s, u) => s + (unitDefs[u.type]?.attack || 0), 0);
    const defendPower = defenders.reduce((s, u) => s + (unitDefs[u.type]?.defense || 0), 0);
    const attackHp = attackers.reduce((s, u) => s + (unitDefs[u.type]?.twoHit ? 2 : 1), 0);
    const defendHp = defenders.reduce((s, u) => s + (unitDefs[u.type]?.twoHit ? 2 : 1), 0);

    if (attackPower === 0) return 0;
    if (defendPower === 0) return 1;

    // Simple IPC-weighted heuristic
    const attackIPC = attackers.reduce((s, u) => s + (unitDefs[u.type]?.cost || 0), 0);
    const defendIPC = defenders.reduce((s, u) => s + (unitDefs[u.type]?.cost || 0), 0);

    const ratio = (attackPower / 6 * attackHp) / ((defendPower / 6 * defendHp) + 0.001);
    return Math.min(0.99, Math.max(0.01, ratio / (1 + ratio)));
  }
}
