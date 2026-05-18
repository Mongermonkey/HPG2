// Preload script for Electron (runs in renderer, before web code)
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => ipcRenderer.invoke('ping'),
  loadGamePage: () => ipcRenderer.invoke('load-game-page'),
  openLoadGameDialog: () => ipcRenderer.invoke('open-load-game-dialog'),
  listSaveFiles: () => ipcRenderer.invoke('list-save-files'),
  loadSaveFile: (filename) => ipcRenderer.invoke('load-save-file', filename),
});
