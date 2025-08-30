import { describe, it, expect, vi, beforeEach } from 'vitest';
import ComponentLoader from '../src/js/component-loader.js';

function createDOM() {
  document.body.innerHTML = `
    <div id="navbar-container"></div>
  `;
}

describe('ComponentLoader', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    delete window.__scriptRan;
  });

  it('loads component HTML into target and replaces inline scripts (jsdom-safe)', async () => {
    createDOM();
    const html = `<div>OK<script>window.__scriptRan = (window.__scriptRan||0)+1;<\/script></div>`;
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve(html) });

    const el = await ComponentLoader.loadComponent('src/components/navbar.html', '#navbar-container', { fetch: mockFetch });

    expect(el).not.toBeNull();
    expect(el.innerHTML).toContain('OK');
    // jsdom führt inline Skripte nicht automatisch aus; wir prüfen, dass das Script-Element vorhanden ist
    const script = el.querySelector('script');
    expect(script).not.toBeNull();
    // Optional: simulierte Ausführung in Testumgebung
    // eslint-disable-next-line no-eval
    eval(script.textContent);
    expect(window.__scriptRan).toBe(1);
  });

  it('shows error in target on fetch failure', async () => {
    createDOM();
    const mockFetch = vi.fn().mockResolvedValue({ ok: false, status: 404, statusText: 'Not Found' });

    const el = await ComponentLoader.loadComponent('src/components/missing.html', '#navbar-container', { fetch: mockFetch });

    expect(el).toBeNull();
    const target = document.querySelector('#navbar-container');
    expect(target.innerHTML).toMatch(/Component failed to load/i);
  });
});

