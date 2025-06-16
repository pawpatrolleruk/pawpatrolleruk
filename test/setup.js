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

// Mock window object
global.window = {
  localStorage: new LocalStorageMock(),
  dispatchEvent: vi.fn(),
  CustomEvent: class CustomEvent {
    constructor(event, options) {
      this.type = event;
      this.detail = options?.detail;
    }
  }
};

// Make localStorage available globally
global.localStorage = window.localStorage;

// Mock location.reload
global.location = {
  reload: vi.fn()
};
