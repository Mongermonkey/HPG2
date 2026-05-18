// Mostra un esempio di utilizzo dell'API preload di Electron
import { isElectronPreload } from '../utilities/electronHelpers';

export async function testElectronPing() {
  if (isElectronPreload() && window.electronAPI && window.electronAPI.ping) {
    const pong = await window.electronAPI.ping();
    // eslint-disable-next-line no-console
    console.log('Ping result from main process:', pong);
    return pong;
  } else {
    // eslint-disable-next-line no-console
    console.log('Not running in Electron.');
    return null;
  }
}
