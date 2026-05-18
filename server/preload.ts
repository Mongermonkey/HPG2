// Preload script for Electron (runs in renderer, before web code)
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => ipcRenderer.invoke('ping'),
  loadGamePage: () => ipcRenderer.invoke('load-game-page'),
});
