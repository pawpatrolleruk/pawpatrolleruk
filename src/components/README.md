# Paw Patroller UK Components

This directory contains reusable components for the Paw Patroller UK website.

## Available Components

- `navbar.html` - The site navigation bar
- `footer.html` - The site footer
- `floating-buttons.html` - Floating contact and back-to-top buttons
- `cookie-banner.html` - GDPR-compliant cookie consent banner

## How to Use Components

1. Add container elements to your HTML page:

```html
<!-- Navbar Container -->
<div id="navbar-container"></div>

<!-- Footer Container -->
<div id="footer-container"></div>

<!-- Floating Buttons Container -->
<div id="floating-buttons-container"></div>

<!-- Cookie Banner Container -->
<div id="cookie-banner-container"></div>
```

2. The components will be automatically loaded by the `component-loader.js` script in `main.js`.

## Creating New Pages

1. Copy the template from `src/templates/page-template.html`
2. Update the page title, meta tags, and content
3. Save the file in the root directory with an appropriate name (e.g., `services.html`)

## Modifying Components

When modifying components, remember that changes will affect all pages that use the component.

1. Edit the component file in `src/components/`
2. Test the changes on multiple pages to ensure consistency

## Component Structure

Each component follows this structure:

1. HTML markup for the component
2. Any component-specific JavaScript in a `<script>` tag
3. Component-specific styles are in the main CSS file

## Notes

- Components use relative paths (e.g., `index.html#services`) - update these as needed for different pages
- The component loader handles script execution automatically
- Components are loaded asynchronously
