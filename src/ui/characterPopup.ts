import { getCharacterInfoRows } from '../basis/_index';

export function setupCharacterPopup(windowObj: any, targetContainer?: HTMLElement)
{
  // Crea il contenitore dei bottoni character info/salva
  const showCharacterControl = document.createElement('div');
  showCharacterControl.id = 'show-character-control';
  showCharacterControl.style.display = 'flex';
  showCharacterControl.style.alignItems = 'center';
  showCharacterControl.style.gap = '8px';

  // Bottone info personaggio
  const showCharacterBtn = document.createElement('button');
  showCharacterBtn.id = 'show-character-btn';
  showCharacterBtn.type = 'button';
  showCharacterBtn.title = 'Show character';
  showCharacterBtn.style.position = 'relative';
  // Crea la stellina come span figlio, sopra l'icona (non sopra il bottone)
  const starSpan = document.createElement('span');
  starSpan.id = 'character-info-star';
  starSpan.textContent = '✦';
  starSpan.style.position = 'absolute';
  starSpan.style.top = '5px';
  starSpan.style.right = '5px';
  starSpan.style.fontSize = '10px';
  starSpan.style.lineHeight = '1';
  // La stellina segue la logica di stato (colore) e controlla il toggle
  starSpan.style.pointerEvents = 'auto';
  starSpan.style.cursor = 'pointer';
  starSpan.addEventListener('click', (e) => {
    e.stopPropagation();
    extendedViewToggle.checked = !extendedViewToggle.checked;
    updateStarState();
  });
  starSpan.style.userSelect = 'none';
  starSpan.style.zIndex = '9999';
  starSpan.style.transition = 'color 0.2s, text-shadow 0.2s';
  // Colore iniziale
  starSpan.style.color = 'rgb(255, 233, 160)';
  starSpan.style.textShadow = '0 0 4px rgba(255, 233, 160, 0.45)';

  // Inserisci la stellina PRIMA dell'icona
  showCharacterBtn.appendChild(starSpan);
  showCharacterBtn.appendChild(document.createTextNode('📜'));

  // Bottone salvataggio personaggio
  const saveCharacterBtn = document.createElement('button');
  saveCharacterBtn.id = 'save-character-btn';
  saveCharacterBtn.type = 'button';
  saveCharacterBtn.title = 'Save character';
  // Usa SVG calderone con freccia
  saveCharacterBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;">
    <path d="M16 6v12" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M12 14l4 4 4-4" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6 26 Q16 30 26 26" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
  </svg>`;
  // Uniforma stile al bottone info
  saveCharacterBtn.style.padding = '8px 12px';
  saveCharacterBtn.style.backgroundColor = 'rgb(40, 40, 48)';
  saveCharacterBtn.style.color = 'rgb(232, 232, 240)';
  saveCharacterBtn.style.border = '2px solid rgb(80, 80, 88)'; // stesso colore del bottone info
  saveCharacterBtn.style.borderRadius = '8px';
  saveCharacterBtn.style.cursor = 'pointer';
  saveCharacterBtn.style.fontSize = '20px';
  saveCharacterBtn.style.height = '38px';
  saveCharacterBtn.style.lineHeight = '22px';
  saveCharacterBtn.style.letterSpacing = '0.08em';
  saveCharacterBtn.style.transition = 'background 0.2s, border 0.2s';
  saveCharacterBtn.addEventListener('mouseenter', () => {
    saveCharacterBtn.style.backgroundColor = 'rgb(40, 40, 48)';
    saveCharacterBtn.style.borderColor = 'rgb(180, 180, 220)';
    saveCharacterBtn.style.boxShadow = '0 0 5px rgb(180, 180, 220)';
  });
  saveCharacterBtn.addEventListener('mouseleave', () => {
    saveCharacterBtn.style.backgroundColor = 'rgb(40, 40, 48)';
    saveCharacterBtn.style.borderColor = 'rgb(80, 80, 88)';
    saveCharacterBtn.style.boxShadow = 'none';
  });

  // Toggle vista estesa
  const extendedViewToggle = document.createElement('input');
  extendedViewToggle.id = 'character-extended-toggle';
  extendedViewToggle.type = 'checkbox';
  extendedViewToggle.title = 'Show extended view';
  extendedViewToggle.checked = false;

  // Ordine: info | salva | toggle
  showCharacterControl.appendChild(showCharacterBtn);
  showCharacterControl.appendChild(saveCharacterBtn);
  showCharacterControl.appendChild(extendedViewToggle);

  // Funzione per aggiornare la stellina in base allo stato del toggle
  function updateStarState() {
    if (extendedViewToggle.checked) {
      starSpan.style.color = 'rgb(180, 180, 220)';
      starSpan.style.textShadow = '0 0 5px rgba(180, 180, 220, 0.45)';
    } else {
      starSpan.style.color = 'rgb(255, 233, 160)';
      starSpan.style.textShadow = '0 0 4px rgba(255, 233, 160, 0.45)';
    }
  }
  extendedViewToggle.addEventListener('change', updateStarState);
  updateStarState();

  // Funzione per forzare download in cartella fissa
  function saveCharacterToFile(character: any)
  {
    let baseName = character?.name ? character.name.replace(/[^a-zA-Z0-9_-]/g, '_') : 'character';
    let defaultName = 'HPG2_' + baseName;

    // Overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.style.position = 'fixed';
    modalOverlay.style.inset = '0';
    modalOverlay.style.background = 'rgba(0,0,0,0.45)';
    modalOverlay.style.zIndex = '99999';
    modalOverlay.style.display = 'flex';
    modalOverlay.style.alignItems = 'center';
    modalOverlay.style.justifyContent = 'center';

    // Modale
    const modal = document.createElement('div');
    modal.style.background = 'rgb(28,28,38)';
    modal.style.border = '2px solid rgb(80,80,88)';
    modal.style.borderRadius = '10px';
    modal.style.padding = '28px 28px 18px 28px';
    modal.style.boxShadow = '0 2px 24px rgba(0,0,0,0.25)';
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.alignItems = 'center';
    modal.style.minWidth = '320px';
    modal.style.marginTop = '7vh';
    modalOverlay.style.alignItems = 'flex-start';

    const label = document.createElement('label');
    label.textContent = 'Save character as:';
    label.style.fontFamily = 'monospace';
    label.style.fontSize = '15px';
    label.style.color = 'rgb(232,232,240)';
    label.style.marginBottom = '12px';
    label.style.display = 'block';

    const inputWrap = document.createElement('div');
    inputWrap.style.display = 'flex';
    inputWrap.style.alignItems = 'center';
    inputWrap.style.marginBottom = '18px';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = defaultName;
    input.style.fontSize = '16px';
    input.style.padding = '6px 10px';
    input.style.border = '2px solid rgb(80,80,88)';
    input.style.borderRadius = '7px 0 0 7px';
    input.style.background = 'rgb(40,40,48)';
    input.style.color = 'rgb(232,232,240)';
    input.style.fontFamily = 'monospace';
    input.style.outline = 'none';
    input.style.width = '180px';

    const extSpan = document.createElement('span');
    extSpan.textContent = '.json';
    extSpan.style.fontSize = '16px';
    extSpan.style.background = 'rgb(40,40,48)';
    extSpan.style.color = 'rgb(180,180,220)';
    extSpan.style.border = '2px solid rgb(80,80,88)';
    extSpan.style.borderLeft = 'none';
    extSpan.style.borderRadius = '0 7px 7px 0';
    extSpan.style.padding = '6px 12px 6px 6px';
    extSpan.style.userSelect = 'none';

    inputWrap.appendChild(input);
    inputWrap.appendChild(extSpan);

    const btnWrap = document.createElement('div');
    btnWrap.style.display = 'flex';
    btnWrap.style.gap = '16px';

    const okBtn = document.createElement('button');
    okBtn.textContent = 'Save';
    okBtn.style.fontFamily = 'monospace';
    okBtn.style.fontSize = '15px';
    okBtn.style.padding = '7px 18px';
    okBtn.style.background = 'rgb(40,40,48)';
    okBtn.style.color = 'rgb(232,232,240)';
    okBtn.style.border = '2px solid rgb(80,80,88)';
    okBtn.style.borderRadius = '7px';
    okBtn.style.cursor = 'pointer';
    okBtn.style.marginTop = '4px';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.fontFamily = 'monospace';
    cancelBtn.style.fontSize = '15px';
    cancelBtn.style.padding = '7px 18px';
    cancelBtn.style.background = 'rgb(40,40,48)';
    cancelBtn.style.color = 'rgb(232,232,240)';
    cancelBtn.style.border = '2px solid rgb(80,80,88)';
    cancelBtn.style.borderRadius = '7px';
    cancelBtn.style.cursor = 'pointer';
    cancelBtn.style.marginTop = '4px';

    btnWrap.appendChild(okBtn);
    btnWrap.appendChild(cancelBtn);

    modal.appendChild(label);
    modal.appendChild(inputWrap);
    modal.appendChild(btnWrap);
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);

    function closeModal() {
      document.body.removeChild(modalOverlay);
    }

    cancelBtn.onclick = () => closeModal();
    input.onkeydown = (e) => { if (e.key === 'Enter') okBtn.click(); };

    okBtn.onclick = () => {
      let filename = input.value.trim();
      if (!filename) {
        input.style.borderColor = 'red';
        input.focus();
        return;
      }
      filename = filename.replace(/\.[jJ][sS][oO][nN]$/, '');
      filename += '.json';
      closeModal();
      const json = JSON.stringify(character, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(a.href); }, 100);
    };

    input.focus();
    input.select();
  }

  saveCharacterBtn.addEventListener('click', () => {
    const currentCharacter = (windowObj as any).currentCharacter;
    if (!currentCharacter) return;
    saveCharacterToFile(currentCharacter);
  });

  const characterOverlay = document.createElement('div');
  characterOverlay.id = 'character-popup-overlay';

  const characterPopup = document.createElement('aside');
  characterPopup.id = 'character-popup';

  const characterPopupOutput = document.createElement('div');
  characterPopupOutput.id = 'character-popup-output';

  characterPopup.appendChild(characterPopupOutput);
  characterOverlay.appendChild(characterPopup);
  // Se viene passato un contenitore, inserisci lì i bottoni, altrimenti su body
  if (targetContainer) {
    targetContainer.appendChild(showCharacterControl);
  } else {
    document.body.appendChild(showCharacterControl);
  }
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

    if (!isObjectLike(value)) {
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

    if (entries.length === 0) {
      const emptyRow = document.createElement('div');
      emptyRow.className = 'json-row json-empty';
      emptyRow.textContent = Array.isArray(value) ? '[]' : '{}';
      childrenContainer.appendChild(emptyRow);
    } else {
      for (const [childKey, childValue] of entries) {
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

    if (!isObjectLike(character)) {
      characterPopupOutput.textContent = 'Character not available yet.';
      return;
    }

    const rows = getCharacterInfoRows(character as any, !extendedView);
    for (const row of rows) {
      if (row.key === null) {
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
    const currentCharacter = (windowObj as any).currentCharacter;
    if (!currentCharacter) {
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
    if (characterOverlay.classList.contains('open')) {
      closeCharacterPopup();
      return;
    }
    openCharacterPopup();
  });

  document.addEventListener('mousedown', (event) => {
    if (!characterOverlay.classList.contains('open')) return;
    const target = event.target as Node;
    if (!characterPopup.contains(target) && !showCharacterControl.contains(target)) {
      closeCharacterPopup();
    }
  });
}

export function saveCharacterToFile(character: any)
{
  let baseName = character?.name ? character.name.replace(/[^a-zA-Z0-9_-]/g, '_') : 'character';
  let defaultName = 'HPG2_' + baseName;

  // Overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.style.position = 'fixed';
  modalOverlay.style.inset = '0';
  modalOverlay.style.background = 'rgba(0,0,0,0.45)';
  modalOverlay.style.zIndex = '99999';
  modalOverlay.style.display = 'flex';
  modalOverlay.style.alignItems = 'center';
  modalOverlay.style.justifyContent = 'center';

  // Modale
  const modal = document.createElement('div');
  modal.style.background = 'rgb(28,28,38)';
  modal.style.border = '2px solid rgb(80,80,88)';
  modal.style.borderRadius = '10px';
  modal.style.padding = '28px 28px 18px 28px';
  modal.style.boxShadow = '0 2px 24px rgba(0,0,0,0.25)';
  modal.style.display = 'flex';
  modal.style.flexDirection = 'column';
  modal.style.alignItems = 'center';
  modal.style.minWidth = '320px';
  modal.style.marginTop = '7vh';
  modalOverlay.style.alignItems = 'flex-start';

  const label = document.createElement('label');
  label.textContent = 'Save character as:';
  label.style.fontFamily = 'monospace';
  label.style.fontSize = '15px';
  label.style.color = 'rgb(232,232,240)';
  label.style.marginBottom = '12px';
  label.style.display = 'block';

  const inputWrap = document.createElement('div');
  inputWrap.style.display = 'flex';
  inputWrap.style.alignItems = 'center';
  inputWrap.style.marginBottom = '18px';

  const input = document.createElement('input');
  input.type = 'text';
  input.value = defaultName;
  input.style.fontSize = '16px';
  input.style.padding = '6px 10px';
  input.style.border = '2px solid rgb(80,80,88)';
  input.style.borderRadius = '7px 0 0 7px';
  input.style.background = 'rgb(40,40,48)';
  input.style.color = 'rgb(232,232,240)';
  input.style.fontFamily = 'monospace';
  input.style.outline = 'none';
  input.style.width = '180px';

  const extSpan = document.createElement('span');
  extSpan.textContent = '.json';
  extSpan.style.fontSize = '16px';
  extSpan.style.background = 'rgb(40,40,48)';
  extSpan.style.color = 'rgb(180,180,220)';
  extSpan.style.border = '2px solid rgb(80,80,88)';
  extSpan.style.borderLeft = 'none';
  extSpan.style.borderRadius = '0 7px 7px 0';
  extSpan.style.padding = '6px 12px 6px 6px';
  extSpan.style.userSelect = 'none';

  inputWrap.appendChild(input);
  inputWrap.appendChild(extSpan);

  const btnWrap = document.createElement('div');
  btnWrap.style.display = 'flex';
  btnWrap.style.gap = '16px';

  const okBtn = document.createElement('button');
  okBtn.textContent = 'Save';
  okBtn.style.fontFamily = 'monospace';
  okBtn.style.fontSize = '15px';
  okBtn.style.padding = '7px 18px';
  okBtn.style.background = 'rgb(40,40,48)';
  okBtn.style.color = 'rgb(232,232,240)';
  okBtn.style.border = '2px solid rgb(80,80,88)';
  okBtn.style.borderRadius = '7px';
  okBtn.style.cursor = 'pointer';
  okBtn.style.marginTop = '4px';

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.style.fontFamily = 'monospace';
  cancelBtn.style.fontSize = '15px';
  cancelBtn.style.padding = '7px 18px';
  cancelBtn.style.background = 'rgb(40,40,48)';
  cancelBtn.style.color = 'rgb(232,232,240)';
  cancelBtn.style.border = '2px solid rgb(80,80,88)';
  cancelBtn.style.borderRadius = '7px';
  cancelBtn.style.cursor = 'pointer';
  cancelBtn.style.marginTop = '4px';

  btnWrap.appendChild(okBtn);
  btnWrap.appendChild(cancelBtn);

  modal.appendChild(label);
  modal.appendChild(inputWrap);
  modal.appendChild(btnWrap);
  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);

  function closeModal() {
    document.body.removeChild(modalOverlay);
  }

  cancelBtn.onclick = () => closeModal();
  input.onkeydown = (e) => { if (e.key === 'Enter') okBtn.click(); };

  okBtn.onclick = () => {
    let filename = input.value.trim();
    if (!filename) {
      input.style.borderColor = 'red';
      input.focus();
      return;
    }
    filename = filename.replace(/\.[jJ][sS][oO][nN]$/, '');
    filename += '.json';
    closeModal();
    const json = JSON.stringify(character, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(a.href); }, 100);
  };

  input.focus();
  input.select();
}