// TypeScript declaration for Electron preload API
export interface ElectronAPI {
  ping: () => Promise<string>;
  loadGamePage?: () => Promise<void>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
