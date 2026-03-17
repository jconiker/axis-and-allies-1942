export const UNIT_TYPES = {
  // ── LAND ──
  infantry: {
    id:'infantry', name:'Infantry', cost:3, attack:1, defense:2, movement:1,
    type:'land', canCarry:false, carriedBy:['transport'],
    icon:'🪖', color:'#888', isCustom:false,
    availableFor: null,  // null = all nations
    blitz:false,
    description:'Basic ground unit. Can be supported by artillery to attack at 2.'
  },
  artillery: {
    id:'artillery', name:'Artillery', cost:4, attack:2, defense:2, movement:1,
    type:'land', canCarry:false, carriedBy:['transport'],
    icon:'💥', color:'#888', isCustom:false,
    availableFor: null,
    blitz:false, supportsInfantry:true,
    description:'Supports 1 infantry per artillery to attack at 2.'
  },
  armor: {
    id:'armor', name:'Armor', cost:6, attack:3, defense:3, movement:2,
    type:'land', canCarry:false, carriedBy:['transport'],
    icon:'🎯', color:'#888', isCustom:false,
    availableFor: null,
    blitz:true,
    description:'Can blitz through unoccupied enemy territory.'
  },
  antiair: {
    id:'antiair', name:'Anti-Aircraft Gun', cost:5, attack:0, defense:0, movement:1,
    type:'land', canCarry:false, carriedBy:['transport'],
    icon:'⚡', color:'#888', isCustom:false,
    availableFor: null,
    blitz:false, shootsAtAir:true, airShots:1,
    description:'Fires at attacking aircraft before combat (hits on 1). Cannot attack.'
  },
  // ── AIR ──
  fighter: {
    id:'fighter', name:'Fighter', cost:10, attack:3, defense:4, movement:4,
    type:'air', canCarry:false, carriedBy:['carrier'],
    icon:'✈️', color:'#aae', isCustom:false,
    availableFor: null,
    canLandOnCarrier:true,
    description:'Versatile air unit. Can land on carriers.'
  },
  bomber: {
    id:'bomber', name:'Bomber', cost:12, attack:4, defense:1, movement:6,
    type:'air', canCarry:false, carriedBy:[],
    icon:'💣', color:'#aae', isCustom:false,
    availableFor: null,
    canStrategicBomb:true, bombingDice:2,
    description:'Long-range. Can strategic bomb enemy IPC production.'
  },
  tactical_bomber: {
    id:'tactical_bomber', name:'Tactical Bomber', cost:11, attack:3, defense:3, movement:4,
    type:'air', canCarry:false, carriedBy:['carrier'],
    icon:'🛩️', color:'#aae', isCustom:false,
    availableFor: null,
    canLandOnCarrier:true, canStrategicBomb:true, bombingDice:1,
    description:'Can land on carriers. Bonds with armor/fighter for +1 attack.'
  },
  // ── SEA ──
  submarine: {
    id:'submarine', name:'Submarine', cost:6, attack:2, defense:1, movement:2,
    type:'sea', canCarry:false, carriedBy:[],
    icon:'🤿', color:'#44a', isCustom:false,
    availableFor: null,
    submerge:true, firstStrike:true, ignoresDestroyers:false,
    description:'First strike. Can submerge to avoid combat. Ignored by planes (unless destroyer present).'
  },
  destroyer: {
    id:'destroyer', name:'Destroyer', cost:8, attack:3, defense:3, movement:2,
    type:'sea', canCarry:false, carriedBy:[],
    icon:'⚓', color:'#44a', isCustom:false,
    availableFor: null,
    cancelsSubs:true,
    description:'Cancels submarine special abilities. General purpose warship.'
  },
  cruiser: {
    id:'cruiser', name:'Cruiser', cost:12, attack:3, defense:3, movement:2,
    type:'sea', canCarry:false, carriedBy:[],
    icon:'🚢', color:'#44a', isCustom:false,
    availableFor: null,
    canBombard:true,
    description:'Can bombard coastal territories during amphibious assaults.'
  },
  carrier: {
    id:'carrier', name:'Aircraft Carrier', cost:14, attack:1, defense:2, movement:2,
    type:'sea', canCarry:true, carriedBy:[], carriesMax:2, carriesTypes:['fighter','tactical_bomber'],
    icon:'🛳️', color:'#44a', isCustom:false,
    availableFor: null,
    description:'Carries up to 2 fighters/tactical bombers. Defends at 2.'
  },
  battleship: {
    id:'battleship', name:'Battleship', cost:20, attack:4, defense:4, movement:2,
    type:'sea', canCarry:false, carriedBy:[],
    icon:'⛵', color:'#44a', isCustom:false,
    availableFor: null,
    twoHit:true, canBombard:true,
    description:'Takes 2 hits to sink. Can bombard coastal territories.'
  },
  transport: {
    id:'transport', name:'Transport', cost:7, attack:0, defense:1, movement:2,
    type:'sea', canCarry:true, carriedBy:[], carriesMax:2, carriesTypes:['infantry','artillery','armor','antiair'],
    icon:'🚤', color:'#44a', isCustom:false,
    availableFor: null,
    description:'Carries up to 2 land units (1 heavy = 1 slot, infantry/art = 1 slot each).'
  },
};

// ── BUILT-IN ADVANCED UNITS (unlockable / purchasable by specific nations) ────
export const ADVANCED_UNITS = {
  // USA exclusive
  b52: {
    id:'b52', name:'B-52 Stratofortress', cost:18, attack:5, defense:2, movement:8,
    type:'air', canCarry:false, carriedBy:[],
    icon:'✈', color:'#4a8', isCustom:false,
    availableFor: ['usa'],
    canStrategicBomb:true, bombingDice:3,
    description:'USA only. Strategic bomber with extreme range (8). Rolls 3 dice for bombing runs.'
  },
  stealth_fighter: {
    id:'stealth_fighter', name:'Stealth Fighter', cost:14, attack:4, defense:5, movement:5,
    type:'air', canCarry:false, carriedBy:['carrier'],
    icon:'🔷', color:'#4a8', isCustom:false,
    availableFor: ['usa'],
    canLandOnCarrier:true, evadeAA:true,
    description:'USA only. Evades AA fire. Can land on carriers. Superior defense.'
  },
  ford_carrier: {
    id:'ford_carrier', name:'Ford-Class Carrier', cost:22, attack:2, defense:4, movement:2,
    type:'sea', canCarry:true, carriedBy:[], carriesMax:4, carriesTypes:['fighter','stealth_fighter','tactical_bomber'],
    icon:'⚓', color:'#4a8', isCustom:false,
    availableFor: ['usa', 'australia'],
    twoHit:true,
    description:'USA/Australia. Carries up to 4 aircraft. Two-hit ship.'
  },
  // Germany exclusive
  tiger_tank: {
    id:'tiger_tank', name:'Tiger Tank', cost:9, attack:4, defense:4, movement:2,
    type:'land', canCarry:false, carriedBy:[],
    icon:'🎖', color:'#468', isCustom:false,
    availableFor: ['germany'],
    blitz:true,
    description:'Germany only. Powerful heavy armor. Blitzes like standard armor.'
  },
  // Japan exclusive
  zero_fighter: {
    id:'zero_fighter', name:'A6M Zero', cost:9, attack:4, defense:4, movement:5,
    type:'air', canCarry:false, carriedBy:['carrier'],
    icon:'⛩', color:'#a84', isCustom:false,
    availableFor: ['japan'],
    canLandOnCarrier:true,
    description:'Japan only. Fast, agile carrier fighter with superior movement.'
  },
  // USSR exclusive
  t34_tank: {
    id:'t34_tank', name:'T-34 Tank', cost:7, attack:3, defense:4, movement:2,
    type:'land', canCarry:false, carriedBy:[],
    icon:'🔴', color:'#a44', isCustom:false,
    availableFor: ['ussr'],
    blitz:true,
    description:'USSR only. Reliable medium tank. Better defense than standard armor.'
  },
  // UK exclusive
  spitfire: {
    id:'spitfire', name:'Spitfire', cost:10, attack:3, defense:5, movement:4,
    type:'air', canCarry:false, carriedBy:['carrier'],
    icon:'🇬🇧', color:'#a80', isCustom:false,
    availableFor: ['uk'],
    canLandOnCarrier:true,
    description:'UK only. Exceptional defensive fighter. Can land on carriers.'
  },
  // Australia exclusive
  digger_inf: {
    id:'digger_inf', name:'ANZAC Infantry', cost:3, attack:2, defense:2, movement:1,
    type:'land', canCarry:false, carriedBy:['transport'],
    icon:'🦘', color:'#2a9', isCustom:false,
    availableFor: ['australia'],
    blitz:false,
    description:'Australia only. ANZAC elite infantry — attacks and defends at 2.'
  },
};

// Runtime custom units added by user
export let customUnits = {};

export function addCustomUnit(unit) {
  customUnits[unit.id] = { ...unit, isCustom: true };
}

export function removeCustomUnit(id) {
  delete customUnits[id];
}

export function getAllUnits() {
  return { ...UNIT_TYPES, ...ADVANCED_UNITS, ...customUnits };
}

/** Get units available for purchase by a specific nation */
export function getUnitsForNation(nationId) {
  const all = getAllUnits();
  return Object.fromEntries(
    Object.entries(all).filter(([, u]) =>
      u.availableFor === null || u.availableFor === undefined || u.availableFor.includes(nationId)
    )
  );
}
