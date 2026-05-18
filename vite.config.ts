import { defineConfig } from "vite";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";

export default defineConfig({
  root: '.',
  server: {
    open: '/hpg2-main.html', // apre direttamente il nuovo file
  },
  build: {
    rollupOptions: {
      input: {
        main: 'hpg2-main.html',
        start: 'start.html'
      }
    }
  },
  plugins: [
    electron([
      {
        entry: 'server/main.ts',
        onstart({ startup }) {
          // Avvia Electron solo una volta
          startup(['electron', '.']);
        },
        vite: {
          build: {
            outDir: 'dist-electron',
          },
        },
      },
      {
        entry: 'server/preload.ts',
        vite: {
          build: {
            outDir: 'dist-electron',
          },
        },
      },
    ]),
    renderer(),
  ],
});
