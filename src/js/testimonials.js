/**
 * Testimonials Carousel Module
 * 
 * This module provides an optimized implementation of the testimonials carousel
 * with improved performance and better cross-browser compatibility.
 */

// Configuration
const CONFIG = {
  selectors: {
    container: '#review-container',
    pagination: '#pagination-dots',
    prevButton: '#prev-button',
    nextButton: '#next-button'
  },
  classes: {
    reviewCard: 'review-card',
    paginationDot: 'pagination-dot',
    activeDot: 'active'
  },
  breakpoints: {
    tablet: 768,
    desktop: 1024
  },
  debounceDelay: 250 // ms
};

/**
 * Initialize the testimonials carousel
 */
export function initTestimonials() {
  const container = document.querySelector(CONFIG.selectors.container);
  if (!container) return;
  
  // Load testimonials data
  loadTestimonials()
    .then(setupCarousel)
    .catch(handleError);
}

/**
 * Load testimonials data from JSON file
 * @returns {Promise<Array>} Array of testimonial objects
 */
async function loadTestimonials() {
  try {
    const response = await fetch('data/reviews.json');
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    if (!data || !Array.isArray(data)) {
      throw new Error('Invalid data format');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Set up the carousel with the loaded testimonials
 * @param {Array} testimonials - Array of testimonial objects
 */
function setupCarousel(testimonials) {
  const container = document.querySelector(CONFIG.selectors.container);
  if (!container) return;
  
  // Clear any existing content
  container.innerHTML = '';
  
  // Render testimonials
  renderTestimonials(testimonials, container);
  
  // Set up pagination
  setupPagination(testimonials.length);
  
  // Initialize navigation
  initCarouselNavigation();
}

/**
 * Render testimonials in the container
 * @param {Array} testimonials - Array of testimonial objects
 * @param {HTMLElement} container - Container element
 */
function renderTestimonials(testimonials, container) {
  testimonials.forEach((review, index) => {
    // Sanitize data
    const safeText = (review.review_text || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const safeName = (review.reviewer_name || 'Anonymous').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Generate stars based on rating (default to 5 if not specified)
    const rating = review.rating || 5;
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
      starsHTML += `<span class="star">${i <= rating ? '★' : '☆'}</span>`;
    }
    
    // Create review element
    const reviewElement = document.createElement('div');
    reviewElement.className = CONFIG.classes.reviewCard;
    reviewElement.setAttribute('data-index', index);
    
    // Determine what to show at the top (image or placeholder)
    let imageSection = '';
    if (review.image_url) {
      // Improved image handling with better error handling and lazy loading
      const imageUrl = `reviews/${review.image_url}`;
      
      imageSection = `
        <div class="review-image-container">
          <img src="${imageUrl}" 
               alt="Review from ${safeName}" 
               class="review-image" 
               loading="lazy"
               onerror="this.onerror=null; this.src='reviews/default-review.jpg';">
        </div>
      `;
    } else {
      imageSection = `
        <div class="review-image-placeholder">
          <span class="material-icons">pets</span>
        </div>
      `;
    }
    
    // Build the review HTML
    reviewElement.innerHTML = `
      ${imageSection}
      <div class="review-stars">
        ${starsHTML}
      </div>
      <div class="review-content">
        <div class="review-header">
          <span class="review-name">${safeName}</span>
          ${review.verified_booking ? '<span class="review-badge">Verified</span>' : ''}
        </div>
        <p class="review-text">${safeText}</p>
      </div>
    `;
    
    container.appendChild(reviewElement);
  });
}

/**
 * Set up pagination dots based on number of reviews
 * @param {number} totalReviews - Total number of reviews
 */
function setupPagination(totalReviews) {
  const paginationContainer = document.querySelector(CONFIG.selectors.pagination);
  if (!paginationContainer) return;
  
  // Calculate how many pages we need based on viewport size
  const itemsPerPage = getItemsPerPage();
  const totalPages = Math.ceil(totalReviews / itemsPerPage);
  
  // Create pagination dots
  paginationContainer.innerHTML = '';
  for (let i = 0; i < totalPages; i++) {
    const dot = document.createElement('div');
    dot.className = `${CONFIG.classes.paginationDot} ${i === 0 ? CONFIG.classes.activeDot : ''}`;
    dot.setAttribute('data-page', i);
    dot.addEventListener('click', () => scrollToPage(i));
    paginationContainer.appendChild(dot);
  }
}

/**
 * Initialize carousel navigation
 */
function initCarouselNavigation() {
  const container = document.querySelector(CONFIG.selectors.container);
  const prevButton = document.querySelector(CONFIG.selectors.prevButton);
  const nextButton = document.querySelector(CONFIG.selectors.nextButton);
  const paginationContainer = document.querySelector(CONFIG.selectors.pagination);
  
  if (!container || !prevButton || !nextButton || !paginationContainer) return;
  
  // Handle previous button click
  prevButton.addEventListener('click', () => {
    const dots = paginationContainer.querySelectorAll(`.${CONFIG.classes.paginationDot}`);
    const activeDotIndex = Array.from(dots).findIndex(dot => 
      dot.classList.contains(CONFIG.classes.activeDot)
    );
    
    if (activeDotIndex > 0) {
      scrollToPage(activeDotIndex - 1);
    }
  });
  
  // Handle next button click
  nextButton.addEventListener('click', () => {
    const dots = paginationContainer.querySelectorAll(`.${CONFIG.classes.paginationDot}`);
    const activeDotIndex = Array.from(dots).findIndex(dot => 
      dot.classList.contains(CONFIG.classes.activeDot)
    );
    
    if (activeDotIndex < dots.length - 1) {
      scrollToPage(activeDotIndex + 1);
    }
  });
  
  // Optimized scroll event handling with requestAnimationFrame
  let ticking = false;
  container.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveDotFromScroll(container);
        ticking = false;
      });
      ticking = true;
    }
  });
  
  // Update on window resize with debouncing
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const reviewContainer = document.querySelector(CONFIG.selectors.container);
      if (!reviewContainer) return;
      
      const totalReviews = reviewContainer.querySelectorAll(`.${CONFIG.classes.reviewCard}`).length;
      setupPagination(totalReviews);
      
      // Reset to first page on resize
      scrollToPage(0);
    }, CONFIG.debounceDelay);
  });
  
  // Ensure buttons are enabled/disabled correctly on initialization
  updateNavigationButtons(0);
}

/**
 * Scroll to a specific page
 * @param {number} pageIndex - Index of the page to scroll to
 */
function scrollToPage(pageIndex) {
  const container = document.querySelector(CONFIG.selectors.container);
  if (!container) return;
  
  // Calculate width based on viewport
  const itemsPerPage = getItemsPerPage();
  
  // Find the card at the start of the requested page
  const cardIndex = pageIndex * itemsPerPage;
  const cards = container.querySelectorAll(`.${CONFIG.classes.reviewCard}`);
  
  if (cardIndex < cards.length) {
    const card = cards[cardIndex];
    
    // Calculate the scroll position
    const scrollLeft = card.offsetLeft - container.offsetLeft;
    
    // Use scrollTo with smooth behavior for modern browsers
    try {
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    } catch (error) {
      // Fallback for older browsers
      container.scrollLeft = scrollLeft;
    }
    
    // Update UI indicators
    updateActiveDot(pageIndex);
    updateNavigationButtons(pageIndex);
  }
}

/**
 * Update active pagination dot
 * @param {number} activeIndex - Index of the active dot
 */
function updateActiveDot(activeIndex) {
  const dots = document.querySelectorAll(`${CONFIG.selectors.pagination} .${CONFIG.classes.paginationDot}`);
  if (!dots.length) return;
  
  dots.forEach((dot, index) => {
    dot.classList.toggle(CONFIG.classes.activeDot, index === activeIndex);
  });
}

/**
 * Update navigation button states
 * @param {number} currentPageIndex - Current page index
 */
function updateNavigationButtons(currentPageIndex) {
  const prevButton = document.querySelector(CONFIG.selectors.prevButton);
  const nextButton = document.querySelector(CONFIG.selectors.nextButton);
  const paginationContainer = document.querySelector(CONFIG.selectors.pagination);
  
  if (!prevButton || !nextButton || !paginationContainer) return;
  
  const totalPages = paginationContainer.querySelectorAll(`.${CONFIG.classes.paginationDot}`).length;
  
  prevButton.disabled = currentPageIndex === 0;
  nextButton.disabled = currentPageIndex === totalPages - 1;
}

/**
 * Update active dot based on scroll position
 * @param {HTMLElement} container - Container element
 */
function updateActiveDotFromScroll(container) {
  // Calculate which page we're on based on scroll position
  const containerWidth = container.offsetWidth;
  const scrollPosition = container.scrollLeft;
  const reviewCards = container.querySelectorAll(`.${CONFIG.classes.reviewCard}`);
  
  if (reviewCards.length === 0) return;
  
  // Calculate visible card
  const itemsPerPage = getItemsPerPage();
  
  // Calculate the width of a single card (including gap)
  const cardWidth = (containerWidth / itemsPerPage);
  
  // Calculate current page based on scroll position
  const currentPage = Math.round(scrollPosition / cardWidth);
  
  // Ensure the current page is within valid bounds
  const boundedCurrentPage = Math.max(0, Math.min(currentPage, Math.ceil(reviewCards.length / itemsPerPage) - 1));
  
  updateActiveDot(boundedCurrentPage);
  updateNavigationButtons(boundedCurrentPage);
}

/**
 * Get the number of items to display per page based on viewport width
 * @returns {number} Number of items per page
 */
function getItemsPerPage() {
  if (window.innerWidth >= CONFIG.breakpoints.desktop) return 3; // Desktop
  if (window.innerWidth >= CONFIG.breakpoints.tablet) return 2; // Tablet
  return 1; // Mobile default
}

/**
 * Handle error when loading testimonials
 * @param {Error} error - Error object
 */
function handleError(error) {
  console.error('Error loading reviews:', error);
  
  const container = document.querySelector(CONFIG.selectors.container);
  if (container) {
    container.innerHTML = `
      <div class="text-center p-4">
        <p>Unable to load reviews. Please try again later.</p>
        <p class="text-xs text-gray-500 mt-2">${error.message}</p>
      </div>
    `;
  }
}

export default {
  initTestimonials
};
