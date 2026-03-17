/**
 * Custom Unit Editor — create, manage, and assign custom units.
 * Opens as an overlay modal from the Purchase Panel.
 */
import { customUnits, addCustomUnit, removeCustomUnit, getAllUnits } from '../data/units.js';
import { NATIONS, TURN_ORDER } from '../data/nations.js';

const UNIT_TEMPLATES = [
  {
    id: 'custom_b52', name: 'B-52 Bomber', cost: 18, attack: 5, defense: 2, movement: 8,
    type: 'air', availableFor: ['usa'],
    description: 'Strategic bomber with extreme range. Rolls 3 dice when bombing.',
  },
  {
    id: 'custom_stealth', name: 'Stealth Fighter', cost: 14, attack: 4, defense: 5, movement: 5,
    type: 'air', availableFor: ['usa'],
    description: 'Evades AA fire. Can land on carriers.',
  },
  {
    id: 'custom_ford_cv', name: 'Ford-Class Carrier', cost: 22, attack: 2, defense: 4, movement: 2,
    type: 'sea', availableFor: ['usa', 'australia'],
    description: 'Carries 4 aircraft. Two-hit ship.',
  },
  {
    id: 'custom_mech', name: 'Mechanized Infantry', cost: 4, attack: 1, defense: 2, movement: 2,
    type: 'land', availableFor: null,
    description: 'Fast infantry. Moves 2 spaces like armor.',
  },
  {
    id: 'custom_marine', name: 'Marine', cost: 4, attack: 2, defense: 2, movement: 1,
    type: 'land', availableFor: null,
    description: 'Elite amphibious infantry. Attacks at 2.',
  },
  {
    id: 'custom_nuke', name: 'Nuclear Bomb', cost: 30, attack: 6, defense: 0, movement: 6,
    type: 'air', availableFor: ['usa'],
    description: 'One-use strategic bomber. Destroys all defending units on hit.',
  },
];

export class CustomUnitEditor {
  constructor(container, app) {
    this.container = container;
    this.app = app;
    this._el = null;
  }

  show() {
    this._el?.remove();
    this._el = document.createElement('div');
    this._el.innerHTML = `<style>${CSS}</style>`;
    const modal = document.createElement('div');
    modal.className = 'cue-overlay';
    this._el.appendChild(modal);
    this.container.appendChild(this._el);
    this._modal = modal;
    this._renderMain();
  }

  hide() { this._el?.remove(); this._el = null; }

  _renderMain() {
    const existing = Object.values(customUnits);
    this._modal.innerHTML = `
      <div class="cue-box">
        <div class="cue-hdr">
          <span class="cue-title">⚙ CUSTOM UNITS</span>
          <button class="cue-close" id="cue-close">✕</button>
        </div>
        <div class="cue-subtitle">Create custom units and assign them to nations</div>

        ${existing.length > 0 ? `
        <div class="cue-section-lbl">YOUR CUSTOM UNITS</div>
        <div class="cue-unit-list">
          ${existing.map(u => `
            <div class="cue-unit-row">
              <div class="cue-unit-name">${u.name}</div>
              <div class="cue-unit-stats">${u.type.toUpperCase()} · ATK${u.attack} DEF${u.defense} MOV${u.movement} · ${u.cost}IPC</div>
              <div class="cue-unit-nations">${u.availableFor ? u.availableFor.map(n => NATIONS[n]?.flag || n).join(' ') : 'ALL'}</div>
              <button class="cue-del-btn" data-id="${u.id}" title="Remove">🗑</button>
            </div>
          `).join('')}
        </div>` : '<div class="cue-empty">No custom units yet. Create one below.</div>'}

        <div class="cue-section-lbl">TEMPLATES</div>
        <div class="cue-template-grid">
          ${UNIT_TEMPLATES.map(t => `
            <div class="cue-template" data-template="${t.id}">
              <div class="cue-tmpl-name">${t.name}</div>
              <div class="cue-tmpl-stats">${t.type.toUpperCase()} · ATK${t.attack} DEF${t.defense} MOV${t.movement}</div>
              <div class="cue-tmpl-cost">${t.cost} IPC</div>
              <div class="cue-tmpl-nations">${t.availableFor ? t.availableFor.join(', ') : 'all nations'}</div>
            </div>
          `).join('')}
        </div>

        <div class="cue-section-lbl">CREATE NEW UNIT</div>
        <div class="cue-form" id="cue-form">
          <div class="cue-form-row">
            <label>Name</label>
            <input id="cf-name" class="cue-input" type="text" placeholder="e.g. Hellcat Fighter" maxlength="30">
          </div>
          <div class="cue-form-row">
            <label>Type</label>
            <select id="cf-type" class="cue-select">
              <option value="land">LAND</option>
              <option value="air">AIR</option>
              <option value="sea">SEA</option>
            </select>
          </div>
          <div class="cue-form-grid">
            <div class="cue-form-cell"><label>ATTACK</label><input id="cf-atk" class="cue-num" type="number" min="0" max="6" value="3"></div>
            <div class="cue-form-cell"><label>DEFENSE</label><input id="cf-def" class="cue-num" type="number" min="0" max="6" value="3"></div>
            <div class="cue-form-cell"><label>MOVEMENT</label><input id="cf-mov" class="cue-num" type="number" min="1" max="8" value="2"></div>
            <div class="cue-form-cell"><label>COST (IPC)</label><input id="cf-cost" class="cue-num" type="number" min="1" max="40" value="10"></div>
          </div>
          <div class="cue-form-row">
            <label>Available To</label>
            <div class="cue-nation-picks" id="cf-nations">
              <label class="cue-nat-opt">
                <input type="checkbox" value="all" checked> All Nations
              </label>
              ${TURN_ORDER.filter(n => n !== 'neutral').map(n => `
                <label class="cue-nat-opt">
                  <input type="checkbox" value="${n}"> ${NATIONS[n]?.flag || ''} ${NATIONS[n]?.name || n}
                </label>
              `).join('')}
            </div>
          </div>
          <div class="cue-form-row">
            <label>Description</label>
            <input id="cf-desc" class="cue-input" type="text" placeholder="Optional unit description" maxlength="100">
          </div>
          <button class="cue-create-btn" id="cue-create">+ CREATE UNIT</button>
          <div class="cue-err" id="cue-err"></div>
        </div>
      </div>
    `;

    this._modal.querySelector('#cue-close')?.addEventListener('click', () => this.hide());

    // Delete existing units
    this._modal.querySelectorAll('.cue-del-btn').forEach(b => {
      b.addEventListener('click', () => {
        removeCustomUnit(b.dataset.id);
        this._renderMain();
      });
    });

    // Load template into form
    this._modal.querySelectorAll('.cue-template').forEach(t => {
      t.addEventListener('click', () => {
        const tmpl = UNIT_TEMPLATES.find(x => x.id === t.dataset.template);
        if (!tmpl) return;
        this._modal.querySelector('#cf-name').value = tmpl.name;
        this._modal.querySelector('#cf-type').value = tmpl.type;
        this._modal.querySelector('#cf-atk').value  = tmpl.attack;
        this._modal.querySelector('#cf-def').value  = tmpl.defense;
        this._modal.querySelector('#cf-mov').value  = tmpl.movement;
        this._modal.querySelector('#cf-cost').value = tmpl.cost;
        this._modal.querySelector('#cf-desc').value = tmpl.description || '';
        // Set nation checkboxes
        const boxes = this._modal.querySelectorAll('#cf-nations input[type=checkbox]');
        boxes.forEach(cb => {
          if (cb.value === 'all') cb.checked = !tmpl.availableFor;
          else cb.checked = tmpl.availableFor ? tmpl.availableFor.includes(cb.value) : false;
        });
        t.classList.add('selected');
        setTimeout(() => t.classList.remove('selected'), 600);
      });
    });

    // All-nations checkbox logic
    const allBox = this._modal.querySelector('#cf-nations input[value=all]');
    allBox?.addEventListener('change', () => {
      if (allBox.checked) {
        this._modal.querySelectorAll('#cf-nations input:not([value=all])').forEach(cb => { cb.checked = false; });
      }
    });
    this._modal.querySelectorAll('#cf-nations input:not([value=all])').forEach(cb => {
      cb.addEventListener('change', () => { if (cb.checked) allBox.checked = false; });
    });

    // Create
    this._modal.querySelector('#cue-create')?.addEventListener('click', () => {
      const name = this._modal.querySelector('#cf-name').value.trim();
      const err  = this._modal.querySelector('#cue-err');
      if (!name) { err.textContent = 'Unit name is required.'; return; }

      const allChecked = this._modal.querySelector('#cf-nations input[value=all]').checked;
      const nationBoxes = [...this._modal.querySelectorAll('#cf-nations input:not([value=all])')].filter(cb => cb.checked);
      const availableFor = allChecked ? null : nationBoxes.map(cb => cb.value);
      if (!allChecked && nationBoxes.length === 0) { err.textContent = 'Select at least one nation (or All Nations).'; return; }

      const uid = 'custom_' + name.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 20) + '_' + Date.now().toString(36).slice(-4);
      addCustomUnit({
        id: uid,
        name,
        type: this._modal.querySelector('#cf-type').value,
        attack:   parseInt(this._modal.querySelector('#cf-atk').value)  || 0,
        defense:  parseInt(this._modal.querySelector('#cf-def').value)  || 0,
        movement: parseInt(this._modal.querySelector('#cf-mov').value)  || 1,
        cost:     parseInt(this._modal.querySelector('#cf-cost').value) || 10,
        availableFor,
        icon: '⚙', color: '#888',
        description: this._modal.querySelector('#cf-desc').value.trim(),
        canCarry: false, carriedBy: [],
        blitz: false, isCustom: true,
      });
      err.textContent = '';
      this._renderMain();
    });

    // Close on overlay click
    this._modal.addEventListener('click', e => { if (e.target === this._modal) this.hide(); });
  }
}

const CSS = `
  .cue-overlay {
    position: fixed; inset: 0; z-index: 600;
    background: rgba(0,0,0,0.82);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Arial Narrow', Arial, sans-serif;
  }
  .cue-box {
    background: #161820; border: 1px solid #2c3048;
    border-radius: 10px; padding: 20px 22px;
    width: min(560px, 95vw); max-height: 88vh;
    overflow-y: auto; box-shadow: 0 8px 48px rgba(0,0,0,0.9);
    -webkit-overflow-scrolling: touch;
  }
  .cue-hdr { display: flex; align-items: center; margin-bottom: 4px; }
  .cue-title { flex: 1; font-size: 1rem; font-weight: 900; color: #c8b880; letter-spacing: 1.5px; }
  .cue-subtitle { font-size: 0.65rem; color: #555; margin-bottom: 14px; }
  .cue-close {
    background: #222; border: none; color: #666;
    width: 28px; height: 28px; border-radius: 50%;
    font-size: 0.85rem; cursor: pointer;
  }
  .cue-close:hover { background: #c83018; color: #fff; }

  .cue-section-lbl {
    font-size: 0.6rem; color: #4a5890; letter-spacing: 2px; font-weight: 900;
    text-transform: uppercase; margin: 14px 0 6px; border-bottom: 1px solid #2a3060;
    padding-bottom: 4px;
  }
  .cue-empty { font-size: 0.72rem; color: #445; padding: 8px 0; }

  .cue-unit-list { display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; }
  .cue-unit-row {
    display: flex; align-items: center; gap: 8px;
    background: #1c1e30; border-radius: 5px; padding: 6px 10px;
    border: 1px solid #2a2e50;
  }
  .cue-unit-name  { flex: 1; font-size: 0.75rem; font-weight: bold; color: #c0c8e8; }
  .cue-unit-stats { font-size: 0.6rem; color: #5a6888; }
  .cue-unit-nations { font-size: 0.72rem; min-width: 40px; text-align: center; }
  .cue-del-btn {
    background: none; border: none; cursor: pointer; font-size: 0.9rem;
    opacity: 0.5; padding: 2px;
  }
  .cue-del-btn:hover { opacity: 1; }

  .cue-template-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 6px;
  }
  .cue-template {
    background: #1c1e28; border: 1px solid #2a3040;
    border-radius: 6px; padding: 8px;
    cursor: pointer; transition: background 0.15s;
  }
  .cue-template:hover { background: #24283a; border-color: #5060a0; }
  .cue-template.selected { background: #282e50; border-color: #8090d0; }
  .cue-tmpl-name  { font-size: 0.68rem; font-weight: 900; color: #a0aad0; margin-bottom: 2px; }
  .cue-tmpl-stats { font-size: 0.56rem; color: #4a5870; }
  .cue-tmpl-cost  { font-size: 0.62rem; color: #c8a040; font-weight: bold; margin-top: 2px; }
  .cue-tmpl-nations { font-size: 0.52rem; color: #3a4870; margin-top: 1px; }

  .cue-form { display: flex; flex-direction: column; gap: 8px; }
  .cue-form-row { display: flex; align-items: flex-start; gap: 10px; }
  .cue-form-row label { width: 90px; font-size: 0.62rem; color: #556; padding-top: 4px; flex-shrink: 0; letter-spacing: 0.5px; }
  .cue-input {
    flex: 1; background: #111318; border: 1px solid #2a3040;
    border-radius: 4px; padding: 6px 8px; color: #c0c8e0;
    font-family: inherit; font-size: 0.72rem;
  }
  .cue-select {
    background: #111318; border: 1px solid #2a3040;
    border-radius: 4px; padding: 6px 8px; color: #c0c8e0;
    font-family: inherit; font-size: 0.72rem;
    cursor: pointer;
  }
  .cue-form-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; padding-left: 100px; }
  .cue-form-cell { display: flex; flex-direction: column; gap: 2px; }
  .cue-form-cell label { font-size: 0.52rem; color: #445; }
  .cue-num {
    background: #111318; border: 1px solid #2a3040;
    border-radius: 4px; padding: 5px 6px; color: #c0c8e0;
    font-family: inherit; font-size: 0.82rem; font-weight: bold;
    text-align: center; width: 100%;
  }
  .cue-nation-picks { flex: 1; display: flex; flex-wrap: wrap; gap: 4px; }
  .cue-nat-opt {
    display: flex; align-items: center; gap: 3px;
    font-size: 0.62rem; color: #7888b8; cursor: pointer;
    background: #181c2c; border-radius: 3px; padding: 3px 6px;
    border: 1px solid #2a3050;
  }
  .cue-nat-opt input { margin: 0; }
  .cue-create-btn {
    background: #203050; color: #8098d0; border: 1px solid #304068;
    border-radius: 5px; padding: 10px; font-size: 0.78rem; font-weight: 900;
    letter-spacing: 1px; cursor: pointer; font-family: inherit;
    align-self: flex-end; width: 100%;
  }
  .cue-create-btn:hover { background: #284068; color: #c0d8f8; }
  .cue-err { font-size: 0.68rem; color: #e06040; min-height: 16px; }
`;
