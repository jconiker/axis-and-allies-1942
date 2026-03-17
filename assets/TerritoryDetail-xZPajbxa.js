import{T as v,N as d,g as y}from"./index-CPrB5dtQ.js";class _{constructor(n,e){this.container=n,this.app=e,this.state=e.state,this._el=null}show(n){var m,x,b,g,h;(m=this._el)==null||m.remove();const e=v[n];if(!e)return;const r=this.state.ownership[n],c=d[r]||d.neutral,p=this.state.getUnits(n),f=y(),u=Object.values(d).some(t=>t.capital===n),$=!!((x=this.state.industrialComplexes)!=null&&x[n]),o={};p.forEach(t=>{o[t.nation]||(o[t.nation]={}),o[t.nation][t.type]=(o[t.nation][t.type]||0)+1});const w=Object.entries(o).map(([t,l])=>{const i=d[t];return`
        <div class="td-nation-block">
          <span class="td-nat-label" style="color:${(i==null?void 0:i.color)||"#888"}">${(i==null?void 0:i.flag)||""} ${(i==null?void 0:i.name)||t}</span>
          <div class="td-unit-chips">
            ${Object.entries(l).map(([s,k])=>{const a=f[s];return`<span class="td-chip" title="Atk:${a==null?void 0:a.attack} Def:${a==null?void 0:a.defense} Move:${a==null?void 0:a.movement}">
                ${(a==null?void 0:a.icon)||"?"} ${(a==null?void 0:a.name)||s} ×${k}
              </span>`}).join("")}
          </div>
        </div>`}).join("");this._el=document.createElement("div"),this._el.innerHTML=`
      <style>${z}</style>
      <div class="td-backdrop" id="td-backdrop"></div>
      <div class="td-panel">
        <div class="td-header" style="border-left:4px solid ${c.color}">
          <div>
            <div class="td-name">${e.name}${u?" ★":""}</div>
            <div class="td-owner">${c.flag} ${c.name}${e.neutral&&r==="neutral"?" (Neutral)":""}</div>
          </div>
          <div class="td-ipc-block">
            ${e.ipc>0?`<span class="td-ipc">${e.ipc}</span><span class="td-ipc-lbl">IPC</span>`:""}
            ${$?'<span class="td-ic-badge">🏭 IC</span>':""}
          </div>
          <button class="td-close" id="td-close">✕</button>
        </div>

        ${p.length>0?`
          <div class="td-units">
            <div class="td-section-label">Units Present</div>
            ${w}
          </div>
        `:'<div class="td-empty">No units</div>'}

        ${e.type==="land"&&((b=e.adjacent)!=null&&b.length)?`
          <div class="td-adj">
            <div class="td-section-label">Adjacent</div>
            <div class="td-adj-list">
              ${e.adjacent.slice(0,8).map(t=>{const l=v[t],i=this.state.ownership[t],s=d[i];return`<span class="td-adj-chip" style="border-color:${(s==null?void 0:s.color)||"#444"}">
                  ${(s==null?void 0:s.flag)||""} ${(l==null?void 0:l.name)||t}
                </span>`}).join("")}
            </div>
          </div>
        `:""}
      </div>
    `,this.container.appendChild(this._el),(g=document.getElementById("td-close"))==null||g.addEventListener("click",()=>{var t;return(t=this._el)==null?void 0:t.remove()}),(h=document.getElementById("td-backdrop"))==null||h.addEventListener("click",()=>{var t;return(t=this._el)==null?void 0:t.remove()})}}const z=`
  .td-backdrop {
    position: fixed; inset: 0; z-index: 200;
    background: transparent;
  }
  .td-panel {
    position: fixed; bottom: 64px; left: 50%;
    transform: translateX(-50%);
    background: #111e30; border: 1px solid #1e3a5a;
    border-radius: 10px; padding: 14px 16px;
    min-width: 280px; max-width: 380px; width: 90%;
    z-index: 201;
    font-family: Georgia, serif; color: #d4c9a8;
    box-shadow: 0 4px 24px rgba(0,0,0,0.7);
  }
  .td-header {
    display: flex; align-items: flex-start; gap: 10px;
    padding-left: 10px; margin-bottom: 12px;
  }
  .td-name  { font-size: 1rem; font-weight: bold; color: #c8a040; }
  .td-owner { font-size: 0.75rem; color: #6a7a8a; margin-top: 2px; }
  .td-ipc-block { margin-left: auto; display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .td-ipc   { font-size: 1.4rem; color: #c8a040; font-weight: bold; line-height: 1; }
  .td-ipc-lbl { font-size: 0.6rem; color: #6a7a8a; }
  .td-ic-badge { font-size: 0.7rem; color: #aaaaee; margin-top: 2px; }
  .td-close {
    background: none; border: none; color: #6a7a8a;
    font-size: 1rem; cursor: pointer; padding: 2px 6px; flex-shrink: 0;
  }
  .td-section-label {
    font-size: 0.65rem; letter-spacing: 1.2px; text-transform: uppercase;
    color: #6a7a8a; margin-bottom: 6px;
  }
  .td-units { margin-bottom: 10px; }
  .td-nation-block { margin-bottom: 6px; }
  .td-nat-label { font-size: 0.78rem; font-weight: bold; }
  .td-unit-chips { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
  .td-chip {
    background: #0d1925; border: 1px solid #1e3a5a;
    border-radius: 5px; padding: 3px 7px; font-size: 0.78rem;
  }
  .td-empty { color: #6a7a8a; font-size: 0.85rem; margin-bottom: 8px; }
  .td-adj { margin-top: 4px; }
  .td-adj-list { display: flex; flex-wrap: wrap; gap: 4px; }
  .td-adj-chip {
    background: #0a1422; border: 1px solid #1e3a5a;
    border-radius: 4px; padding: 2px 6px; font-size: 0.72rem; color: #8a9aaa;
  }
`;export{_ as TerritoryDetail};
