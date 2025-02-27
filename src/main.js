// Import styles
import './style.css';

// DOM ready event handler
document.addEventListener('DOMContentLoaded', function() {
  // Handle mobile menu dropdown
  const mobileMenuToggle = document.querySelector('[data-mobile-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      const isOpen = mobileMenu.getAttribute('data-open') === 'true';
      mobileMenu.setAttribute('data-open', isOpen ? 'false' : 'true');
      mobileMenu.style.display = isOpen ? 'none' : 'block';
    });
  }

  // Current year for footer
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('#current-year').forEach(element => {
    if (element) element.textContent = currentYear;
  });

  // Cookie consent handling
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('accept-cookies');
  const cookieSettingsLink = document.getElementById('open-cookie-settings');
  
  // Show banner if consent not already given
  if (!localStorage.getItem('cookieConsentAcknowledged') && cookieBanner) {
    cookieBanner.style.display = 'block';
  }
  
  // Handle accept button click
  if (acceptButton) {
    acceptButton.addEventListener('click', function() {
      localStorage.setItem('cookieConsentAcknowledged', 'true');
      if (cookieBanner) cookieBanner.style.display = 'none';
    });
  }
  
  // Handle settings link click
  if (cookieSettingsLink) {
    cookieSettingsLink.addEventListener('click', function(e) {
      e.preventDefault();
      if (cookieBanner) cookieBanner.style.display = 'block';
    });
  }

  // Testimonials loader
  const loadTestimonials = function() {
    const reviewContainer = document.getElementById('review-container');
    if (!reviewContainer) return;
    
    fetch('reviews.json')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        if (!data || !data.reviews || !Array.isArray(data.reviews)) {
          throw new Error('Invalid data format');
        }
        
        // Clear any existing content
        reviewContainer.innerHTML = '';
        
        // Add testimonials
        data.reviews.slice(0, 5).forEach(review => {
          const rating = Math.min(Math.max(parseInt(review.rating) || 0, 0), 5);
          const safeText = (review.text || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          const safeName = (review.name || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          
          const reviewElement = document.createElement('div');
          reviewElement.className = 'p-6 transition-all duration-300 bg-white shadow-lg review-item rounded-xl hover:shadow-xl hover:-translate-y-1';
          reviewElement.innerHTML = `
            <div class="flex items-center mb-4">
              <span class="text-2xl text-yellow-400">${'★'.repeat(rating)}</span>
            </div>
            <p class="mb-4">"${safeText}"</p>
            <p class="font-semibold">- ${safeName}</p>
          `;
          reviewContainer.appendChild(reviewElement);
        });
      })
      .catch(error => {
        console.error('Error loading reviews:', error);
        if (reviewContainer) {
          reviewContainer.innerHTML = '<div class="text-center p-4"><p>Coming soon!</p></div>';
        }
      });
  };
  
  // Load testimonials if on a page that needs them
  loadTestimonials();
});