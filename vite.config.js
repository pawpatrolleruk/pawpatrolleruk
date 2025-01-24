import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/pawpatrolleruk.github.io/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        testimonials: resolve(__dirname, 'pages/testimonials.html')
      }
    }
  },
  server: {
    historyApiFallback: {
      rewrites: [
        { from: /\/pages\/testimonials/, to: '/pages/testimonials.html' }
      ]
    }
  }
})