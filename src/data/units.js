export const UNIT_TYPES = {
  // ── LAND ──
  infantry: {
    id:'infantry', name:'Infantry', cost:3, attack:1, defense:2, movement:1,
    type:'land', canCarry:false, carriedBy:['transport'],
    icon:'🪖', color:'#888', isCustom:false,
    blitz:false,
    description:'Basic ground unit. Can be supported by artillery to attack at 2.'
  },
  artillery: {
    id:'artillery', name:'Artillery', cost:4, attack:2, defense:2, movement:1,
    type:'land', canCarry:false, carriedBy:['transport'],
    icon:'💥', color:'#888', isCustom:false,
    blitz:false, supportsInfantry:true,
    description:'Supports 1 infantry per artillery to attack at 2.'
  },
  armor: {
    id:'armor', name:'Armor', cost:6, attack:3, defense:3, movement:2,
    type:'land', canCarry:false, carriedBy:['transport'],
    icon:'🎯', color:'#888', isCustom:false,
    blitz:true,
    description:'Can blitz through unoccupied enemy territory.'
  },
  antiair: {
    id:'antiair', name:'Anti-Aircraft Gun', cost:5, attack:0, defense:0, movement:1,
    type:'land', canCarry:false, carriedBy:['transport'],
    icon:'⚡', color:'#888', isCustom:false,
    blitz:false, shootsAtAir:true, airShots:1,
    description:'Fires at attacking aircraft before combat (hits on 1). Cannot attack.'
  },
  // ── AIR ──
  fighter: {
    id:'fighter', name:'Fighter', cost:10, attack:3, defense:4, movement:4,
    type:'air', canCarry:false, carriedBy:['carrier'],
    icon:'✈️', color:'#aae', isCustom:false,
    canLandOnCarrier:true,
    description:'Versatile air unit. Can land on carriers.'
  },
  bomber: {
    id:'bomber', name:'Bomber', cost:12, attack:4, defense:1, movement:6,
    type:'air', canCarry:false, carriedBy:[],
    icon:'💣', color:'#aae', isCustom:false,
    canStrategicBomb:true, bombingDice:2,
    description:'Long-range. Can strategic bomb enemy IPC production.'
  },
  tactical_bomber: {
    id:'tactical_bomber', name:'Tactical Bomber', cost:11, attack:3, defense:3, movement:4,
    type:'air', canCarry:false, carriedBy:['carrier'],
    icon:'🛩️', color:'#aae', isCustom:false,
    canLandOnCarrier:true, canStrategicBomb:true, bombingDice:1,
    description:'Can land on carriers. Bonds with armor/fighter for +1 attack.'
  },
  // ── SEA ──
  submarine: {
    id:'submarine', name:'Submarine', cost:6, attack:2, defense:1, movement:2,
    type:'sea', canCarry:false, carriedBy:[],
    icon:'🤿', color:'#44a', isCustom:false,
    submerge:true, firstStrike:true, ignoresDestroyers:false,
    description:'First strike. Can submerge to avoid combat. Ignored by planes (unless destroyer present).'
  },
  destroyer: {
    id:'destroyer', name:'Destroyer', cost:8, attack:3, defense:3, movement:2,
    type:'sea', canCarry:false, carriedBy:[],
    icon:'⚓', color:'#44a', isCustom:false,
    cancelsSubs:true,
    description:'Cancels submarine special abilities. General purpose warship.'
  },
  cruiser: {
    id:'cruiser', name:'Cruiser', cost:12, attack:3, defense:3, movement:2,
    type:'sea', canCarry:false, carriedBy:[],
    icon:'🚢', color:'#44a', isCustom:false,
    canBombard:true,
    description:'Can bombard coastal territories during amphibious assaults.'
  },
  carrier: {
    id:'carrier', name:'Aircraft Carrier', cost:14, attack:1, defense:2, movement:2,
    type:'sea', canCarry:true, carriedBy:[], carriesMax:2, carriesTypes:['fighter','tactical_bomber'],
    icon:'🛳️', color:'#44a', isCustom:false,
    description:'Carries up to 2 fighters/tactical bombers. Defends at 2.'
  },
  battleship: {
    id:'battleship', name:'Battleship', cost:20, attack:4, defense:4, movement:2,
    type:'sea', canCarry:false, carriedBy:[],
    icon:'⛵', color:'#44a', isCustom:false,
    twoHit:true, canBombard:true,
    description:'Takes 2 hits to sink. Can bombard coastal territories.'
  },
  transport: {
    id:'transport', name:'Transport', cost:7, attack:0, defense:1, movement:2,
    type:'sea', canCarry:true, carriedBy:[], carriesMax:2, carriesTypes:['infantry','artillery','armor','antiair'],
    icon:'🚤', color:'#44a', isCustom:false,
    description:'Carries up to 2 land units (1 heavy = 1 slot, infantry/art = 1 slot each).'
  },
};

// Custom units added by user at runtime are merged here
export let customUnits = {};

export function addCustomUnit(unit) {
  customUnits[unit.id] = { ...unit, isCustom: true };
}

export function getAllUnits() {
  return { ...UNIT_TYPES, ...customUnits };
}
