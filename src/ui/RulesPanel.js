/**
 * RulesPanel — full A&A 1942 Second Edition rules reference.
 * Opened via the ❓ button in the HUD.
 */
export class RulesPanel {
  constructor(container) {
    this.container = container;
    this._el = null;
  }

  show() {
    if (this._el) { this._el.remove(); }

    this._el = document.createElement('div');
    this._el.className = 'rules-overlay';
    this._el.innerHTML = `
      <style>${RULES_CSS}</style>
      <div class="rules-panel">
        <div class="rules-header">
          <span>📖 AXIS &amp; ALLIES 1942 — RULES REFERENCE</span>
          <button class="rules-close" id="rules-close">✕</button>
        </div>
        <div class="rules-body">

          <!-- OVERVIEW -->
          <section>
            <h2>OVERVIEW</h2>
            <p>Axis &amp; Allies 1942 Second Edition is a strategic WWII board game for 2–5 players.
            The <strong>Axis</strong> (Germany, Japan) battles the <strong>Allies</strong> (Soviet Union, United Kingdom, United States).
            The game is played in rounds; each nation takes a full turn per round.</p>
            <p><strong>Axis wins</strong> by controlling 9 of the 10 victory cities at the end of any Axis turn.
            <strong>Allies win</strong> by capturing both Berlin and Tokyo simultaneously.</p>
          </section>

          <!-- VICTORY CITIES -->
          <section>
            <h2>VICTORY CITIES (10 total)</h2>
            <div class="vc-grid">
              <div class="vc-axis">
                <div class="vc-label">AXIS START</div>
                <div>Berlin (Germany)</div>
                <div>Western Europe (Germany)</div>
                <div>Southern Europe (Germany)</div>
                <div>Tokyo (Japan)</div>
                <div>Manchuria (Japan)</div>
              </div>
              <div class="vc-allies">
                <div class="vc-label">ALLIES START</div>
                <div>Moscow (USSR)</div>
                <div>London (UK)</div>
                <div>Eastern USA (USA)</div>
                <div>India (UK)</div>
                <div>Australia (UK)</div>
              </div>
            </div>
            <p class="rule-note">Axis needs 9 of 10 victory cities at the END of any Axis nation's turn to win.</p>
          </section>

          <!-- TURN ORDER -->
          <section>
            <h2>TURN ORDER</h2>
            <ol>
              <li><span class="nat-ussr">Soviet Union</span></li>
              <li><span class="nat-germany">Germany</span></li>
              <li><span class="nat-uk">United Kingdom</span></li>
              <li><span class="nat-japan">Japan</span></li>
              <li><span class="nat-usa">United States</span></li>
            </ol>
            <p class="rule-note">Each nation completes all 6 phases before the next nation takes their turn.</p>
          </section>

          <!-- 6 PHASES -->
          <section>
            <h2>THE 6 PHASES OF EACH TURN</h2>

            <div class="phase-block">
              <div class="phase-num">1</div>
              <div class="phase-content">
                <h3>PURCHASE UNITS</h3>
                <p>Spend your IPC (Industrial Production Certificates) to buy units. Purchased units are set aside and placed on the board later in Phase 5. You may not spend more IPC than you have.</p>
                <p>You may also spend 5 IPC per die to roll for <strong>National Technology</strong> (roll a 6 to gain a tech breakthrough).</p>
              </div>
            </div>

            <div class="phase-block">
              <div class="phase-num">2</div>
              <div class="phase-content">
                <h3>COMBAT MOVEMENT</h3>
                <p>Move units that will participate in combat. Units moving into enemy-controlled territories or sea zones containing enemy ships are attacking. <strong>You must resolve any attack you start.</strong></p>
                <ul>
                  <li>Land units <strong>stop</strong> when they enter an enemy territory</li>
                  <li>Fighters and bombers fly over friendly territories en route to attacks</li>
                  <li>Submarines may submerge to avoid combat (if no enemy destroyer present)</li>
                  <li>AA Guns may <strong>not</strong> be moved in Combat Movement</li>
                  <li>Transports may carry up to 2 land units (1 infantry + 1 other, or 2 infantry)</li>
                </ul>
              </div>
            </div>

            <div class="phase-block">
              <div class="phase-num">3</div>
              <div class="phase-content">
                <h3>CONDUCT COMBAT</h3>
                <p>Resolve all battles you initiated. The attacker may <strong>withdraw</strong> after any round of combat.</p>
                <p><strong>Combat rounds:</strong></p>
                <ol>
                  <li>Defender's AA guns fire at attacking aircraft (hits on a 1; each gun fires once)</li>
                  <li>All attacking units fire simultaneously — assign hits to defending units</li>
                  <li>All defending units fire simultaneously — assign hits to attacking units</li>
                  <li>Remove casualties. Attacker decides to continue or withdraw.</li>
                </ol>
                <p>If the attacker eliminates all defenders, they capture the territory and move attacking land units in. The attacker collects any IPC tokens present.</p>
              </div>
            </div>

            <div class="phase-block">
              <div class="phase-num">4</div>
              <div class="phase-content">
                <h3>NON-COMBAT MOVEMENT</h3>
                <p>Move any units that did <strong>not</strong> participate in combat. Units may only enter friendly territories or sea zones. This is when you reposition defensive forces, move AA guns, and ferry units via transports.</p>
                <p>Fighters that attacked must have enough movement remaining to land on a friendly territory or carrier.</p>
              </div>
            </div>

            <div class="phase-block">
              <div class="phase-num">5</div>
              <div class="phase-content">
                <h3>MOBILIZE NEW UNITS (Place)</h3>
                <p>Place all units purchased in Phase 1 on territories you control that contain an <strong>Industrial Complex (🏭)</strong>. You may place up to <strong>3 units per IC per turn</strong> (or more with Industrial Technology).</p>
                <p>Naval units are placed in a friendly sea zone adjacent to the IC territory.</p>
              </div>
            </div>

            <div class="phase-block">
              <div class="phase-num">6</div>
              <div class="phase-content">
                <h3>COLLECT INCOME</h3>
                <p>Count the IPC value of all territories you currently control (shown in gold on the map). Add that amount to your treasury. You may never have more than 999 IPC.</p>
              </div>
            </div>
          </section>

          <!-- UNIT STATS -->
          <section>
            <h2>UNIT REFERENCE</h2>
            <p class="rule-note">ATK = attack value, DEF = defense value, MOV = movement spaces, COST = IPC cost. Roll ≤ the value on a d6 to hit.</p>
            <table class="unit-table">
              <thead><tr><th>Unit</th><th>Code</th><th>ATK</th><th>DEF</th><th>MOV</th><th>COST</th><th>Notes</th></tr></thead>
              <tbody>
                <tr class="land"><td>Infantry</td><td>INF</td><td>1</td><td>2</td><td>1</td><td>3</td><td>Boosted to ATK 2 when paired with Artillery</td></tr>
                <tr class="land"><td>Artillery</td><td>ART</td><td>2</td><td>2</td><td>1</td><td>4</td><td>Boosts 1 paired Infantry to ATK 2</td></tr>
                <tr class="land"><td>Armor (Tank)</td><td>ARM</td><td>3</td><td>3</td><td>2</td><td>6</td><td>Can blitz through undefended territory (2 moves)</td></tr>
                <tr class="land"><td>Anti-Aircraft</td><td>AA</td><td>—</td><td>1</td><td>1</td><td>5</td><td>Fires at air units before combat (hits on 1); 1 AA shot per attacking plane; max 3 shots; cannot move in combat phase</td></tr>
                <tr class="air"><td>Fighter</td><td>FTR</td><td>3</td><td>4</td><td>4</td><td>10</td><td>Must land on carrier or friendly territory; can escort/intercept</td></tr>
                <tr class="air"><td>Bomber</td><td>BMB</td><td>4</td><td>1</td><td>6</td><td>12</td><td>Can conduct strategic bombing runs on ICs (roll 1d6, deal that much damage)</td></tr>
                <tr class="naval"><td>Submarine</td><td>SUB</td><td>2</td><td>1</td><td>2</td><td>6</td><td>First strike; can submerge to avoid combat; ignored by surface ships (unless destroyer present)</td></tr>
                <tr class="naval"><td>Destroyer</td><td>DD</td><td>2</td><td>2</td><td>2</td><td>8</td><td>Negates submarine special abilities</td></tr>
                <tr class="naval"><td>Cruiser</td><td>CA</td><td>3</td><td>3</td><td>2</td><td>12</td><td>Can bombard land territories during amphibious assault (ATK 3)</td></tr>
                <tr class="naval"><td>Aircraft Carrier</td><td>CV</td><td>1</td><td>2</td><td>2</td><td>14</td><td>Carries up to 2 fighters; damaged carrier still carries fighters</td></tr>
                <tr class="naval"><td>Battleship</td><td>BB</td><td>4</td><td>4</td><td>2</td><td>20</td><td>Two hits to sink; can bombard land (ATK 4); takes 1 hit before full sinking</td></tr>
                <tr class="naval"><td>Transport</td><td>TRN</td><td>0</td><td>1</td><td>2</td><td>7</td><td>Carries up to 2 land units (1 large + 1 small, or 2 small); cannot attack</td></tr>
              </tbody>
            </table>
          </section>

          <!-- COMBAT RULES -->
          <section>
            <h2>COMBAT RULES</h2>
            <h3>Amphibious Assaults</h3>
            <p>Transport land units to a sea zone adjacent to an enemy territory. Warships in the same sea zone may provide <strong>shore bombardment</strong> (each fires once at its ATK value before the first round of combat). You must clear the sea zone of enemy ships first (sea battle), or the assault is blocked.</p>

            <h3>Strategic Bombing</h3>
            <p>Send bombers to attack an enemy Industrial Complex. The defender may scramble fighters from within 1 territory range to intercept. If uncontested, each bomber rolls 1d6 and deals that much damage (max = current IC production capacity). IC damage reduces production by 1 unit per damage point until repaired (costs 1 IPC per damage point during Phase 5).</p>

            <h3>Submarine Rules</h3>
            <ul>
              <li><strong>First Strike</strong>: Subs fire before all other units; casualties are removed before the enemy fires back</li>
              <li><strong>Submerge</strong>: At any point before or during combat, subs may submerge (retreat underwater) — UNLESS an enemy destroyer is present</li>
              <li><strong>Ignored</strong>: Opposing naval units may pass through a sea zone with only submarines (no destroyer present) without fighting</li>
            </ul>

            <h3>Retreating</h3>
            <p>The attacker may choose to retreat after any round of combat. Retreat to an adjacent territory that the attacking units moved from. All surviving attacking units must retreat to the same territory.</p>
          </section>

          <!-- INDUSTRIAL COMPLEXES -->
          <section>
            <h2>INDUSTRIAL COMPLEXES 🏭</h2>
            <p>Starting IC locations: <strong>Germany, Russia, United Kingdom, Eastern US, Japan</strong>.</p>
            <p>Each IC allows you to build up to <strong>3 units per turn</strong>. If an enemy captures a territory with your IC, they now control that IC and may use it on their turn.</p>
            <p>New ICs may be built for 15 IPC during Phase 5 on any territory you control with an IPC value of 2 or more.</p>
          </section>

          <!-- NATIONAL STARTING IPC -->
          <section>
            <h2>STARTING IPC / INCOME</h2>
            <table class="ipc-table">
              <thead><tr><th>Nation</th><th>Starting IPC</th><th>Starting Income</th></tr></thead>
              <tbody>
                <tr><td class="nat-ussr">Soviet Union</td><td>12</td><td>24</td></tr>
                <tr><td class="nat-germany">Germany</td><td>40</td><td>40</td></tr>
                <tr><td class="nat-uk">United Kingdom</td><td>20</td><td>28</td></tr>
                <tr><td class="nat-japan">Japan</td><td>26</td><td>26</td></tr>
                <tr><td class="nat-usa">United States</td><td>42</td><td>38</td></tr>
              </tbody>
            </table>
          </section>

          <!-- NATIONAL TECHNOLOGY -->
          <section>
            <h2>NATIONAL TECHNOLOGY</h2>
            <p>During Phase 1, spend 5 IPC per die. Roll each die — a <strong>6</strong> earns a breakthrough. Randomly determine which technology is gained from the table below.</p>
            <table class="tech-table">
              <thead><tr><th>Technology</th><th>Effect</th></tr></thead>
              <tbody>
                <tr><td>Advanced Artillery</td><td>Each Artillery boosts TWO infantry instead of one</td></tr>
                <tr><td>Rockets</td><td>AA Guns may fire once per turn at enemy ICs within 3 territories (1d6 damage, max 6)</td></tr>
                <tr><td>Jet Fighters</td><td>Fighters defend at 5 instead of 4</td></tr>
                <tr><td>Long-Range Aircraft</td><td>Fighters +2 movement, Bombers +2 movement</td></tr>
                <tr><td>Heavy Bombers</td><td>Bombers roll 2d6 on bombing runs (keep higher); attack with 2 dice (keep higher)</td></tr>
                <tr><td>Super Submarines</td><td>Submarines attack at 3 instead of 2</td></tr>
                <tr><td>Improved Shipyards</td><td>All naval units cost 1 less IPC</td></tr>
                <tr><td>Radar</td><td>AA Guns hit aircraft on a 1 or 2</td></tr>
                <tr><td>Industrial Technology</td><td>Industrial Complexes produce 2 extra units per turn (total 5)</td></tr>
                <tr><td>Mechanized Infantry</td><td>Infantry can move 2 spaces if paired with a tank; can blitz with tank</td></tr>
                <tr><td>Paratroopers</td><td>Each bomber may transport 1 infantry up to 3 territories (land in adjacent territory to target)</td></tr>
                <tr><td>War Bonds</td><td>Collect 1d6 extra IPC at end of Income phase</td></tr>
              </tbody>
            </table>
          </section>

          <!-- NEUTRALS -->
          <section>
            <h2>NEUTRAL TERRITORIES</h2>
            <p>Strictly Neutral territories (Spain, Sweden, Turkey, Yugoslavia, Austria) may be attacked — but doing so activates ALL other strict neutrals to defend against the attacking nation (they place 2 infantry per neutral territory that faces you). You gain their IPC value if captured.</p>
          </section>

        </div>
      </div>
    `;

    document.body.appendChild(this._el);
    document.getElementById('rules-close').addEventListener('click', () => this.hide());
    // Close on backdrop click
    this._el.addEventListener('click', (e) => { if (e.target === this._el) this.hide(); });
  }

  hide() {
    this._el?.remove();
    this._el = null;
  }
}

const RULES_CSS = `
  .rules-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.82);
    z-index: 800;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Arial Narrow', Arial, sans-serif;
  }
  .rules-panel {
    width: min(860px, 96vw); height: 88vh;
    background: #0e1208;
    border: 1px solid #2a3018;
    border-radius: 10px;
    display: flex; flex-direction: column;
    overflow: hidden;
    box-shadow: 0 8px 64px rgba(0,0,0,0.95);
  }
  .rules-header {
    background: #141a08; border-bottom: 1px solid #2a3018;
    padding: 12px 18px;
    display: flex; align-items: center; justify-content: space-between;
    font-size: 0.85rem; font-weight: 900; color: #c8a040;
    letter-spacing: 2px; flex-shrink: 0;
  }
  .rules-close {
    background: #2a1808; border: 1px solid #5a2010; color: #e86040;
    width: 28px; height: 28px; border-radius: 4px;
    font-size: 0.8rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }
  .rules-body {
    overflow-y: auto; padding: 20px 24px;
    color: #c0b880;
    font-size: 0.85rem; line-height: 1.6;
  }
  .rules-body section {
    margin-bottom: 28px; border-bottom: 1px solid #1e2410; padding-bottom: 20px;
  }
  .rules-body section:last-child { border-bottom: none; }
  .rules-body h2 {
    font-size: 0.9rem; color: #e8c040; letter-spacing: 2px;
    font-weight: 900; margin: 0 0 10px;
    border-left: 3px solid #c8a030; padding-left: 10px;
  }
  .rules-body h3 { font-size: 0.82rem; color: #a89860; margin: 12px 0 6px; }
  .rules-body p  { margin: 0 0 8px; }
  .rules-body ul, .rules-body ol { margin: 6px 0 10px 20px; }
  .rules-body li { margin: 3px 0; }
  .rule-note { color: #888068; font-size: 0.8rem; font-style: italic; }

  /* Victory city grid */
  .vc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 10px 0; }
  .vc-axis  { background: #1a0c0c; border: 1px solid #3a1818; border-radius: 5px; padding: 10px; }
  .vc-allies{ background: #0c1018; border: 1px solid #182830; border-radius: 5px; padding: 10px; }
  .vc-label { font-weight: 900; letter-spacing: 1px; margin-bottom: 6px; font-size: 0.75rem; color: #a0a070; }
  .vc-axis  div:not(.vc-label) { color: #e07070; font-size: 0.82rem; margin: 2px 0; }
  .vc-allies div:not(.vc-label){ color: #70a8e0; font-size: 0.82rem; margin: 2px 0; }

  /* Phase blocks */
  .phase-block {
    display: flex; gap: 14px; margin: 10px 0;
    background: #0a0e06; border: 1px solid #1e2410;
    border-radius: 6px; padding: 12px;
  }
  .phase-num {
    width: 32px; height: 32px; border-radius: 50%;
    background: #c8a030; color: #080a04;
    font-size: 1.1rem; font-weight: 900;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .phase-content { flex: 1; }
  .phase-content h3 { margin: 0 0 6px; font-size: 0.85rem; color: #d0b860; }

  /* Unit table */
  .unit-table {
    width: 100%; border-collapse: collapse; font-size: 0.78rem;
    margin: 8px 0;
  }
  .unit-table th {
    background: #141a08; color: #a8a070; font-weight: 900;
    padding: 7px 8px; text-align: left; border-bottom: 1px solid #2a3010;
    letter-spacing: 0.5px;
  }
  .unit-table td { padding: 6px 8px; border-bottom: 1px solid #1a1e0c; }
  .unit-table tr:last-child td { border-bottom: none; }
  .unit-table tr.land  td:first-child { color: #c8a060; }
  .unit-table tr.air   td:first-child { color: #8080e8; }
  .unit-table tr.naval td:first-child { color: #4898d0; }
  .unit-table td:nth-child(3),.unit-table td:nth-child(4) { color: #e87870; text-align: center; font-weight: bold; }
  .unit-table td:nth-child(5) { color: #70d070; text-align: center; font-weight: bold; }
  .unit-table td:nth-child(6) { color: #f0c040; text-align: center; font-weight: bold; }

  /* IPC/tech tables */
  .ipc-table, .tech-table {
    width: 100%; border-collapse: collapse; font-size: 0.78rem; margin: 8px 0;
  }
  .ipc-table th, .tech-table th {
    background: #141a08; color: #a8a070; font-weight: 900;
    padding: 7px 8px; text-align: left; border-bottom: 1px solid #2a3010;
  }
  .ipc-table td, .tech-table td { padding: 6px 8px; border-bottom: 1px solid #1a1e0c; }
  .ipc-table tr:last-child td, .tech-table tr:last-child td { border-bottom: none; }
  .tech-table td:first-child { color: #88c870; font-weight: bold; }

  /* Nation colors */
  .nat-ussr    { color: #e03030; }
  .nat-germany { color: #70b8c8; }
  .nat-uk      { color: #e8a030; }
  .nat-japan   { color: #e8c830; }
  .nat-usa     { color: #50c040; }

  /* Scrollbar */
  .rules-body::-webkit-scrollbar { width: 6px; }
  .rules-body::-webkit-scrollbar-track { background: #0a0c06; }
  .rules-body::-webkit-scrollbar-thumb { background: #3a4020; border-radius: 3px; }
`;
