// Import styles
import './css/index.css';

// Import modules
import cookieConsentUI from './js/cookies/ui.js';
import { revokeConsent } from './js/cookies/index.js';
import { initTestimonials } from './js/testimonials.js';
import ComponentLoader from './js/component-loader.js';
// Theme switcher removed on customer request

// DOM ready event handler
document.addEventListener('DOMContentLoaded', async function() {
  // Load reusable components
  await loadPageComponents();
  // Setup footer interactions (theme toggle removed on customer request)
  setupFooterInteractions();
  // Setup mobile navigation (migrated from main-fixed.js)
  setupMobileNavigation();
  // Initialize testimonials carousel using the optimized module
  initTestimonials();
});

/**
 * Theme toggle functionality removed on customer request
 */

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
  const BASE_URL = import.meta.env.BASE_URL || '/';
  const componentMap = {
    ...(document.querySelector('#navbar-container') && {
      [`${BASE_URL}src/components/navbar.html`]: '#navbar-container'
    }),
    ...(document.querySelector('#footer-container') && {
      [`${BASE_URL}src/components/footer.html`]: '#footer-container'
    }),
    ...(document.querySelector('#floating-buttons-container') && {
      [`${BASE_URL}src/components/floating-buttons.html`]: '#floating-buttons-container'
    }),
    ...(document.querySelector('#cookie-banner-container') && {
      [`${BASE_URL}src/components/cookie-banner.html`]: '#cookie-banner-container'
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
 * (updated for new navbar structure)
 */
function setupMobileNavigation() {
  setTimeout(() => {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    // Since we're using CSS-only toggle with checkbox, we don't need click handlers
    // Just setup active navigation
    setupActiveNavigation();
  }, 200);
}

function setupActiveNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const base = import.meta.env.BASE_URL || '/';
  let currentPath = window.location.pathname;
  if (base !== '/' && currentPath.startsWith(base)) {
    currentPath = currentPath.slice(base.length - 1);
  }
  currentPath = currentPath.replace(/\/index\.html$/, '/');
  navLinks.forEach(link => {
    let linkPath = link.pathname;
    if (base !== '/' && linkPath.startsWith(base)) {
      linkPath = linkPath.slice(base.length - 1);
    }
    if (linkPath === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
