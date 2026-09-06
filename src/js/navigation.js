(function () {
  let mobileMenuOpen = false;

  function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileClose = document.getElementById('mobile-close');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-menu-link');
    let previousFocus = null;

    function onScroll() {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    function setMobileMenu(open) {
      mobileMenuOpen = open;
      if (open) previousFocus = document.activeElement;
      hamburger.setAttribute('aria-expanded', String(open));
      hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      hamburger.classList.toggle('open', open);
      mobileMenu.classList.toggle('open', open);
      mobileMenu.setAttribute('aria-hidden', String(!open));
      mobileMenu.inert = !open;
      mobileOverlay.classList.toggle('open', open);
      mobileOverlay.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('menu-open', open);

      if (open) {
        const firstLink = mobileMenu.querySelector('a');
        if (firstLink) firstLink.focus();
      } else if (previousFocus && previousFocus.focus) {
        previousFocus.focus();
      }
    }

    function closeMobileMenu() {
      setMobileMenu(false);
    }

    hamburger.addEventListener('click', function () {
      setMobileMenu(!mobileMenuOpen);
    });

    mobileOverlay.addEventListener('click', closeMobileMenu);
    if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu();
      }
      if (e.key === 'Tab' && mobileMenuOpen) {
        const focusable = Array.from(mobileMenu.querySelectorAll('a[href], button:not([disabled])'));
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
    });

    function updateActiveSection() {
      const sections = document.querySelectorAll('section[id]');
      let currentSectionId = 'home';
      const scrollPos = window.scrollY + 120;
      const navSectionMap = {
        capabilities: 'skills',
        environment: 'skills',
        upcoming: 'projects',
        philosophy: 'experience',
        github: 'projects'
      };

      sections.forEach(function (section) {
        if (section.offsetTop <= scrollPos) {
          currentSectionId = section.id;
        }
      });

      navLinks.forEach(function (link) {
        const target = link.getAttribute('href').slice(1);
        const activeTarget = navSectionMap[currentSectionId] || currentSectionId;
        link.classList.toggle('active', target === activeTarget);
      });
    }

    window.addEventListener('scroll', function () {
      onScroll();
      updateActiveSection();
    }, { passive: true });

    onScroll();
    updateActiveSection();
  }

  document.addEventListener('DOMContentLoaded', initNavigation);
})();
