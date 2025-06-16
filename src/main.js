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
      // Show cookie banner
      const cookieBanner = document.getElementById('cookie-banner');
      if (cookieBanner) {
        cookieBanner.style.display = 'block';
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
  } catch (error) {
    console.error('Error loading components:', error);
  }
}
