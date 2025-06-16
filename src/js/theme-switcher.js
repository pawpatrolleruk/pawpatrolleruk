/**
 * Theme Switcher
 * 
 * This module handles theme switching functionality for the website.
 * It provides methods to toggle between light and dark themes and
 * persists the user's preference in localStorage.
 */

class ThemeSwitcher {
  constructor() {
    this.STORAGE_KEY = 'theme-preference';
    this.DARK_CLASS = 'dark';
    this.LIGHT_THEME = 'light';
    this.DARK_THEME = 'dark';
    this.SYSTEM_THEME = 'system';
    
    // Initialize theme based on stored preference or system preference
    this.init();
  }
  
  /**
   * Initialize the theme
   */
  init() {
    // Get stored theme preference
    // const storedTheme = localStorage.getItem(this.STORAGE_KEY);
    
    // if (storedTheme) {
    //   // Apply stored theme preference
    //   if (storedTheme === this.DARK_THEME) {
    //     this.enableDarkMode();
    //   } else if (storedTheme === this.LIGHT_THEME) {
    //     this.enableLightMode();
    //   } else {
    //     // System preference
    //     // this.applySystemTheme();
    //   }
    // } else {
    //   // No stored preference, use system preference
    //   // this.applySystemTheme();
    // }
    this.enableLightMode(); // Default to light mode
    
    // Listen for system theme changes
    // this.setupSystemThemeListener();
  }
  
  /**
   * Apply system theme preference
   */
  applySystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.enableDarkMode(false); // Don't save preference
    } else {
      this.enableLightMode(false); // Don't save preference
    }
    
    // Save that we're using system preference
    localStorage.setItem(this.STORAGE_KEY, this.SYSTEM_THEME);
  }
  
  /**
   * Setup listener for system theme changes
   */
  setupSystemThemeListener() {
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        const storedTheme = localStorage.getItem(this.STORAGE_KEY);
        
        // Only apply system theme if user hasn't set a preference
        if (storedTheme === this.SYSTEM_THEME) {
          if (e.matches) {
            this.enableDarkMode(false);
          } else {
            this.enableLightMode(false);
          }
        }
      });
    }
  }
  
  /**
   * Enable dark mode
   * @param {boolean} savePreference - Whether to save the preference
   */
  enableDarkMode(savePreference = true) {
    document.documentElement.classList.add(this.DARK_CLASS);
    document.documentElement.setAttribute('data-theme', this.DARK_THEME);
    
    if (savePreference) {
      localStorage.setItem(this.STORAGE_KEY, this.DARK_THEME);
    }
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: this.DARK_THEME } }));
  }
  
  /**
   * Enable light mode
   * @param {boolean} savePreference - Whether to save the preference
   */
  enableLightMode(savePreference = true) {
    document.documentElement.classList.remove(this.DARK_CLASS);
    document.documentElement.setAttribute('data-theme', this.LIGHT_THEME);
    
    if (savePreference) {
      localStorage.setItem(this.STORAGE_KEY, this.LIGHT_THEME);
    }
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: this.LIGHT_THEME } }));
  }
  
  /**
   * Toggle between light and dark mode
   */
  toggleTheme() {
    if (document.documentElement.classList.contains(this.DARK_CLASS)) {
      this.enableLightMode();
    } else {
      this.enableDarkMode();
    }
  }
  
  /**
   * Get current theme
   * @returns {string} - Current theme (light, dark, or system)
   */
  getCurrentTheme() {
    return localStorage.getItem(this.STORAGE_KEY) || this.SYSTEM_THEME;
  }
  
  /**
   * Set theme
   * @param {string} theme - Theme to set (light, dark, or system)
   */
  setTheme(theme) {
    if (theme === this.DARK_THEME) {
      this.enableDarkMode();
    } else if (theme === this.LIGHT_THEME) {
      this.enableLightMode();
    } else {
      this.applySystemTheme();
    }
  }
}

// Create and export a singleton instance
const themeSwitcher = new ThemeSwitcher();
export default themeSwitcher;
