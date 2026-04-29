
import { Wheel } from './utilities/_index';
import { startStory } from './story/story';
import { setupCharacterPopup } from './ui/characterPopup';
import { stopDialogueAudio } from './utilities/talkify_audio';
import { createVoiceLoadingOverlay } from './ui/voiceLoadingOverlay';
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

  (window as any).output = output;
  (window as any).input = input;
  (window as any).nextBtn = nextBtn;
  (window as any).spinBtn = spinBtn;

  if (wheelArea) wheelArea.style.visibility = 'hidden';
  const myWheel = new Wheel('canvas');
  (window as any).myWheel = myWheel;


  // Avvio diretto del gioco (senza overlay menù start)
  unlockDialogueAudioFromGesture();
  await ensureDialogueVoiceReady();
  let mainChara = undefined;
  try {
    const mainCharaStr = sessionStorage.getItem('mainChara');
    if (mainCharaStr) mainChara = JSON.parse(mainCharaStr);
  } catch {}
  startStory(mainChara);

  // Popup e controlli personaggio
  setupCharacterPopup(window);
});