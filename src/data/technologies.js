/**
 * Axis & Allies 1942 — Technology / Weapons Enhancements
 * Players spend IPCs during their turn to research developments.
 * Standard rule: 5 IPC per research die. Roll 6 = breakthrough.
 */

export const TECHNOLOGIES = {
  // ── LAND ────────────────────────────────────────────────────────────────────
  mechanized_infantry: {
    id: 'mechanized_infantry', name: 'Mechanized Infantry', category: 'land',
    researchCost: 5, icon: '🚛',
    description: 'Infantry can blitz through unoccupied enemy territory alongside armor.',
    effect: { type: 'unit_ability', unit: 'infantry', ability: 'blitz_with_armor' }
  },
  advanced_artillery: {
    id: 'advanced_artillery', name: 'Advanced Artillery', category: 'land',
    researchCost: 5, icon: '🔩',
    description: 'Each artillery piece now supports 2 infantry (attack at 2) instead of 1.',
    effect: { type: 'artillery_support_multiplier', value: 2 }
  },
  paratroopers: {
    id: 'paratroopers', name: 'Paratroopers', category: 'land',
    researchCost: 5, icon: '🪂',
    description: 'Bombers may transport 1 infantry as a paratrooper during combat movement.',
    effect: { type: 'unit_ability', unit: 'bomber', ability: 'carry_infantry' }
  },
  war_bonds: {
    id: 'war_bonds', name: 'War Bonds', category: 'economy',
    researchCost: 5, icon: '💰',
    description: 'Roll 1D6 extra IPC during each income collection phase.',
    effect: { type: 'income_bonus_dice', dice: 1 }
  },
  rockets: {
    id: 'rockets', name: 'Rockets', category: 'land',
    researchCost: 5, icon: '🚀',
    description: 'AA guns can bombard one adjacent enemy industrial territory per turn for 1D6 IPC damage.',
    effect: { type: 'unit_ability', unit: 'antiair', ability: 'rocket_attack' }
  },

  // ── AIR ─────────────────────────────────────────────────────────────────────
  jet_fighters: {
    id: 'jet_fighters', name: 'Jet Fighters', category: 'air',
    researchCost: 5, icon: '✈️',
    description: 'Fighters attack at 4 (up from 3). Defense unchanged.',
    effect: { type: 'unit_stat', unit: 'fighter', property: 'attack', value: 4 }
  },
  heavy_bombers: {
    id: 'heavy_bombers', name: 'Heavy Bombers', category: 'air',
    researchCost: 6, icon: '💣',
    description: 'Bombers roll 2 dice in combat and strategic bombing — take the best result.',
    effect: { type: 'unit_ability', unit: 'bomber', ability: 'heavy_bombing' }
  },
  long_range_aircraft: {
    id: 'long_range_aircraft', name: 'Long-Range Aircraft', category: 'air',
    researchCost: 5, icon: '🛫',
    description: 'All aircraft gain +2 movement points.',
    effect: { type: 'unit_movement_bonus', unitCategory: 'air', delta: 2 }
  },

  // ── SEA ─────────────────────────────────────────────────────────────────────
  super_submarines: {
    id: 'super_submarines', name: 'Super Submarines', category: 'sea',
    researchCost: 5, icon: '🤿',
    description: 'Submarines attack at 3 (up from 2) and cannot be targeted by aircraft.',
    effect: { type: 'unit_stat', unit: 'submarine', property: 'attack', value: 3 }
  },
  improved_shipyards: {
    id: 'improved_shipyards', name: 'Improved Shipyards', category: 'sea',
    researchCost: 5, icon: '⚓',
    description: 'All naval unit costs are reduced by 1 IPC.',
    effect: { type: 'cost_reduction', unitCategory: 'sea', amount: 1 }
  },
  radar: {
    id: 'radar', name: 'Radar', category: 'defense',
    researchCost: 5, icon: '📡',
    description: 'AA guns hit aircraft on a roll of 1 or 2 (up from 1 only).',
    effect: { type: 'unit_stat', unit: 'antiair', property: 'aaHitOn', value: 2 }
  },

  // ── CUSTOM WEAPONS ENHANCEMENTS ─────────────────────────────────────────────
  combined_arms: {
    id: 'combined_arms', name: 'Combined Arms Doctrine', category: 'land',
    researchCost: 6, icon: '⚔️',
    description: 'Armor + tactical bomber pairs each get +1 attack (stacks with fighter bond).',
    effect: { type: 'unit_ability', unit: 'tactical_bomber', ability: 'combined_arms' }
  },
  improved_logistics: {
    id: 'improved_logistics', name: 'Improved Logistics', category: 'land',
    researchCost: 5, icon: '📦',
    description: 'Infantry and artillery gain +1 movement point.',
    effect: { type: 'unit_movement_bonus', units: ['infantry','artillery'], delta: 1 }
  },
  naval_air_patrol: {
    id: 'naval_air_patrol', name: 'Naval Air Patrol', category: 'sea',
    researchCost: 5, icon: '🛩️',
    description: 'Carriers defend at 3 (up from 2) and can carry 3 aircraft.',
    effect: { type: 'unit_stat', unit: 'carrier', property: 'defense', value: 3 }
  },
  blitzkrieg: {
    id: 'blitzkrieg', name: 'Blitzkrieg', category: 'land',
    researchCost: 6, icon: '⚡',
    description: 'Armor units may blitz through 2 unoccupied enemy territories in one turn.',
    effect: { type: 'unit_ability', unit: 'armor', ability: 'double_blitz' }
  },
};

export const TECH_CATEGORIES = {
  land:    { label: 'Land',       color: '#8B6914' },
  air:     { label: 'Air',        color: '#4a7cba' },
  sea:     { label: 'Sea',        color: '#2a6080' },
  defense: { label: 'Defense',    color: '#5a4a7a' },
  economy: { label: 'Economy',    color: '#4a7a4a' },
};

/**
 * Apply a researched technology's effect to a unit definition copy.
 * Returns modified unitDefs object.
 */
export function applyTechEffects(unitDefs, researchedTechs = []) {
  const defs = JSON.parse(JSON.stringify(unitDefs)); // deep clone

  for (const techId of researchedTechs) {
    const tech = TECHNOLOGIES[techId];
    if (!tech) continue;
    const { effect } = tech;

    if (effect.type === 'unit_stat') {
      if (defs[effect.unit]) defs[effect.unit][effect.property] = effect.value;
    } else if (effect.type === 'unit_ability') {
      if (defs[effect.unit]) {
        defs[effect.unit].abilities = defs[effect.unit].abilities || [];
        defs[effect.unit].abilities.push(effect.ability);
      }
    } else if (effect.type === 'unit_movement_bonus') {
      if (effect.units) {
        effect.units.forEach(uid => { if (defs[uid]) defs[uid].movement += effect.delta; });
      } else if (effect.unitCategory) {
        Object.values(defs).forEach(u => { if (u.type === effect.unitCategory) u.movement += effect.delta; });
      }
    } else if (effect.type === 'cost_reduction') {
      Object.values(defs).forEach(u => { if (u.type === effect.unitCategory) u.cost = Math.max(1, u.cost - effect.amount); });
    }
  }

  return defs;
}
