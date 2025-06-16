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
  static async loadComponent(componentPath, targetSelector) {
    try {
      const response = await fetch(componentPath);
      
      if (!response.ok) {
        throw new Error(`Failed to load component: ${response.status} ${response.statusText}`);
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
        
        // Copy all attributes
        Array.from(script.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        
        // Copy the content
        newScript.textContent = script.textContent;
        
        // Replace the old script with the new one
        script.parentNode.replaceChild(newScript, script);
      });
      
      return targetElement;
    } catch (error) {
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
