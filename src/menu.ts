// Logica menu principale per start.html
import { createVoiceLoadingOverlay } from './ui/voiceLoadingOverlay';
import { isElectronPreload } from './utilities/electronHelpers';

document.addEventListener('DOMContentLoaded', () => {
  createVoiceLoadingOverlay('/img/HPG2_logo.png', async () => {
    // La logica di navigazione viene gestita internamente in voiceLoadingOverlay.ts
    // Qui puoi mettere eventuale logica di avvio gioco, se serve
  });
});
