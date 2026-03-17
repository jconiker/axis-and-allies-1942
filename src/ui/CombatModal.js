import { CombatEngine } from '../engine/CombatEngine.js';
import { getAllUnits } from '../data/units.js';
import { TERRITORIES } from '../data/territories.js';
import { NATIONS } from '../data/nations.js';

export class CombatModal {
  constructor(container, app) {
    this.container = container;
    this.app = app;
    this.state = app.state;
    this._el = null;
    this._tid = null;
    this._log = [];
    this._round = 0;
    this._done = false;
  }

  show(territoryId) {
    this._tid = territoryId;
    this._log = [];
    this._round = 0;
    this._done = false;

    if (!this._el) {
      this._el = document.createElement('div');
      this._el.className = 'combat-modal-wrap';
      this._el.innerHTML = `<style>${COMBAT_CSS}</style><div class="combat-modal" id="combat-modal"></div>`;
      this.container.appendChild(this._el);
    }
    this._render();
  }

  hide() {
    this._el?.remove();
    this._el = null;
  }

  _render() {
    const modal = this._el?.querySelector('#combat-modal');
    if (!modal) return;

    const tid = this._tid;
    const territory = TERRITORIES[tid];
    const nation = this.state.currentNation;
    const attackers = this.state.getUnits(tid, nation);
    const defenders = this.state.getUnits(tid).filter(u => u.nation !== nation);
    const defenderNation = defenders[0]?.nation;
    const defNationDef = NATIONS[defenderNation] || { flag: '🏳️', name: 'Neutral', color: '#888' };
    const atkNationDef = NATIONS[nation] || {};

    if (attackers.length === 0 || defenders.length === 0) {
      if (attackers.length > 0 && defenders.length === 0) {
        this.state.captureTerritory(tid, nation);
      }
      this.hide();
      this.app.turnEngine.advancePhase();
      return;
    }

    const allUnits = getAllUnits();

    modal.innerHTML = `
      <div class="cm-header">
        <div class="cm-territory">${territory?.name || tid}</div>
        <div class="cm-round">Round ${this._round + 1}</div>
      </div>

      <div class="cm-battlefield">
        <div class="cm-side attacker">
          <div class="cm-side-label" style="color:${atkNationDef.color}">
            ${atkNationDef.flag || ''} ${atkNationDef.name || nation} (You)
          </div>
          <div class="cm-unit-list">
            ${this._renderUnitList(attackers, allUnits)}
          </div>
        </div>

        <div class="cm-vs">⚔</div>

        <div class="cm-side defender">
          <div class="cm-side-label" style="color:${defNationDef.color}">
            ${defNationDef.flag} ${defNationDef.name} (AI)
          </div>
          <div class="cm-unit-list">
            ${this._renderUnitList(defenders, allUnits)}
          </div>
        </div>
      </div>

      ${this._log.length > 0 ? `
        <div class="cm-log">
          ${this._log.slice(-3).map(l => {
            if (l.aa)    return `<div class="cm-log-line aa">⚡ AA guns fire: <b>${l.hits}</b> aircraft shot down</div>`;
            if (l.error) return `<div class="cm-log-line err">⚠ Combat error — retry</div>`;
            return `<div class="cm-log-line">
              <div class="cm-log-round">Round ${l.round}</div>
              <div class="cm-log-row">
                <span class="cm-log-atk">Attk</span>
                <span class="cm-log-dice">${l.atkDice}</span>
                <span class="cm-log-result ${l.atkHits > 0 ? 'hit' : ''}">${l.atkHits} hit${l.atkHits !== 1 ? 's' : ''}</span>
                ${l.defKilled > 0 ? `<span class="cm-log-kill">−${l.defKilled} enemy</span>` : ''}
              </div>
              <div class="cm-log-row">
                <span class="cm-log-def">Def</span>
                <span class="cm-log-dice">${l.defDice}</span>
                <span class="cm-log-result ${l.defHits > 0 ? 'hit def' : ''}">${l.defHits} hit${l.defHits !== 1 ? 's' : ''}</span>
                ${l.atkKilled > 0 ? `<span class="cm-log-kill def">−${l.atkKilled} yours</span>` : ''}
              </div>
            </div>`;
          }).join('')}
        </div>
      ` : ''}

      ${this._done ? `
        <div class="cm-done-msg">${this._doneMsg}</div>
        <button class="cm-btn cm-btn-ok" id="cm-ok">Continue →</button>
      ` : `
        <div class="cm-actions">
          <button class="cm-btn cm-btn-roll" id="cm-roll">🎲 Roll Dice</button>
          <button class="cm-btn cm-btn-retreat" id="cm-retreat">↩ Retreat</button>
        </div>
      `}
    `;

    modal.querySelector('#cm-roll')?.addEventListener('click', () => this._doRound());
    modal.querySelector('#cm-retreat')?.addEventListener('click', () => this._doRetreat());
    modal.querySelector('#cm-ok')?.addEventListener('click', () => {
      this.hide();
      // Remove this combat from pending
      if (this.app.turnEngine.pendingCombats) {
        this.app.turnEngine.pendingCombats = this.app.turnEngine.pendingCombats.filter(t => t !== this._tid);
      }
      if (this.app.turnEngine.pendingCombats?.length === 0) {
        this.app.turnEngine.advancePhase();
      }
    });
  }

  _renderUnitList(units, allUnits) {
    const counts = units.reduce((acc, u) => {
      acc[u.type] = (acc[u.type] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([type, cnt]) => {
      const def = allUnits[type];
      return `<span class="cm-unit-chip">${def?.icon || '?'} ×${cnt}</span>`;
    }).join('');
  }

  _renderDiceRow(rolls, hits) {
    if (!rolls || rolls.length === 0) return '<span style="color:#555">—</span>';
    // Mark the lowest-value rolls as hits (so hit count matches)
    const indexed = rolls.map((r, i) => ({ r, i }));
    const sorted = [...indexed].sort((a, b) => a.r - b.r);
    const hitSet = new Set(sorted.slice(0, hits).map(x => x.i));
    return rolls.map((r, i) =>
      `<span class="cm-die ${hitSet.has(i) ? 'hit' : 'miss'}">${r}</span>`
    ).join('');
  }

  _doRound() {
    const nation = this.state.currentNation;
    const attackers = this.state.getUnits(this._tid, nation);
    const defenders = this.state.getUnits(this._tid).filter(u => u.nation !== nation);
    if (attackers.length === 0 || defenders.length === 0) {
      this._finishCombat(attackers.length > 0 ? 'attacker' : 'defender');
      return;
    }

    try {
      const result = CombatEngine.resolveCombatRound(attackers, defenders, this._round === 0);
      this._round++;

      // Apply AA casualties first round
      if (result.aaResults?.targets?.length > 0) {
        result.aaResults.targets.forEach(id => {
          this.state.units[this._tid] = this.state.units[this._tid].filter(u => u.id !== id);
        });
        this._log.push({ aa: true, hits: result.aaResults.hits });
      }

      // Attacker hits → pick defender casualties
      const defCas = CombatEngine.selectCasualties(
        this.state.getUnits(this._tid).filter(u => u.nation !== nation),
        result.attackerHits, false
      );
      defCas.filter(c => c.killed).forEach(c => {
        this.state.units[this._tid] = this.state.units[this._tid].filter(u => u.id !== c.unit.id);
      });

      // Defender hits → pick attacker casualties
      const atkCas = CombatEngine.selectCasualties(
        this.state.getUnits(this._tid, nation),
        result.defenderHits, true
      );
      atkCas.filter(c => c.killed).forEach(c => {
        this.state.units[this._tid] = this.state.units[this._tid].filter(u => u.id !== c.unit.id);
      });

      const atkKilled = atkCas.filter(c => c.killed).length;
      const defKilled = defCas.filter(c => c.killed).length;

      this._log.push({
        round: this._round,
        atkHits: result.attackerHits, defHits: result.defenderHits,
        atkDice: this._renderDiceRow(result.attackerRolls || [], result.attackerHits),
        defDice: this._renderDiceRow(result.defenderRolls || [], result.defenderHits),
        atkKilled, defKilled,
      });

      this.state.autosave();

      // Check end of combat
      const newAtk = this.state.getUnits(this._tid, nation);
      const newDef = this.state.getUnits(this._tid).filter(u => u.nation !== nation);
      if (newAtk.length === 0) {
        this._finishCombat('defender');
      } else if (newDef.length === 0) {
        this._finishCombat('attacker');
      } else {
        this._render();
      }
    } catch (e) {
      console.error('[CombatModal] round error:', e);
      this._log.push({ error: true });
      this._render();
    }
  }

  _doRetreat() {
    // Move attackers back to adjacent friendly territory
    const nation = this.state.currentNation;
    const attackers = this.state.getUnits(this._tid, nation);
    const territory = TERRITORIES[this._tid];
    // Find adjacent friendly territory to retreat to
    const retreatTo = territory?.adjacent.find(adjId => {
      const owner = this.state.ownership[adjId];
      return owner === nation || NATIONS[owner]?.side === NATIONS[nation]?.side;
    });
    if (retreatTo && attackers.length > 0) {
      this.state.moveUnits(attackers.map(u => u.id), this._tid, retreatTo);
      this._log.push(`Retreated to ${TERRITORIES[retreatTo]?.name || retreatTo}`);
    }
    this._doneMsg = '↩ Retreat successful.';
    this._done = true;
    this._render();
  }

  _finishCombat(winner) {
    const nation = this.state.currentNation;
    if (winner === 'attacker') {
      this.state.captureTerritory(this._tid, nation);
      this._doneMsg = `✅ ${TERRITORIES[this._tid]?.name} captured!`;
    } else {
      this._doneMsg = `❌ Attack repelled — ${TERRITORIES[this._tid]?.name} holds.`;
    }
    this._done = true;
    this._render();
  }
}

const COMBAT_CSS = `
  .combat-modal-wrap {
    position: fixed; inset: 0;
    background: rgba(5,10,20,0.9);
    z-index: 400;
    display: flex; align-items: center; justify-content: center;
  }
  .combat-modal {
    background: #111e30; border: 1px solid #1e3a5a;
    border-radius: 12px; padding: 20px 24px;
    max-width: 480px; width: 94%;
    font-family: Georgia, serif; color: #d4c9a8;
    max-height: 90vh; overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .cm-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 16px;
  }
  .cm-territory { font-size: 1.2rem; color: #c8a040; font-weight: bold; }
  .cm-round { font-size: 0.85rem; color: #6a7a8a; }

  .cm-battlefield {
    display: flex; align-items: flex-start; gap: 12px;
    margin-bottom: 16px; background: #0d1925;
    border-radius: 8px; padding: 14px;
  }
  .cm-side { flex: 1; }
  .cm-side-label { font-size: 0.8rem; font-weight: bold; margin-bottom: 8px; }
  .cm-unit-list { display: flex; flex-wrap: wrap; gap: 5px; }
  .cm-unit-chip {
    background: #1a2a3a; border: 1px solid #2a4a6a;
    border-radius: 5px; padding: 4px 8px; font-size: 0.85rem;
  }
  .cm-vs { font-size: 1.5rem; padding-top: 20px; color: #c8a040; }

  .cm-log {
    background: #0a1422; border: 1px solid #1a2a3a;
    border-radius: 6px; padding: 8px 10px;
    margin-bottom: 14px; max-height: 160px; overflow-y: auto;
  }
  .cm-log-line { font-size: 0.72rem; color: #8aaa8a; margin-bottom: 6px; }
  .cm-log-line.aa  { color: #e8c840; }
  .cm-log-line.err { color: #e05040; }
  .cm-log-round  { font-size: 0.62rem; color: #506080; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 3px; }
  .cm-log-row    { display: flex; align-items: center; gap: 6px; margin-bottom: 2px; }
  .cm-log-atk    { width: 28px; font-size: 0.6rem; color: #70b870; font-weight: bold; }
  .cm-log-def    { width: 28px; font-size: 0.6rem; color: #8080e0; font-weight: bold; }
  .cm-log-dice   { display: flex; gap: 2px; flex-wrap: wrap; flex: 1; }
  .cm-log-result { font-size: 0.62rem; color: #707060; width: 40px; text-align: right; }
  .cm-log-result.hit     { color: #70e870; }
  .cm-log-result.hit.def { color: #e07070; }
  .cm-log-kill   { font-size: 0.6rem; color: #c05040; font-weight: bold; }
  .cm-log-kill.def { color: #e05040; }

  /* Dice pips */
  .cm-die {
    display: inline-flex; align-items: center; justify-content: center;
    width: 16px; height: 16px; border-radius: 3px;
    font-size: 0.65rem; font-weight: 900;
    border: 1px solid;
  }
  .cm-die.hit  { background: #1a3a1a; color: #70e060; border-color: #3a8030; }
  .cm-die.miss { background: #1a1a1a; color: #505040; border-color: #2a2a20; }

  .cm-actions { display: flex; gap: 10px; }
  .cm-btn {
    flex: 1; padding: 14px; border: none; border-radius: 8px;
    font-family: Georgia, serif; font-size: 1rem; font-weight: bold;
    cursor: pointer; min-height: 52px;
    -webkit-tap-highlight-color: transparent;
  }
  .cm-btn:active { transform: scale(0.97); }
  .cm-btn-roll    { background: #c8a040; color: #0a1628; }
  .cm-btn-retreat { background: #1e3a5a; color: #d4c9a8; }
  .cm-btn-ok      { width: 100%; background: #3aaa44; color: #fff; }

  .cm-done-msg {
    text-align: center; font-size: 1rem; color: #c8a040;
    margin-bottom: 14px; padding: 12px;
    background: #0d1925; border-radius: 8px;
  }
`;
