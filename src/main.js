// Import styles
import './style.css';

// DOM ready event handler
document.addEventListener('DOMContentLoaded', function() {
  // Simple Mobile Dropdown Implementation
  const initMobileNavigation = function() {
    const mobileDropdownButton = document.querySelector('.mobile-dropdown-button');
    const mobileDropdownContent = document.querySelector('.mobile-dropdown-content');
    
    if (mobileDropdownButton && mobileDropdownContent) {
      // Toggle dropdown on button click
      mobileDropdownButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent event bubbling
        mobileDropdownContent.classList.toggle('open');
      });
      
      // Close dropdown when clicking elsewhere on the page
      document.addEventListener('click', function(event) {
        if (!mobileDropdownButton.contains(event.target) && 
            !mobileDropdownContent.contains(event.target)) {
          mobileDropdownContent.classList.remove('open');
        }
      });
      
      // Close dropdown when clicking on menu links
      const menuLinks = mobileDropdownContent.querySelectorAll('a');
      menuLinks.forEach(link => {
        link.addEventListener('click', function() {
          mobileDropdownContent.classList.remove('open');
        });
      });
    }
  };
  
  // Initialize mobile navigation
  initMobileNavigation();

  // Simple Mobile Navigation handler
  const handleResponsiveNavigation = function() {
    const desktopNav = document.getElementById('desktop-nav');
    
    if (window.innerWidth < 1024 && desktopNav) {
      desktopNav.style.display = 'none';
    } else if (desktopNav) {
      desktopNav.style.display = '';
    }
  };

  // Initialize responsive navigation
  handleResponsiveNavigation();
  window.addEventListener('resize', handleResponsiveNavigation);

  // Simple dropdown toggle
  const mobileMenuToggle = document.querySelector('.dropdown label');
  const mobileMenuDropdown = document.querySelector('.dropdown-content');
  
  if (mobileMenuToggle && mobileMenuDropdown) {
    // Simple toggle for dropdown
    mobileMenuToggle.addEventListener('click', function() {
      mobileMenuDropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking a menu item
    const menuItems = mobileMenuDropdown.querySelectorAll('a');
    menuItems.forEach(item => {
      item.addEventListener('click', function() {
        mobileMenuDropdown.classList.remove('active');
      });
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

  // Testimonials loader with star rating system and pagination
  const loadTestimonials = function() {
    const reviewContainer = document.getElementById('review-container');
    if (!reviewContainer) return;
    
    fetch('assets/data/reviews.json')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        if (!data || !Array.isArray(data)) {
          throw new Error('Invalid data format');
        }
        
        // Clear any existing content
        reviewContainer.innerHTML = '';
        
        // Show ALL reviews on index page instead of just a subset
        const reviewsToShow = data;
        
        // Add testimonials with star ratings
        reviewsToShow.forEach((review, index) => {
          // Sanitize data
          const safeText = (review.review_text || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          const safeName = (review.reviewer_name || 'Anonymous').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          
          // Generate stars based on rating (default to 5 if not specified)
          const rating = review.rating || 5;
          let starsHTML = '';
          for (let i = 1; i <= 5; i++) {
            starsHTML += `<span class="star">${i <= rating ? '★' : '☆'}</span>`;
          }
          
          // Create review element with new design
          const reviewElement = document.createElement('div');
          reviewElement.className = 'review-card';
          reviewElement.setAttribute('data-index', index);
          
          // Determine what to show at the top (image or placeholder)
          let imageSection = '';
          if (review.image_url) {
            // Ensure the path is correctly pointing to assets/reviews/
            imageSection = `<img src="assets/reviews/${review.image_url}" alt="Review from ${safeName}" class="review-image" onerror="this.onerror=null;this.src='assets/reviews/default-review.jpg';">`;
          } else {
            imageSection = `
              <div class="review-image-placeholder">
                <span class="material-icons">pets</span>
              </div>
            `;
          }
          
          // Display full review text (no truncation)
          const reviewText = safeText;
          
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
              <p class="review-text">${reviewText}</p>
            </div>
          `;
          
          reviewContainer.appendChild(reviewElement);
        });
        
        // Set up pagination dots
        setupPagination(reviewsToShow.length);
        
        // Initialize carousel navigation
        initCarouselNavigation();
      })
      .catch(error => {
        console.error('Error loading reviews:', error);
        if (reviewContainer) {
          reviewContainer.innerHTML = '<div class="text-center p-4"><p>Coming soon!</p></div>';
        }
      });
  };

  // Set up pagination dots based on number of reviews
  function setupPagination(totalReviews) {
    const paginationContainer = document.getElementById('pagination-dots');
    if (!paginationContainer) return;
    
    // Calculate how many pages we need based on viewport size
    let itemsPerPage = 1; // Mobile default
    if (window.innerWidth >= 768) itemsPerPage = 2; // Tablet
    if (window.innerWidth >= 1024) itemsPerPage = 3; // Desktop
    
    const totalPages = Math.ceil(totalReviews / itemsPerPage);
    
    // Create pagination dots
    paginationContainer.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('div');
      dot.className = `pagination-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('data-page', i);
      dot.addEventListener('click', () => scrollToPage(i));
      paginationContainer.appendChild(dot);
    }
  }

  // Improved scroll to page function with better cross-browser support
  function scrollToPage(pageIndex) {
    const reviewContainer = document.getElementById('review-container');
    if (!reviewContainer) return;
    
    // Calculate width based on viewport
    let itemsPerPage = 1; // Mobile default
    if (window.innerWidth >= 768) itemsPerPage = 2; // Tablet
    if (window.innerWidth >= 1024) itemsPerPage = 3; // Desktop
    
    // Find the card at the start of the requested page
    const cardIndex = pageIndex * itemsPerPage;
    const cards = reviewContainer.querySelectorAll('.review-card');
    
    if (cardIndex < cards.length) {
      const card = cards[cardIndex];
      
      // Calculate the scroll position
      const scrollLeft = card.offsetLeft - reviewContainer.offsetLeft;
      
      // Use scrollTo with smooth behavior for modern browsers
      try {
        reviewContainer.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      } catch (error) {
        // Fallback for older browsers
        reviewContainer.scrollLeft = scrollLeft;
      }
      
      // Update UI indicators
      updateActiveDot(pageIndex);
      updateNavigationButtons(pageIndex);
    }
  }

  // Update active pagination dot
  function updateActiveDot(activeIndex) {
    const dots = document.querySelectorAll('.pagination-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });
  }

  // Update navigation button states
  function updateNavigationButtons(currentPageIndex) {
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const totalPages = document.querySelectorAll('.pagination-dot').length;
    
    if (prevButton) {
      prevButton.disabled = currentPageIndex === 0;
    }
    
    if (nextButton) {
      nextButton.disabled = currentPageIndex === totalPages - 1;
    }
  }

  // Initialize carousel navigation
  function initCarouselNavigation() {
    const reviewContainer = document.getElementById('review-container');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    
    if (!reviewContainer || !prevButton || !nextButton) return;
    
    // Handle previous button click
    prevButton.addEventListener('click', () => {
      const dots = document.querySelectorAll('.pagination-dot');
      const activeDotIndex = Array.from(dots).findIndex(dot => dot.classList.contains('active'));
      
      if (activeDotIndex > 0) {
        scrollToPage(activeDotIndex - 1);
      }
    });
    
    // Handle next button click
    nextButton.addEventListener('click', () => {
      const dots = document.querySelectorAll('.pagination-dot');
      const activeDotIndex = Array.from(dots).findIndex(dot => dot.classList.contains('active'));
      
      if (activeDotIndex < dots.length - 1) {
        scrollToPage(activeDotIndex + 1);
      }
    });
    
    // Improved scroll handling with better cross-browser support
    reviewContainer.addEventListener('scroll', () => {
      // Use requestAnimationFrame to limit events
      requestAnimationFrame(() => {
        // Calculate which page we're on based on scroll position
        const containerWidth = reviewContainer.offsetWidth;
        const scrollPosition = reviewContainer.scrollLeft;
        const reviewCards = reviewContainer.querySelectorAll('.review-card');
        
        if (reviewCards.length === 0) return;
        
        // Calculate visible card
        let itemsPerPage = 1; // Mobile default
        if (window.innerWidth >= 768) itemsPerPage = 2; // Tablet
        if (window.innerWidth >= 1024) itemsPerPage = 3; // Desktop
        
        // Calculate the width of a single card (including gap)
        const cardWidth = (containerWidth / itemsPerPage);
        
        // Calculate current page based on scroll position
        const currentPage = Math.round(scrollPosition / cardWidth);
        
        // Ensure the current page is within valid bounds
        const boundedCurrentPage = Math.max(0, Math.min(currentPage, Math.ceil(reviewCards.length / itemsPerPage) - 1));
        
        updateActiveDot(boundedCurrentPage);
        updateNavigationButtons(boundedCurrentPage);
      });
    });
    
    // Ensure buttons are enabled/disabled correctly on initialization
    updateNavigationButtons(0);
    
    // Update on window resize with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const totalReviews = document.querySelectorAll('.review-card').length;
        setupPagination(totalReviews);
        
        // Reset to first page on resize
        scrollToPage(0);
      }, 250); // 250ms debounce
    });
  }

  // Load testimonials if on a page that needs them
  loadTestimonials();
});