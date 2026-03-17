import { App } from './ui/App.js';

// Register service worker for offline PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(e => {
      console.warn('[SW] Registration failed:', e);
    });
  });
}

// Boot the app
window.addEventListener('DOMContentLoaded', () => {
  try {
    const app = new App(document.getElementById('app'));
    app.init();
    // Expose for debugging
    window.__aa = app;
  } catch (e) {
    console.error('[Boot] Fatal error:', e);
    document.getElementById('loading').innerHTML = `
      <h1 style="color:#cc3333">⚠ Error</h1>
      <p style="color:#d4c9a8;max-width:400px;text-align:center">${e.message}</p>
      <button onclick="location.reload()" style="margin-top:20px;padding:12px 24px;background:#c8a040;border:none;border-radius:6px;font-size:1rem;cursor:pointer">Reload</button>
    `;
  }
});
