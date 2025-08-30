import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initTestimonials } from '../src/js/testimonials.js';

function mountDOM({ width = 360 } = {}) {
  // Basic layout for the carousel
  document.body.innerHTML = `
    <style>
      #review-container { width: ${width}px; overflow-x: auto; }
      .review-card { width: ${width}px; }
    </style>
    <div id="review-container"></div>
    <div id="pagination-dots"></div>
    <button id="prev-button"></button>
    <button id="next-button"></button>
  `;
}

function stubExistingCardsLayout(container, cardWidth = 360) {
  const cards = container.querySelectorAll('.review-card');
  cards.forEach((el, i) => {
    Object.defineProperty(el, 'offsetLeft', { value: i * cardWidth, configurable: true });
    Object.defineProperty(el, 'offsetWidth', { value: cardWidth, configurable: true });
  });
  // Simulate container client metrics
  Object.defineProperty(container, 'clientWidth', { value: cardWidth, configurable: true });
  Object.defineProperty(container, 'scrollWidth', { value: cards.length * cardWidth, configurable: true });
}

function flushTimers(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Carousel interaction (js-controlled paging)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('navigates to next page via next button and lands exactly on a card boundary', async () => {
    // Force mobile viewport for itemsPerPage=1 behavior
    Object.defineProperty(window, 'innerWidth', { value: 360, configurable: true });
    mountDOM({ width: 360 });

    const data = Array.from({ length: 5 }).map((_, i) => ({ reviewer_name: `User ${i}`, review_text: 'ok', rating: 5 }));
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(data) });

    // Initialize module which will render cards
    // Inject an instant scroll animator for deterministic tests
    const instant = (el, from, to) => { el.scrollLeft = to; };
    initTestimonials({ fetch: mockFetch, scrollAnimator: instant });
    await Promise.resolve();
    await new Promise(r => setTimeout(r, 0));

    const container = document.querySelector('#review-container');
    // Patch layout of the cards created by the module
    stubExistingCardsLayout(container, 360);

    const next = document.querySelector('#next-button');
    next.click();

    await flushTimers();
    expect(container.scrollLeft).toBeCloseTo(360, 0);
  });

  it('free-scroll mode does not snap after manual scroll stop', async () => {
    Object.defineProperty(window, 'innerWidth', { value: 360, configurable: true });
    mountDOM({ width: 360 });

    const data = Array.from({ length: 5 }).map((_, i) => ({ reviewer_name: `User ${i}`, review_text: 'ok', rating: 5 }));
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(data) });

    const instant = (el, from, to) => { el.scrollLeft = to; };
    initTestimonials({ fetch: mockFetch, scrollAnimator: instant });
    await Promise.resolve();
    await new Promise(r => setTimeout(r, 0));

    const container = document.querySelector('#review-container');
    // Patch layout of the cards created by the module
    stubExistingCardsLayout(container, 360);

    // Simulate a user scroll to mid-card
    container.scrollLeft = 150;
    container.dispatchEvent(new Event('scroll'));

    await flushTimers();
    // Free scroll: should remain where user left it
    expect(container.scrollLeft).toBeCloseTo(150, 0);

    // Now near card 1 boundary
    container.scrollLeft = 220;
    container.dispatchEvent(new Event('scroll'));

    await flushTimers();
    // Still free scroll
    expect(container.scrollLeft).toBeCloseTo(220, 0);
  });
});

