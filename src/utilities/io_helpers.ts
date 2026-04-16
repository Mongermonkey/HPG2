/**
 * Funzioni di supporto per input e output testuale:
 * - Visualizzazione testo (showText)
 * - Gestione input utente (handleInput)
 * - Gestione avanzamento eventi (nextEvent)
 */

import { animateText } from "./visual_magic/dust_animation";

let current_msg = 0;

/**
 * Aggiorna l'interfaccia per mostrare un nuovo output testuale.
 * @param text Testo dell'evento da mostrare
 * @param waitForNext Se true, attende il click su "Avanti" al termine del testo
 */
export async function showText(text: string | null, waitForNext: boolean = true)
{
  const output = (window as any).output as HTMLElement;
  const input = (window as any).input as HTMLInputElement;
  const nextBtn = (window as any).nextBtn as HTMLButtonElement;
  const isFastSkipEnabled = Boolean((window as any).fastSkipEnabled);
  output.innerHTML = "";
  input.value = "";
  nextBtn.disabled = !(waitForNext && isFastSkipEnabled);
  if (waitForNext) nextBtn.focus();

  if (!text)
  {
    if (waitForNext) nextBtn.disabled = false;
    return;
  }

  // Incremento il token per questa animazione
  const myToken = ++current_msg;
  let skipSignal: (() => void) | null = null;
  const skipPromise = new Promise<void>((resolve) => {
    skipSignal = resolve;
  });

  const onFastSkip = () => {
    if (!isFastSkipEnabled || !waitForNext) return;
    if (myToken !== current_msg) return;

    // Interrompe immediatamente il dialogo corrente e lascia spazio al successivo.
    current_msg++;
    output.innerHTML = "";
    nextBtn.removeEventListener('click', onFastSkip);
    if (skipSignal) skipSignal();
  };

  if (isFastSkipEnabled && waitForNext)
  {
    nextBtn.addEventListener('click', onFastSkip);
  }

  for (let i = 0; i < text.length; i++)
  {
    // Se è partita una nuova showText, interrompo questa
    if (myToken !== current_msg)
    {
      nextBtn.removeEventListener('click', onFastSkip);
      return;
    }

    output.innerHTML += text[i] === "\n" ? "<br>" : text[i];
    const delay = text[i] === "\n" ? 36 : 18;

    await Promise.race([
      new Promise<void>(res => setTimeout(res, delay)),
      skipPromise
    ]);
  }

  nextBtn.removeEventListener('click', onFastSkip);

  // Se il messaggio è stato skippato durante la scrittura, esce subito.
  if (myToken !== current_msg) return;

  if (waitForNext) await nextEvent();
}

/**
 * Attende e restituisce l'input del giocatore (quando preme Enter).
 * @returns Promise<string>
 */
export function handleInput(): Promise<string>
{
  return new Promise((resolve) => {
    const input = (window as any).input as HTMLInputElement;
    function onInput(e: KeyboardEvent)
    {
      if (e.key === 'Enter')
      {
        const playerText = input.value.trim();
        if (playerText)
        {
          input.removeEventListener('keydown', onInput);

          // Svuota l'input e anima il testo inserito dall'utente
          input.value = "";
          animateText(playerText, input);

          resolve(playerText);
        }
      }
    }
    input.addEventListener('keydown', onInput);
    input.focus();
  });
}

/**
 * Attende che l'utente prema il pulsante "Avanti" e poi risolve la Promise.
 * Cancella anche il contenuto di #wheel-output ogni volta che viene premuto.
 * @returns Promise<void>
 */
export function nextEvent(): Promise<void>
{
  return new Promise((resolve) => {
    const nextBtn = (window as any).nextBtn as HTMLButtonElement;
    const onNext = () => {
      nextBtn.removeEventListener('click', onNext);

      // Cancella il contenuto di wheel-output
      const wheelOutput = document.getElementById('wheel-output') as HTMLElement;
      if (wheelOutput) wheelOutput.textContent = '';

      resolve();
    };
    nextBtn.addEventListener('click', onNext);
    nextBtn.disabled = false;
    nextBtn.focus();
  });
}