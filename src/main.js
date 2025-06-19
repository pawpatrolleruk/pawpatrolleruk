// Import styles
import './css/index.css';

// Import modules
import cookieConsentUI from './js/cookies/ui.js';
import { revokeConsent } from './js/cookies/index.js';
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
  // Setup mobile navigation (migrated from main-fixed.js)
  setupMobileNavigation();
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
      revokeConsent();
      // The UI will be updated via the cookieConsentUpdate event
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
    
    // Wait a bit for components to be fully rendered
    setTimeout(() => {
      // Initialize cookie UI after components are loaded
      console.log('Initializing cookie consent UI...');
      if (cookieConsentUI && typeof cookieConsentUI.init === 'function') {
        cookieConsentUI.init();
      } else {
        console.error('Cookie consent UI not available');
      }
    }, 100);
  } catch (error) {
    console.error('Error loading components:', error);
  }
}

/**
 * Setup mobile navigation menu and active state
 * (migrated from main-fixed.js)
 */
function setupMobileNavigation() {
  setTimeout(() => {
    const navToggle = document.getElementById('mobile-nav-toggle');
    const navMenu = document.getElementById('mobile-nav-menu');
    if (!navToggle || !navMenu) return;
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('open');
      navToggle.classList.toggle('open');
      document.body.classList.toggle('nav-open');
    });
    setupActiveNavigation();
  }, 200);
}

function setupActiveNavigation() {
  const navLinks = document.querySelectorAll('#mobile-nav-menu a');
  const currentPath = window.location.pathname.replace(/\/index\.html$/, '/');
  navLinks.forEach(link => {
    if (link.pathname === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
