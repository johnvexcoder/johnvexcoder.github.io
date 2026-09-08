(function () {
  const STORAGE_KEY = 'j0hnvexcoder-theme';

  function getInitialTheme() {
    let stored; try { stored = localStorage.getItem(STORAGE_KEY); } catch (error) {}
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
      toggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    }
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#07101d' : '#f4f8fc');
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.body.classList.add('theme-transition');
    applyTheme(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (error) {}
    setTimeout(() => document.body.classList.remove('theme-transition'), 400);
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(getInitialTheme());
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', toggleTheme);
    }
  });
})();
