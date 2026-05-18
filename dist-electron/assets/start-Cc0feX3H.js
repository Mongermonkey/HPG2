import{d as O}from"./characterPopup-P2n-s9fy.js";function h(){return typeof window<"u"&&!!window.electronAPI}async function A(){if(h()&&window.electronAPI&&window.electronAPI.ping){const e=await window.electronAPI.ping();return console.log("Ping result from main process:",e),e}else return console.log("Not running in Electron."),null}function B(e,a){const o=document.createElement("div");o.id="voice-loading-overlay",o.innerHTML=`
    <div id="voice-loading-card">
      <img id="voice-loading-logo" src="${e}" alt="HPG2 Logo" style="max-width: 440px; margin-bottom: 48px; margin-top: 0;" />
      <div id="voice-loading-spinner" style="display:none;"></div>
      <div id="voice-loading-title" style="display:none;"></div>
      <div id="voice-loading-subtitle"></div>
      <button id="voice-loading-load" class="voice-loading-btn" type="button">Load game</button>
      <button id="voice-loading-action" class="voice-loading-btn" type="button">New game</button>
    </div>
  `,document.body.appendChild(o),A();const g=document.createElement("style");g.textContent=`
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
  `,document.head.appendChild(g);const t=o.querySelector("#voice-loading-title"),l=o.querySelector("#voice-loading-subtitle"),r=o.querySelector("#voice-loading-action");let n=!1;async function i(){if(!n){n=!0,r.disabled=!0,t.textContent="Preparing narrator voice...",l.textContent="Please wait while audio is being initialized.";try{if(h()&&window.electronAPI&&window.electronAPI.loadGamePage){await window.electronAPI.loadGamePage();return}o.remove(),g.remove(),await a()}catch{n=!1,r.disabled=!1,t.textContent="Unable to initialize narrator voice.",l.textContent="Press the button again to retry audio unlock."}}}r.addEventListener("click",i),t.style.display=""}document.addEventListener("DOMContentLoaded",()=>{B("/img/HPG2_logo.png",async()=>{})});const m=[getComputedStyle(document.documentElement).getPropertyValue("--c-blue").trim(),getComputedStyle(document.documentElement).getPropertyValue("--c-red").trim(),getComputedStyle(document.documentElement).getPropertyValue("--c-orange").trim(),getComputedStyle(document.documentElement).getPropertyValue("--c-yellow").trim(),getComputedStyle(document.documentElement).getPropertyValue("--c-green").trim()];function w(e){const a=String(e).trim().replace(/^#/,""),o=parseInt(a,16);return{r:o>>16&255,g:o>>8&255,b:o&255}}let p=null,d=w(m[1]),b=2%m.length,s=0;const M=.02;window.fastSkipEnabled=!1;const E="hpg2-dialogue-audio-enabled",S="hpg2-color-option-enabled",I="hpg2-fast-skip-enabled";function T(){try{return localStorage.getItem(S)==="true"}catch{return!1}}function v(e){try{localStorage.setItem(S,String(e))}catch{}}function z(){try{return localStorage.getItem(I)==="true"}catch{return!1}}function F(e){try{localStorage.setItem(I,String(e))}catch{}}window.fastSkipEnabled=z();function N(){try{return localStorage.getItem(E)==="true"}catch{return!1}}function H(e){try{localStorage.setItem(E,String(e))}catch{}}window.dialogueAudioEnabled=N();function k(){const e=w(m[b]);Math.round(d.r+(e.r-d.r)*s),Math.round(d.g+(e.g-d.g)*s),Math.round(d.b+(e.b-d.b)*s),s+=M,s>=1&&(s=0,d=e,b=(b+1)%m.length)}function D(e){e&&e.stopPropagation();const a=document.getElementById("color-btn");p?(clearInterval(p),p=null,c(a,"Change color",!1),v(!1)):(p=setInterval(k,50),c(a,"Change color",!0),v(!0))}function c(e,a,o){e.innerHTML=`<span class="settings-option-label">${a}</span><span class="settings-option-sep">: </span><span class="settings-option-state ${o?"is-on":"is-off"}">${o?"ON":"OFF"}</span>`}document.getElementById("color-btn").addEventListener("click",D);function _(e){e&&e.stopPropagation();const a=document.getElementById("fast-skip-btn");window.fastSkipEnabled=!window.fastSkipEnabled,c(a,"Fast skip",window.fastSkipEnabled),F(window.fastSkipEnabled)}document.getElementById("fast-skip-btn").addEventListener("click",_);const u=document.getElementById("audio-toggle-btn"),j='<svg class="audio-icon" viewBox="0 0 24 24" aria-hidden="true"><polygon points="3,10 7,10 12,6 12,18 7,14 3,14"></polygon><path d="M16 9 C18 10.5,18 13.5,16 15"></path><path d="M18.8 6.5 C22.2 9.3,22.2 14.7,18.8 17.5"></path></svg>',q='<svg class="audio-icon" viewBox="0 0 24 24" aria-hidden="true"><polygon points="3,10 7,10 12,6 12,18 7,14 3,14"></polygon><line x1="5" y1="5" x2="19" y2="19"></line></svg>';function C(){const e=!!window.dialogueAudioEnabled;u.innerHTML=e?j:q,u.title=`Audio: ${e?"ON":"OFF"}`,u.setAttribute("aria-label",`Audio: ${e?"ON":"OFF"}`)}function G(e){e&&e.stopPropagation(),window.dialogueAudioEnabled=!window.dialogueAudioEnabled,H(window.dialogueAudioEnabled),C()}u.addEventListener("click",G);C();const L=document.getElementById("settings-btn"),f=document.getElementById("settings-menu"),P=document.getElementById("settings-overlay");function y(e){f.classList.toggle("show",e),P.classList.toggle("show",e)}L.addEventListener("click",()=>{const e=!f.classList.contains("show");y(e)});P.addEventListener("click",()=>{y(!1)});document.addEventListener("click",e=>{f.classList.contains("show")&&!f.contains(e.target)&&e.target!==L&&e.target!==u&&y(!1)});const x=document.getElementById("color-btn");T()?(p=setInterval(k,50),c(x,"Change color",!0)):c(x,"Change color",!1);const V=document.getElementById("fast-skip-btn");c(V,"Fast skip",window.fastSkipEnabled);const Y=document.getElementById("voice-loading-card");O(window,Y);document.getElementById("voice-loading-action").addEventListener("click",function(){sessionStorage.setItem("fromStartMenu","1"),sessionStorage.removeItem("mainChara"),sessionStorage.removeItem("saveFile"),sessionStorage.removeItem("startYear"),window.location.href="hpg2-main.html"});document.getElementById("voice-loading-load").addEventListener("click",async function(){let e=document.createElement("div");e.id="loadgame-overlay",e.style.position="fixed",e.style.inset="0",e.style.background="rgba(8,8,16,0.85)",e.style.zIndex="6000",e.style.display="flex",e.style.alignItems="center",e.style.justifyContent="center",e.innerHTML=`<div id="loadgame-box" style="background:rgb(20,20,30);border-radius:12px;padding:28px 24px;min-width:320px;max-width:90vw;box-shadow:0 0 20px #000;border:2px solid #444;position:relative;">
        <div style='font-size:18px;margin-bottom:12px;font-family:monospace;color:#e8e8f0;'>Select a save file</div>
        <div id="loadgame-list"></div>
      </div>`,document.body.appendChild(e),e.addEventListener("mousedown",function(t){t.target===e&&e.remove()});const a=e.querySelector("#loadgame-list");let o=null;fetch("scripts/savelist.json").then(t=>t.json()).then(t=>{if(!Array.isArray(t)||!t.length){a.innerHTML='<div style="color:#bbb;">No save files found.</div>';return}function l(){a.innerHTML="",t.forEach(r=>{const n=document.createElement("button");n.textContent=r,n.style.display="block",n.style.width="100%",n.style.margin="6px 0",n.style.padding="10px",n.style.fontFamily="monospace",n.style.fontSize="15px",n.style.background=o===r?"#282860":"#282830",n.style.color=o===r?"#fff":"#e8e8f0",n.style.border=o===r?"2px solid #b4b4dc":"2px solid #444",n.style.borderRadius="8px",n.style.cursor="pointer",n.addEventListener("click",i=>{i.stopPropagation(),o=r,l(),g()}),a.appendChild(n)})}l()}).catch(()=>{a.innerHTML='<div style="color:#bbb;">No save files found.</div>'});function g(){let t=document.createElement("div");t.style.position="fixed",t.style.left="0",t.style.top="0",t.style.width="100vw",t.style.height="100vh",t.style.background="rgba(0,0,0,0.25)",t.style.display="flex",t.style.alignItems="center",t.style.justifyContent="center",t.style.zIndex="7000",t.innerHTML=`<div style='background:rgb(30,30,40);padding:32px 28px;border-radius:12px;box-shadow:0 0 16px #000;border:2px solid #888;min-width:220px;text-align:center;'>
          <div style='font-size:16px;margin-bottom:18px;color:#e8e8f0;font-family:monospace;'>Confirm choice?</div>
          <button id='loadgame-yes' style='margin:0 12px 0 0;padding:8px 18px;border-radius:8px;border:2px solid #444;background:#282830;color:#fff;font-family:monospace;font-size:15px;cursor:pointer;'>Yes</button>
          <button id='loadgame-no' style='padding:8px 18px;border-radius:8px;border:2px solid #444;background:#282830;color:#fff;font-family:monospace;font-size:15px;cursor:pointer;'>No</button>
        </div>`,document.body.appendChild(t),t.addEventListener("mousedown",function(l){l.target===t&&t.remove()}),t.querySelector("#loadgame-no").addEventListener("click",function(){t.remove()}),t.querySelector("#loadgame-yes").addEventListener("click",async function(){t.remove();try{const r=await(await fetch("saves/"+o)).json();let n=Number(r.year);if(n===7){let i=document.createElement("div");i.style.position="fixed",i.style.left="0",i.style.top="0",i.style.width="100vw",i.style.height="100vh",i.style.background="rgba(0,0,0,0.25)",i.style.display="flex",i.style.alignItems="center",i.style.justifyContent="center",i.style.zIndex="8000",i.innerHTML=`<div style='background:rgb(30,30,40);padding:32px 28px;border-radius:12px;box-shadow:0 0 16px #000;border:2px solid #888;min-width:220px;text-align:center;'>
                <div style='font-size:16px;margin-bottom:18px;color:#e8e8f0;font-family:monospace;'>Game ended</div>
                <button id='ended-ok' style='padding:8px 18px;border-radius:8px;border:2px solid #444;background:#282830;color:#fff;font-family:monospace;font-size:15px;cursor:pointer;'>OK</button>
              </div>`,document.body.appendChild(i),i.querySelector("#ended-ok").addEventListener("click",function(){i.remove()});return}sessionStorage.setItem("saveFile",o),sessionStorage.setItem("fromStartMenu","1"),sessionStorage.setItem("startYear",String(n+1)),sessionStorage.setItem("mainChara",JSON.stringify(r)),e.remove(),window.location.href="hpg2-main.html"}catch{alert("Errore nel caricamento del file di salvataggio."),e.remove()}})}});
