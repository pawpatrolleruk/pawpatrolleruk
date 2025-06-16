/**
 * Unified Cookie Management Module
 * 
 * This module provides a centralized way to manage cookie consent preferences.
 * It replaces the previous duplicate implementations across the codebase.
 */

// Cookie types and their metadata
const COOKIE_TYPES = {
  necessary: {
    name: 'Necessary',
    description: 'Essential cookies that enable basic functionality of the website.',
    required: true
  },
  analytics: {
    name: 'Analytics',
    description: 'Cookies that help us understand how visitors interact with our website.',
    required: false
  },
  marketing: {
    name: 'Marketing',
    description: 'Cookies used to deliver personalized marketing content.',
    required: false
  }
};

// Storage key for consent data
const CONSENT_KEY = 'cookieConsent';

/**
 * Get current consent preferences
 * @returns {Object|null} The consent object or null if not set
 */
export function getConsent() {
  const consent = localStorage.getItem(CONSENT_KEY);
  return consent ? JSON.parse(consent) : null;
}

/**
 * Check if consent is given for a specific cookie type
 * @param {string} type - The cookie type to check
 * @returns {boolean} Whether consent is given
 */
export function hasConsent(type) {
  const consent = getConsent();
  return consent ? !!consent[type] : false;
}

/**
 * Save consent preferences
 * @param {Object} preferences - Object with boolean values for each cookie type
 */
export function setConsent(preferences) {
  // Ensure necessary cookies are always enabled
  const consentData = {
    ...preferences,
    necessary: true,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData));
  
  // Apply the consent settings
  applyConsent();
  
  // Notify other parts of the application
  window.dispatchEvent(new CustomEvent('cookieConsentUpdate', {
    detail: consentData
  }));
}

/**
 * Apply consent settings to the application
 */
function applyConsent() {
  // Disable analytics if not consented
  if (!hasConsent('analytics')) {
    window['ga-disable-GA_MEASUREMENT_ID'] = true;
  }
}

/**
 * Accept all cookie types
 */
export function acceptAllCookies() {
  setConsent({
    necessary: true,
    analytics: true,
    marketing: true
  });
}

/**
 * Reject optional cookie types
 */
export function rejectOptionalCookies() {
  setConsent({
    necessary: true,
    analytics: false,
    marketing: false
  });
}

/**
 * Revoke all consent and reload the page
 */
export function revokeConsent() {
  localStorage.removeItem(CONSENT_KEY);
  location.reload();
}

/**
 * Get metadata about available cookie types
 * @returns {Object} Cookie types metadata
 */
export function getCookieTypes() {
  return COOKIE_TYPES;
}

// Export a default object for easier imports
export default {
  getConsent,
  hasConsent,
  setConsent,
  acceptAllCookies,
  rejectOptionalCookies,
  revokeConsent,
  getCookieTypes
};
