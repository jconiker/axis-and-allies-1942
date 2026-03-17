const p={mechanized_infantry:{id:"mechanized_infantry",name:"Mechanized Infantry",category:"land",researchCost:5,icon:"🚛",description:"Infantry can blitz through unoccupied enemy territory alongside armor.",effect:{type:"unit_ability",unit:"infantry",ability:"blitz_with_armor"}},advanced_artillery:{id:"advanced_artillery",name:"Advanced Artillery",category:"land",researchCost:5,icon:"🔩",description:"Each artillery piece now supports 2 infantry (attack at 2) instead of 1.",effect:{type:"artillery_support_multiplier",value:2}},paratroopers:{id:"paratroopers",name:"Paratroopers",category:"land",researchCost:5,icon:"🪂",description:"Bombers may transport 1 infantry as a paratrooper during combat movement.",effect:{type:"unit_ability",unit:"bomber",ability:"carry_infantry"}},war_bonds:{id:"war_bonds",name:"War Bonds",category:"economy",researchCost:5,icon:"💰",description:"Roll 1D6 extra IPC during each income collection phase.",effect:{type:"income_bonus_dice",dice:1}},rockets:{id:"rockets",name:"Rockets",category:"land",researchCost:5,icon:"🚀",description:"AA guns can bombard one adjacent enemy industrial territory per turn for 1D6 IPC damage.",effect:{type:"unit_ability",unit:"antiair",ability:"rocket_attack"}},jet_fighters:{id:"jet_fighters",name:"Jet Fighters",category:"air",researchCost:5,icon:"✈️",description:"Fighters attack at 4 (up from 3). Defense unchanged.",effect:{type:"unit_stat",unit:"fighter",property:"attack",value:4}},heavy_bombers:{id:"heavy_bombers",name:"Heavy Bombers",category:"air",researchCost:6,icon:"💣",description:"Bombers roll 2 dice in combat and strategic bombing — take the best result.",effect:{type:"unit_ability",unit:"bomber",ability:"heavy_bombing"}},long_range_aircraft:{id:"long_range_aircraft",name:"Long-Range Aircraft",category:"air",researchCost:5,icon:"🛫",description:"All aircraft gain +2 movement points.",effect:{type:"unit_movement_bonus",unitCategory:"air",delta:2}},super_submarines:{id:"super_submarines",name:"Super Submarines",category:"sea",researchCost:5,icon:"🤿",description:"Submarines attack at 3 (up from 2) and cannot be targeted by aircraft.",effect:{type:"unit_stat",unit:"submarine",property:"attack",value:3}},improved_shipyards:{id:"improved_shipyards",name:"Improved Shipyards",category:"sea",researchCost:5,icon:"⚓",description:"All naval unit costs are reduced by 1 IPC.",effect:{type:"cost_reduction",unitCategory:"sea",amount:1}},radar:{id:"radar",name:"Radar",category:"defense",researchCost:5,icon:"📡",description:"AA guns hit aircraft on a roll of 1 or 2 (up from 1 only).",effect:{type:"unit_stat",unit:"antiair",property:"aaHitOn",value:2}},combined_arms:{id:"combined_arms",name:"Combined Arms Doctrine",category:"land",researchCost:6,icon:"⚔️",description:"Armor + tactical bomber pairs each get +1 attack (stacks with fighter bond).",effect:{type:"unit_ability",unit:"tactical_bomber",ability:"combined_arms"}},improved_logistics:{id:"improved_logistics",name:"Improved Logistics",category:"land",researchCost:5,icon:"📦",description:"Infantry and artillery gain +1 movement point.",effect:{type:"unit_movement_bonus",units:["infantry","artillery"],delta:1}},naval_air_patrol:{id:"naval_air_patrol",name:"Naval Air Patrol",category:"sea",researchCost:5,icon:"🛩️",description:"Carriers defend at 3 (up from 2) and can carry 3 aircraft.",effect:{type:"unit_stat",unit:"carrier",property:"defense",value:3}},blitzkrieg:{id:"blitzkrieg",name:"Blitzkrieg",category:"land",researchCost:6,icon:"⚡",description:"Armor units may blitz through 2 unoccupied enemy territories in one turn.",effect:{type:"unit_ability",unit:"armor",ability:"double_blitz"}}},y={land:{label:"Land",color:"#8B6914"},air:{label:"Air",color:"#4a7cba"},sea:{label:"Sea",color:"#2a6080"},defense:{label:"Defense",color:"#5a4a7a"},economy:{label:"Economy",color:"#4a7a4a"}};class v{constructor(e,r){this.container=e,this.app=r,this.state=r.state,this._el=null,this._dice=1}show(){this._el=document.createElement("div"),this._el.innerHTML=`<style>${f}</style><div class="tech-panel-wrap"><div class="tech-panel" id="tech-panel"></div></div>`,this.container.appendChild(this._el),this._render()}hide(){var e;(e=this._el)==null||e.remove(),this._el=null}_render(){var o,t,s,h;const e=(o=this._el)==null?void 0:o.querySelector("#tech-panel");if(!e)return;const r=this.state.currentNation,d=this.state.ipc[r]||0,n=this.state.technologies[r]||[],l=Math.floor(d/5),i={};Object.values(p).forEach(a=>{i[a.category]||(i[a.category]=[]),i[a.category].push(a)}),e.innerHTML=`
      <div class="tp-header">
        <span>🔬 Research &amp; Development</span>
        <button class="tp-close" id="tp-close">✕</button>
      </div>
      <p class="tp-sub">Roll research dice (5 IPC each). Roll a 6 = breakthrough!</p>

      <div class="tp-dice-row">
        <span class="tp-dice-label">Dice: ${this._dice}</span>
        <input type="range" id="tp-dice-range" min="1" max="${Math.max(1,l)}" value="${this._dice}"
               style="flex:1;accent-color:#c8a040;" ${l<1?"disabled":""} />
        <span class="tp-dice-cost">${this._dice*5} IPC</span>
      </div>

      <button class="tp-btn tp-btn-roll" id="tp-roll" ${l<1?"disabled":""}>
        🎲 Roll ${this._dice} ${this._dice===1?"die":"dice"} (${this._dice*5} IPC)
      </button>

      <div class="tp-tree">
        ${Object.entries(i).map(([a,g])=>{var m,b;return`
          <div class="tp-category">
            <div class="tp-cat-label" style="color:${((m=y[a])==null?void 0:m.color)||"#888"}">
              ${((b=y[a])==null?void 0:b.label)||a}
            </div>
            <div class="tp-techs">
              ${g.map(c=>{const u=n.includes(c.id);return`
                  <div class="tp-tech ${u?"owned":""}" title="${c.description}">
                    <span class="tp-tech-icon">${c.icon}</span>
                    <div class="tp-tech-info">
                      <span class="tp-tech-name">${c.name}</span>
                      <span class="tp-tech-desc">${c.description}</span>
                    </div>
                    ${u?'<span class="tp-owned-badge">✓</span>':""}
                  </div>`}).join("")}
            </div>
          </div>
        `}).join("")}
      </div>
    `,(t=e.querySelector("#tp-close"))==null||t.addEventListener("click",()=>this.hide()),(s=e.querySelector("#tp-dice-range"))==null||s.addEventListener("input",a=>{this._dice=parseInt(a.target.value),this._render()}),(h=e.querySelector("#tp-roll"))==null||h.addEventListener("click",()=>this._doRoll())}_doRoll(){const e=this.state.currentNation;if((this.state.ipc[e]||0)<this._dice*5){alert("Not enough IPC!");return}const d=Object.keys(p).filter(t=>!(this.state.technologies[e]||[]).includes(t)),n=this.state.rollResearch(e,this._dice,d);let i=`Dice rolled: ${n.dice.map(t=>t===6?`<b style="color:#c8a040">${t}</b>`:t).join(" ")}<br>`;n.breakthroughs.length===0?i+="No breakthrough this time. Keep researching!":i+=`🎉 Breakthrough! You discovered: ${n.breakthroughs.map(t=>{var s;return(s=p[t])==null?void 0:s.name}).join(", ")}`;const o=document.createElement("div");o.className="tp-result",o.innerHTML=`<div class="tp-result-box">
      <h3>Research Results</h3>
      <div style="margin:12px 0;font-size:1.1rem">${i}</div>
      <button class="tp-btn tp-btn-roll" onclick="this.closest('.tp-result').remove()">OK</button>
    </div>`,this._el.appendChild(o),this._render()}}const f=`
  .tech-panel-wrap {
    position: fixed; inset: 0;
    background: rgba(5,10,20,0.88);
    z-index: 450; display: flex; align-items: flex-end;
  }
  .tech-panel {
    width: 100%; max-height: 80vh; background: #111e30;
    border-top: 2px solid #1e3a5a; border-radius: 16px 16px 0 0;
    padding: 16px; overflow-y: auto; font-family: Georgia, serif; color: #d4c9a8;
    -webkit-overflow-scrolling: touch;
  }
  .tp-header {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 1rem; font-weight: bold; color: #c8a040; margin-bottom: 6px;
  }
  .tp-close {
    background: none; border: none; color: #6a7a8a; font-size: 1.1rem; cursor: pointer;
  }
  .tp-sub { font-size: 0.78rem; color: #6a7a8a; margin-bottom: 12px; }

  .tp-dice-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .tp-dice-label { color: #d4c9a8; font-size: 0.85rem; white-space: nowrap; }
  .tp-dice-cost { color: #c8a040; font-size: 0.85rem; white-space: nowrap; }

  .tp-btn {
    width: 100%; padding: 12px; border: none; border-radius: 8px;
    font-family: Georgia, serif; font-size: 0.95rem; font-weight: bold;
    cursor: pointer; margin-bottom: 12px; min-height: 48px;
  }
  .tp-btn-roll { background: #3a5a8a; color: #d4c9a8; }
  .tp-btn-roll:disabled { opacity: 0.4; cursor: not-allowed; }
  .tp-btn-roll:active { background: #2a4a7a; }

  .tp-tree { margin-top: 4px; }
  .tp-category { margin-bottom: 12px; }
  .tp-cat-label { font-size: 0.7rem; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 6px; }
  .tp-techs { display: flex; flex-direction: column; gap: 5px; }
  .tp-tech {
    display: flex; align-items: flex-start; gap: 10px;
    background: #0d1925; border: 1px solid #1e3a5a;
    border-radius: 7px; padding: 8px 10px; opacity: 0.75;
  }
  .tp-tech.owned { opacity: 1; border-color: #c8a040; background: #1a2a1a; }
  .tp-tech-icon { font-size: 1.2rem; flex-shrink: 0; }
  .tp-tech-info { flex: 1; }
  .tp-tech-name { display: block; font-size: 0.85rem; color: #c8a040; }
  .tp-tech-desc { display: block; font-size: 0.72rem; color: #6a7a8a; margin-top: 2px; }
  .tp-owned-badge { color: #3aaa44; font-size: 1rem; font-weight: bold; }

  .tp-result {
    position: absolute; inset: 0;
    background: rgba(5,10,20,0.9); display: flex; align-items: center; justify-content: center;
  }
  .tp-result-box {
    background: #111e30; border: 1px solid #c8a040; border-radius: 12px;
    padding: 24px; max-width: 340px; text-align: center; color: #d4c9a8;
  }
  .tp-result-box h3 { color: #c8a040; margin-bottom: 8px; }
`;export{v as TechPanel};
