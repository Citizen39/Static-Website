/* ============================================================
   Citizen39 — client-side hash router + contact form.
   No dependencies. Content lives in the HTML; this only toggles
   which <section.page> is visible and reflects it in the URL hash.
   ============================================================ */

(function () {
  'use strict';

  var PAGES = ['home', 'about', 'services', 'contact'];

  /* ---- Router ------------------------------------------------ */

  // Map a location.hash like "#/services" -> "services". Defaults to "home".
  function pageFromHash() {
    var raw = (location.hash || '').replace(/^#\/?/, '').trim().toLowerCase();
    return PAGES.indexOf(raw) !== -1 ? raw : 'home';
  }

  function showPage(page) {
    PAGES.forEach(function (p) {
      var section = document.getElementById('page-' + p);
      if (section) section.classList.toggle('active', p === page);
    });

    // Active nav underline — drive every nav link that points at this page.
    var links = document.querySelectorAll('.nav-link[data-nav]');
    for (var i = 0; i < links.length; i++) {
      links[i].classList.toggle('active', links[i].getAttribute('data-nav') === page);
    }

    // Reset the contact form's success state whenever we (re)enter a page,
    // mirroring the prototype's go() which clears `submitted` on navigation.
    resetContactForm();

    closeMobileNav();

    // Instant scroll to top on page switch.
    try { window.scrollTo({ top: 0, behavior: 'instant' }); }
    catch (e) { window.scrollTo(0, 0); }
  }

  function route() { showPage(pageFromHash()); }

  window.addEventListener('hashchange', route);

  /* ---- Mobile nav ------------------------------------------- */

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');

  function closeMobileNav() {
    if (nav) nav.classList.remove('open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---- Contact form ----------------------------------------- */

  var form = document.getElementById('contact-form');
  var success = document.getElementById('form-success');
  var successMsg = document.getElementById('form-success-msg');
  var sendAnother = document.getElementById('send-another');

  function resetContactForm() {
    if (!form || !success) return;
    form.reset();
    form.classList.remove('hidden');
    success.classList.add('hidden');
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Native HTML5 validation (required + type=email) — we set novalidate on
      // the form so we can trigger the browser UI explicitly and bail if invalid.
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // No backend: submission is simulated client-side. If a real endpoint is
      // added later, POST here and keep the success state on a 2xx response.
      var name = (form.elements['name'].value || '').trim();
      var first = name ? name.split(/\s+/)[0] : '';
      if (successMsg) {
        successMsg.textContent = 'Thanks' + (first ? ', ' + first : '') +
          " — we've got it. Someone from the Citizen39 team will reach out within one business day.";
      }

      form.classList.add('hidden');
      success.classList.remove('hidden');

      try { window.scrollTo({ top: 0, behavior: 'instant' }); }
      catch (err) { window.scrollTo(0, 0); }
    });
  }

  if (sendAnother) {
    sendAnother.addEventListener('click', resetContactForm);
  }

  /* ---- Boot -------------------------------------------------- */

  // Normalize a bare "#" or empty hash to "#/" so the URL is always shareable.
  if (!location.hash || location.hash === '#') {
    if (history.replaceState) history.replaceState(null, '', '#/');
  }

  route();
})();
