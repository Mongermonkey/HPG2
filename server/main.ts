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

// Example: handle IPC
ipcMain.handle('ping', () => 'pong');
