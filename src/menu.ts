// Logica menu principale per start.html
import { createVoiceLoadingOverlay } from './ui/voiceLoadingOverlay';
import { isElectronPreload } from './utilities/electronHelpers';

document.addEventListener('DOMContentLoaded', () => {
  // Logo sempre visibile nell'overlay
  const logoPath = './assets/HPG2_title-DyN6F_xP.png';
  createVoiceLoadingOverlay(logoPath, async () => {
    // ...altre logiche di avvio gioco...
  });
});
