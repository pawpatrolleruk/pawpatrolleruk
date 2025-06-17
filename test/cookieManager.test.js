import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  getConsent, 
  setConsent, 
  hasConsent, 
  acceptAllCookies, 
  rejectOptionalCookies, 
  revokeConsent, 
  needsRePrompt 
} from '../src/js/cookies/index.js';

describe('Cookie Manager', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Mock window.dispatchEvent
    vi.spyOn(window, 'dispatchEvent').mockImplementation(() => true);
  });

  it('should return null when no consent is stored', () => {
    expect(getConsent()).toBeNull();
  });

  it('should store and retrieve consent correctly', () => {
    const preferences = {
      analytics: true,
      marketing: false
    };

    setConsent(preferences);
    
    const consent = getConsent();
    expect(consent).not.toBeNull();
    expect(consent.analytics).toBe(true);
    expect(consent.marketing).toBe(false);
    expect(consent.necessary).toBe(true); // Always required
    expect(consent.timestamp).toBeDefined();
    expect(consent.version).toBeDefined();
  });

  it('should check consent status correctly', () => {
    const preferences = {
      analytics: true,
      marketing: false
    };

    setConsent(preferences);
    
    expect(hasConsent('analytics')).toBe(true);
    expect(hasConsent('marketing')).toBe(false);
    expect(hasConsent('necessary')).toBe(true);
    expect(hasConsent('nonexistent')).toBe(false);
  });

  it('should reject all sets analytics & marketing to false and keeps necessary true', () => {
    rejectOptionalCookies();
    
    const consent = getConsent();
    expect(consent.analytics).toBe(false);
    expect(consent.marketing).toBe(false);
    expect(consent.necessary).toBe(true);
  });

  it('should accept all cookies', () => {
    acceptAllCookies();
    
    const consent = getConsent();
    expect(consent.analytics).toBe(true);
    expect(consent.marketing).toBe(true);
    expect(consent.necessary).toBe(true);
  });

  it('should dispatch event when applying consent', () => {
    const preferences = {
      analytics: false,
      marketing: true
    };

    setConsent(preferences);
    
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'cookieConsentUpdate',
        detail: expect.objectContaining({
          analytics: false,
          marketing: true,
          necessary: true
        })
      })
    );
  });

  it('should revoke consent correctly', () => {
    const preferences = {
      analytics: true,
      marketing: true
    };

    setConsent(preferences);
    revokeConsent();
    
    expect(getConsent()).toBeNull();
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'cookieConsentUpdate',
        detail: null
      })
    );
  });

  it('consent version is stored and read; when CONSENT_VERSION increments needsRePrompt() returns true', () => {
    // Test with no consent
    expect(needsRePrompt()).toBe(true);
    
    // Set consent with current version
    setConsent({ analytics: true, marketing: false });
    expect(needsRePrompt()).toBe(false);
    
    // Simulate old version by manually setting outdated consent
    const oldConsent = {
      analytics: true,
      marketing: false,
      necessary: true,
      timestamp: new Date().toISOString(),
      version: 0 // Old version
    };
    localStorage.setItem('cookieConsent', JSON.stringify(oldConsent));
    expect(needsRePrompt()).toBe(true);
  });
});

