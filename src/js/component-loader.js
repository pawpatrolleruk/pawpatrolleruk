/**
 * Component Loader
 * 
 * This script loads HTML components into pages.
 * It allows for reusable components across multiple pages.
 */

class ComponentLoader {
  /**
   * Load a component into a target element
   * @param {string} componentPath - Path to the component HTML file
   * @param {string} targetSelector - CSS selector for the target element
   * @returns {Promise} - Promise that resolves when the component is loaded
   */
  static async loadComponent(componentPath, targetSelector, deps = {}) {
    try {
      // Resolve path consistently for both dev ("/") and GitHub Pages ("/<repo>/")
      let finalPath = componentPath;
      // Vite injects import.meta.env.BASE_URL at build time
      let base = '/';
      try {
        base = (import.meta && import.meta.env && import.meta.env.BASE_URL) || '/';
      } catch (_) {
        base = '/';
      }
      const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;

      // If absolute URL, leave as is
      if (/^https?:\/\//i.test(componentPath)) {
        finalPath = componentPath;
      // If already base-prefixed, leave as is
      } else if (componentPath.startsWith(normalizedBase + '/')) {
        finalPath = componentPath;
      // If root-absolute path, prefix base
      } else if (componentPath.startsWith('/')) {
        finalPath = normalizedBase + componentPath;
      // Otherwise treat as relative to base
      } else {
        finalPath = normalizedBase + '/' + componentPath;
      }

      const doFetch = deps.fetch || fetch;
      const response = await doFetch(finalPath);
      if (!response.ok) {
        throw new Error(`Failed to load component: ${response.status} ${response.statusText} (${finalPath})`);
      }
      const html = await response.text();
      const targetElement = document.querySelector(targetSelector);
      if (!targetElement) {
        throw new Error(`Target element not found: ${targetSelector}`);
      }
      targetElement.innerHTML = html;
      // Execute scripts in the component
      const scripts = targetElement.querySelectorAll('script');
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        Array.from(script.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.textContent = script.textContent;
        script.parentNode.replaceChild(newScript, script);
      });
      return targetElement;
    } catch (error) {
      // User-friendly error message in the DOM
      const targetElement = document.querySelector(targetSelector);
      if (targetElement) {
        targetElement.innerHTML = `<div style='color:red;font-size:0.9em;'>Component failed to load: ${error.message}</div>`;
      }
      console.error('Error loading component:', error);
      return null;
    }
  }
  
  /**
   * Initialize components on the page
   * @param {Object} componentMap - Map of component paths to target selectors
   * @returns {Promise} - Promise that resolves when all components are loaded
   */
  static async initComponents(componentMap) {
    const promises = Object.entries(componentMap).map(([componentPath, targetSelector]) =>
      this.loadComponent(componentPath, targetSelector)
    );
    
    return Promise.all(promises);
  }
}

// Export for use in other modules
export default ComponentLoader;
