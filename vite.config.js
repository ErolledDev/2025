import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src/standalone',
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/standalone/index.html')
      }
    }
  },
  server: {
    port: 5173
  },
  preview: {
    port: 4173
  }
});