import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    browserName: 'chromium',
    baseURL: 'http://localhost:3000',
  },
  testDir: 'tests',
});