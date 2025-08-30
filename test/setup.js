import { vi } from 'vitest';

// Mock localStorage for testing
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

// Use jsdom's real window and augment it
const jsdomWindow = globalThis.window || global.window;

// Attach a mock localStorage (jsdom's storage can vary)
jsdomWindow.localStorage = new LocalStorageMock();

// Ensure dispatchEvent exists and is spy-able
if (!jsdomWindow.dispatchEvent) {
  jsdomWindow.dispatchEvent = vi.fn();
} else {
  vi.spyOn(jsdomWindow, 'dispatchEvent').mockImplementation(() => true);
}

// Ensure CustomEvent exists
if (!jsdomWindow.CustomEvent) {
  jsdomWindow.CustomEvent = class CustomEvent {
    constructor(event, options) {
      this.type = event;
      this.detail = options?.detail;
    }
  };
}

// Make localStorage available globally
global.localStorage = jsdomWindow.localStorage;

// Mock location.reload but keep other properties intact
if (!global.location) global.location = {};
if (!global.location.reload) global.location.reload = vi.fn();


// Polyfill requestAnimationFrame/cancelAnimationFrame for jsdom tests
if (!global.requestAnimationFrame) {
  global.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16);
}
if (!global.cancelAnimationFrame) {
  global.cancelAnimationFrame = (id) => clearTimeout(id);
}
