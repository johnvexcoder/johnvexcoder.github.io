(function () {
  'use strict';

  const section = document.getElementById('testimonials');
  const content = document.getElementById('testimonials-content');
  const modal = document.getElementById('review-modal');
  if (!section || !content || !modal) return;

  const form = document.getElementById('review-form');
  const submit = document.getElementById('review-submit');
  const status = document.getElementById('review-submit-status');
  const opener = document.getElementById('open-review-modal');
  const success = document.getElementById('review-success');
  const reduceMotion = () => document.documentElement.classList.contains('motion-lite') || matchMedia('(prefers-reduced-motion: reduce)').matches;
  let processing = false;
  let lastFocus = null;

  function text(tag, value, className) {
    const node = document.createElement(tag);
    node.textContent = value;
    if (className) node.className = className;
    return node;
  }

  function safeUrl(value, localOnly) {
    try {
      const url = new URL(value, location.href);
      return ['https:', 'http:'].includes(url.protocol) && (!localOnly || url.origin === location.origin) ? url.href : '';
    } catch (_) { return ''; }
  }

  function cleanReview(row) {
    if (!row || typeof row !== 'object' || typeof row.email !== 'undefined') return null;
    const name = String(row.name || '').trim().slice(0, 60);
    const review = String(row.review || '').trim().slice(0, 600);
    const rating = Number(row.rating);
    if (!name || review.length < 20 || !Number.isInteger(rating) || rating < 1 || rating > 5) return null;
    return {
      name, review, rating,
      role: String(row.role || '').trim().slice(0, 80),
      company: String(row.company || '').trim().slice(0, 80),
      project: String(row.project || '').trim().slice(0, 80),
      date: String(row.date || '').trim().slice(0, 50),
      projectUrl: row.projectUrl ? safeUrl(String(row.projectUrl)) : '',
      avatar: row.avatar ? safeUrl(String(row.avatar), true) : ''
    };
  }

  function cardFor(row) {
    const card = document.createElement('article');
    card.className = 'testimonial-card';
    card.tabIndex = 0;
    const top = text('div', '', 'testimonial-top');
    top.append(text('small', 'CLIENT / FEEDBACK'));
    const stars = text('span', '★'.repeat(row.rating) + '☆'.repeat(5 - row.rating), 'testimonial-stars');
    stars.setAttribute('aria-label', row.rating + ' out of 5 stars');
    top.append(stars);
    card.append(top, text('blockquote', '“' + row.review + '”', 'testimonial-quote'));
    const identity = text('div', '', 'testimonial-identity');
    const avatar = text('span', '', 'testimonial-avatar');
    if (row.avatar) {
      const img = document.createElement('img');
      img.src = row.avatar;
      img.alt = '';
      img.loading = 'lazy';
      avatar.append(img);
    } else {
      avatar.textContent = row.name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
    }
    const who = text('span', '');
    const credit = row.company === row.name ? 'Company' : ([row.role, row.company].filter(Boolean).join(' · ') || 'Client');
    who.append(text('strong', row.name), text('small', credit));
    identity.append(avatar, who);
    card.append(identity);
    if (row.project || row.date || row.projectUrl) {
      const bottom = text('div', '', 'testimonial-bottom');
      if (row.project || row.date) bottom.append(text('span', [row.project, row.date].filter(Boolean).join(' · '), 'testimonial-project'));
      if (row.projectUrl) {
        const link = text('a', 'View project ↗');
        link.href = row.projectUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        bottom.append(link);
      }
      card.append(bottom);
    }
    return card;
  }

  function renderCarousel(rows) {
    const carousel = text('div', '', 'testimonials-carousel');
    const track = text('div', '', 'testimonials-track');
    track.setAttribute('role', 'region');
    track.setAttribute('aria-roledescription', 'carousel');
    track.setAttribute('aria-label', 'Approved client testimonials');
    track.tabIndex = 0;
    rows.forEach(row => track.append(cardFor(row)));
    const controls = text('div', '', 'testimonials-controls');
    const prev = text('button', '←', 'testimonials-control');
    const next = text('button', '→', 'testimonials-control');
    prev.type = next.type = 'button';
    prev.setAttribute('aria-label', 'Previous testimonial');
    next.setAttribute('aria-label', 'Next testimonial');
    const dots = text('div', '', 'testimonials-dots');
    dots.setAttribute('role', 'group');
    dots.setAttribute('aria-label', 'Choose testimonial');
    const dotButtons = rows.map((_, index) => {
      const dot = text('button', '', 'testimonials-dot');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Go to testimonial ' + (index + 1));
      dot.addEventListener('click', () => go(index));
      dots.append(dot);
      return dot;
    });
    controls.append(prev, dots, next);
    carousel.append(track, controls);
    content.replaceChildren(carousel);
    let current = 0;
    function visibleCount() {
      const cards = track.children;
      if (!cards.length) return 1;
      return Math.max(1, Math.round(track.clientWidth / cards[0].getBoundingClientRect().width));
    }
    function sync() {
      current = Math.max(0, Math.min(rows.length - 1, Math.round(track.scrollLeft / Math.max(1, track.children[0].getBoundingClientRect().width + 14))));
      prev.disabled = current === 0;
      next.disabled = current >= rows.length - visibleCount();
      dotButtons.forEach((dot, index) => dot.setAttribute('aria-current', String(index === current)));
    }
    function go(index) {
      current = Math.max(0, Math.min(index, rows.length - visibleCount()));
      track.children[current].scrollIntoView({ behavior: reduceMotion() ? 'instant' : 'smooth', block: 'nearest', inline: 'start' });
      sync();
    }
    prev.addEventListener('click', () => go(current - 1));
    next.addEventListener('click', () => go(current + 1));
    track.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        go(current + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    let pointerX = null;
    track.addEventListener('pointerdown', event => { if (event.pointerType === 'mouse') pointerX = event.clientX; });
    track.addEventListener('pointerup', event => {
      if (pointerX !== null && Math.abs(event.clientX - pointerX) > 45) go(current + (event.clientX < pointerX ? 1 : -1));
      pointerX = null;
    });
    track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    addEventListener('resize', sync, { passive: true });
    sync();
  }

  fetch('data/testimonials.json', { cache: 'no-cache' })
    .then(response => { if (!response.ok) throw new Error('Testimonials unavailable'); return response.json(); })
    .then(data => {
      if (!Array.isArray(data)) return;
      const approved = data.map(cleanReview).filter(Boolean);
      if (approved.length) renderCarousel(approved);
    })
    .catch(() => { /* Keep the public empty state if local data cannot load. */ });

  function setStatus(message, type) {
    status.textContent = message;
    status.className = 'review-submit-status' + (type ? ' ' + type : '');
  }
  function openModal() {
    lastFocus = opener;
    modal.inert = false;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('review-modal-open');
    document.getElementById('close-review-modal').focus();
  }
  function closeModal() {
    if (processing) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    modal.inert = true;
    document.body.classList.remove('review-modal-open');
    setTimeout(() => (lastFocus && lastFocus.isConnected && lastFocus !== document.body ? lastFocus : opener).focus(), 0);
  }
  opener.addEventListener('click', openModal);
  document.getElementById('close-review-modal').addEventListener('click', closeModal);
  document.getElementById('review-success-close').addEventListener('click', closeModal);
  modal.addEventListener('pointerdown', event => { if (event.target === modal) closeModal(); });
  modal.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); closeModal(); return; }
    if (event.key !== 'Tab') return;
    const items = Array.from(modal.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href]')).filter(node => node.getClientRects().length);
    if (!items.length) return;
    if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items[items.length - 1].focus(); }
    else if (!event.shiftKey && document.activeElement === items[items.length - 1]) { event.preventDefault(); items[0].focus(); }
  });

  const ratingInputs = Array.from(form.querySelectorAll('input[name="rating"]'));
  function paintRating() {
    const selected = Number(form.querySelector('input[name="rating"]:checked')?.value || 0);
    ratingInputs.forEach(input => input.closest('label').classList.toggle('is-selected', Number(input.value) <= selected));
  }
  ratingInputs.forEach(input => input.addEventListener('change', () => { paintRating(); clearError('rating'); }));
  const message = document.getElementById('review-message');
  message.addEventListener('input', () => { document.getElementById('review-count').textContent = message.value.length + ' / 600'; clearError('message'); });
  function clearError(id) {
    document.getElementById('review-' + id + '-error').textContent = '';
    document.getElementById('review-' + id)?.removeAttribute('aria-invalid');
  }
  form.addEventListener('input', event => { if (event.target.id?.startsWith('review-') && event.target.id !== 'review-message') clearError(event.target.id.slice(7)); });
  form.addEventListener('change', event => { if (event.target.id?.startsWith('review-')) clearError(event.target.id.slice(7)); });

  function validate() {
    const values = {
      name: document.getElementById('review-name').value.trim(),
      email: document.getElementById('review-email').value.trim(),
      company: document.getElementById('review-company').value.trim(),
      project: document.getElementById('review-project').value,
      rating: Number(form.querySelector('input[name="rating"]:checked')?.value || 0),
      message: message.value.trim(),
      url: document.getElementById('review-url').value.trim(),
      permission: document.getElementById('review-permission').checked,
      captcha: form.querySelector('[name="h-captcha-response"]')?.value.trim() || ''
    };
    const errors = {};
    const containsMarkup = value => /[<>]/.test(value);
    if (!values.name || values.name.length > 60) errors.name = 'Enter your name (up to 60 characters).';
    else if (containsMarkup(values.name)) errors.name = 'Use plain text for your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || values.email.length > 254) errors.email = 'Enter a valid email address.';
    if (values.company.length > 80) errors.company = 'Keep this under 80 characters.';
    else if (containsMarkup(values.company)) errors.company = 'Use plain text for your company or profession.';
    if (!values.project) errors.project = 'Choose the project or service.';
    if (!Number.isInteger(values.rating) || values.rating < 1 || values.rating > 5) errors.rating = 'Choose a rating from one to five stars.';
    if (values.message.length < 20 || values.message.length > 600) errors.message = 'Write at least 20 characters (up to 600).';
    else if (containsMarkup(values.message)) errors.message = 'Use plain text for your review.';
    if (values.url.length > 250 || (values.url && (!/^https?:\/\//i.test(values.url) || !safeUrl(values.url)))) errors.url = 'Enter a valid http:// or https:// URL (up to 250 characters).';
    if (!values.permission) errors.permission = 'Please confirm permission to publish your review.';
    if (!values.captcha) errors.captcha = 'Complete the verification above before submitting.';
    form.querySelectorAll('.form-error').forEach(node => node.textContent = '');
    Object.entries(errors).forEach(([id, error]) => {
      document.getElementById('review-' + id + '-error').textContent = error;
      document.getElementById('review-' + id)?.setAttribute('aria-invalid', 'true');
    });
    if (Object.keys(errors).length) {
      const first = Object.keys(errors)[0];
      (document.getElementById('review-' + first) || (first === 'rating' ? ratingInputs[0] : form.querySelector('.h-captcha'))).focus();
      return null;
    }
    return values;
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (processing) return;
    const values = validate();
    if (!values) return;
    processing = true;
    submit.disabled = true;
    submit.classList.add('is-loading');
    submit.querySelector('span:nth-child(2)').textContent = 'Submitting…';
    setStatus('Submitting your review…', 'info');
    try {
      const data = new FormData(form);
      data.set('name', values.name);
      data.set('email', values.email);
      data.set('company_profession', values.company);
      data.set('project_service', values.project);
      data.set('rating', String(values.rating) + ' out of 5 stars');
      data.set('message', values.message);
      data.set('project_url', values.url);
      const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success !== true) {
        const error = new Error('Submission failed');
        error.rateLimited = response.status === 429;
        throw error;
      }
      form.hidden = true;
      success.hidden = false;
      modal.querySelector('.review-dialog').classList.add('is-success');
      modal.setAttribute('aria-labelledby', 'review-success-title');
      document.getElementById('review-success-close').focus();
    } catch (error) {
      setStatus(error?.rateLimited ? 'Too many attempts. Please wait a while before trying again.' : 'We couldn’t send your review. Please check your connection and try again.', 'error');
      submit.querySelector('span:nth-child(2)').textContent = 'Try Again';
      if (window.hcaptcha?.reset) window.hcaptcha.reset();
    } finally {
      processing = false;
      submit.disabled = false;
      submit.classList.remove('is-loading');
    }
  });
})();
