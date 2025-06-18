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
  console.log('Initializing testimonials...');
  const container = document.querySelector(CONFIG.selectors.container);
  
  if (!container) {
    console.error('Testimonials container not found:', CONFIG.selectors.container);
    return;
  }
  
  console.log('Container found, loading testimonials...');
  
  // Load testimonials data
  loadTestimonials()
    .then(testimonials => {
      console.log('Testimonials loaded:', testimonials.length, 'reviews');
      setupCarousel(testimonials);
    })
    .catch(handleError);
}

/**
 * Load testimonials data from JSON file
 * @returns {Promise<Array>} Array of testimonial objects
 */
async function loadTestimonials() {
  try {
    console.log('Fetching reviews from data/reviews.json...');
    const response = await fetch('data/reviews.json');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data || !Array.isArray(data)) {
      throw new Error('Invalid data format - expected an array');
    }
    
    console.log('Successfully loaded', data.length, 'reviews');
    return data;
  } catch (error) {
    console.error('Error loading testimonials:', error);
    throw error;
  }
}

/**
 * Set up the carousel with the loaded testimonials
 * @param {Array} testimonials - Array of testimonial objects
 */
function setupCarousel(testimonials) {
  console.log('Setting up carousel with', testimonials.length, 'testimonials');
  const container = document.querySelector(CONFIG.selectors.container);
  
  if (!container) {
    console.error('Container not found during setup');
    return;
  }
  
  // Clear any existing content
  container.innerHTML = '';
  
  // Render testimonials
  renderTestimonials(testimonials, container);
  
  // Set up pagination
  setupPagination(testimonials.length);
  
  // Initialize navigation
  initCarouselNavigation();
  
  console.log('Carousel setup complete');
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
  
  console.log('Setting up pagination:', { totalReviews, itemsPerPage, totalPages });
  
  // Only show pagination if we have more than one page
  if (totalPages <= 1) {
    paginationContainer.style.display = 'none';
    return;
  }
  
  paginationContainer.style.display = 'flex';
  
  // Create pagination dots
  paginationContainer.innerHTML = '';
  for (let i = 0; i < totalPages; i++) {
    const dot = document.createElement('div');
    dot.className = `${CONFIG.classes.paginationDot} ${i === 0 ? CONFIG.classes.activeDot : ''}`;
    dot.setAttribute('data-page', i);
    dot.addEventListener('click', () => {
      console.log('Pagination dot clicked:', i);
      scrollToPage(i);
    });
    paginationContainer.appendChild(dot);
  }
  
  console.log('Pagination setup complete with', totalPages, 'pages for', totalReviews, 'reviews');
}

/**
 * Initialize carousel navigation
 */
function initCarouselNavigation() {
  const container = document.querySelector(CONFIG.selectors.container);
  const prevButton = document.querySelector(CONFIG.selectors.prevButton);
  const nextButton = document.querySelector(CONFIG.selectors.nextButton);
  const paginationContainer = document.querySelector(CONFIG.selectors.pagination);
  
  if (!container || !prevButton || !nextButton || !paginationContainer) {
    console.error('Navigation elements not found');
    return;
  }
  
  // Simpler approach: scroll by card widths
  const scrollByCards = (direction) => {
    const cards = container.querySelectorAll(`.${CONFIG.classes.reviewCard}`);
    if (!cards.length) return;
    
    const cardWidth = cards[0].offsetWidth + 24; // card width + gap
    const scrollAmount = cardWidth * getItemsPerPage();
    
    console.log('Scrolling by', direction, 'cards. Card width:', cardWidth, 'Scroll amount:', scrollAmount);
    
    container.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  };
  
  // Button handlers for simpler navigation
  prevButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Previous button clicked');
    scrollByCards(-1);
  });
  
  nextButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Next button clicked');
    scrollByCards(1);
  });
  
  // Simple scroll tracking for button states and pagination dots
  let isScrolling = false;
  let isProgrammaticScroll = false;
  let skipScrollUpdateUntil = 0;
  let scrollDebounceTimeout;

  container.addEventListener('scroll', () => {
    if (isProgrammaticScroll) return;
    clearTimeout(scrollDebounceTimeout);
    scrollDebounceTimeout = setTimeout(() => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const currentScroll = container.scrollLeft;
      prevButton.disabled = currentScroll <= 0;
      nextButton.disabled = currentScroll >= maxScroll - 10; // Small tolerance
      updateActiveDotFromScroll(container);
    }, 100);
  });
  
  // Touch/swipe support for mobile
  let startX = null;
  
  container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });
  
  container.addEventListener('touchend', (e) => {
    if (!startX) return;
    
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - startX;
    
    // Only handle significant horizontal swipes
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        scrollByCards(-1); // Swipe right (previous)
      } else {
        scrollByCards(1); // Swipe left (next)
      }
    }
    
    startX = null;
  });
  
  // Initialize button states
  setTimeout(() => {
    const maxScroll = container.scrollWidth - container.clientWidth;
    prevButton.disabled = true; // Start at beginning
    nextButton.disabled = maxScroll <= 0; // Disable if no scroll needed
  }, 100);
  
  // Handle window resize to recalculate pagination
  const debouncedResize = debounce(() => {
    const testimonials = Array.from(container.querySelectorAll(`.${CONFIG.classes.reviewCard}`));
    if (testimonials.length > 0) {
      setupPagination(testimonials.length);
      // Reset to first page on resize
      container.scrollTo({ left: 0, behavior: 'smooth' });
      updateActiveDot(0);
    }
  }, CONFIG.debounceDelay);
  
  window.addEventListener('resize', debouncedResize);
}

/**
 * Scroll to a specific page
 * @param {number} pageIndex - Index of the page to scroll to
 */
function scrollToPage(pageIndex) {
  console.log('Scrolling to page:', pageIndex);
  const container = document.querySelector(CONFIG.selectors.container);
  if (!container) {
    console.error('Container not found for scrollToPage');
    return;
  }

  const cards = container.querySelectorAll(`.${CONFIG.classes.reviewCard}`);
  if (!cards.length) {
    console.error('No cards found for scrollToPage');
    return;
  }

  const itemsPerPage = getItemsPerPage();
  const targetCardIndex = pageIndex * itemsPerPage;
  
  // Make sure we don't scroll past the last card
  const cardIndex = Math.min(targetCardIndex, cards.length - 1);
  const targetCard = cards[cardIndex];
  
  if (targetCard) {
    isProgrammaticScroll = true;
    container.scrollTo({
      left: scrollPosition,
      behavior: 'auto'
    });
    updateActiveDot(pageIndex);
    updateNavigationButtons(pageIndex);
    // Reset the flag on the next animation frame so scroll handler can resume
    requestAnimationFrame(() => { isProgrammaticScroll = false; });
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
  const cards = container.querySelectorAll(`.${CONFIG.classes.reviewCard}`);
  if (!cards.length) return;
  
  const itemsPerPage = getItemsPerPage();
  const containerWidth = container.offsetWidth;
  const scrollPosition = container.scrollLeft;
  
  // Calculate which page we're currently viewing based on scroll position
  // Find the card that's most visible in the viewport center
  let currentPage = 0;
  const scrollCenter = scrollPosition + containerWidth / 2;
  
  cards.forEach((card, index) => {
    const cardLeft = card.offsetLeft;
    const cardRight = cardLeft + card.offsetWidth;
    const cardCenter = cardLeft + card.offsetWidth / 2;
    
    // If the card center is visible or the scroll center is within this card
    if (scrollCenter >= cardLeft && scrollCenter <= cardRight) {
      currentPage = Math.floor(index / itemsPerPage);
    }
  });
  
  console.log('Scroll update - Position:', scrollPosition, 'Container width:', containerWidth, 'Current page:', currentPage, 'Items per page:', itemsPerPage);
  
  updateActiveDot(currentPage);
  updateNavigationButtons(currentPage);
}

/**
 * Get the number of items to display per page based on viewport width
 * @returns {number} Number of items per page
 */
function getItemsPerPage() {
  if (window.innerWidth >= CONFIG.breakpoints.desktop) return 3; // Desktop: 3 items
  if (window.innerWidth >= CONFIG.breakpoints.tablet) return 2; // Tablet: 2 items  
  return 1; // Mobile: 1 item
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

/**
 * Debounce utility function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default {
  initTestimonials
};
