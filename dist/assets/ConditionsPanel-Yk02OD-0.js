import{G as s,o as M,c as m,M as y,g as $,a as A}from"./index-D55S26Nl.js";import"./topojson-CdfAIyUK.js";const f=new Set([s.CONTINENTAL,s.WORLD_DOMINATION]);function x(v,D,I,N,T){const d=v===y.STATES,b=v===y.SOURCE_TO_SEA,r=d||b;let o=N??s.DEFAULT;const u=new Set(T??[]);r&&f.has(o)&&(o=s.DEFAULT),!d&&o===s.NATIONAL_DOMINATION&&(o=s.DEFAULT);const a=(i,n,e,c,l=!1)=>l?"":`
    <div class="condition-option ${o===i?"selected":""}" data-goal="${i}">
      <div class="condition-name">${n} ${e}</div>
      <div class="condition-desc">${c}</div>
    </div>`,E=(i,n,e,c,l="")=>`
    <div class="condition-option condition-mod ${u.has(i)?"selected":""}" data-mod="${i}">
      <div class="condition-name">${n} ${e}</div>
      <div class="condition-desc">${c}</div>
      ${l}
    </div>`,h=`
    <div class="panel">
      <button class="panel-close" id="close-conditions">✕</button>
      <div class="panel-title">GAME MODE</div>

      <div class="condition-section-label">GOAL <span class="condition-section-hint">pick one</span></div>
      <div class="condition-list" id="goal-list">
        ${a(s.DEFAULT,'<span class="gc-icon gc-icon-sm">all_inclusive</span>',"Endless","No finish line — play as long as you like.")}
        ${a(s.CONTINENTAL,'<span class="gc-icon gc-icon-sm">public</span>',"Continental","Place every country on the starter's continent.",r)}
        ${a(s.WORLD_DOMINATION,'<span class="gc-icon gc-icon-sm">travel_explore</span>',"World Domination","Every country on Earth. Bering Strait unlocked.",r)}
        ${a(s.NATIONAL_DOMINATION,'<span class="gc-icon gc-icon-sm">star</span>',"National Domination","Place every US state. Available in US States mode only.",!d)}
      </div>

      <div class="condition-section-label" style="margin-top:16px">MODIFIERS <span class="condition-section-hint">optional — mix and match freely</span></div>
      <div class="condition-list" id="mod-list">
        ${E(A.ERROR_LIMIT,'<span class="gc-icon gc-icon-sm">close</span>',"Error Limit","Game over when you hit your mistake cap.",'<div class="condition-sub"><label>Errors allowed:</label><input type="number" id="error-limit-input" min="1" max="20" value="3" /></div>')}
        ${E(A.TIME_LIMIT,'<span class="gc-icon gc-icon-sm">schedule</span>',"Time Limit","Race the clock. Score = countries placed.",'<div class="condition-sub"><label>Time:</label><input type="text" id="time-limit-input" value="3:00" placeholder="MM:SS" style="width:70px" /><span style="font-size:11px;color:var(--text-dim)">MM:SS</span></div>')}
      </div>

      <div class="panel-actions">
        <button class="btn btn-primary" id="confirm-condition">CONFIRM</button>
        <button class="btn btn-ghost" id="close-conditions-2">Cancel</button>
      </div>
    </div>
  `;M(h);const t=$();let O=o;const p=new Set(u),L=t.querySelectorAll("#goal-list .condition-option");L.forEach(i=>{i.addEventListener("click",()=>{L.forEach(n=>n.classList.remove("selected")),i.classList.add("selected"),O=i.dataset.goal})}),t.querySelectorAll("#mod-list input").forEach(i=>{i.addEventListener("click",n=>n.stopPropagation()),i.addEventListener("mousedown",n=>n.stopPropagation())}),t.querySelectorAll("#mod-list .condition-option").forEach(i=>{i.addEventListener("click",()=>{i.classList.toggle("selected");const n=i.dataset.mod;i.classList.contains("selected")?p.add(n):p.delete(n)})}),t.querySelector("#close-conditions").addEventListener("click",m),t.querySelector("#close-conditions-2").addEventListener("click",m),t.querySelector("#confirm-condition").addEventListener("click",()=>{var S,g;const i=parseInt(((S=t.querySelector("#error-limit-input"))==null?void 0:S.value)??"3",10),n=((g=t.querySelector("#time-limit-input"))==null?void 0:g.value)??"3:00",[e,c]=n.split(":").map(Number),l=(e||0)*60+(c||0)||180;m(),I({goal:O,modifiers:[...p],errorLimit:i,timeLimitSeconds:l})})}export{x as showConditionsPanel};
