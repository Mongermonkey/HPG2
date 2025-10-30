import { animateText } from "../visual_magic/dust_animation";

let current_msg = 0;

/**
 * Aggiorna l'interfaccia per mostrare un nuovo output testuale.
 * @param text Testo dell'evento da mostrare
 */
export async function showText(text: string | null)
{
  const output = (window as any).output as HTMLElement;
  const input = (window as any).input as HTMLInputElement;
  output.innerHTML = "";
  input.value = "";
  input.focus();

  if (!text) return;

  // Incremento il token per questa animazione
  const myToken = ++current_msg;

  for (let i = 0; i < text.length; i++)
  {
    // Se è partita una nuova showText, interrompo questa
    if (myToken !== current_msg) return;

    output.innerHTML += text[i] === "\n" ? "<br>" : text[i];
    const delay = text[i] === "\n" ? 36 : 18;

    await new Promise(res => setTimeout(res, delay));
  }
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
      if (e.key === "Enter")
      {
        const playerText = input.value.trim();
        if (playerText)
        {
          input.removeEventListener("keydown", onInput);

          // Svuota l'input e anima il testo inserito dall'utente
          input.value = "";
          animateText(playerText, input);

          resolve(playerText);
        }
      }
    }
    input.addEventListener("keydown", onInput);
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
      nextBtn.removeEventListener("click", onNext);

      // Cancella il contenuto di wheel-output
      const wheelOutput = document.getElementById("wheel-output") as HTMLElement;
      if (wheelOutput) wheelOutput.textContent = "";

      resolve();
    };
    nextBtn.addEventListener("click", onNext);
    nextBtn.disabled = false;
    nextBtn.focus();
  });
}