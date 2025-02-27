import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: './',
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        privacy: './privacy-policy.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});