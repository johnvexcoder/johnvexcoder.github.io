(function () {
  const COMMANDS = [
    { name: 'Go Home', icon: 'home', action: function () { goTo('#home'); } },
    { name: 'About', icon: 'user', action: function () { goTo('#about'); } },
    { name: 'Skills', icon: 'code', action: function () { goTo('#skills'); } },
    { name: 'Projects', icon: 'folder', action: function () { goTo('#projects'); } },
    { name: 'Homelab', icon: 'server', action: function () { goTo('#homelab'); } },
    { name: 'Experience', icon: 'briefcase', action: function () { goTo('#experience'); } },
    { name: 'Services', icon: 'gift', action: function () { goTo('#services'); } },
    { name: 'GitHub', icon: 'github', action: function () { window.open('https://github.com/johnvexcoder', '_blank', 'noopener'); } },
    { name: 'Contact', icon: 'mail', action: function () { goTo('#contact'); } },
    { name: 'Toggle Theme', icon: 'moon', action: function () {
      const toggle = document.getElementById('theme-toggle');
      if (toggle) toggle.click();
    } }
  ];

  const ICONS = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>',
    server: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>',
    briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>'
  };

  let paletteOpen = false;
  let selectedIndex = 0;
  let previousFocus = null;

  function goTo(selector) {
    closePalette();
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'auto' });
    }
  }

  function openPalette() {
    paletteOpen = true;
    const palette = document.getElementById('palette');
    const input = document.getElementById('palette-input');
    previousFocus = document.activeElement;
    palette.inert = false;
    palette.setAttribute('aria-hidden', 'false');
    palette.classList.add('open');
    input.value = '';
    document.body.classList.add('palette-open');
    selectedIndex = 0;
    renderResults('');
    setTimeout(function () { input.focus(); }, 50);
  }

  function closePalette() {
    if (!paletteOpen) return;
    paletteOpen = false;
    const palette = document.getElementById('palette');
    palette.classList.remove('open');
    palette.setAttribute('aria-hidden', 'true');
    palette.inert = true;
    document.body.classList.remove('palette-open');
    if (previousFocus && previousFocus.focus) queueMicrotask(function () { previousFocus.focus(); });
  }

  function renderResults(query) {
    const resultsEl = document.getElementById('palette-results');
    const filtered = COMMANDS.filter(function (cmd) {
      return cmd.name.toLowerCase().includes(query.toLowerCase());
    });

    if (filtered.length === 0) {
      resultsEl.innerHTML = '<div class="palette-empty">No matches found</div>';
      return;
    }

    resultsEl.innerHTML = filtered.map(function (cmd, i) {
      return `
        <button type="button" class="palette-result ${i === selectedIndex ? 'selected' : ''}" data-index="${i}" role="option" aria-selected="${i === selectedIndex}">
          <span class="palette-result-icon">${ICONS[cmd.icon] || ICONS.search}</span>
          <span class="palette-result-name">${cmd.name}</span>
          <span class="palette-result-hint">↵</span>
        </button>
      `;
    }).join('');

    resultsEl.querySelectorAll('.palette-result').forEach(function (btn) {
      btn.addEventListener('mousemove', function () {
        selectedIndex = parseInt(btn.getAttribute('data-index'));
        highlightSelected();
      });
      btn.addEventListener('click', function () {
        const idx = parseInt(btn.getAttribute('data-index'));
        runCommand(filtered[idx]);
      });
    });

    selectedIndex = 0;
    highlightSelected();
  }

  function highlightSelected() {
    const resultsEl = document.getElementById('palette-results');
    const buttons = resultsEl.querySelectorAll('.palette-result');
    buttons.forEach(function (btn, i) {
      btn.classList.toggle('selected', i === selectedIndex);
      btn.setAttribute('aria-selected', String(i === selectedIndex));
    });
    const selected = buttons[selectedIndex];
    if (selected && selected.scrollIntoView) {
      selected.scrollIntoView({ block: 'nearest' });
    }
  }

  function runCommand(cmd) {
    if (cmd && cmd.action) {
      cmd.action();
    }
  }

  function initPalette() {
    const palette = document.getElementById('palette');
    const input = document.getElementById('palette-input');
    const resultsEl = document.getElementById('palette-results');
    const trigger = document.getElementById('palette-trigger');

    if (trigger) trigger.addEventListener('click', openPalette);

    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (paletteOpen) closePalette();
        else openPalette();
      }

      if (paletteOpen) {
        if (e.key === 'Escape') {
          closePalette();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          const resultCount = resultsEl.querySelectorAll('.palette-result').length;
          selectedIndex = Math.min(selectedIndex + 1, Math.max(0, resultCount - 1));
          highlightSelected();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          selectedIndex = Math.max(selectedIndex - 1, 0);
          highlightSelected();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const filtered = COMMANDS.filter(function (cmd) {
            return cmd.name.toLowerCase().includes(input.value.toLowerCase());
          });
          runCommand(filtered[selectedIndex]);
        } else if (e.key === 'Tab') {
          const focusable = Array.from(palette.querySelectorAll('input, button:not([disabled])'));
          if (!focusable.length) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });

    input.addEventListener('input', function () {
      renderResults(input.value);
    });

    palette.addEventListener('click', function (e) {
      if (e.target === palette || e.target === resultsEl) {
        closePalette();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initPalette);
})();
