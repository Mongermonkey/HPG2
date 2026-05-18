// Helper per rilevare se siamo in Electron
export function isElectron() {
  // @ts-ignore
  return !!(window && window.process && window.process.type);
}

// Alternativa più robusta con preload
export function isElectronPreload() {
  return typeof window !== 'undefined' && !!window.electronAPI;
}
