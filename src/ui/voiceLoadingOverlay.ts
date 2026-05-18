import { testElectronPing } from '../utilities/testElectron';
import { isElectronPreload } from '../utilities/electronHelpers';
// Overlay di caricamento voce/narratore

export function createVoiceLoadingOverlay(LOGO_PATH: string | null, onStart: () => Promise<void>) {
  const loadingOverlay = document.createElement('div');
  loadingOverlay.id = 'voice-loading-overlay';
  loadingOverlay.innerHTML = `
    <div id="voice-loading-card">
      ${LOGO_PATH ? `<img id="voice-loading-logo" src="${LOGO_PATH}" alt="HPG2 Logo" />` : ''}
      <div id="voice-loading-spinner" style="display:none;"></div>
      <div id="voice-loading-title" style="display:none;"></div>
      <div id="voice-loading-subtitle"></div>
      <button id="voice-loading-load" class="voice-loading-btn" type="button">Load game</button>
      <button id="voice-loading-action" class="voice-loading-btn" type="button">New game</button>
    </div>
  `;

  document.body.appendChild(loadingOverlay);

  // Test: se siamo in Electron, ping dal preload
  testElectronPing();

  const loadingStyle = document.createElement('style');
  loadingStyle.textContent = `
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
  `;
  document.head.appendChild(loadingStyle);

  const loadingTitle = loadingOverlay.querySelector('#voice-loading-title') as HTMLDivElement;
  const loadingSubtitle = loadingOverlay.querySelector('#voice-loading-subtitle') as HTMLDivElement;
  const loadingAction = loadingOverlay.querySelector('#voice-loading-action') as HTMLButtonElement;
  const loadingLoad = loadingOverlay.querySelector('#voice-loading-load') as HTMLButtonElement;
  let startupInProgress = false;

  async function start() {
    if (startupInProgress) return;
    startupInProgress = true;
    loadingAction.disabled = true;
    loadingTitle.textContent = 'Preparing narrator voice...';
    loadingSubtitle.textContent = 'Please wait while audio is being initialized.';
    try {
      if (isElectronPreload() && window.electronAPI && window.electronAPI.loadGamePage) {
        await window.electronAPI.loadGamePage();
        return;
      }
      loadingOverlay.remove();
      loadingStyle.remove();
      await onStart();
    } catch {
      startupInProgress = false;
      loadingAction.disabled = false;
      loadingTitle.textContent = 'Unable to initialize narrator voice.';
      loadingSubtitle.textContent = 'Press the button again to retry audio unlock.';
    }
  }
  loadingAction.addEventListener('click', start);

  // Handler per il bottone "Load game" - mostra popup custom
  loadingLoad.addEventListener('click', async () => {
    if (startupInProgress) return;
    startupInProgress = true;
    loadingLoad.disabled = true;
    try {
      if (isElectronPreload() && window.electronAPI && window.electronAPI.listSaveFiles) {
        const files = await window.electronAPI.listSaveFiles();
        showSaveListPopup(files);
      }
    } finally {
      startupInProgress = false;
      loadingLoad.disabled = false;
    }
  });

  // Crea e mostra la finestra custom per la lista salvataggi
  function showSaveListPopup(files: string[]) {
    // Rimuovi eventuale popup precedente
    const oldPopup = document.getElementById('save-list-popup');
    if (oldPopup) oldPopup.remove();

    const popup = document.createElement('div');
    popup.id = 'save-list-popup';
    popup.style.position = 'fixed';
    popup.style.left = '0';
    popup.style.top = '0';
    popup.style.width = '100vw';
    popup.style.height = '100vh';
    popup.style.background = 'rgba(8,8,16,0.92)';
    popup.style.zIndex = '6000';
    popup.style.display = 'flex';
    popup.style.alignItems = 'center';
    popup.style.justifyContent = 'center';

    // Chiudi popup cliccando fuori dal card
    popup.addEventListener('mousedown', (e) => {
      if (e.target === popup) popup.remove();
    });

    const card = document.createElement('div');
    card.style.background = 'rgb(20,20,30)';
    card.style.border = '2px solid rgb(80,80,88)';
    card.style.borderRadius = '12px';
    card.style.padding = '28px 32px';
    card.style.minWidth = '320px';
    card.style.maxWidth = '90vw';
    card.style.boxShadow = '0 0 20px rgba(0,0,0,0.45)';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.alignItems = 'center';

    const title = document.createElement('div');
    title.textContent = 'Seleziona un salvataggio';
    title.style.fontSize = '18px';
    title.style.marginBottom = '18px';
    title.style.color = 'rgb(232,232,240)';
    title.style.fontFamily = 'monospace';
    card.appendChild(title);

    if (files.length === 0) {
      const empty = document.createElement('div');
      empty.textContent = 'Nessun salvataggio trovato.';
      empty.style.color = 'rgb(176,176,188)';
      empty.style.marginBottom = '12px';
      card.appendChild(empty);
    } else {
      const list = document.createElement('ul');
      list.style.listStyle = 'none';
      list.style.padding = '0';
      list.style.margin = '0 0 18px 0';
      list.style.width = '100%';
      files.forEach(file => {
        const li = document.createElement('li');
        li.style.marginBottom = '10px';
        const btn = document.createElement('button');
        btn.textContent = file;
        btn.className = 'voice-loading-btn';
        btn.style.width = '100%';
        btn.onclick = async () => {
          popup.remove();
          // Carica il file JSON dalla cartella saves tramite IPC
          if (isElectronPreload() && window.electronAPI && window.electronAPI.loadSaveFile) {
            try {
              const json = await window.electronAPI.loadSaveFile(file);
              if (json) {
                // Salva il json in sessionStorage e vai a hpg2-main.html
                sessionStorage.setItem('hpg2-resume-save', JSON.stringify(json));
                window.location.href = 'hpg2-main.html';
              }
            } catch (e) {
              alert('Errore nel caricamento del salvataggio: ' + e);
            }
          }
        };
        li.appendChild(btn);
        list.appendChild(li);
      });
      card.appendChild(list);
    }

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Annulla';
    closeBtn.className = 'voice-loading-btn';
    closeBtn.style.marginTop = '8px';
    closeBtn.onclick = () => popup.remove();
    card.appendChild(closeBtn);

    popup.appendChild(card);
    document.body.appendChild(popup);
  }

  loadingTitle.style.display = '';
}
