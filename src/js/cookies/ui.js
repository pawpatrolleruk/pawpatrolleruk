/**
 * Cookie Consent UI Component
 * 
 * This module handles the UI interactions for cookie consent management.
 * It provides a clean interface for showing/hiding the consent banner and preferences modal.
 */

import {
  getConsent,
  setConsent,
  acceptAllCookies,
  rejectOptionalCookies,
  getCookieTypes
} from './index.js';

class CookieConsentUI {
  constructor() {
    this.initialized = false;
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }
  
  /**
   * Initialize the UI component
   */
  init() {
    if (this.initialized) return;
    
    this.bindElements();
    if (!this.banner) return; // Exit if banner element doesn't exist
    
    this.bindEvents();
    this.updateUI();
    this.initialized = true;
  }
  
  /**
   * Find and store references to DOM elements
   */
  bindElements() {
    // Main elements
    this.banner = document.getElementById('cookie-banner');
    this.preferencesModal = document.getElementById('cookie-preferences');
    this.checkboxes = document.querySelectorAll('[data-cookie-type]');
    
    // Button elements
    this.acceptButton = document.getElementById('accept-cookies');
    this.rejectButton = document.getElementById('reject-cookies');
    this.manageButton = document.getElementById('manage-cookies');
    this.saveButton = document.getElementById('save-preferences');
    this.closeButton = document.getElementById('close-preferences');
    this.settingsLink = document.getElementById('open-cookie-settings');
  }
  
  /**
   * Attach event listeners to UI elements
   */
  bindEvents() {
    // Banner buttons
    this.acceptButton?.addEventListener('click', () => this.handleAcceptAll());
    this.rejectButton?.addEventListener('click', () => this.handleRejectAll());
    this.manageButton?.addEventListener('click', () => this.showPreferences());
    this.settingsLink?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showBanner();
    });
    
    // Modal buttons
    this.saveButton?.addEventListener('click', () => this.savePreferences());
    this.closeButton?.addEventListener('click', () => this.hidePreferences());
  }
  
  /**
   * Update UI based on current consent state
   */
  updateUI() {
    const consent = getConsent();
    
    // Show/hide banner based on consent
    if (!consent && this.banner) {
      this.showBanner();
    } else if (this.banner) {
      this.hideBanner();
    }
  }
  
  /**
   * Show the consent banner
   */
  showBanner() {
    if (this.banner) {
      this.banner.style.display = 'block';
    }
  }
  
  /**
   * Hide the consent banner
   */
  hideBanner() {
    if (this.banner) {
      this.banner.style.display = 'none';
    }
  }
  
  /**
   * Show the preferences modal
   */
  showPreferences() {
    if (!this.preferencesModal) return;
    
    // Update checkbox states based on current consent
    const consent = getConsent() || {};
    this.checkboxes.forEach(checkbox => {
      const type = checkbox.dataset.cookieType;
      checkbox.checked = consent[type] || false;
    });
    
    // Show the modal
    this.preferencesModal.style.display = 'flex';
  }
  
  /**
   * Hide the preferences modal
   */
  hidePreferences() {
    if (this.preferencesModal) {
      this.preferencesModal.style.display = 'none';
    }
  }
  
  /**
   * Handle accepting all cookies
   */
  handleAcceptAll() {
    acceptAllCookies();
    this.hideBanner();
    this.hidePreferences();
  }
  
  /**
   * Handle rejecting optional cookies
   */
  handleRejectAll() {
    rejectOptionalCookies();
    this.hideBanner();
    this.hidePreferences();
  }
  
  /**
   * Save preferences from modal checkboxes
   */
  savePreferences() {
    const preferences = { necessary: true };
    
    this.checkboxes.forEach(checkbox => {
      preferences[checkbox.dataset.cookieType] = checkbox.checked;
    });
    
    setConsent(preferences);
    this.hideBanner();
    this.hidePreferences();
  }
}

// Create and export a singleton instance
const cookieConsentUI = new CookieConsentUI();
export default cookieConsentUI;
