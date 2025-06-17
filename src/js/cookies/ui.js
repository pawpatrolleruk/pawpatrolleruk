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
    
    console.log('Cookie UI init called');
    this.bindElements();
    if (!this.banner) {
      console.error('Cookie banner element not found, exiting initialization');
      return; // Exit if banner element doesn't exist
    }
    
    console.log('Cookie banner found, binding events and updating UI');
    this.bindEvents();
    this.updateUI();
    this.initialized = true;
    
    // Emit custom event for other modules to hook into
    window.dispatchEvent(new CustomEvent('cookieUIReady', { detail: this }));
    console.log('Cookie UI initialization complete');
  }
  
  /**
   * Find and store references to DOM elements
   */
  bindElements() {
    // Main elements
    this.banner = document.querySelector('#cookie-banner');
    this.preferencesModal = document.querySelector('#cookie-preferences');
    this.checkboxes = document.querySelectorAll('[data-cookie-type]');
    
    // Button elements
    this.acceptButton = document.querySelector('#accept-cookies');
    this.rejectButton = document.querySelector('#reject-cookies');
    this.manageButton = document.querySelector('#manage-cookies');
    this.saveButton = document.querySelector('#save-preferences');
    this.closeButton = document.querySelector('#close-preferences');
    this.settingsLink = document.querySelector('#open-cookie-settings');
    
    // Log warnings for missing elements
    if (!this.banner) console.warn('Cookie banner element (#cookie-banner) not found');
    if (!this.preferencesModal) console.warn('Cookie preferences modal (#cookie-preferences) not found');
    if (!this.acceptButton) console.warn('Accept button (#accept-cookies) not found');
    if (!this.rejectButton) console.warn('Reject button (#reject-cookies) not found');
    if (!this.manageButton) console.warn('Manage button (#manage-cookies) not found');
    if (!this.saveButton) console.warn('Save button (#save-preferences) not found');
    if (!this.closeButton) console.warn('Close button (#close-preferences) not found');
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
    console.log('Updating UI, current consent:', consent);
    
    // Show/hide banner based on consent
    if (!consent && this.banner) {
      console.log('No consent found, showing banner');
      this.showBanner();
    } else if (this.banner) {
      console.log('Consent found, hiding banner');
      this.hideBanner();
    }
  }
  
  /**
   * Show the consent banner
   */
  showBanner() {
    if (this.banner) {
      this.banner.style.display = 'block';
      // Use setTimeout to ensure the display change is applied before adding the class
      setTimeout(() => {
        this.banner.classList.add('visible');
      }, 10);
    }
  }
  
  /**
   * Hide the consent banner
   */
  hideBanner() {
    if (this.banner) {
      this.banner.classList.remove('visible');
      // Wait for transition to complete before hiding
      setTimeout(() => {
        this.banner.style.display = 'none';
      }, 300);
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
    this.preferencesModal.classList.add('visible');
    this.preferencesModal.style.display = 'grid';
  }
  
  /**
   * Hide the preferences modal
   */
  hidePreferences() {
    if (this.preferencesModal) {
      this.preferencesModal.classList.remove('visible');
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
