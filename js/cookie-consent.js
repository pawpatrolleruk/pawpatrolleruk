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
document.addEventListener('DOMContentLoaded', () => {
    new CookieConsentUI();
});
