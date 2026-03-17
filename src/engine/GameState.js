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

  /** IPC value of a territory, accounting for any damage (future: IC damage) */
  getTerritoryIPC(territoryId) {
    return TERRITORIES[territoryId]?.ipc || 0;
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
        const unit = this._makeUnit(unitType, nation);
        this.units[territoryId] = [...(this.units[territoryId] || []), unit];
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
      const capitals = Object.values(NATIONS).filter(n => n.capital).map(n => ({ nation: n.id, capital: n.capital, side: n.side }));
      const axisCapsCaptured = capitals.filter(({ capital, side }) =>
        side === 'allies' && ['germany','japan'].includes(this.ownership[capital])
      ).length;
      const alliedCapsCaptured = capitals.filter(({ capital, side }) =>
        side === 'axis' && ['ussr','uk','usa'].includes(this.ownership[capital])
      ).length;

      // A&A 1942: capture 6+ victory cities / all capitals
      const VICTORY_THRESHOLD = Object.values(NATIONS).filter(n => n.capital && n.side !== 'neutral').length;
      if (axisCapsCaptured >= VICTORY_THRESHOLD) this.winner = 'axis';
      if (alliedCapsCaptured >= VICTORY_THRESHOLD) this.winner = 'allies';
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
