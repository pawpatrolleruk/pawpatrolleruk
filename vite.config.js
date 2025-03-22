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

// Copy reviews.json to public/data directory
const reviewsJsonSrc = resolve(__dirname, 'assets/data/reviews.json');
const reviewsJsonDest = resolve(publicDataDir, 'reviews.json');
if (fs.existsSync(reviewsJsonSrc)) {
  fs.copyFileSync(reviewsJsonSrc, reviewsJsonDest);
}

export default defineConfig({
  root: './',
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy-policy.html'),
        faq: resolve(__dirname, 'faq.html')
      }
    },
    // Ensure all static assets are included in the build
    assetsInlineLimit: 0
  },
  server: {
    port: 3000,
    open: true
  },
  // Copy additional static assets to the dist directory
  publicDir: 'public'
});