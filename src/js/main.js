(function () {
  function initForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      const status = document.getElementById('form-status');
      const name = document.getElementById('contact-name');
      const email = document.getElementById('contact-email');
      const subject = document.getElementById('contact-subject');
      const message = document.getElementById('contact-message');

      if (!name || !email || !message) return;

      let valid = true;

      function setError(el, msg) {
        const field = el.closest('.form-group');
        let err = field.querySelector('.form-error');
        if (!err) {
          err = document.createElement('span');
          err.className = 'form-error';
          err.id = el.id + '-error';
          field.appendChild(err);
        }
        err.textContent = msg;
        field.classList.add('has-error');
        el.setAttribute('aria-invalid', 'true');
        el.setAttribute('aria-describedby', err.id);
        valid = false;
      }

      function clearError(el) {
        const field = el.closest('.form-group');
        const err = field.querySelector('.form-error');
        if (err) err.remove();
        field.classList.remove('has-error');
        el.removeAttribute('aria-invalid');
        el.removeAttribute('aria-describedby');
      }

      [name, email, message].forEach(function (el) { clearError(el); });

      if (!name.value.trim()) setError(name, 'Please enter your name.');
      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        setError(email, 'Please enter a valid email address.');
      }
      if (!message.value.trim()) {
        setError(message, 'Please enter a message.');
      } else if (message.value.trim().length < 5) {
        setError(message, 'Message is too short.');
      }

      if (!valid) {
        e.preventDefault();
        status.textContent = 'Please fix the highlighted fields.';
        status.className = 'form-status error';
        status.style.display = 'block';
        return;
      }

      e.preventDefault();
      status.className = 'form-status info';
      status.textContent = 'Opening your email client...';
      status.style.display = 'block';
      const mailSubject = subject && subject.value.trim() ? subject.value.trim() : 'Portfolio enquiry from ' + name.value.trim();
      const mailBody = 'Name: ' + name.value.trim() + '\nEmail: ' + email.value.trim() + '\n\n' + message.value.trim();
      window.location.href = 'mailto:johnangelodejoya@gmail.com?subject=' + encodeURIComponent(mailSubject) + '&body=' + encodeURIComponent(mailBody);
      const submitBtn = document.getElementById('contact-submit');
      if (submitBtn) {
        submitBtn.classList.add('sent');
        setTimeout(function () { submitBtn.classList.remove('sent'); }, 3000);
      }
    });
  }

  function initModal() {
    const modal = document.getElementById('contact-modal');
    const openBtn = document.getElementById('open-contact-modal');
    const closeBtn = document.getElementById('close-contact-modal');
    if (!modal) return;
    let previousFocus = null;

    function getFocusableElements() {
      return Array.from(modal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
    }

    function open() {
      previousFocus = document.activeElement;
      modal.inert = false;
      modal.setAttribute('aria-hidden', 'false');
      modal.classList.add('open');
      document.body.classList.add('modal-open');
      const first = getFocusableElements()[0];
      if (first) setTimeout(function () { first.focus(); }, 50);
    }

    function close() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      modal.inert = true;
      document.body.classList.remove('modal-open');
      if (previousFocus && previousFocus.focus) previousFocus.focus();
    }

    if (openBtn) openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);

    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        close();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        close();
      }
      if (e.key === 'Tab' && modal.classList.contains('open')) {
        const focusable = getFocusableElements();
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
  }

  function initCopyEmail() {
    const button = document.getElementById('copy-email');
    if (!button) return;
    const label = button.querySelector('span');
    button.addEventListener('click', function () {
      const email = 'johnangelodejoya@gmail.com';
      const done = function () {
        if (label) label.textContent = 'Email copied';
        button.classList.add('copied');
        setTimeout(function () { if (label) label.textContent = 'Copy email address'; button.classList.remove('copied'); }, 2200);
      };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(email).then(done).catch(function () { window.location.href = 'mailto:' + email; });
      else window.location.href = 'mailto:' + email;
    });
  }

  function initFooterYear() {
    const now = new Date();
    const el = document.getElementById('footer-year');
    const nowDate = document.getElementById('now-date');
    if (el) el.textContent = now.getFullYear();
    if (nowDate) nowDate.textContent = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initForm();
    initModal();
    initCopyEmail();
    initFooterYear();
  });
})();
