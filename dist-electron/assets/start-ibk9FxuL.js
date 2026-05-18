import{d as G}from"./characterPopup-P2n-s9fy.js";function E(){return typeof window<"u"&&!!window.electronAPI}async function $(){if(E()&&window.electronAPI&&window.electronAPI.ping){const e=await window.electronAPI.ping();return console.log("Ping result from main process:",e),e}else return console.log("Not running in Electron."),null}function V(e,l){const n=document.createElement("div");n.id="voice-loading-overlay",n.innerHTML=`
    <div id="voice-loading-card">
      ${`<img id="voice-loading-logo" src="${e}" alt="HPG2 Logo" />`}
      <div id="voice-loading-spinner" style="display:none;"></div>
      <div id="voice-loading-title" style="display:none;"></div>
      <div id="voice-loading-subtitle"></div>
      <button id="voice-loading-load" class="voice-loading-btn" type="button">Load game</button>
      <button id="voice-loading-action" class="voice-loading-btn" type="button">New game</button>
    </div>
  `,document.body.appendChild(n),$();const y=document.createElement("style");y.textContent=`
    #voice-loading-overlay {
      position: fixed;
      inset: 0;
      z-index: 5000;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      background: rgba(8, 8, 16, 0.96);
      backdrop-filter: blur(2px);
    }

    #voice-loading-card {
      margin-top: 7vh;
      width: min(420px, calc(100vw - 32px));
      border: 2px solid rgb(80, 80, 88);
      border-radius: 12px;
      background: rgb(20, 20, 30);
      min-height: 320px;
      padding: 18px 20px;
      text-align: center;
      font-family: monospace;
      color: rgb(232, 232, 240);
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.35);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
    }

    #voice-loading-spinner {
      width: 26px;
      height: 26px;
      margin: 0 auto 12px;
      border-radius: 50%;
      border: 3px solid rgb(80, 80, 88);
      border-top-color: rgb(180, 180, 220);
      animation: voice-loading-spin 1s linear infinite;
    }

    #voice-loading-title {
      font-size: 16px;
      margin-bottom: 8px;
      letter-spacing: 0.02em;
    }

    #voice-loading-subtitle {
      font-size: 13px;
      color: rgb(176, 176, 188);
      line-height: 1.4;
      margin-bottom: 12px;
    }


    .voice-loading-btn {
      padding: 8px 14px;
      background-color: rgb(40, 40, 48);
      color: rgb(232, 232, 240);
      border: 2px solid rgb(80, 80, 88);
      border-radius: 8px;
      cursor: pointer;
      font-family: monospace;
      width: 35%;
      box-sizing: border-box;
      margin-top: 10px;
    }

    .voice-loading-btn:first-of-type {
      margin-top: auto;
    }

    .voice-loading-btn:hover,
    .voice-loading-btn:focus,
    .voice-loading-btn:focus-visible {
      outline: none;
      border-color: rgb(180, 180, 220);
      box-shadow: 0 0 5px rgb(180, 180, 220);
    }

    .voice-loading-btn:disabled {
      cursor: wait;
      opacity: 0.8;
    }

    @keyframes voice-loading-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,document.head.appendChild(y);const t=n.querySelector("#voice-loading-title"),c=n.querySelector("#voice-loading-subtitle"),r=n.querySelector("#voice-loading-action"),i=n.querySelector("#voice-loading-load");let o=!1;async function _(){if(!o){o=!0,r.disabled=!0,t.textContent="Preparing narrator voice...",c.textContent="Please wait while audio is being initialized.";try{if(E()&&window.electronAPI&&window.electronAPI.loadGamePage){await window.electronAPI.loadGamePage();return}n.remove(),y.remove(),await l()}catch{o=!1,r.disabled=!1,t.textContent="Unable to initialize narrator voice.",c.textContent="Press the button again to retry audio unlock."}}}r.addEventListener("click",_),i.addEventListener("click",async()=>{if(!o){o=!0,i.disabled=!0;try{if(E()&&window.electronAPI&&window.electronAPI.listSaveFiles){const h=await window.electronAPI.listSaveFiles();q(h)}}finally{o=!1,i.disabled=!1}}});function q(h){const L=document.getElementById("save-list-popup");L&&L.remove();const a=document.createElement("div");a.id="save-list-popup",a.style.position="fixed",a.style.left="0",a.style.top="0",a.style.width="100vw",a.style.height="100vh",a.style.background="rgba(8,8,16,0.92)",a.style.zIndex="6000",a.style.display="flex",a.style.alignItems="center",a.style.justifyContent="center",a.addEventListener("mousedown",s=>{s.target===a&&a.remove()});const d=document.createElement("div");d.style.background="rgb(20,20,30)",d.style.border="2px solid rgb(80,80,88)",d.style.borderRadius="12px",d.style.padding="28px 32px",d.style.minWidth="320px",d.style.maxWidth="90vw",d.style.boxShadow="0 0 20px rgba(0,0,0,0.45)",d.style.display="flex",d.style.flexDirection="column",d.style.alignItems="center";const p=document.createElement("div");if(p.textContent="Seleziona un salvataggio",p.style.fontSize="18px",p.style.marginBottom="18px",p.style.color="rgb(232,232,240)",p.style.fontFamily="monospace",d.appendChild(p),h.length===0){const s=document.createElement("div");s.textContent="Nessun salvataggio trovato.",s.style.color="rgb(176,176,188)",s.style.marginBottom="12px",d.appendChild(s)}else{const s=document.createElement("ul");s.style.listStyle="none",s.style.padding="0",s.style.margin="0 0 18px 0",s.style.width="100%",h.forEach(A=>{const k=document.createElement("li");k.style.marginBottom="10px";const b=document.createElement("button");b.textContent=A,b.className="voice-loading-btn",b.style.width="100%",b.onclick=async()=>{if(a.remove(),E()&&window.electronAPI&&window.electronAPI.loadSaveFile)try{const w=await window.electronAPI.loadSaveFile(A);w&&(sessionStorage.setItem("hpg2-resume-save",JSON.stringify(w)),window.location.href="hpg2-main.html")}catch(w){alert("Errore nel caricamento del salvataggio: "+w)}},k.appendChild(b),s.appendChild(k)}),d.appendChild(s)}const f=document.createElement("button");f.textContent="Annulla",f.className="voice-loading-btn",f.style.marginTop="8px",f.onclick=()=>a.remove(),d.appendChild(f),a.appendChild(d),document.body.appendChild(a)}t.style.display=""}document.addEventListener("DOMContentLoaded",()=>{V("./assets/HPG2_title-DyN6F_xP.png",async()=>{})});const S=[getComputedStyle(document.documentElement).getPropertyValue("--c-blue").trim(),getComputedStyle(document.documentElement).getPropertyValue("--c-red").trim(),getComputedStyle(document.documentElement).getPropertyValue("--c-orange").trim(),getComputedStyle(document.documentElement).getPropertyValue("--c-yellow").trim(),getComputedStyle(document.documentElement).getPropertyValue("--c-green").trim()];function F(e){const l=String(e).trim().replace(/^#/,""),n=parseInt(l,16);return{r:n>>16&255,g:n>>8&255,b:n&255}}let v=null,g=F(S[1]),C=2%S.length,u=0;const Y=.02;window.fastSkipEnabled=!1;const z="hpg2-dialogue-audio-enabled",M="hpg2-color-option-enabled",T="hpg2-fast-skip-enabled";function K(){try{return localStorage.getItem(M)==="true"}catch{return!1}}function O(e){try{localStorage.setItem(M,String(e))}catch{}}function R(){try{return localStorage.getItem(T)==="true"}catch{return!1}}function U(e){try{localStorage.setItem(T,String(e))}catch{}}window.fastSkipEnabled=R();function W(){try{return localStorage.getItem(z)==="true"}catch{return!1}}function J(e){try{localStorage.setItem(z,String(e))}catch{}}window.dialogueAudioEnabled=W();function N(){const e=F(S[C]);Math.round(g.r+(e.r-g.r)*u),Math.round(g.g+(e.g-g.g)*u),Math.round(g.b+(e.b-g.b)*u),u+=Y,u>=1&&(u=0,g=e,C=(C+1)%S.length)}function Q(e){e&&e.stopPropagation();const l=document.getElementById("color-btn");v?(clearInterval(v),v=null,m(l,"Change color",!1),O(!1)):(v=setInterval(N,50),m(l,"Change color",!0),O(!0))}function m(e,l,n){e.innerHTML=`<span class="settings-option-label">${l}</span><span class="settings-option-sep">: </span><span class="settings-option-state ${n?"is-on":"is-off"}">${n?"ON":"OFF"}</span>`}document.getElementById("color-btn").addEventListener("click",Q);function X(e){e&&e.stopPropagation();const l=document.getElementById("fast-skip-btn");window.fastSkipEnabled=!window.fastSkipEnabled,m(l,"Fast skip",window.fastSkipEnabled),U(window.fastSkipEnabled)}document.getElementById("fast-skip-btn").addEventListener("click",X);const x=document.getElementById("audio-toggle-btn"),Z='<svg class="audio-icon" viewBox="0 0 24 24" aria-hidden="true"><polygon points="3,10 7,10 12,6 12,18 7,14 3,14"></polygon><path d="M16 9 C18 10.5,18 13.5,16 15"></path><path d="M18.8 6.5 C22.2 9.3,22.2 14.7,18.8 17.5"></path></svg>',ee='<svg class="audio-icon" viewBox="0 0 24 24" aria-hidden="true"><polygon points="3,10 7,10 12,6 12,18 7,14 3,14"></polygon><line x1="5" y1="5" x2="19" y2="19"></line></svg>';function D(){const e=!!window.dialogueAudioEnabled;x.innerHTML=e?Z:ee,x.title=`Audio: ${e?"ON":"OFF"}`,x.setAttribute("aria-label",`Audio: ${e?"ON":"OFF"}`)}function te(e){e&&e.stopPropagation(),window.dialogueAudioEnabled=!window.dialogueAudioEnabled,J(window.dialogueAudioEnabled),D()}x.addEventListener("click",te);D();const H=document.getElementById("settings-btn"),I=document.getElementById("settings-menu"),j=document.getElementById("settings-overlay");function P(e){I.classList.toggle("show",e),j.classList.toggle("show",e)}H.addEventListener("click",()=>{const e=!I.classList.contains("show");P(e)});j.addEventListener("click",()=>{P(!1)});document.addEventListener("click",e=>{I.classList.contains("show")&&!I.contains(e.target)&&e.target!==H&&e.target!==x&&P(!1)});const B=document.getElementById("color-btn");K()?(v=setInterval(N,50),m(B,"Change color",!0)):m(B,"Change color",!1);const oe=document.getElementById("fast-skip-btn");m(oe,"Fast skip",window.fastSkipEnabled);const ne=document.getElementById("voice-loading-card");G(window,ne);document.getElementById("voice-loading-action").addEventListener("click",function(){sessionStorage.setItem("fromStartMenu","1"),sessionStorage.removeItem("mainChara"),sessionStorage.removeItem("saveFile"),sessionStorage.removeItem("startYear"),window.location.href="hpg2-main.html"});document.getElementById("voice-loading-load").addEventListener("click",async function(){let e=document.createElement("div");e.id="loadgame-overlay",e.style.position="fixed",e.style.inset="0",e.style.background="rgba(8,8,16,0.85)",e.style.zIndex="6000",e.style.display="flex",e.style.alignItems="center",e.style.justifyContent="center",e.innerHTML=`<div id="loadgame-box" style="background:rgb(20,20,30);border-radius:12px;padding:28px 24px;min-width:320px;max-width:90vw;box-shadow:0 0 20px #000;border:2px solid #444;position:relative;">
        <div style='font-size:18px;margin-bottom:12px;font-family:monospace;color:#e8e8f0;'>Select a save file</div>
        <div id="loadgame-list"></div>
      </div>`,document.body.appendChild(e),e.addEventListener("mousedown",function(t){t.target===e&&e.remove()});const l=e.querySelector("#loadgame-list");let n=null;fetch("scripts/savelist.json").then(t=>t.json()).then(t=>{if(!Array.isArray(t)||!t.length){l.innerHTML='<div style="color:#bbb;">No save files found.</div>';return}function c(){l.innerHTML="",t.forEach(r=>{const i=document.createElement("button");i.textContent=r,i.style.display="block",i.style.width="100%",i.style.margin="6px 0",i.style.padding="10px",i.style.fontFamily="monospace",i.style.fontSize="15px",i.style.background=n===r?"#282860":"#282830",i.style.color=n===r?"#fff":"#e8e8f0",i.style.border=n===r?"2px solid #b4b4dc":"2px solid #444",i.style.borderRadius="8px",i.style.cursor="pointer",i.addEventListener("click",o=>{o.stopPropagation(),n=r,c(),y()}),l.appendChild(i)})}c()}).catch(()=>{l.innerHTML='<div style="color:#bbb;">No save files found.</div>'});function y(){let t=document.createElement("div");t.style.position="fixed",t.style.left="0",t.style.top="0",t.style.width="100vw",t.style.height="100vh",t.style.background="rgba(0,0,0,0.25)",t.style.display="flex",t.style.alignItems="center",t.style.justifyContent="center",t.style.zIndex="7000",t.innerHTML=`<div style='background:rgb(30,30,40);padding:32px 28px;border-radius:12px;box-shadow:0 0 16px #000;border:2px solid #888;min-width:220px;text-align:center;'>
          <div style='font-size:16px;margin-bottom:18px;color:#e8e8f0;font-family:monospace;'>Confirm choice?</div>
          <button id='loadgame-yes' style='margin:0 12px 0 0;padding:8px 18px;border-radius:8px;border:2px solid #444;background:#282830;color:#fff;font-family:monospace;font-size:15px;cursor:pointer;'>Yes</button>
          <button id='loadgame-no' style='padding:8px 18px;border-radius:8px;border:2px solid #444;background:#282830;color:#fff;font-family:monospace;font-size:15px;cursor:pointer;'>No</button>
        </div>`,document.body.appendChild(t),t.addEventListener("mousedown",function(c){c.target===t&&t.remove()}),t.querySelector("#loadgame-no").addEventListener("click",function(){t.remove()}),t.querySelector("#loadgame-yes").addEventListener("click",async function(){t.remove();try{const r=await(await fetch("saves/"+n)).json();let i=Number(r.year);if(i===7){let o=document.createElement("div");o.style.position="fixed",o.style.left="0",o.style.top="0",o.style.width="100vw",o.style.height="100vh",o.style.background="rgba(0,0,0,0.25)",o.style.display="flex",o.style.alignItems="center",o.style.justifyContent="center",o.style.zIndex="8000",o.innerHTML=`<div style='background:rgb(30,30,40);padding:32px 28px;border-radius:12px;box-shadow:0 0 16px #000;border:2px solid #888;min-width:220px;text-align:center;'>
                <div style='font-size:16px;margin-bottom:18px;color:#e8e8f0;font-family:monospace;'>Game ended</div>
                <button id='ended-ok' style='padding:8px 18px;border-radius:8px;border:2px solid #444;background:#282830;color:#fff;font-family:monospace;font-size:15px;cursor:pointer;'>OK</button>
              </div>`,document.body.appendChild(o),o.querySelector("#ended-ok").addEventListener("click",function(){o.remove()});return}sessionStorage.setItem("saveFile",n),sessionStorage.setItem("fromStartMenu","1"),sessionStorage.setItem("startYear",String(i+1)),sessionStorage.setItem("mainChara",JSON.stringify(r)),e.remove(),window.location.href="hpg2-main.html"}catch{alert("Errore nel caricamento del file di salvataggio."),e.remove()}})}});
