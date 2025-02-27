import './style.css';
import './components/Header.js';
import './components/Footer.js';

// Cookie Banner and Reviews
document.addEventListener('DOMContentLoaded', function() {
  // Reviews fetching code
  fetch('reviews.json')
    .then(response => response.json())
    .then(data => {
      const reviewContainer = document.getElementById('review-container');
      data.reviews.slice(0, 5).forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'p-6 transition-all duration-300 bg-white shadow-lg review-item rounded-xl hover:shadow-xl hover:-translate-y-1';
        reviewElement.innerHTML = `
          <div class="flex items-center mb-4">
            <span class="text-2xl text-yellow-400">${'★'.repeat(review.rating)}</span>
          </div>
          <p class="mb-4">"${review.text}"</p>
          <p class="font-semibold">- ${review.name}</p>
        `;
        reviewContainer.appendChild(reviewElement);
      });
    })
    .catch(error => console.error('Error loading reviews:', error));

  // Cookie banner functionality
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('accept-cookies');
  const declineButton = document.getElementById('decline-cookies');

  if (!localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => {
      cookieBanner.classList.remove('translate-y-full');
    }, 1000);
  }

  acceptButton.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
    cookieBanner.classList.add('translate-y-full');
  });

  declineButton.addEventListener('click', () => {
    cookieBanner.classList.add('translate-y-full');
  });
});