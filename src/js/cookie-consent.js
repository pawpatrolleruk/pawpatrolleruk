import { saveCookiePreference } from '@js/cookieManager.js';

class CookieConsentUI {
    constructor() {
        this.manager = window.cookieManager;
        this.bindElements();
        this.bindEvents();
        this.init();
    }

    bindElements() {
        this.banner = document.querySelector('.cookie-consent');
        this.preferencesModal = document.querySelector('.cookie-preferences');
        this.checkboxes = document.querySelectorAll('[data-cookie-type]');
        
        // Get button elements
        this.acceptButton = document.getElementById('accept-cookies');
        this.rejectButton = document.getElementById('reject-cookies');
        this.manageButton = document.getElementById('manage-cookies');
        this.saveButton = document.getElementById('save-preferences');
        this.closeButton = document.getElementById('close-preferences');
    }

    bindEvents() {
        // Banner buttons
        this.acceptButton?.addEventListener('click', () => this.acceptAll());
        this.rejectButton?.addEventListener('click', () => this.rejectAll());
        this.manageButton?.addEventListener('click', () => this.showPreferences());
        
        // Modal buttons
        this.saveButton?.addEventListener('click', () => this.savePreferences());
        this.closeButton?.addEventListener('click', () => this.hidePreferences());
    }

    init() {
        const consent = this.manager.getConsent();
        if (!consent) {
            this.banner.classList.add('visible');
        } else {
            this.banner.classList.remove('visible');
        }
        this.hidePreferences();
    }

    showPreferences() {
        const consent = this.manager.getConsent() || {};
        this.checkboxes.forEach(checkbox => {
            const type = checkbox.dataset.cookieType;
            checkbox.checked = consent[type] || false;
        });
        this.preferencesModal.classList.add('visible');
    }

    hidePreferences() {
        this.preferencesModal.classList.remove('visible');
    }

    acceptAll() {
        this.manager.setConsent({
            necessary: true,
            analytics: true,
            marketing: true
        });
        this.banner.classList.remove('visible');
        this.hidePreferences();
    }

    rejectAll() {
        this.manager.setConsent({
            necessary: true,
            analytics: false,
            marketing: false
        });
        this.banner.classList.remove('visible');
        this.hidePreferences();
    }

    savePreferences() {
        const preferences = { necessary: true };
        this.checkboxes.forEach(checkbox => {
            preferences[checkbox.dataset.cookieType] = checkbox.checked;
        });
        this.manager.setConsent(preferences);
        this.banner.classList.remove('visible');
        this.hidePreferences();
    }
}

// Initialize when DOM is ready
export function initCookieConsent() {
    new CookieConsentUI();
}

document.addEventListener('DOMContentLoaded', () => {
  const banner = document.getElementById('cookie-banner');
  const preferencesModal = document.getElementById('cookie-preferences');
  const acceptBtn = document.getElementById('accept-cookies');
  const rejectBtn = document.getElementById('reject-cookies');
  const manageBtn = document.getElementById('manage-cookies');
  const savePrefBtn = document.getElementById('save-preferences');
  const closePrefBtn = document.getElementById('close-preferences');

  // Accept all cookies
  acceptBtn.addEventListener('click', () => {
    saveCookiePreference({ analytics: true, marketing: true });
    banner.style.display = 'none';
  });

  // Reject all cookies
  rejectBtn.addEventListener('click', () => {
    saveCookiePreference({ analytics: false, marketing: false });
    banner.style.display = 'none';
  });

  // Open preferences modal
  manageBtn.addEventListener('click', () => {
    preferencesModal.style.display = 'flex';
  });

  // Save preferences from modal
  savePrefBtn.addEventListener('click', () => {
    const analytics = document.querySelector('input[data-cookie-type="analytics"]').checked;
    const marketing = document.querySelector('input[data-cookie-type="marketing"]').checked;
    saveCookiePreference({ analytics, marketing });
    preferencesModal.style.display = 'none';
    banner.style.display = 'none';
  });

  // Close preferences modal without saving
  closePrefBtn.addEventListener('click', () => {
    preferencesModal.style.display = 'none';
  });
});
