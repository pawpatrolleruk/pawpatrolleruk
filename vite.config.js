import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  resolve: {
    alias: {
      '@js': path.resolve(__dirname, 'src/js')
    }
  },
  plugins: [
    tailwindcss(),
    viteStaticCopy({
      targets: [
        { src: 'src/assets', dest: 'assets' }
      ]
    })
  ],
  base: './', // Updated for patpatrolleruk.com
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html') // ensure index.html is recognized
      },
      output: {
        assetFileNames: ({ name }) => {
          if (/\.(css)$/.test(name ?? '')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          if (/\.(png|jpe?g|gif|svg)$/.test(name ?? '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  server: {
    open: true,
    host: '0.0.0.0',
    port: 3000, // or any port you prefer
  }
});