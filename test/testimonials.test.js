import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initTestimonials } from '../src/js/testimonials.js';

function basicDOM() {
  document.body.innerHTML = `
    <div id="review-container"></div>
    <div id="pagination-dots"></div>
    <button id="prev-button"></button>
    <button id="next-button"></button>
  `;
}

describe('Testimonials', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders reviews from fetch', async () => {
    basicDOM();
    const data = [
      { reviewer_name: 'Alice', review_text: 'Great!', rating: 5 },
      { reviewer_name: 'Bob', review_text: 'Nice', rating: 4 },
    ];
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(data) });

    // Run and let promises resolve
    initTestimonials({ fetch: mockFetch });
    await Promise.resolve();
    await new Promise(r => setTimeout(r, 0));

    const cards = document.querySelectorAll('.review-card');
    expect(cards.length).toBe(2);
  });

  it('handles fetch error gracefully', async () => {
    basicDOM();
    const mockFetch = vi.fn().mockResolvedValue({ ok: false, status: 500, statusText: 'Err' });

    initTestimonials({ fetch: mockFetch });
    await Promise.resolve();
    await new Promise(r => setTimeout(r, 0));

    const container = document.querySelector('#review-container');
    expect(container.textContent).toMatch(/Unable to load reviews/i);
  });
});

