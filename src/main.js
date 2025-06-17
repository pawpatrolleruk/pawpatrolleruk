// Import styles
import './css/index.css';

// Import modules
import './js/cookies/ui.js';
import { initTestimonials } from './js/testimonials.js';
import ComponentLoader from './js/component-loader.js';
import themeSwitcher from './js/theme-switcher.js';

// DOM ready event handler
document.addEventListener('DOMContentLoaded', async function() {
  // Load reusable components
  await loadPageComponents();

  // Setup theme toggle and footer interactions
  setupThemeToggle();
  setupFooterInteractions();

  // Initialize testimonials carousel using the optimized module
  initTestimonials();
});

/**
 * Setup theme toggle functionality
 */
function setupThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');

  if (themeToggleBtn) {
    // Bind click event to toggle theme
    themeToggleBtn.addEventListener('click', function() {
      themeSwitcher.toggleTheme();
    });
  }

  // Update icons based on current theme when page loads
  const currentTheme = themeSwitcher.getCurrentTheme();
  const lightIcon = document.getElementById('theme-toggle-light-icon');
  const darkIcon = document.getElementById('theme-toggle-dark-icon');

  if (lightIcon && darkIcon) {
    if (currentTheme === 'dark' || 
        (currentTheme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      lightIcon.classList.add('hidden');
      darkIcon.classList.remove('hidden');
    } else {
      lightIcon.classList.remove('hidden');
      darkIcon.classList.add('hidden');
    }
  }

  // Listen for theme changes to update icons
  window.addEventListener('themeChange', function(event) {
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');

    if (lightIcon && darkIcon) {
      if (event.detail.theme === 'dark') {
        lightIcon.classList.add('hidden');
        darkIcon.classList.remove('hidden');
      } else {
        lightIcon.classList.remove('hidden');
        darkIcon.classList.add('hidden');
      }
    }
  });
}

/**
 * Setup footer interactions
 */
function setupFooterInteractions() {
  // Set current year for all elements with #current-year
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('#current-year').forEach(element => {
    if (element) element.textContent = currentYear;
  });
  // Handle cookie settings link
  const cookieSettingsLink = document.getElementById('open-cookie-settings');
  if (cookieSettingsLink) {
    cookieSettingsLink.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Cookie settings link clicked');
      
      // Clear existing consent and show cookie banner
      localStorage.removeItem('cookieConsent');
      const cookieBanner = document.getElementById('cookie-banner');
      if (cookieBanner) {
        cookieBanner.style.display = 'block';
        console.log('Cookie banner shown via settings link');
      }
    });
  }
}

/**
 * Load all page components
 */
async function loadPageComponents() {
  // Define component mappings (component path -> target selector)
  const componentMap = {
    // Only load components if their target containers exist
    ...(document.querySelector('#navbar-container') && {
      '/src/components/navbar.html': '#navbar-container'
    }),
    ...(document.querySelector('#footer-container') && {
      '/src/components/footer.html': '#footer-container'
    }),
    ...(document.querySelector('#floating-buttons-container') && {
      '/src/components/floating-buttons.html': '#floating-buttons-container'
    }),
    ...(document.querySelector('#cookie-banner-container') && {
      '/src/components/cookie-banner.html': '#cookie-banner-container'
    })
  };
  // Initialize components
  try {
    await ComponentLoader.initComponents(componentMap);
    console.log('Components loaded successfully');
    
    // Initialize cookie banner after components are loaded
    initializeCookieBanner();
  } catch (error) {
    console.error('Error loading components:', error);
  }
}

/**
 * Initialize cookie banner functionality
 */
function initializeCookieBanner() {
  console.log('Initializing cookie banner...');
  
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');
  const openCookieSettingsBtn = document.getElementById('open-cookie-settings');

  if (!cookieBanner) {
    console.error('Cookie banner element not found');
    return;
  }

  console.log('Cookie banner elements found');

  // Check if user has already accepted cookies
  const hasAcceptedCookies = localStorage.getItem('cookieConsent');
  console.log('Cookie consent status:', hasAcceptedCookies);

  if (!hasAcceptedCookies) {
    // Show the cookie banner if consent hasn't been given
    console.log('Showing cookie banner');
    cookieBanner.style.display = 'block';
  } else {
    console.log('Cookie consent already given, hiding banner');
    cookieBanner.style.display = 'none';
  }

  // Handle cookie acceptance
  if (acceptCookiesBtn) {
    console.log('Setting up accept button click handler');
    acceptCookiesBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Accept button clicked');
      
      // Save consent to localStorage
      try {
        localStorage.setItem('cookieConsent', JSON.stringify({
          necessary: true,
          timestamp: new Date().toISOString()
        }));
        console.log('Cookie consent saved to localStorage');
      } catch (error) {
        console.error('Error saving cookie consent:', error);
      }

      // Hide the banner
      cookieBanner.style.display = 'none';
      console.log('Cookie banner hidden');
    });
  } else {
    console.error('Accept cookies button not found');
  }

  // Handle opening cookie settings (this is already handled in setupFooterInteractions)
  if (openCookieSettingsBtn) {
    console.log('Cookie settings button found');
  }
}
