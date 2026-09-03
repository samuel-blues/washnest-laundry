/* ============================================================
   WASHNEST BY BERSIH.IN — script.js
   ============================================================
   Features:
   · Announcement bar (close + session memory)
   · Navbar scroll effect + active section highlight
   · Mobile menu (open/close/outside-click/escape)
   · Smooth scroll (offset-aware for fixed bars)
   · AOS — Animate On Scroll (IntersectionObserver)
   · How-It-Works tab switcher
   · Form validation (real-time + on submit)
   · Google Sheets submission (fetch + CORS-safe)
   · Thank You popup (personalised + perk list)
   · Counter animation from 0 → 847
   · Sticky CTA mobile (hide when form visible)
   · Scroll-to-top button
   · Floating WhatsApp pulse
   · GA4 + Meta Pixel + Google Ads conversion events
   · JSON-LD structured data injection
   · Touch device detection
   · Passive scroll listeners for 60fps
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────────────────
   CONFIG — replace placeholder IDs before going live
   ────────────────────────────────────────────────────────── */
const CONFIG = {
  SHEETS_URL : 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
  GA4_ID     : 'G-XXXXXXXXXX',
  META_PIXEL : 'XXXXXXXXXXXXXXXXX',
  GADS_ID    : 'AW-XXXXXXXXX',
  GADS_CONV  : 'CONVERSION_LABEL',
  COUNTER_TARGET : 847,
  COUNTER_DURATION : 1600, // ms
};

/* ──────────────────────────────────────────────────────────
   DOM READY
   ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  detectTouchDevice();
  initAnnouncementBar();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initAOS();
  initHowTabs();
  initForm();
  initPopup();
  initStickyCtaMobile();
  initScrollTop();
  initActiveNav();
  initCounterAnimation();
  injectStructuredData();
});


/* ──────────────────────────────────────────────────────────
   TOUCH DEVICE DETECTION
   ────────────────────────────────────────────────────────── */
function detectTouchDevice() {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add('touch-device');
  }
}


/* ──────────────────────────────────────────────────────────
   ANNOUNCEMENT BAR
   ────────────────────────────────────────────────────────── */
function initAnnouncementBar() {
  const bar    = document.getElementById('announcementBar');
  const close  = document.getElementById('annClose');
  const navbar = document.getElementById('navbar');
  if (!bar || !close) return;

  // Restore closed state within the same browser session
  if (sessionStorage.getItem('annClosed') === '1') {
    bar.classList.add('hidden');
    if (navbar) navbar.classList.add('ann-gone');
    return;
  }

  close.addEventListener('click', () => {
    bar.classList.add('hidden');
    if (navbar) navbar.classList.add('ann-gone');
    sessionStorage.setItem('annClosed', '1');
  });
}


/* ──────────────────────────────────────────────────────────
   NAVBAR — scroll shadow + ann-gone sync
   ────────────────────────────────────────────────────────── */
function initNavbar() {
  const navbar      = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (!navbar) return;

  const handler = throttle(() => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 60);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', y > 420);
  }, 80);

  window.addEventListener('scroll', handler, { passive: true });
  handler(); // initial call
}


/* ──────────────────────────────────────────────────────────
   MOBILE MENU
   ────────────────────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close on any link inside mobile menu
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) closeMenu();
  });
}


/* ──────────────────────────────────────────────────────────
   SMOOTH SCROLL — offset-aware (fixed navbar + ann bar)
   ────────────────────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const ann   = document.getElementById('announcementBar');
      const nav   = document.getElementById('navbar');
      const annH  = (ann && !ann.classList.contains('hidden')) ? (ann.offsetHeight || 42) : 0;
      const navH  = nav ? nav.offsetHeight : 68;
      const offset = annH + navH + 16;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    });
  });
}


/* ──────────────────────────────────────────────────────────
   AOS — Animate On Scroll (custom, no library dependency)
   ────────────────────────────────────────────────────────── */
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  // Respect prefers-reduced-motion
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    elements.forEach(el => el.classList.add('aos-animate'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.aosDelay || '0', 10);
      setTimeout(() => el.classList.add('aos-animate'), delay);
      observer.unobserve(el);
    });
  }, {
    threshold  : 0.10,
    rootMargin : '0px 0px -36px 0px',
  });

  elements.forEach(el => observer.observe(el));
}


/* ──────────────────────────────────────────────────────────
   ACTIVE NAV HIGHLIGHT
   ────────────────────────────────────────────────────────── */
function initActiveNav() {
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const links    = document.querySelectorAll('.nav-links a');
  if (!sections.length || !links.length) return;

  const handler = throttle(() => {
    const scrollY = window.scrollY + 130;
    let current = '';

    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop) current = sec.id;
    });

    links.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === '#' + current);
    });
  }, 100);

  window.addEventListener('scroll', handler, { passive: true });
  handler();
}


/* ──────────────────────────────────────────────────────────
   HOW IT WORKS — TAB SWITCHER
   ────────────────────────────────────────────────────────── */
function initHowTabs() {
  const tabs   = document.querySelectorAll('.how-tab');
  const panels = document.querySelectorAll('.how-panel');
  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Update tabs
      tabs.forEach(t => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });

      // Update panels
      panels.forEach(panel => {
        const isActive = panel.id === 'tab-' + target;
        panel.classList.toggle('active', isActive);
        panel.hidden = !isActive;
      });
    });
  });

  // Keyboard navigation for tabs (left/right arrows)
  tabs.forEach((tab, index) => {
    tab.addEventListener('keydown', e => {
      let newIndex = index;
      if (e.key === 'ArrowRight') newIndex = (index + 1) % tabs.length;
      if (e.key === 'ArrowLeft')  newIndex = (index - 1 + tabs.length) % tabs.length;
      if (newIndex !== index) {
        e.preventDefault();
        tabs[newIndex].focus();
        tabs[newIndex].click();
      }
    });
  });
}


/* ──────────────────────────────────────────────────────────
   SCROLL TO TOP
   ────────────────────────────────────────────────────────── */
function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}


/* ──────────────────────────────────────────────────────────
   STICKY CTA MOBILE
   Hide when the #waitlist form card is visible; show otherwise.
   ────────────────────────────────────────────────────────── */
function initStickyCtaMobile() {
  const cta  = document.getElementById('stickyCta');
  const form = document.getElementById('waitlist');
  if (!cta || !form) return;

  const observer = new IntersectionObserver(([entry]) => {
    cta.classList.toggle('visible', !entry.isIntersecting);
  }, { threshold: 0.12 });

  observer.observe(form);
}


/* ──────────────────────────────────────────────────────────
   COUNTER ANIMATION — 0 → 847
   ────────────────────────────────────────────────────────── */
function initCounterAnimation() {
  const el = document.getElementById('counterNum');
  if (!el) return;

  let started = false;

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !started) {
      started = true;
      animateCount(el, 0, CONFIG.COUNTER_TARGET, CONFIG.COUNTER_DURATION);
      observer.disconnect();
    }
  }, { threshold: 0.5 });

  observer.observe(el);
}

/**
 * Animates a number counter with ease-out cubic.
 * @param {HTMLElement} el
 * @param {number} from
 * @param {number} to
 * @param {number} duration  ms
 */
function animateCount(el, from, to, duration) {
  const start = performance.now();

  function tick(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current  = Math.floor(from + (to - from) * eased);

    el.textContent = current.toLocaleString('id-ID');

    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

/**
 * Increment the counter by 1 after a successful form submission.
 */
function incrementCounter() {
  const el = document.getElementById('counterNum');
  if (!el) return;
  const current = parseInt(el.textContent.replace(/[^\d]/g, ''), 10) || CONFIG.COUNTER_TARGET;
  el.textContent = (current + 1).toLocaleString('id-ID');
}


/* ──────────────────────────────────────────────────────────
   FORM VALIDATION & SUBMISSION
   ────────────────────────────────────────────────────────── */

/** Validation rules per field */
const RULES = {
  nama: {
    required : true,
    minLength: 3,
    messages : {
      empty  : 'Nama lengkap wajib diisi.',
      short  : 'Nama minimal 3 karakter.',
    },
  },
  wa: {
    required: true,
    pattern : /^(\+62|08)\d{7,13}$/,
    messages: {
      empty  : 'Nomor WhatsApp wajib diisi.',
      invalid: 'Format tidak valid. Contoh: 08123456789 atau +6281234567890',
    },
  },
};

function initForm() {
  const form      = document.getElementById('waitlistForm');
  const submitBtn = document.getElementById('submitBtn');
  if (!form || !submitBtn) return;

  // Live validation: validate on blur, re-validate on input if already errored
  ['nama', 'wa'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', () => validateField(id));
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) validateField(id);
    });
  });

  // Submission
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const namaOk = validateField('nama');
    const waOk   = validateField('wa');

    if (!namaOk || !waOk) {
      const firstErr = form.querySelector('input.error');
      if (firstErr) firstErr.focus();
      return;
    }

    const nama = document.getElementById('nama').value.trim();
    const wa   = document.getElementById('wa').value.trim().replace(/\s/g, '');
    const kota = (document.getElementById('kota') || {}).value?.trim() || '';

    setSubmitLoading(true);

    try {
      await submitToSheets({ nama, wa, kota });
    } catch (err) {
      // Non-blocking — we still fire conversion events and show popup
      console.warn('[WashNest] Sheets submission error:', err.message);
    } finally {
      setSubmitLoading(false);
    }

    fireConversionEvents(nama, wa);
    showThankYouPopup(nama);
    incrementCounter();
  });
}

/**
 * Validates a single form field and updates UI.
 * @param {string} id  — field ID
 * @returns {boolean}  — true if valid
 */
function validateField(id) {
  const el    = document.getElementById(id);
  const errEl = document.getElementById(id + '-err');
  if (!el || !RULES[id]) return true;

  const rule = RULES[id];
  const val  = el.value.trim().replace(/\s/g, '');
  let msg = '';

  if (rule.required && !val) {
    msg = rule.messages.empty;
  } else if (rule.minLength && val.length < rule.minLength) {
    msg = rule.messages.short;
  } else if (rule.pattern && val && !rule.pattern.test(val)) {
    msg = rule.messages.invalid;
  }

  el.classList.toggle('error', !!msg);
  if (errEl) errEl.textContent = msg;
  return !msg;
}

/**
 * Toggle submit button loading state.
 * @param {boolean} loading
 */
function setSubmitLoading(loading) {
  const btn     = document.getElementById('submitBtn');
  if (!btn) return;
  const label   = btn.querySelector('.btn-label');
  const spinner = btn.querySelector('.btn-loading');

  btn.disabled = loading;

  if (label) {
    label.style.display = loading ? 'none' : '';
  }
  if (spinner) {
    spinner.style.display = loading ? 'inline-flex' : 'none';
    spinner.setAttribute('aria-hidden', String(!loading));
  }
}


/* ──────────────────────────────────────────────────────────
   GOOGLE SHEETS INTEGRATION
   ──────────────────────────────────────────────────────────
   SETUP INSTRUCTIONS:
   1. Open script.google.com → New Project
   2. Paste the Apps Script code below:

   function doPost(e) {
     var ss    = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID');
     var sheet = ss.getSheetByName('WaitingList') || ss.insertSheet('WaitingList');
     var data  = JSON.parse(e.postData.contents);
     if (sheet.getLastRow() === 0) {
       sheet.appendRow(['Timestamp','Nama','WhatsApp','Kota','Source','UserAgent']);
     }
     sheet.appendRow([
       new Date().toISOString(),
       data.nama      || '',
       data.wa        || '',
       data.kota      || '',
       data.source    || 'landing-page',
       data.userAgent || ''
     ]);
     return ContentService
       .createTextOutput(JSON.stringify({ status: 'ok' }))
       .setMimeType(ContentService.MimeType.JSON);
   }

   3. Deploy → New Deployment → Web App
      - Execute as: Me
      - Who has access: Anyone
   4. Copy the Web App URL and paste into CONFIG.SHEETS_URL above.
   ────────────────────────────────────────────────────────── */
async function submitToSheets(payload) {
  if (!CONFIG.SHEETS_URL || CONFIG.SHEETS_URL.includes('YOUR_SCRIPT_ID')) {
    console.info('[WashNest] Google Sheets URL not configured — skipping.');
    return;
  }

  const body = JSON.stringify({
    ...payload,
    source    : 'washnest-landing-page',
    userAgent : navigator.userAgent.substring(0, 200),
    timestamp : new Date().toISOString(),
  });

  const res = await fetch(CONFIG.SHEETS_URL, {
    method : 'POST',
    // Use text/plain to avoid CORS preflight on Apps Script
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body,
  });

  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}


/* ──────────────────────────────────────────────────────────
   CONVERSION EVENTS — GA4 + Meta Pixel + Google Ads
   ────────────────────────────────────────────────────────── */
function fireConversionEvents(nama, wa) {
  // GA4 — Lead event
  if (typeof gtag === 'function') {
    gtag('event', 'generate_lead', {
      event_category: 'WaitingList',
      event_label   : 'Hero Form Submission',
      value         : 1,
      currency      : 'IDR',
    });

    // Google Ads conversion
    gtag('event', 'conversion', {
      send_to: `${CONFIG.GADS_ID}/${CONFIG.GADS_CONV}`,
    });
  }

  // Meta Pixel — Lead event
  if (typeof fbq === 'function') {
    fbq('track', 'Lead', {
      content_name    : 'WashNest Waiting List',
      content_category: 'Laundry Service',
    });
  }
}


/* ──────────────────────────────────────────────────────────
   THANK YOU POPUP
   ────────────────────────────────────────────────────────── */
function initPopup() {
  const overlay   = document.getElementById('popupOverlay');
  const closeBtn  = document.getElementById('popupClose');
  const xCloseBtn = document.getElementById('popupXClose');
  if (!overlay) return;

  // Close on primary close button
  if (closeBtn)  closeBtn.addEventListener('click',  () => closePopup());
  if (xCloseBtn) xCloseBtn.addEventListener('click', () => closePopup());

  // Close on overlay backdrop click (not on the card itself)
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closePopup();
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closePopup();
  });
}

/**
 * Show the thank-you popup, personalised with the registrant's first name.
 * Also hides the form so it can't be re-submitted.
 * @param {string} nama — full name
 */
function showThankYouPopup(nama) {
  const overlay  = document.getElementById('popupOverlay');
  const nameSpan = document.getElementById('popupName');
  const form     = document.getElementById('waitlistForm');
  if (!overlay) return;

  // Personalise
  if (nameSpan) {
    const firstName = nama.split(/\s+/)[0];
    nameSpan.textContent = firstName;
  }

  // Hide form to prevent re-submit
  if (form) form.style.display = 'none';

  // Show popup
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');

  // Trap focus inside popup
  const card = overlay.querySelector('.popup-card');
  if (card) {
    card.setAttribute('tabindex', '-1');
    card.focus();
  }

  // Prevent body scroll
  document.body.style.overflow = 'hidden';
}

function closePopup() {
  const overlay = document.getElementById('popupOverlay');
  if (!overlay) return;
  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  // Return focus to submit button area
  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) submitBtn.focus();
}


/* ──────────────────────────────────────────────────────────
   JSON-LD STRUCTURED DATA (LocalBusiness schema)
   ────────────────────────────────────────────────────────── */
function injectStructuredData() {
  const schema = {
    '@context' : 'https://schema.org',
    '@type'    : 'LocalBusiness',
    'name'     : 'WashNest by Bersih.in',
    'description': 'Hybrid laundry pertama yang menggabungkan teknologi, kenyamanan, dan kepedulian lingkungan. Self service, full service, dan antar-jemput radius 10 km dengan deterjen eco-friendly.',
    'url'      : 'https://washnest.bersih.in',
    'logo'     : 'https://washnest.bersih.in/2.png',
    'image'    : 'https://washnest.bersih.in/WhatsApp Image 2026-07-16 at 21.00.13.jpeg',
    'telephone': '+6281234567890',
    'email'    : 'hello@bersih.in',
    'address'  : {
      '@type'         : 'PostalAddress',
      'addressCountry': 'ID',
    },
    'priceRange'   : 'Rp',
    'openingHours' : 'Mo-Su 08:00-22:00',
    'servesCuisine': null,
    'sameAs': [
      'https://www.instagram.com/washnest.id',
      'https://www.tiktok.com/@washnest.id',
    ],
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name' : 'Layanan Laundry WashNest',
      'itemListElement': [
        {
          '@type'      : 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name' : 'Self Service Laundry',
            'description': 'Layanan mandiri dengan mesin front-load premium, ruang tunggu nyaman, Wi-Fi gratis, dan deterjen eco-friendly.',
          },
        },
        {
          '@type'      : 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name' : 'Full Service Laundry',
            'description': 'Tim profesional mencuci, mengeringkan, dan merapikan pakaian Anda. Tersedia layanan reguler dan express.',
          },
        },
        {
          '@type'      : 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name' : 'Antar-Jemput Laundry',
            'description': 'Layanan pick-up dan delivery dalam radius 10 km. Pakaian dijemput dari rumah dan diantar kembali bersih wangi.',
          },
        },
      ],
    },
    'founder': {
      '@type': 'Organization',
      'name' : 'Bersih.in',
    },
  };

  const script = document.createElement('script');
  script.type  = 'application/ld+json';
  script.textContent = JSON.stringify(schema, null, 2);
  document.head.appendChild(script);
}


/* ──────────────────────────────────────────────────────────
   UTILITY: throttle
   ────────────────────────────────────────────────────────── */
/**
 * Returns a throttled version of fn that fires at most once per `ms`.
 * @param {Function} fn
 * @param {number}   ms
 * @returns {Function}
 */
function throttle(fn, ms) {
  let lastTime = 0;
  let timer    = null;

  return function (...args) {
    const now  = Date.now();
    const wait = ms - (now - lastTime);

    if (wait <= 0) {
      if (timer) { clearTimeout(timer); timer = null; }
      lastTime = now;
      fn.apply(this, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        lastTime = Date.now();
        timer    = null;
        fn.apply(this, args);
      }, wait);
    }
  };
}


/* ──────────────────────────────────────────────────────────
   PERFORMANCE NOTES
   ──────────────────────────────────────────────────────────
   · All scroll event listeners use { passive: true }
   · Hero image uses loading="eager" for LCP
   · All other images use loading="lazy"
   · Fonts use preconnect + display=swap for CLS/FID
   · Counter uses requestAnimationFrame (not setInterval)
   · IntersectionObserver used for AOS, counter, sticky CTA
   ────────────────────────────────────────────────────────── */


/* ──────────────────────────────────────────────────────────
   ACCESSIBILITY NOTES
   ──────────────────────────────────────────────────────────
   · Announcement bar has role="banner" + aria-label
   · Mobile menu has aria-hidden + aria-expanded on trigger
   · Form fields have aria-required + aria-describedby for errors
   · Error messages use role="alert" + aria-live="polite"
   · Popup is role="dialog" + aria-modal + focus trap
   · FAQ uses native <details>/<summary> for keyboard access
   · How-tabs use role="tablist" / role="tab" + keyboard arrows
   · All decorative SVGs have aria-hidden="true"
   · Images have descriptive alt text
   ────────────────────────────────────────────────────────── */
