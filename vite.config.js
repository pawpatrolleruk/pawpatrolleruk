import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({

  plugins: [tailwindcss()],
  base: '/PawPatrollerUK/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})