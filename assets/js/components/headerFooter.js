class ComponentLoader {
  constructor() {
    this.basePath = document.currentScript.src.replace(/\/[^/]+$/, '') + '/../../components/';
    this.init();
  }

  async loadComponent(name) {
    try {
      const response = await fetch(`${this.basePath}${name}.html`);
      if (!response.ok) throw new Error(`Failed to load ${name}`);
      return await response.text();
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  async init() {
    // Load header
    const headerPlaceholder = document.querySelector('header');
    if (headerPlaceholder) {
      const headerHTML = await this.loadComponent('header');
      headerPlaceholder.innerHTML = headerHTML;
    }

    // Load footer
    const footerPlaceholder = document.querySelector('footer');
    if (footerPlaceholder) {
      const footerHTML = await this.loadComponent('footer');
      footerPlaceholder.innerHTML = footerHTML;
    }

    // Set active nav links
    this.setActiveNavLink();
  }

  setActiveNavLink() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('nav a').forEach(link => {
      const linkPath = new URL(link.href).pathname;
      if (currentPath === linkPath || currentPath.startsWith(linkPath)) {
        link.classList.add('active');
      }
    });
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ComponentLoader());
} else {
  new ComponentLoader();
}