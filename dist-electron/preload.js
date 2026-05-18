"use strict";const e=require("electron");e.contextBridge.exposeInMainWorld("electronAPI",{ping:()=>e.ipcRenderer.invoke("ping"),loadGamePage:()=>e.ipcRenderer.invoke("load-game-page")});
