// Overlay di caricamento voce/narratore
export function createVoiceLoadingOverlay(LOGO_PATH: string, onStart: () => Promise<void>) {
  const loadingOverlay = document.createElement('div');
  loadingOverlay.id = 'voice-loading-overlay';
  loadingOverlay.innerHTML = `
    <div id="voice-loading-card">
      <img id="voice-loading-logo" src="${LOGO_PATH}" alt="HPG2 Logo" style="max-width: 440px; margin-bottom: 48px; margin-top: 0;" />
      <div id="voice-loading-spinner" style="display:none;"></div>
      <div id="voice-loading-title" style="display:none;"></div>
      <div id="voice-loading-subtitle"></div>
      <button id="voice-loading-load" class="voice-loading-btn" type="button">Load game</button>
      <button id="voice-loading-action" class="voice-loading-btn" type="button">New game</button>
    </div>
  `;
  document.body.appendChild(loadingOverlay);

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
  let startupInProgress = false;

  async function start() {
    if (startupInProgress) return;
    startupInProgress = true;
    loadingAction.disabled = true;
    loadingTitle.textContent = 'Preparing narrator voice...';
    loadingSubtitle.textContent = 'Please wait while audio is being initialized.';
    try {
      await onStart();
      loadingOverlay.remove();
      loadingStyle.remove();
    } catch {
      startupInProgress = false;
      loadingAction.disabled = false;
      loadingTitle.textContent = 'Unable to initialize narrator voice.';
      loadingSubtitle.textContent = 'Press the button again to retry audio unlock.';
    }
  }
  loadingAction.addEventListener('click', start);
  loadingTitle.style.display = '';
}
