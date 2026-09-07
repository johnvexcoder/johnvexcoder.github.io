(function () {
  const icon = function (body) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
  };

  const SKILLS = [
    { name: 'HTML', level: 10, color: '#E34F26', icon: icon('<path d="m4 3 1.6 17L12 22l6.4-2L20 3H4Z"/><path d="M8 8h8l-.5 3H8.3l.3 3H15l-.3 3-2.7.8L9.3 17l-.2-1.5"/>') },
    { name: 'CSS', level: 9.5, color: '#1572B6', icon: icon('<path d="m4 3 1.6 17L12 22l6.4-2L20 3H4Z"/><path d="M8 8h8l-.4 3H9l.2 3h6l-.3 3-2.9.8-2.8-.8"/>') },
    { name: 'Java', level: 8.5, color: '#EA2D2E', icon: icon('<path d="M8 18h8a3 3 0 0 0 3-3v-3h-3"/><path d="M6 12h10v5a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4v-5Z"/><path d="M9 8c3-1 1-3 4-4M8 22h9"/>') },
    { name: 'Python', level: 10, color: '#3776AB', icon: icon('<path d="M12 3c-4 0-4 2-4 4v3h8a3 3 0 0 1 3 3v4c0 2-2 4-7 4"/><path d="M12 21c4 0 4-2 4-4v-3H8a3 3 0 0 1-3-3V7c0-2 2-4 7-4"/><path d="M10 6h.01M14 18h.01"/>') },
    { name: 'Docker', level: 7.5, color: '#2496ED', icon: icon('<path d="M3 13h15c0 4-3 7-8 7-4 0-7-2-7-7Z"/><path d="M6 10h3v3H6zM9 7h3v3H9zM12 10h3v3h-3zM9 10h3v3H9z"/><path d="M18 11c1-1 2-1 3 0-.5 1.5-1.5 2-3 2"/>') },
    { name: 'Linux', level: 10, color: '#FCC624', icon: icon('<rect x="2.5" y="3.5" width="19" height="17" rx="3"/><path d="m7 8 4 4-4 4M13 16h4"/>') },
    { name: 'GitHub', level: 8.5, color: 'var(--text)', icon: icon('<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.7.9-1.1 2-.9 3.5v4"/><path d="M9 18c-4.5 2-5-2-7-2"/>') },
    { name: 'Proxmox', level: 7.5, color: '#E57000', icon: icon('<path d="m3 5 7 7-7 7M14 5l7 7-7 7M9 5l7 7-7 7"/>') },
    { name: 'SQLite', level: 8.5, color: '#0F80CC', icon: icon('<ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v14c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 12c0 1.7 3.1 3 7 3 1 0 2-.1 2.8-.3"/>') },
    { name: 'Next.js', level: 7, color: 'var(--text)', icon: icon('<circle cx="12" cy="12" r="9"/><path d="M8 16V8l8 8V8"/>') },
    { name: 'Nginx', level: 9, color: '#009639', icon: icon('<path d="m12 2 8 5v10l-8 5-8-5V7l8-5Z"/><path d="M8.5 16V8l7 8V8"/>') },
    { name: 'WordPress', level: 9, color: '#21759B', icon: icon('<circle cx="12" cy="12" r="9"/><path d="M7 8h3l4 10 3-8c.6-1.7-.4-2-1-2M6 8l4 10 2-5"/>') }
  ];

  const STATUS_LABELS = {
    active: { text: 'Active', class: 'active' },
    experimental: { text: 'Experimental', class: 'experimental' },
    concept: { text: 'Concept', class: 'concept' },
    demo: { text: 'Live Demo', class: 'active' },
    completed: { text: 'Completed', class: 'completed' },
    comingSoon: { text: 'Coming Soon', class: 'concept' }
  };

  let carouselProjects = [];
  let activeProjectIndex = 0;
  let carouselBound = false;
  let pointerStartX = null;
  let dragMoved = false;
  let carouselInView = false;
  let wheelLocked = false;
  let imageScrollFrame = null;
  let imageScrollTimer = null;
  let activeImageScroller = null;
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduceMotion = () => motionPreference.matches || document.documentElement.classList.contains('motion-lite');
  motionPreference.addEventListener('change', function () { if (reduceMotion()) clearImageAutoScroll(); });
  if (navigator.connection && navigator.connection.addEventListener) navigator.connection.addEventListener('change', function () { if (navigator.connection.saveData) clearImageAutoScroll(); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) clearImageAutoScroll(); });

  function clearImageAutoScroll() {
    if (imageScrollFrame) cancelAnimationFrame(imageScrollFrame);
    if (imageScrollTimer) clearTimeout(imageScrollTimer);
    imageScrollFrame = null;
    imageScrollTimer = null;
    if (activeImageScroller) activeImageScroller.classList.remove('is-auto-scrolling');
  }

  function startImageAutoScroll(container, delay) {
    clearImageAutoScroll();
    activeImageScroller = container || null;
    if (!container || reduceMotion() || document.hidden) return;
    const image = container.querySelector('img');
    if (!image) return;

    function begin() {
      if (activeImageScroller !== container) return;
      const maximum = container.scrollHeight - container.clientHeight;
      if (maximum < 20) return;
      const startTop = container.scrollTop;
      const distance = Math.max(0, maximum - startTop);
      const duration = Math.min(52000, Math.max(16000, distance / 78 * 1000));
      let startedAt = null;
      container.classList.add('is-auto-scrolling');

      function step(time) {
        if (activeImageScroller !== container || reduceMotion() || document.hidden) return;
        const bounds = container.getBoundingClientRect();
        if (bounds.bottom < 0 || bounds.top > innerHeight) { clearImageAutoScroll(); return; }
        if (startedAt === null) startedAt = time;
        const progress = Math.min(1, (time - startedAt) / duration);
        const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        container.scrollTop = startTop + distance * eased;
        if (progress < 1) {
          imageScrollFrame = requestAnimationFrame(step);
        } else {
          imageScrollFrame = null;
          container.classList.remove('is-auto-scrolling');
          imageScrollTimer = setTimeout(function () {
            if (activeImageScroller !== container) return;
            container.scrollTop = 0;
            startImageAutoScroll(container, 1900);
          }, 2600);
        }
      }
      imageScrollFrame = requestAnimationFrame(step);
    }

    if (!image.complete) {
      image.addEventListener('load', function () {
        if (activeImageScroller === container) startImageAutoScroll(container, delay);
      }, { once: true });
      return;
    }
    imageScrollTimer = setTimeout(begin, typeof delay === 'number' ? delay : 1500);
  }

  function pauseImageForInteraction(container, resumeDelay) {
    if (activeImageScroller !== container) return;
    clearImageAutoScroll();
    activeImageScroller = container;
    if (typeof resumeDelay === 'number') {
      imageScrollTimer = setTimeout(function () {
        startImageAutoScroll(container, 0);
      }, resumeDelay);
    }
  }

  function bindImageScroller(container) {
    if (!container || container.dataset.scrollBound === 'true') return;
    container.dataset.scrollBound = 'true';
    container.addEventListener('pointerenter', function () { pauseImageForInteraction(container); });
    container.addEventListener('pointerleave', function () { startImageAutoScroll(container, 1200); });
    container.addEventListener('pointerdown', function () { pauseImageForInteraction(container); });
    container.addEventListener('pointerup', function () { pauseImageForInteraction(container, 5000); });
    container.addEventListener('pointercancel', function () { pauseImageForInteraction(container, 3000); });
    container.addEventListener('wheel', function () { pauseImageForInteraction(container, 5000); }, { passive: true });
    container.addEventListener('focusin', function () { pauseImageForInteraction(container); });
    container.addEventListener('focusout', function () { pauseImageForInteraction(container, 2500); });
    container.addEventListener('keydown', function (event) {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(event.key)) {
        pauseImageForInteraction(container, 5000);
      }
    });
  }

  function activateProjectImage(cards) {
    if (!carouselInView) {
      clearImageAutoScroll();
      activeImageScroller = null;
      return;
    }
    const activeCard = cards[activeProjectIndex];
    const scroller = activeCard && activeCard.querySelector('.project-image.is-scrollable');
    startImageAutoScroll(scroller, 1700);
  }

  function wrapIndex(index, total) {
    return ((index % total) + total) % total;
  }

  function moveCarousel(step) {
    if (carouselProjects.length < 2) return;
    activeProjectIndex = wrapIndex(activeProjectIndex + step, carouselProjects.length);
    updateCarousel(true);
  }

  function updateCarousel(announce) {
    const viewport = document.getElementById('projects-grid');
    const cards = viewport ? Array.from(viewport.querySelectorAll('.project-card')) : [];
    const current = document.getElementById('carousel-current');
    const total = document.getElementById('carousel-total');
    const dots = document.getElementById('carousel-dots');
    const status = document.getElementById('carousel-status');
    const controls = document.querySelector('.carousel-controls');
    const hint = document.querySelector('.carousel-hint');
    if (!cards.length) return;

    activeProjectIndex = wrapIndex(activeProjectIndex, cards.length);

    cards.forEach(function (card, index) {
      let offset = index - activeProjectIndex;
      if (offset > cards.length / 2) offset -= cards.length;
      if (offset < -cards.length / 2) offset += cards.length;
      const distance = Math.abs(offset);
      const side = offset === 0 ? 0 : (offset < 0 ? -1 : 1);
      const scale = Math.max(0.7, 1 - distance * 0.12);
      const opacity = distance === 0 ? 1 : distance === 1 ? 0.68 : distance === 2 ? 0.26 : 0;

      card.style.setProperty('--carousel-x', (offset * 58) + '%');
      card.style.setProperty('--carousel-z', (-distance * 170) + 'px');
      card.style.setProperty('--carousel-rotate', (side * -8) + 'deg');
      card.style.setProperty('--carousel-scale', scale);
      card.style.setProperty('--carousel-opacity', opacity);
      card.style.zIndex = String(20 - distance);
      card.classList.toggle('is-active', offset === 0);
      card.classList.toggle('is-adjacent', distance === 1);
      card.setAttribute('aria-hidden', offset === 0 ? 'false' : 'true');
      card.querySelectorAll('a, button').forEach(function (control) {
        if (offset === 0) control.removeAttribute('tabindex');
        else control.setAttribute('tabindex', '-1');
      });
      const imageScroller = card.querySelector('.project-image.is-scrollable');
      if (imageScroller) imageScroller.setAttribute('tabindex', offset === 0 ? '0' : '-1');
    });

    if (current) current.textContent = String(activeProjectIndex + 1).padStart(2, '0');
    if (total) total.textContent = String(cards.length).padStart(2, '0');
    if (controls) controls.hidden = cards.length < 2;
    if (hint) hint.hidden = cards.length < 2;
    if (dots) {
      dots.querySelectorAll('button').forEach(function (dot, index) {
        dot.classList.toggle('active', index === activeProjectIndex);
        dot.setAttribute('aria-current', index === activeProjectIndex ? 'true' : 'false');
      });
    }
    if (announce && status) {
      status.textContent = 'Project ' + (activeProjectIndex + 1) + ' of ' + cards.length + ': ' + carouselProjects[activeProjectIndex].name;
    }
    activateProjectImage(cards);
  }

  function buildCarouselNavigation() {
    const dots = document.getElementById('carousel-dots');
    if (!dots) return;
    dots.innerHTML = carouselProjects.map(function (project, index) {
      return '<button type="button" aria-label="Show ' + escapeHtml(project.name) + '" data-carousel-index="' + index + '"><span></span></button>';
    }).join('');
    dots.querySelectorAll('button').forEach(function (dot) {
      dot.addEventListener('click', function () {
        activeProjectIndex = Number(dot.getAttribute('data-carousel-index')) || 0;
        updateCarousel(true);
      });
    });
  }

  function bindCarousel() {
    if (carouselBound) return;
    const viewport = document.getElementById('projects-grid');
    const previous = document.getElementById('project-prev');
    const next = document.getElementById('project-next');
    if (!viewport || !previous || !next) return;
    carouselBound = true;

    if ('IntersectionObserver' in window) {
      const visibilityObserver = new IntersectionObserver(function (entries) {
        carouselInView = entries[0].isIntersecting;
        if (carouselInView) {
          updateCarousel(false);
        } else {
          clearImageAutoScroll();
          activeImageScroller = null;
        }
      }, { threshold: 0.12 });
      visibilityObserver.observe(viewport);
    } else {
      carouselInView = true;
      updateCarousel(false);
    }

    previous.addEventListener('click', function () { moveCarousel(-1); });
    next.addEventListener('click', function () { moveCarousel(1); });
    viewport.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') { event.preventDefault(); moveCarousel(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); moveCarousel(1); }
      if (event.key === 'Home') { event.preventDefault(); activeProjectIndex = 0; updateCarousel(true); }
      if (event.key === 'End') { event.preventDefault(); activeProjectIndex = carouselProjects.length - 1; updateCarousel(true); }
    });
    viewport.addEventListener('pointerdown', function (event) {
      pointerStartX = event.clientX;
      dragMoved = false;
      viewport.classList.add('is-dragging');
    });
    viewport.addEventListener('pointerup', function (event) {
      if (pointerStartX === null) return;
      const distance = event.clientX - pointerStartX;
      pointerStartX = null;
      viewport.classList.remove('is-dragging');
      if (Math.abs(distance) > 45) {
        dragMoved = true;
        event.preventDefault();
        moveCarousel(distance < 0 ? 1 : -1);
      }
    });
    viewport.addEventListener('pointercancel', function () {
      pointerStartX = null;
      viewport.classList.remove('is-dragging');
    });
    viewport.addEventListener('click', function (event) {
      if (!dragMoved) return;
      event.preventDefault();
      event.stopPropagation();
      dragMoved = false;
    }, true);
    viewport.addEventListener('wheel', function (event) {
      if (Math.abs(event.deltaX) < 8 && !event.shiftKey) return;
      event.preventDefault();
      if (wheelLocked) return;
      wheelLocked = true;
      moveCarousel(event.deltaX > 0 || event.deltaY > 0 ? 1 : -1);
      setTimeout(function () { wheelLocked = false; }, 420);
    }, { passive: false });
  }

  function renderSkills() {
    const container = document.getElementById('skills-grid');
    if (!container) return;

    container.innerHTML = SKILLS.map(function (skill, index) {
      const label = skill.level >= 9 ? 'Advanced' : skill.level >= 8 ? 'Proficient' : 'Working knowledge';
      const pct = label === 'Advanced' ? 100 : label === 'Proficient' ? 72 : 44;
      return `
        <div class="skill-card reveal reveal-delay-${index % 4}">
          <div class="skill-head">
            <div class="skill-name-group">
              <div class="skill-icon" style="--skill-color:${skill.color}" aria-hidden="true">${skill.icon}</div>
              <span class="skill-name">${skill.name}</span>
            </div>
            <span class="skill-level">${label}</span>
          </div>
          <div class="skill-bar-wrap">
            <div class="progress-bar" role="img" aria-label="${skill.name}: ${label}, based on practical project use">
              <div class="progress-bar-bar" data-level="${pct}" style="width:0%"></div>
            </div>
            <span class="skill-bar-val">Project use</span>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderProjects(filter, search) {
    const grid = document.getElementById('projects-grid');
    const empty = document.getElementById('projects-empty');
    if (!grid) return;

    let projects = PROJECTS_DATA.slice();

    if (filter && filter !== 'all') {
      projects = projects.filter(function (p) {
        return p.category === filter;
      });
    }

    if (search) {
      const q = search.toLowerCase();
      projects = projects.filter(function (p) {
        return p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.technologies || []).some(function (t) { return t.toLowerCase().includes(q); });
      });
    }

    if (projects.length === 0) {
      carouselProjects = [];
      grid.innerHTML = '';
      if (empty) empty.classList.add('show');
      const carousel = document.getElementById('project-carousel');
      if (carousel) carousel.classList.add('is-empty');
      return;
    }

    if (empty) empty.classList.remove('show');
    const carousel = document.getElementById('project-carousel');
    if (carousel) carousel.classList.remove('is-empty');
    carouselProjects = projects;
    activeProjectIndex = 0;

    grid.innerHTML = projects.map(function (project, projectIndex) {
      const status = STATUS_LABELS[project.status] || STATUS_LABELS.completed;
      const techTags = project.technologies.slice(0, 5).map(function (t) {
        return '<span class="tag">' + escapeHtml(t) + '</span>';
      }).join('');

      const useScrollImage = project.scrollImage && !(navigator.connection && navigator.connection.saveData);
      const imageSource = useScrollImage ? project.scrollImage : project.image;
      const imageFallback = useScrollImage ? project.image : project.imageFallback;
      const imageContent = imageSource
        ? '<img src="' + imageSource + '" data-fallback="' + (imageFallback || '') + '" data-placeholder="pj-img-' + project.id + '" alt="' + escapeHtml(project.name) + ' screenshot" loading="eager" decoding="async">'
        : '';

      const serviceVisual = project.visualType === 'service'
        ? '<div class="no-image service-visual"><span class="service-orbit" aria-hidden="true"></span><img src="' + project.logo + '" alt=""><strong>AGENT SERVICE</strong><span>' + escapeHtml(project.visualLabel || 'Dedicated infrastructure service') + '</span></div>'
        : '';
      const fallbackContent = project.image
        ? '<div class="no-image" id="pj-img-' + project.id + '" style="display:none"><span>screenshot available</span></div>'
        : serviceVisual || '<div class="no-image"><span>terminal/CLI project</span></div>';

      const logoContent = project.logo && project.visualType !== 'service'
        ? '<span class="project-logo"><img src="' + project.logo + '" data-fallback="' + (project.logoFallback || '') + '" alt=""></span>'
        : '';

      const disclaimer = project.disclaimer
        ? '<span class="tag accent" style="margin-top:0.6rem">' + escapeHtml(project.disclaimer) + '</span>'
        : '';
      const facts = (project.facts || []).map(function (fact) {
        return '<li>' + escapeHtml(fact) + '</li>';
      }).join('');

      const actions = [];
      actions.push('<button type="button" class="project-action case-study-trigger" data-case-study="' + project.id + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5h16v14H4z"/><path d="M8 9h8M8 13h5"/></svg>Case study</button>');
      if (project.github) actions.push('<a href="' + project.github + '" class="project-action" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>GitHub</a>');
      if (project.docs) actions.push('<a href="' + project.docs + '" class="project-action" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>Docs</a>');
      if (project.release && project.status !== 'concept') actions.push('<a href="' + project.release + '" class="project-action" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5 4 4L8 20l-4 1 1-4Z"/><path d="m13 7 4 4"/></svg>Releases</a>');
      if (project.demo) actions.push('<a href="' + project.demo + '" class="project-action" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>Live Demo</a>');

      return `
        <article class="project-card" data-category="${project.category}" data-id="${project.id}" data-carousel-index="${projectIndex}">
          <div class="project-image${project.scrollImage ? ' is-scrollable' : ''}"${project.scrollImage ? ' tabindex="0" aria-label="Scrollable full-page screenshot for ' + escapeHtml(project.name) + '"' : ''}>
            ${imageContent}
            ${fallbackContent}
            ${logoContent}
            <div class="project-image-overlay">
              <span class="status-badge ${status.class}">${status.text}</span>
            </div>
          </div>
          <div class="project-body">
            <div class="project-head">
              <div>
                <h3 class="project-name">${escapeHtml(project.name)}</h3>
                <p class="project-category">${escapeHtml(project.category)}</p>
              </div>
              <span class="status-badge ${status.class}" style="flex-shrink:0">${status.text}</span>
            </div>
            <p class="project-desc">${escapeHtml(project.shortDescription)}</p>
            ${disclaimer}
            ${facts ? '<ul class="project-facts">' + facts + '</ul>' : ''}
            <div class="project-tags">${techTags}</div>
            <div class="project-actions">${actions.join('')}</div>
          </div>
        </article>
      `;
    }).join('');

    grid.querySelectorAll('img[data-fallback]').forEach(function (image) {
      image.addEventListener('error', function handleImageError() {
        const fallback = image.getAttribute('data-fallback');
        if (fallback && image.src.indexOf(fallback) === -1) {
          image.src = fallback;
          return;
        }
        image.style.display = 'none';
        const placeholderId = image.getAttribute('data-placeholder');
        const placeholder = placeholderId && document.getElementById(placeholderId);
        if (placeholder) placeholder.style.display = 'grid';
      });
    });

    grid.querySelectorAll('.project-image.is-scrollable').forEach(bindImageScroller);

    grid.querySelectorAll('.project-card').forEach(function (card) {
      card.addEventListener('click', function (event) {
        const index = Number(card.getAttribute('data-carousel-index'));
        if (index === activeProjectIndex) return;
        event.preventDefault();
        activeProjectIndex = index;
        updateCarousel(true);
      });
    });

    buildCarouselNavigation();
    updateCarousel(false);

    animateBars();
  }

  function initCaseStudies() {
    const modal = document.getElementById('case-study-modal');
    const closeButton = document.getElementById('case-study-close');
    if (!modal || !closeButton) return;
    let previousFocus = null;

    function closeCaseStudy() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      modal.inert = true;
      document.body.classList.remove('modal-open');
      if (previousFocus && previousFocus.focus) previousFocus.focus();
    }

    function openCaseStudy(project, trigger) {
      previousFocus = trigger;
      document.getElementById('case-study-title').textContent = project.name;
      document.getElementById('case-study-kicker').textContent = project.category + ' / PROJECT CASE STUDY';
      document.getElementById('case-study-context').textContent = project.shortDescription;
      document.getElementById('case-study-build').textContent = project.description;
      document.getElementById('case-study-response').textContent = project.problemSolution || project.shortDescription;
      document.getElementById('case-study-meta').innerHTML = '<span class="status-badge ' + (STATUS_LABELS[project.status] || STATUS_LABELS.completed).class + '">' + escapeHtml((STATUS_LABELS[project.status] || STATUS_LABELS.completed).text) + '</span><span>' + escapeHtml(project.category) + '</span><span>Independent project</span>';
      document.getElementById('case-study-facts').innerHTML = (project.facts || []).map(function (fact) { return '<li>' + escapeHtml(fact) + '</li>'; }).join('');
      document.getElementById('case-study-stack').innerHTML = project.technologies.map(function (tech) { return '<span class="tag">' + escapeHtml(tech) + '</span>'; }).join('');
      const links = [];
      if (project.github) links.push('<a class="btn primary" href="' + project.github + '" target="_blank" rel="noopener noreferrer">View source<svg><use href="#i-external"/></svg></a>');
      if (project.docs) links.push('<a class="btn secondary" href="' + project.docs + '" target="_blank" rel="noopener noreferrer">Read documentation<svg><use href="#i-external"/></svg></a>');
      if (project.demo) links.push('<a class="btn secondary" href="' + project.demo + '" target="_blank" rel="noopener noreferrer">Open live demo<svg><use href="#i-external"/></svg></a>');
      document.getElementById('case-study-actions').innerHTML = links.join('');
      modal.inert = false;
      modal.setAttribute('aria-hidden', 'false');
      modal.classList.add('open');
      document.body.classList.add('modal-open');
      setTimeout(function () { closeButton.focus(); }, 30);
    }

    document.addEventListener('click', function (event) {
      const trigger = event.target.closest('.case-study-trigger');
      if (!trigger) return;
      event.preventDefault();
      event.stopPropagation();
      const project = PROJECTS_DATA.find(function (item) { return item.id === trigger.dataset.caseStudy; });
      if (project) openCaseStudy(project, trigger);
    });
    closeButton.addEventListener('click', closeCaseStudy);
    modal.addEventListener('click', function (event) { if (event.target === modal) closeCaseStudy(); });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal.classList.contains('open')) closeCaseStudy();
      if (event.key !== 'Tab' || !modal.classList.contains('open')) return;
      const focusable = Array.from(modal.querySelectorAll('a[href],button:not([disabled])'));
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  }

  function initCarouselGuide() {
    const guide = document.getElementById('carousel-guide');
    const close = document.getElementById('carousel-guide-close');
    const viewport = document.getElementById('projects-grid');
    if (!guide || !viewport) return;
    let seen = false;
    try { seen = localStorage.getItem('j0hnvexcoder-carousel-guide-v2') === 'seen'; } catch (error) {}
    if (seen) return;
    const dismiss = function () {
      guide.classList.remove('show');
      try { localStorage.setItem('j0hnvexcoder-carousel-guide-v2', 'seen'); } catch (error) {}
    };
    requestAnimationFrame(function () { guide.classList.add('show'); });
    if (close) close.addEventListener('click', dismiss);
    viewport.addEventListener('pointerdown', dismiss, { once: true });
    viewport.addEventListener('keydown', dismiss, { once: true });
    setTimeout(dismiss, 7000);
  }

  function renderFeatured() {
    const grid = document.getElementById('featured-grid');
    if (!grid) return;

    grid.innerHTML = UPCOMING_PROJECTS.map(function (p, i) {
      const icons = {
        mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
        lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
        file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M9 13h6M9 17h3"/></svg>'
      };
      const caps = p.capabilities.map(function (c) {
        return '<span class="tag">' + escapeHtml(c) + '</span>';
      }).join('');
      return `
        <article class="featured-card reveal reveal-delay-${i % 3}">
          <div class="featured-card-top">
            <div class="featured-icon">${icons[p.icon] || icons.file}</div>
            <span class="status-badge ${p.status === 'concept' ? 'concept' : 'experimental'}">${escapeHtml(p.tagline)}</span>
          </div>
          <h3 class="featured-name">${escapeHtml(p.name)}</h3>
          <p class="featured-desc">${escapeHtml(p.description)}</p>
          <div class="featured-capabilities">${caps}</div>
        </article>
      `;
    }).join('');
  }

  function renderGitHub() {
    const reposContainer = document.getElementById('github-repos');
    if (!reposContainer) return;

    reposContainer.innerHTML = PROJECTS_DATA.filter(function (p) {
      return p.github;
    }).slice(0, 6).map(function (p) {
      const langDots = {
        'React': '#61DAFB',
        'TypeScript': '#3178C6',
        'Express': '#000000',
        'WebSocket': '#000000',
        'Tailwind': '#06B6D4',
        'ECharts': '#FF6384',
        'SQLite': '#003B57',
        'Docker': '#2496ED',
        'Python': '#3776AB',
        'PySide6': '#3776AB',
        'Pillow': '#A4C639',
        'CLI': '#3776AB',
        'Desktop': '#512BD4',
        'Next.js': '#000000',
        'Redis': '#DC382D',
        'FFmpeg': '#007808',
        'TMDB': '#01D277',
        'curses': '#3776AB',
        'Terminal': '#4EAA25',
        'ZSH': '#4EAA25',
        'Bash': '#4EAA25',
        'Linux': '#FCC624',
        'HTML': '#E34F26',
        'CSS': '#1572B6',
        'JavaScript': '#F7DF1E',
        'UI/UX': '#E34F26'
      };
      const primaryTech = p.technologies[0];
      const dotColor = langDots[primaryTech] || '#94A3B8';
      return `
        <a href="${p.github}" class="github-repo" target="_blank" rel="noopener noreferrer">
          <p class="github-repo-name">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            ${escapeHtml(p.name)}
          </p>
          <p class="github-repo-desc">${escapeHtml(p.shortDescription)}</p>
          <div class="github-repo-meta">
            <span><span class="lang-dot" style="background:${dotColor}"></span>${escapeHtml(primaryTech)}</span>
            <span>${escapeHtml(p.category)}</span>
            <span style="margin-left:auto">${p.status === 'active' ? '●' : ''}</span>
          </div>
        </a>
      `;
    }).join('');
  }

  function fetchGitHubStats() {
    const reposEl = document.getElementById('gh-repos');
    const followersEl = document.getElementById('gh-followers');
    const starsEl = document.getElementById('gh-stars');
    const noteEl = document.getElementById('github-api-note');

    if (navigator.connection && navigator.connection.saveData) {
      if (noteEl) noteEl.textContent = 'Data saver is on. Open GitHub for current public activity.';
      return;
    }

    Promise.all([
      fetch('https://api.github.com/users/johnvexcoder'),
      fetch('https://api.github.com/users/johnvexcoder/repos?per_page=100&sort=updated')
    ])
      .then(function (responses) {
        if (!responses[0].ok || !responses[1].ok) throw new Error('GitHub API request failed');
        return Promise.all(responses.map(function (res) { return res.json(); }));
      })
      .then(function (results) {
        const profile = results[0];
        const repos = results[1];
        const stars = repos.reduce(function (total, repo) { return total + (repo.stargazers_count || 0); }, 0);
        animateValue(reposEl, profile.public_repos ?? 0);
        animateValue(followersEl, profile.followers ?? 0);
        animateValue(starsEl, stars);
        if (noteEl) noteEl.textContent = 'Public GitHub information loaded live.';
      })
      .catch(function () {
        if (reposEl) reposEl.textContent = '—';
        if (followersEl) followersEl.textContent = '—';
        if (starsEl) starsEl.textContent = '—';
        if (noteEl) noteEl.textContent = 'Live GitHub stats unavailable right now. Stats load from the public API when reachable.';
      });
  }

  function animateValue(el, target) {
    if (!el) return;
    if (reduceMotion()) { el.textContent = String(target); return; }
    const duration = 900;
    const startTime = performance.now();
    (function tick(now) {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    })(startTime);
  }

  function animateBars() {
    document.querySelectorAll('.progress-bar-bar').forEach(function (bar) {
      const target = parseFloat(bar.getAttribute('data-level'));
      if (!target) return;
      requestAnimationFrame(function () {
        setTimeout(function () {
          bar.style.width = target + '%';
        }, 200);
      });
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function initProjects() {
    renderSkills();
    renderProjects('all', '');
    bindCarousel();
    initCarouselGuide();
    initCaseStudies();
    renderFeatured();
    renderGitHub();
    fetchGitHubStats();

    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('project-search');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        renderProjects(filter, searchInput ? searchInput.value.trim() : '');
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        const activeFilter = document.querySelector('.filter-btn.active');
        const filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
        renderProjects(filter, searchInput.value.trim());
      });
    }

    window.addEventListener('load', function () {
      animateBars();
    });
  }

  document.addEventListener('DOMContentLoaded', initProjects);
})();
