class CookieManager {
    constructor() {
        this.consentKey = 'cookieConsent';
        this.cookieTypes = {
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
    }

    getConsent() {
        const consent = localStorage.getItem(this.consentKey);
        return consent ? JSON.parse(consent) : null;
    }

    setConsent(preferences) {
        localStorage.setItem(this.consentKey, JSON.stringify({
            ...preferences,
            timestamp: new Date().toISOString(),
            necessary: true // Always required
        }));
        this.applyConsent();
    }

    hasConsent(type) {
        const consent = this.getConsent();
        return consent ? !!consent[type] : false;
    }

    applyConsent() {
        // Disable analytics if not consented
        if (!this.hasConsent('analytics')) {
            window['ga-disable-GA_MEASUREMENT_ID'] = true;
        }
        
        // Dispatch event for other scripts to handle
        window.dispatchEvent(new CustomEvent('cookieConsentUpdate', {
            detail: this.getConsent()
        }));
    }

    revokeConsent() {
        localStorage.removeItem(this.consentKey);
        location.reload();
    }
}

// Export for use in other files
window.cookieManager = new CookieManager();

export function saveCookiePreference(preferences) {
  localStorage.setItem('cookie-preferences', JSON.stringify(preferences));
}

export function getCookiePreference() {
  const prefs = localStorage.getItem('cookie-preferences');
  return prefs ? JSON.parse(prefs) : null;
}

export function clearCookiePreference() {
  localStorage.removeItem('cookie-preferences');
}
