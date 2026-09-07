(function () {
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  let reducedMotion;
  function syncMotion() {
    const lite = Boolean((connection && connection.saveData) || (navigator.deviceMemory && navigator.deviceMemory <= 4));
    document.documentElement.classList.toggle('motion-lite', lite);
    reducedMotion = motionQuery.matches || lite;
    document.documentElement.classList.toggle('motion-paused', document.hidden);
    if (reducedMotion) document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('revealed'); });
  }
  syncMotion();
  motionQuery.addEventListener('change', syncMotion);
  if (connection && connection.addEventListener) connection.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);

  function finishBoot() {
    const loader = document.getElementById('boot-loader');
    let finished = false;
    const finish = function () {
      if (finished) return;
      finished = true;
      document.body.classList.remove('is-booting');
      document.body.classList.add('site-ready');
      if (loader) loader.classList.add('is-complete');
      setTimeout(function () { if (loader) loader.remove(); }, reducedMotion ? 20 : 900);
    };
    if (document.readyState === 'complete') {
      setTimeout(finish, reducedMotion ? 0 : 520);
    } else {
      window.addEventListener('load', function () {
        setTimeout(finish, reducedMotion ? 0 : 520);
      }, { once: true });
      setTimeout(finish, reducedMotion ? 0 : 850);
    }
  }

  function decorateReveals(elements) {
    const groups = new Map();
    elements.forEach(function (element, index) {
      const parent = element.parentElement;
      const groupIndex = groups.get(parent) || 0;
      groups.set(parent, groupIndex + 1);
      element.style.setProperty('--reveal-delay', Math.min(groupIndex * 80, 320) + 'ms');

      if (element.closest('.hero') && element.id !== 'hero-visual' && !element.matches('.hero-title')) {
        element.classList.add('reveal-rise');
      } else if (element.matches('.about-photo,.timeline,.github-mark')) {
        element.classList.add('reveal-left');
      } else if (element.matches('.about-copy,.independent-work,.github-panel,.contact-form')) {
        element.classList.add('reveal-right');
      } else if (element.matches('.skill-card,.capability-card,.featured-card,.service-card,.lab-shell')) {
        element.classList.add('reveal-scale');
      } else {
        element.classList.add(index % 2 ? 'reveal-rise' : 'reveal-soft');
      }
    });
  }

  function initHeadline() {
    const title = document.querySelector('.hero-title');
    if (!title || reducedMotion) return;
    const lines = title.innerHTML.split(/<br\s*\/?>/i);
    title.innerHTML = lines.map(function (line, index) {
      return '<span class="h-line"><span class="h-line-in" style="--line-delay:' + (index * 120) + 'ms">' + line + '</span></span>';
    }).join('');
  }

  function initReveal() {
    const elements = Array.from(document.querySelectorAll('.reveal'));
    decorateReveals(elements);
    if (reducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach(function (element) { element.classList.add('revealed'); });
      return;
    }
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -7%' });
    elements.forEach(function (element) { observer.observe(element); });
  }

  function initScrollEffects() {
    const progress = document.getElementById('scroll-progress-bar');
    const root = document.documentElement;
    let ticking = false;

    function update() {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const ratio = Math.min(1, Math.max(0, window.scrollY / max));
      if (progress) progress.style.transform = 'scaleX(' + ratio + ')';
      if (!reducedMotion && window.innerWidth > 860 && window.scrollY < window.innerHeight * 1.5) {
        root.style.setProperty('--hero-shift', Math.min(window.scrollY * 0.055, 42) + 'px');
        root.style.setProperty('--grid-shift', (window.scrollY * -0.018) + 'px');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  function initHeroTilt() {
    const hero = document.getElementById('hero-visual');
    if (!hero || reducedMotion || window.matchMedia('(pointer: coarse)').matches) return;
    hero.addEventListener('pointermove', function (event) {
      if (reducedMotion || window.innerWidth <= 860) return;
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      hero.style.setProperty('--hero-tilt-x', (-y * 3.5) + 'deg');
      hero.style.setProperty('--hero-tilt-y', (x * 4.5) + 'deg');
    }, { passive: true });
    hero.addEventListener('pointerleave', function () {
      hero.style.setProperty('--hero-tilt-x', '0deg');
      hero.style.setProperty('--hero-tilt-y', '0deg');
    });
  }

  function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow || reducedMotion || window.matchMedia('(pointer: coarse)').matches) return;
    let ticking = false;
    let x = 0;
    let y = 0;
    document.addEventListener('pointermove', function (event) {
      if (reducedMotion) return;
      x = event.clientX;
      y = event.clientY;
      glow.classList.add('active');
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        glow.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) translate(-50%,-50%)';
        ticking = false;
      });
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', function () { glow.classList.remove('active'); });
  }

  function initSectionMotion() {
    const sections = document.querySelectorAll('main > section');
    if (!('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('motion-observed');
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('in-view', entry.isIntersecting);
        if (entry.isIntersecting) entry.target.classList.add('section-entered');
      });
    }, { rootMargin: '60px', threshold: 0 });
    sections.forEach(function (section) { observer.observe(section); });
    document.querySelectorAll('.guest-grid > div').forEach(function (node, index) {
      node.style.setProperty('--node-delay', (index * .35) + 's');
    });
  }

  function initBackToTop() {
    const button = document.getElementById('back-to-top');
    if (!button) return;
    function update() { button.classList.toggle('visible', window.scrollY > 700); }
    window.addEventListener('scroll', update, { passive: true });
    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
    update();
  }

  document.addEventListener('DOMContentLoaded', function () {
    finishBoot();
    initHeadline();
    initReveal();
    initSectionMotion();
    initScrollEffects();
    initHeroTilt();
    initCursorGlow();
    initBackToTop();
  });
})();
