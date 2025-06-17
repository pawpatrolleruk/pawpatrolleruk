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
  
  // Setup mobile navigation after components are loaded
  setupMobileNavigation();

  // Initialize testimonials carousel using the optimized module
  initTestimonials();
});

/**
 * Setup mobile navigation functionality
 */
function setupMobileNavigation() {
  // Wait a bit to ensure navbar is fully loaded
  setTimeout(() => {
    const mobileDropdownButton = document.querySelector('.mobile-dropdown-button');
    const mobileDropdownContent = document.querySelector('.mobile-dropdown-content');

    console.log('Setting up mobile navigation...', { button: mobileDropdownButton, content: mobileDropdownContent });

    if (mobileDropdownButton && mobileDropdownContent) {
      // Remove any existing event listeners to avoid duplicates
      const newButton = mobileDropdownButton.cloneNode(true);
      mobileDropdownButton.parentNode.replaceChild(newButton, mobileDropdownButton);
      
      // Add click event listener to the new button
      newButton.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const isExpanded = mobileDropdownContent.classList.contains('open');
        const menuIcon = newButton.querySelector('.menu-icon');
        
        console.log('Mobile dropdown clicked, currently expanded:', isExpanded);
        
        if (isExpanded) {
          mobileDropdownContent.classList.remove('open');
          newButton.setAttribute('aria-expanded', 'false');
          if (menuIcon) menuIcon.textContent = 'menu';
        } else {
          mobileDropdownContent.classList.add('open');
          newButton.setAttribute('aria-expanded', 'true');
          if (menuIcon) menuIcon.textContent = 'close';
        }
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', function(event) {
        if (!newButton.contains(event.target) && !mobileDropdownContent.contains(event.target)) {
          mobileDropdownContent.classList.remove('open');
          newButton.setAttribute('aria-expanded', 'false');
          const menuIcon = newButton.querySelector('.menu-icon');
          if (menuIcon) menuIcon.textContent = 'menu';
        }
      });

      // Close dropdown when clicking on a link
      const mobileLinks = mobileDropdownContent.querySelectorAll('a');
      mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
          mobileDropdownContent.classList.remove('open');
          newButton.setAttribute('aria-expanded', 'false');
          const menuIcon = newButton.querySelector('.menu-icon');
          if (menuIcon) menuIcon.textContent = 'menu';
        });
      });

      // Keyboard navigation support
      newButton.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          newButton.click();
        }
      });

      console.log('Mobile navigation setup complete');
    } else {
      console.error('Mobile dropdown elements not found:', { button: mobileDropdownButton, content: mobileDropdownContent });
    }

    // Setup active link detection
    setupActiveNavigation();
  }, 200);
}

/**
 * Setup active navigation state management
 */
function setupActiveNavigation() {
  // Active link detection based on current page/section
  function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;

    // Clear all active classes first
    document.querySelectorAll('.menu li a').forEach(link => {
      link.classList.remove('active');
    });

    // Set active class based on current URL
    if (currentPath.includes('faq.html')) {
      document.getElementById('nav-faq')?.classList.add('active');
    } else if (currentHash) {
      // For hash-based navigation on index page
      const hashId = currentHash.substring(1); // Remove the # character
      document.getElementById(`nav-${hashId}`)?.classList.add('active');
    } else if (currentPath === '/' || currentPath.includes('index.html')) {
      // Default to home if on index page with no hash
      document.getElementById('nav-home')?.classList.add('active');
    }

    // Also set active class in mobile menu
    const activeLinkHref = document.querySelector('.menu li a.active')?.getAttribute('href');
    if (activeLinkHref) {
      document.querySelectorAll('.mobile-dropdown-content .menu li a').forEach(link => {
        if (link.getAttribute('href') === activeLinkHref) {
          link.classList.add('active');
        }
      });
    }
  }

  // Set active link on page load
  setActiveNavLink();

  // Update active link when hash changes (for single-page navigation)
  window.addEventListener('hashchange', setActiveNavLink);
}

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
