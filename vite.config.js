import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// Create the public/data directory if it doesn't exist
const publicDataDir = resolve(__dirname, 'public/data');
if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}

// Create the public/reviews directory for review images if it doesn't exist
const publicReviewsDir = resolve(__dirname, 'public/reviews');
if (!fs.existsSync(publicReviewsDir)) {
  fs.mkdirSync(publicReviewsDir, { recursive: true });
}

// Note: reviews.json is copied by copy-assets.js during the prebuild process

const BASE_URL = process.env.BASE_URL || '/';
console.log('BASE_URL:', BASE_URL);

export default defineConfig({
  root: './',
  base: BASE_URL,
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Enable minification for better performance
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // Enable code splitting
    cssCodeSplit: true,
    // Configure chunk size warnings
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy-policy.html'),
        faq: resolve(__dirname, 'faq.html'),
        testimonials: resolve(__dirname, 'testimonials.html'),
        cookiePolicy: resolve(__dirname, 'cookie-policy.html')
      },
      output: {
        // Configure code splitting
        manualChunks: {
          vendor: ['./src/js/cookies/index.js', './src/js/cookies/ui.js'],
          testimonials: ['./src/js/testimonials.js']
        },        // Configure asset file names
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          
          // Preserve badges directory structure
          if (assetInfo.name.includes('badge') || 
              ['dbs-checked', 'oplex-first-aid', 'protectivity-insurance'].some(badge => assetInfo.name.includes(badge))) {
            return `assets/badges/[name][extname]`;
          }
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
            extType = 'fonts';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        // Configure chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        // Configure entry file names
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },
    // Ensure all static assets are included in the build
    assetsInlineLimit: 0,
    // Generate source maps for production
    sourcemap: false
  },
  server: {
    port: 3000,
    open: true,
    // Enable CORS
    cors: true
  },
  // Copy additional static assets to the dist directory
  publicDir: 'public',
  // Configure resolve aliases for cleaner imports
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@css': resolve(__dirname, 'src/css'),
      '@js': resolve(__dirname, 'src/js')
    }
  },
  // Configure CSS optimization
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      // Add any preprocessor options here
    }
  }
});
