import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CookieManager, saveCookiePreference, getCookiePreference, clearCookiePreference } from '../src/js/cookieManager';

describe('CookieManager', () => {
  let cookieManager;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Create a new instance of CookieManager
    cookieManager = new CookieManager();
  });

  it('should initialize with correct default values', () => {
    expect(cookieManager.consentKey).toBe('cookieConsent');
    expect(cookieManager.cookieTypes.necessary.required).toBe(true);
    expect(cookieManager.cookieTypes.analytics.required).toBe(false);
    expect(cookieManager.cookieTypes.marketing.required).toBe(false);
  });

  it('should return null when no consent is stored', () => {
    expect(cookieManager.getConsent()).toBeNull();
  });

  it('should store and retrieve consent correctly', () => {
    const preferences = {
      analytics: true,
      marketing: false
    };

    cookieManager.setConsent(preferences);
    
    const consent = cookieManager.getConsent();
    expect(consent).not.toBeNull();
    expect(consent.analytics).toBe(true);
    expect(consent.marketing).toBe(false);
    expect(consent.necessary).toBe(true); // Always required
    expect(consent.timestamp).toBeDefined();
  });

  it('should check consent status correctly', () => {
    const preferences = {
      analytics: true,
      marketing: false
    };

    cookieManager.setConsent(preferences);
    
    expect(cookieManager.hasConsent('analytics')).toBe(true);
    expect(cookieManager.hasConsent('marketing')).toBe(false);
    expect(cookieManager.hasConsent('necessary')).toBe(true);
    expect(cookieManager.hasConsent('nonexistent')).toBe(false);
  });

  it('should dispatch event when applying consent', () => {
    const preferences = {
      analytics: false,
      marketing: true
    };

    cookieManager.setConsent(preferences);
    
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

    cookieManager.setConsent(preferences);
    cookieManager.revokeConsent();
    
    expect(cookieManager.getConsent()).toBeNull();
    expect(location.reload).toHaveBeenCalled();
  });
});

describe('Cookie Preference Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should save and retrieve cookie preferences', () => {
    const preferences = { 
      analytics: true, 
      marketing: false 
    };
    
    saveCookiePreference(preferences);
    const retrieved = getCookiePreference();
    
    expect(retrieved).toEqual(preferences);
  });

  it('should return null when no preferences are stored', () => {
    expect(getCookiePreference()).toBeNull();
  });

  it('should clear cookie preferences', () => {
    const preferences = { 
      analytics: true, 
      marketing: false 
    };
    
    saveCookiePreference(preferences);
    clearCookiePreference();
    
    expect(getCookiePreference()).toBeNull();
  });
});