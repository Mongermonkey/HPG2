import { stopDialogueAudio } from './utilities/talkify_audio';

import { Wheel } from './utilities/_index';
import { startStory } from './story/story';
import { getCharacterInfoRows } from './basis/_index';
import { ensureDialogueVoiceReady, unlockDialogueAudioFromGesture } from './utilities/talkify_audio';

document.addEventListener('DOMContentLoaded', async () => {
  window.addEventListener('beforeunload', () => {
    try { stopDialogueAudio(); } catch {}
  });
  const output = document.getElementById('game-output')!;
  const input = document.getElementById('player-input') as HTMLInputElement;
  const nextBtn = document.getElementById('next-btn') as HTMLButtonElement;
  const spinBtn = document.getElementById('spin-btn') as HTMLButtonElement;
  const wheelArea = document.getElementById('wheel-area') as HTMLElement;

  const loadingOverlay = document.createElement('div');
  loadingOverlay.id = 'voice-loading-overlay';
  loadingOverlay.innerHTML = `
    <div id="voice-loading-card">
      <img id="voice-loading-logo" src="src/assets/img/HPG2_logo.png" alt="HPG2 Logo" style="max-width: 440px; margin-bottom: 48px; margin-top: 0;" />
      <div id="voice-loading-spinner" style="display:none;"></div>
      <div id="voice-loading-title" style="display:none;">Loading...</div>
      <div id="voice-loading-subtitle"></div>
      <button id="voice-loading-action" type="button">Start</button>
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

    #voice-loading-action {
      padding: 8px 14px;
      background-color: rgb(40, 40, 48);
      color: rgb(232, 232, 240);
      border: 2px solid rgb(80, 80, 88);
      border-radius: 8px;
      cursor: pointer;
      font-family: monospace;
      margin-top: auto;
    }

    #voice-loading-action:hover,
    #voice-loading-action:focus,
    #voice-loading-action:focus-visible {
      outline: none;
      border-color: rgb(180, 180, 220);
      box-shadow: 0 0 5px rgb(180, 180, 220);
    }

    #voice-loading-action:disabled {
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

  const startWhenVoiceReady = async () => {
    if (startupInProgress) return;
    startupInProgress = true;
    loadingAction.disabled = true;
    loadingTitle.textContent = 'Preparing narrator voice...';
    loadingSubtitle.textContent = 'Please wait while audio is being initialized.';

    unlockDialogueAudioFromGesture();

    try
    {
      await ensureDialogueVoiceReady();
      loadingOverlay.remove();
      loadingStyle.remove();
      startStory();
    }
    catch
    {
      startupInProgress = false;
      loadingAction.disabled = false;
      loadingTitle.textContent = 'Unable to initialize narrator voice.';
      loadingSubtitle.textContent = 'Press the button again to retry audio unlock.';
    }
  };

  loadingAction.addEventListener('click', startWhenVoiceReady);

  (window as any).output = output;
  (window as any).input = input;
  (window as any).nextBtn = nextBtn;
  (window as any).spinBtn = spinBtn;

  // Hide the entire wheel area immediately
  if (wheelArea) wheelArea.style.visibility = 'hidden';

  const myWheel = new Wheel('canvas');
  (window as any).myWheel = myWheel;

  const showCharacterBtn = document.createElement('button');
  showCharacterBtn.id = 'show-character-btn';
  showCharacterBtn.type = 'button';
  showCharacterBtn.title = 'Show character';
  showCharacterBtn.textContent = '📜';

  const showCharacterControl = document.createElement('div');
  showCharacterControl.id = 'show-character-control';

  const extendedViewToggle = document.createElement('input');
  extendedViewToggle.id = 'character-extended-toggle';
  extendedViewToggle.type = 'checkbox';
  extendedViewToggle.title = 'Show extended view';
  extendedViewToggle.checked = false;

  showCharacterControl.appendChild(showCharacterBtn);
  showCharacterControl.appendChild(extendedViewToggle);

  const characterOverlay = document.createElement('div');
  characterOverlay.id = 'character-popup-overlay';

  const characterPopup = document.createElement('aside');
  characterPopup.id = 'character-popup';

  const characterPopupOutput = document.createElement('div');
  characterPopupOutput.id = 'character-popup-output';

  characterPopup.appendChild(characterPopupOutput);
  characterOverlay.appendChild(characterPopup);
  document.body.appendChild(showCharacterControl);
  document.body.appendChild(characterOverlay);

  const isObjectLike = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null;
  };

  const formatPrimitive = (value: unknown, quoteStrings: boolean): string => {
    if (typeof value === 'string') return quoteStrings ? `"${value}"` : value;
    if (value === null) return 'null';
    return String(value);
  };

  const renderJsonNode = (key: string, value: unknown, depth: number, quoteStrings: boolean): HTMLElement => {
    const row = document.createElement('div');
    row.className = 'json-row';
    row.style.setProperty('--json-depth', String(depth));

    if (!isObjectLike(value))
    {
      const keySpan = document.createElement('span');
      keySpan.className = 'json-key';
      keySpan.textContent = key;

      const sep = document.createElement('span');
      sep.className = 'json-sep';
      sep.textContent = ': ';

      const valueSpan = document.createElement('span');
      valueSpan.className = 'json-value';
      valueSpan.textContent = formatPrimitive(value, quoteStrings);

      row.appendChild(keySpan);
      row.appendChild(sep);
      row.appendChild(valueSpan);
      return row;
    }

    const details = document.createElement('details');
    details.className = 'json-node';
    details.open = false;

    const summary = document.createElement('summary');
    const keySpan = document.createElement('span');
    keySpan.className = 'json-key';
    keySpan.textContent = key;

    const sep = document.createElement('span');
    sep.className = 'json-sep';
    sep.textContent = ': ';

    const typeSpan = document.createElement('span');
    typeSpan.className = 'json-brace';
    if (Array.isArray(value)) typeSpan.textContent = `[${value.length}]`;
    else typeSpan.textContent = '{...}';

    summary.appendChild(keySpan);
    summary.appendChild(sep);
    summary.appendChild(typeSpan);
    details.appendChild(summary);

    const childrenContainer = document.createElement('div');
    childrenContainer.className = 'json-children';

    const entries = Array.isArray(value)
      ? value.map((entry, index) => [String(index), entry] as const)
      : Object.entries(value);

    if (entries.length === 0)
    {
      const emptyRow = document.createElement('div');
      emptyRow.className = 'json-row json-empty';
      emptyRow.textContent = Array.isArray(value) ? '[]' : '{}';
      childrenContainer.appendChild(emptyRow);
    }
    else
    {
      for (const [childKey, childValue] of entries)
      {
        childrenContainer.appendChild(renderJsonNode(childKey, childValue, depth + 1, quoteStrings));
      }
    }

    details.appendChild(childrenContainer);
    row.appendChild(details);
    return row;
  };

  const renderCharacterTree = (character: unknown, extendedView: boolean): void => {
    characterPopupOutput.innerHTML = '';
    const quoteStrings = extendedView;

    if (!isObjectLike(character))
    {
      characterPopupOutput.textContent = 'Character not available yet.';
      return;
    }

    const rows = getCharacterInfoRows(character as any, !extendedView);
    for (const row of rows)
    {
      if (row.key === null)
      {
        const headingRow = document.createElement('div');
        headingRow.className = 'json-row json-character-title';
        headingRow.textContent = String(row.value);
        characterPopupOutput.appendChild(headingRow);
        continue;
      }

      characterPopupOutput.appendChild(renderJsonNode(row.key, row.value, 0, quoteStrings));
    }
  };

  const updateCharacterPopup = () => {
    const currentCharacter = (window as any).currentCharacter;
    if (!currentCharacter)
    {
      characterPopupOutput.textContent = 'Character not available yet.';
      return;
    }

    renderCharacterTree(currentCharacter, extendedViewToggle.checked);
  };

  const openCharacterPopup = () => {
    updateCharacterPopup();
    characterOverlay.classList.add('open');
  };

  const closeCharacterPopup = () => {
    characterOverlay.classList.remove('open');
  };

  showCharacterBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    if (characterOverlay.classList.contains('open'))
    {
      closeCharacterPopup();
      return;
    }
    openCharacterPopup();
  });

  document.addEventListener('mousedown', (event) => {
    if (!characterOverlay.classList.contains('open')) return;
    const target = event.target as Node;
    if (!characterPopup.contains(target) && !showCharacterControl.contains(target))
    {
      closeCharacterPopup();
    }
  });

  // Game startup is explicitly gated by loadingAction until voice is ready.
});