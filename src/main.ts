
import { Wheel } from './wheel_magic/Wheel';
import { startStory } from './story/story';
import { getCharacterInfoRows } from './characters/maincharacter';

document.addEventListener('DOMContentLoaded', () => {
  const output = document.getElementById('game-output')!;
  const input = document.getElementById('player-input') as HTMLInputElement;
  const nextBtn = document.getElementById('next-btn') as HTMLButtonElement;
  const spinBtn = document.getElementById('spin-btn') as HTMLButtonElement;
  const wheelArea = document.getElementById('wheel-area') as HTMLElement;

  (window as any).output = output;
  (window as any).input = input;
  (window as any).nextBtn = nextBtn;
  (window as any).spinBtn = spinBtn;

  // Nascondi subito tutta l'area della ruota
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

  // Avvia il gioco
  startStory();
});