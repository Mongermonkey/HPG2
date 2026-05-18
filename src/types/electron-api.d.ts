// TypeScript declaration for Electron preload API
export interface ElectronAPI {
  ping: () => Promise<string>;
  loadGamePage?: () => Promise<void>;
  openLoadGameDialog?: () => Promise<void>;
  listSaveFiles?: () => Promise<string[]>;
  loadSaveFile?: (filename: string) => Promise<any>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
