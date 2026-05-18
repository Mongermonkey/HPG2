
import { Wheel } from './utilities/_index';
import { startStory } from './story/story';
import { setupCharacterPopup } from './ui/characterPopup';
import { stopDialogueAudio } from './utilities/talkify_audio';
import { ensureDialogueVoiceReady, unlockDialogueAudioFromGesture } from './utilities/talkify_audio';

document.addEventListener('DOMContentLoaded', async () => {
  const output = document.getElementById('game-output');
  setTimeout(() => {
    const input = document.getElementById('player-input') as HTMLInputElement;
    if (input) {
      input.focus();
      input.addEventListener('keydown', (e) => {
        console.log('[HPG2] keydown su input:', e.key, input.value);
      });
    } else {
      console.warn('[HPG2] input non trovato');
    }
  }, 500);


  // RESET: svuota sessionStorage e localStorage per forzare nuova partita
  sessionStorage.clear();
  localStorage.clear();
  window.addEventListener('beforeunload', () => {
    try { stopDialogueAudio(); } catch {}
  });

  // Inizializza riferimenti DOM e oggetti globali

  // output già dichiarato sopra per debug
  const input = document.getElementById('player-input');
  const nextBtn = document.getElementById('next-btn');
  const spinBtn = document.getElementById('spin-btn');
  const wheelArea = document.getElementById('wheel-area');

  (window as any).output = output;
  (window as any).input = input;
  (window as any).nextBtn = nextBtn;
  (window as any).spinBtn = spinBtn;

  if (wheelArea) wheelArea.style.visibility = 'hidden';
  const myWheel = new Wheel('canvas');
  (window as any).myWheel = myWheel;

  // Avvia direttamente la logica di gioco

  unlockDialogueAudioFromGesture();
  await ensureDialogueVoiceReady();
  await startStory();
  setupCharacterPopup(window);
});