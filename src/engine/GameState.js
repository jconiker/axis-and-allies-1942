import { TERRITORIES } from '../data/territories.js';
import { NATIONS, TURN_ORDER, areEnemies } from '../data/nations.js';
import { getAllUnits } from '../data/units.js';

const SAVE_KEY = 'aa1942_autosave';
const SAVE_VERSION = 2;

/**
 * Core game state — single source of truth.
 * Auto-saves to localStorage after every mutation.
 */
export class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.ownership = {};
    this.units = {};
    this.ipc = {};
    this.round = 1;
    this.currentNationIdx = 0;
    this.phase = 'setup';
    this.players = {};          // { nationId: 'human' | 'ai' }
    this.pendingPlacements = {};
    this.activeBattle = null;
    this.winner = null;
    this.technologies = {};     // { nationId: string[] }  — researched tech ids
    this.industrialComplexes = {};  // { territoryId: nationId } — IC locations
    this.icDamage = {};             // { territoryId: number } — damage tokens on ICs
    this.unitsPlacedThisTurn = {}; // { territoryId: count } — reset each placement phase
    this._listeners = [];
  }

  // ── SCENARIO LOADING ────────────────────────────────────────────────────────

  loadScenario(scenario) {
    try {
      Object.values(TERRITORIES).forEach(t => {
        this.ownership[t.id] = t.startOwner;   // null for sea zones, 'neutral' for neutrals
        this.units[t.id] = [];
      });
      Object.values(NATIONS).forEach(n => {
        if (n.id === 'neutral') return;
        this.ipc[n.id] = scenario.ipc?.[n.id] ?? n.startingIPC;
        this.pendingPlacements[n.id] = [];
        this.technologies[n.id] = [];
      });
      // Industrial complexes — capitals + starting IC territories
      ['germany','russia','united_kingdom','eastern_us','japan','australia'].forEach(tid => {
        const owner = this.ownership[tid];
        if (owner && owner !== 'neutral') this.industrialComplexes[tid] = owner;
      });
      this._placeScenarioUnits(scenario);
      this.phase = 'setup';
      this.round = 1;
      this.currentNationIdx = 0;
      this.autosave();
    } catch (e) {
      console.error('[GameState] loadScenario failed:', e);
    }
  }

  _placeScenarioUnits(scenario) {
    // Scenario format: { territoryId: [ { nation, type, count }, ... ] }
    Object.entries(scenario.units).forEach(([tid, entries]) => {
      if (!this.units[tid]) this.units[tid] = [];
      if (!Array.isArray(entries)) return;
      entries.forEach(({ nation, type, count }) => {
        for (let i = 0; i < count; i++) {
          this.units[tid].push(this._makeUnit(type, nation));
        }
      });
    });
  }

  _makeUnit(type, nation, extra = {}) {
    return {
      id: `${type}_${nation}_${Math.random().toString(36).slice(2,7)}`,
      type, nation, damaged: false, moved: false, ...extra
    };
  }

  // ── ACCESSORS ───────────────────────────────────────────────────────────────

  get currentNation() { return TURN_ORDER[this.currentNationIdx]; }

  getUnits(territoryId, nation = null) {
    const all = this.units[territoryId] || [];
    return nation ? all.filter(u => u.nation === nation) : all;
  }

  countUnits(territoryId, nation = null) {
    return this.getUnits(territoryId, nation).reduce((acc, u) => {
      acc[u.type] = (acc[u.type] || 0) + 1;
      return acc;
    }, {});
  }

  /** IPC value of a territory's IC (reduced by damage tokens) */
  getTerritoryIPC(territoryId) {
    return TERRITORIES[territoryId]?.ipc || 0;
  }

  /** Effective IC production capacity (IPC minus damage) */
  getICCapacity(territoryId) {
    const base = this.getTerritoryIPC(territoryId);
    const dmg = this.icDamage[territoryId] || 0;
    return Math.max(0, base - dmg);
  }

  /** Apply strategic bombing damage to an IC. Returns damage dealt. */
  applyStrategicBombing(territoryId, bomberUnits) {
    try {
      const defs = getAllUnits();
      let totalDamage = 0;
      const rolls = [];
      bomberUnits.forEach(u => {
        const dice = defs[u.type]?.bombingDice || 1;
        for (let i = 0; i < dice; i++) {
          const roll = Math.ceil(Math.random() * 6);
          rolls.push(roll);
          totalDamage += roll;
        }
      });
      const maxDmg = this.getTerritoryIPC(territoryId) * 2; // max damage = 2× IPC value
      const cap = this.icDamage[territoryId] || 0;
      const actual = Math.min(totalDamage, maxDmg - cap);
      if (actual > 0) {
        this.icDamage[territoryId] = (cap + actual);
        this._emit('ic_bombed', { territoryId, rolls, damage: actual, totalDamage: cap + actual });
        this.autosave();
      }
      return { rolls, damage: actual };
    } catch (e) {
      console.error('[GameState] applyStrategicBombing failed:', e);
      return { rolls: [], damage: 0 };
    }
  }

  /** Repair IC damage (purchase phase) at 1 IPC per point */
  repairIC(territoryId, nation, amount) {
    try {
      const cost = amount;
      if ((this.ipc[nation] || 0) < cost) return false;
      const current = this.icDamage[territoryId] || 0;
      const repaired = Math.min(amount, current);
      if (repaired <= 0) return false;
      this.icDamage[territoryId] = current - repaired;
      this.ipc[nation] -= repaired;
      this._emit('ic_repaired', { territoryId, nation, repaired });
      this.autosave();
      return true;
    } catch (e) {
      console.error('[GameState] repairIC failed:', e);
      return false;
    }
  }

  /** Calculate total income for a nation based on current ownership */
  calculateIncome(nation) {
    return Object.entries(this.ownership)
      .filter(([, owner]) => owner === nation)
      .reduce((sum, [tid]) => sum + this.getTerritoryIPC(tid), 0);
  }

  // ── MUTATIONS (each auto-saves) ─────────────────────────────────────────────

  moveUnits(unitIds, fromId, toId) {
    try {
      const moving = this.units[fromId].filter(u => unitIds.includes(u.id));
      this.units[fromId] = this.units[fromId].filter(u => !unitIds.includes(u.id));
      moving.forEach(u => { u.moved = true; });
      this.units[toId] = [...(this.units[toId] || []), ...moving];
      this._emit('units_moved', { unitIds, fromId, toId });
      this.autosave();
    } catch (e) {
      console.error('[GameState] moveUnits failed:', e);
    }
  }

  purchaseUnit(unitType, nation) {
    try {
      const unitDef = getAllUnits()[unitType];
      if (!unitDef) return false;
      const cost = unitDef.cost;
      if ((this.ipc[nation] || 0) < cost) return false;
      this.ipc[nation] -= cost;
      this.pendingPlacements[nation].push(unitType);
      this._emit('unit_purchased', { unitType, nation });
      this.autosave();
      return true;
    } catch (e) {
      console.error('[GameState] purchaseUnit failed:', e);
      return false;
    }
  }

  refundUnit(unitType, nation) {
    try {
      const idx = this.pendingPlacements[nation].indexOf(unitType);
      if (idx === -1) return false;
      const unitDef = getAllUnits()[unitType];
      this.pendingPlacements[nation].splice(idx, 1);
      this.ipc[nation] += unitDef?.cost || 0;
      this._emit('unit_refunded', { unitType, nation });
      this.autosave();
      return true;
    } catch (e) {
      console.error('[GameState] refundUnit failed:', e);
      return false;
    }
  }

  placeUnit(unitType, nation, territoryId) {
    try {
      const idx = this.pendingPlacements[nation].indexOf(unitType);
      if (idx === -1) return false;
      this.pendingPlacements[nation].splice(idx, 1);

      if (unitType === 'industrial_complex') {
        // ICs are buildings — register in industrialComplexes, not units array
        this.industrialComplexes[territoryId] = nation;
      } else {
        // A&A 1942 SE: cannot place more units than IC capacity (IPC minus damage tokens)
        const icIPC = this.getICCapacity(territoryId);
        const placedHere = this.unitsPlacedThisTurn[territoryId] || 0;
        if (placedHere >= icIPC) {
          this.pendingPlacements[nation].splice(idx, 0, unitType); // put back
          this._emit('placement_limit_reached', { territoryId, limit: icIPC });
          return false;
        }
        const unit = this._makeUnit(unitType, nation);
        this.units[territoryId] = [...(this.units[territoryId] || []), unit];
        this.unitsPlacedThisTurn[territoryId] = placedHere + 1;
      }

      this._emit('unit_placed', { unitType, nation, territoryId });
      this.autosave();
      return true;
    } catch (e) {
      console.error('[GameState] placeUnit failed:', e);
      return false;
    }
  }

  collectIncome(nation) {
    try {
      const income = this.calculateIncome(nation);
      // War Bonds tech: roll bonus dice
      let bonus = 0;
      if (this.hasTech(nation, 'war_bonds')) {
        bonus = Math.ceil(Math.random() * 6);
      }
      const total = income + bonus;
      this.ipc[nation] = Math.min((this.ipc[nation] || 0) + total, 999);
      this._emit('income_collected', { nation, income, bonus, total: this.ipc[nation] });
      this.autosave();
      return { income, bonus };
    } catch (e) {
      console.error('[GameState] collectIncome failed:', e);
      return { income: 0, bonus: 0 };
    }
  }

  captureTerritory(territoryId, byNation) {
    try {
      const prevOwner = this.ownership[territoryId];
      this.ownership[territoryId] = byNation;
      // Clear enemy units (they were destroyed); keep own units
      this.units[territoryId] = (this.units[territoryId] || []).filter(u => u.nation === byNation);
      // Transfer IC to capturing nation (A&A standard rule — IC stays, changes ownership)
      if (this.industrialComplexes[territoryId]) {
        this.industrialComplexes[territoryId] = byNation;
      }
      // If capturing capital, strip IPC from defeated nation
      const capturedNation = Object.values(NATIONS).find(n => n.capital === territoryId);
      if (capturedNation && capturedNation.id !== byNation && capturedNation.id !== 'neutral') {
        const loot = this.ipc[capturedNation.id] || 0;
        this.ipc[capturedNation.id] = 0;
        this.ipc[byNation] = (this.ipc[byNation] || 0) + loot;
      }
      this._emit('territory_captured', { territoryId, byNation, prevOwner });
      this.autosave();
    } catch (e) {
      console.error('[GameState] captureTerritory failed:', e);
    }
  }

  // ── TECHNOLOGY ──────────────────────────────────────────────────────────────

  hasTech(nation, techId) {
    return (this.technologies[nation] || []).includes(techId);
  }

  researchTech(nation, techId) {
    try {
      if (!this.technologies[nation]) this.technologies[nation] = [];
      if (!this.technologies[nation].includes(techId)) {
        this.technologies[nation].push(techId);
        this._emit('tech_researched', { nation, techId });
        this.autosave();
      }
    } catch (e) {
      console.error('[GameState] researchTech failed:', e);
    }
  }

  /**
   * Attempt tech research: pay 5 IPC per die, roll each, 6 = breakthrough.
   * Returns { dice: number[], breakthroughs: string[] }
   */
  rollResearch(nation, numDice, availableTechs) {
    try {
      const cost = numDice * 5;
      if ((this.ipc[nation] || 0) < cost) return { dice: [], breakthroughs: [] };
      this.ipc[nation] -= cost;
      const dice = Array.from({ length: numDice }, () => Math.ceil(Math.random() * 6));
      const numHits = dice.filter(d => d === 6).length;
      const breakthroughs = [];
      const eligible = availableTechs.filter(t => !this.hasTech(nation, t));
      for (let i = 0; i < numHits && eligible.length > 0; i++) {
        const idx = Math.floor(Math.random() * eligible.length);
        const techId = eligible.splice(idx, 1)[0];
        this.researchTech(nation, techId);
        breakthroughs.push(techId);
      }
      this.autosave();
      return { dice, breakthroughs };
    } catch (e) {
      console.error('[GameState] rollResearch failed:', e);
      return { dice: [], breakthroughs: [] };
    }
  }

  // ── VICTORY ─────────────────────────────────────────────────────────────────

  checkVictory() {
    try {
      // A&A 1942 Second Edition: 10 Victory Cities on the map.
      // Axis wins by controlling 9+ VCs, Allies win by controlling 9+ VCs.
      // VCs: Berlin, Rome, Paris (axis), London, Moscow, Washington,
      //      Leningrad, Calcutta, Sydney, Tokyo
      const ALL_VCS = [
        'germany',       // Berlin (Axis capital)
        'western_europe',// Rome/Paris (Axis)
        'southern_europe',// (Axis)
        'japan',         // Tokyo (Axis capital)
        'manchuria',     // (Axis expansion)
        'russia',        // Moscow (Allied capital)
        'united_kingdom',// London (Allied capital)
        'eastern_us',    // Washington (Allied capital)
        'india',         // Calcutta (Allied)
        'australia',     // Sydney (Allied capital)
      ];
      const AXIS_WIN_THRESHOLD   = 9;  // Axis needs 9/10 VCs
      const ALLIES_WIN_THRESHOLD = 9;  // Allies win by recapturing 9/10 VCs

      let axisVCs = 0, alliesVCs = 0;
      ALL_VCS.forEach(tid => {
        const owner = this.ownership[tid];
        const nd = Object.values(NATIONS).find(n => n.id === owner);
        if (!nd) return;
        if (nd.side === 'axis')   axisVCs++;
        if (nd.side === 'allies') alliesVCs++;
      });

      if (axisVCs   >= AXIS_WIN_THRESHOLD)   this.winner = 'axis';
      if (alliesVCs >= ALLIES_WIN_THRESHOLD) this.winner = 'allies';
      return this.winner;
    } catch (e) {
      console.error('[GameState] checkVictory failed:', e);
      return null;
    }
  }

  // ── PHASE MANAGEMENT ────────────────────────────────────────────────────────

  nextPhase() {
    const phases = ['purchase','combat_move','conduct_combat','noncombat_move','place','collect'];
    const idx = phases.indexOf(this.phase);
    if (idx < phases.length - 1) {
      this.phase = phases[idx + 1];
      if (this.phase === 'place') this.unitsPlacedThisTurn = {};
    } else {
      this.phase = 'purchase';
      this.currentNationIdx = (this.currentNationIdx + 1) % TURN_ORDER.length;
      if (this.currentNationIdx === 0) this.round++;
      Object.values(this.units).flat().forEach(u => { u.moved = false; });
    }
    this._emit('phase_changed', { phase: this.phase, nation: this.currentNation, round: this.round });
    this.autosave();
  }

  // ── PERSISTENCE ─────────────────────────────────────────────────────────────

  autosave() {
    try {
      const data = {
        version: SAVE_VERSION,
        timestamp: Date.now(),
        ownership: this.ownership,
        units: this.units,
        ipc: this.ipc,
        round: this.round,
        currentNationIdx: this.currentNationIdx,
        phase: this.phase,
        players: this.players,
        technologies: this.technologies,
        industrialComplexes: this.industrialComplexes,
        icDamage: this.icDamage,
        pendingPlacements: this.pendingPlacements,
        winner: this.winner,
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (e) {
      // localStorage might be full or unavailable — silently ignore
    }
  }

  static hasSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      return data.version === SAVE_VERSION;
    } catch { return false; }
  }

  static getSaveInfo() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return { timestamp: data.timestamp, round: data.round, phase: data.phase, nation: TURN_ORDER[data.currentNationIdx] };
    } catch { return null; }
  }

  loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (data.version !== SAVE_VERSION) return false;
      this.ownership = data.ownership;
      this.units = data.units;
      this.ipc = data.ipc;
      this.round = data.round;
      this.currentNationIdx = data.currentNationIdx;
      this.phase = data.phase;
      this.players = data.players || {};
      this.technologies = data.technologies || {};
      this.industrialComplexes = data.industrialComplexes || {};
      this.icDamage = data.icDamage || {};
      this.pendingPlacements = data.pendingPlacements || {};
      this.winner = data.winner || null;
      this._listeners = [];
      return true;
    } catch (e) {
      console.error('[GameState] loadSave failed:', e);
      return false;
    }
  }

  static clearSave() {
    try { localStorage.removeItem(SAVE_KEY); } catch {}
  }

  serialize() { return JSON.stringify(this.autosave); }

  // ── EVENTS ──────────────────────────────────────────────────────────────────

  on(event, fn) { this._listeners.push({ event, fn }); }
  off(event, fn) { this._listeners = this._listeners.filter(l => !(l.event === event && l.fn === fn)); }
  _emit(event, data) {
    this._listeners.filter(l => l.event === event || l.event === '*').forEach(l => {
      try { l.fn(data, event); } catch (e) { console.error('[GameState] listener error:', event, e); }
    });
  }
}
