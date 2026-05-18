// IPC: carica il contenuto di un file di salvataggio .json dalla cartella saves
ipcMain.handle('load-save-file', async (event, filename) => {
  const savesDir = path.join(process.cwd(), 'saves');
  const filePath = path.join(savesDir, filename);
  try {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
});
// Main process entry for Electron
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    // In dev, carica start.html dal dev server
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL.replace('hpg2-main.html', 'start.html'));
    mainWindow.webContents.openDevTools();
  } else {
    // In produzione, carica start.html
    mainWindow.loadFile(path.join(__dirname, '../dist/start.html'));
  }
}

app.whenReady().then(createWindow);


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// IPC: carica la pagina di gioco
ipcMain.handle('load-game-page', () => {
  if (mainWindow) {
    if (process.env.VITE_DEV_SERVER_URL) {
      mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
      mainWindow.loadFile(path.join(__dirname, '../dist/hpg2-main.html'));
    }
  }
});

// IPC: mostra dialogo di caricamento salvataggio
import { dialog } from 'electron';
const path = require('path');
const fs = require('fs');
// IPC: restituisce la lista dei file di salvataggio .json nella cartella saves
ipcMain.handle('list-save-files', async () => {
  const savesDir = path.join(process.cwd(), 'saves');
  try {
    const files = await fs.promises.readdir(savesDir);
    return files.filter(f => f.endsWith('.json'));
  } catch (e) {
    return [];
  }
});
ipcMain.handle('open-load-game-dialog', async () => {
  if (!mainWindow) return;
  // Usa la working directory reale per puntare a 'saves'
  const savesDir = path.join(process.cwd(), 'saves');
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Carica salvataggio',
    defaultPath: savesDir,
    filters: [
      { name: 'Salvataggi HPG2', extensions: ['json'] }
    ],
    properties: ['openFile']
  });
  if (!canceled && filePaths.length > 0) {
    return filePaths[0];
  }
  return null;
});

// Example: handle IPC
ipcMain.handle('ping', () => 'pong');
