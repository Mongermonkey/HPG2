import { defineConfig } from "vite";

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
  }
});
