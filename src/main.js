import './main.css';
import { initCookieConsent } from './js/cookie-consent';
import '@js/cookie-consent.js';

// Initialize cookie consent when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initCookieConsent();
});

// Reviews
document.addEventListener('DOMContentLoaded', function() {
  fetch('./reviews.json') // updated relative URL for static sites
    .then(response => response.json())
    .then(data => {
      const reviewContainer = document.getElementById('review-container');
      data.reviews.slice(0, 5).forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'p-6 transition-all duration-300 bg-white shadow-lg review-item rounded-xl hover:shadow-xl hover:-translate-y-1';
        reviewElement.innerHTML = `
          <div class="flex items-center mb-4">
            <span class="text-yellow-400 text-2xl">${'★'.repeat(review.rating)}</span>
          </div>
          <p class="mb-4">"${review.text}"</p>
          <p class="font-semibold">- ${review.name}</p>
        `;
        reviewContainer.appendChild(reviewElement);
      });
    })
    .catch(error => console.error('Error loading reviews:', error));
});

// NEW: Example enhancement for "Get In Touch" smooth scroll (if needed)
document.addEventListener('click', function(e) {
  if (e.target.closest('.btn-get-in-touch')) {
    e.preventDefault();
    document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
  }
});