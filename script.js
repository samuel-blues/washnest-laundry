/* ============================================================
   WASHNEST BY BERSIH.IN — script.js
   Form Validation · Thank You Popup · Google Sheets
   GA4 + Meta Pixel + Google Ads · AOS · Sticky CTA
   Smooth Scroll · Active Nav · Announcement Bar
   ============================================================ */

'use strict';

/* ─── CONFIG ─────────────────────────────────────────────── */
const CONFIG = {
  // Replace with your deployed Google Apps Script Web App URL
  SHEETS_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
  GA4_ID:     'G-XXXXXXXXXX',
  META_PIXEL: 'XXXXXXXXXXXXXXXXX',
  GADS_ID:    'AW-XXXXXXXXX',
  GADS_CONV:  'CONVERSION_LABEL',
};

/* ─── DOM READY ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initAnnouncementBar();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initAOS();
  initForm();
  initPopup();
  initStickyCtaMobile();
  initScrollTop();
  initActiveNav();
  initCounterAnimation();
});

/* ─── ANNOUNCEMENT BAR ───────────────────────────────────── */
function initAnnouncementBar() {
  const bar     = document.getElementById('announcementBar');
  const closeBtn = document.getElementById('annClose');
  const navbar  = document.getElementById('navbar');
  if (!bar || !closeBtn) return;

  // Restore hidden state across page loads
  if (sessionStorage.getItem('annClosed') === '1') {
    bar.classList.add('hidden');
    navbar.classList.add('ann-gone');
    return;
  }

  closeBtn.addEventListener('click', () => {
    bar.classList.add('hidden');
    navbar.classList.add('ann-gone');
    sessionStorage.setItem('annClosed', '1');
  });
}

/* ─── NAVBAR SCROLL EFFECT ───────────────────────────────── */
function initNavbar() {
  const navbar      = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (!navbar) return;

  const onScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 60);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', y > 400);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

/* ─── MOBILE MENU ────────────────────────────────────────── */
function initMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on any link click inside mobile menu
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });
}

/* ─── SMOOTH SCROLL ──────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();

      // Account for fixed navbar + announcement bar height
      const annBar  = document.getElementById('announcementBar');
      const navbar  = document.getElementById('navbar');
      const annH    = (annBar && !annBar.classList.contains('hidden')) ? annBar.offsetHeight : 0;
      const navH    = navbar ? navbar.offsetHeight : 68;
      const offset  = annH + navH + 12;
      const top     = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ─── AOS (ANIMATE ON SCROLL) ────────────────────────────── */
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.getAttribute('data-aos-delay') || '0', 10);
      setTimeout(() => el.classList.add('aos-animate'), delay);
      observer.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ─── ACTIVE NAV HIGHLIGHT ───────────────────────────────── */
function initActiveNav() {
  const sections  = Array.from(document.querySelectorAll('section[id]'));
  const navLinks  = document.querySelectorAll('.nav-links a');

  const onScroll = () => {
    const scrollY = window.scrollY + 120;
    let current   = '';
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─── SCROLL TO TOP BUTTON ───────────────────────────────── */
function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ─── STICKY CTA MOBILE ──────────────────────────────────── */
function initStickyCtaMobile() {
  const bar  = document.getElementById('stickyCta');
  const form = document.getElementById('waitlist');
  if (!bar || !form) return;

  const observer = new IntersectionObserver(([entry]) => {
    bar.classList.toggle('visible', !entry.isIntersecting);
  }, { threshold: 0.1 });

  observer.observe(form);
}

/* ─── COUNTER ANIMATION ──────────────────────────────────── */
function initCounterAnimation() {
  const counterEl = document.getElementById('counterNum');
  if (!counterEl) return;

  const target   = 847;
  let   started  = false;

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !started) {
      started = true;
      animateCount(counterEl, 0, target, 1400);
      observer.disconnect();
    }
  }, { threshold: 0.5 });

  observer.observe(counterEl);
}

function animateCount(el, from, to, duration) {
  const startTime = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(from + (to - from) * eased).toLocaleString('id-ID');
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ─── FORM VALIDATION ────────────────────────────────────── */
function initForm() {
  const form      = document.getElementById('waitlistForm');
  const submitBtn = document.getElementById('submitBtn');
  if (!form || !submitBtn) return;

  const rules = {
    nama: {
      required: true,
      minLength: 3,
      messages: {
        empty:   'Nama lengkap wajib diisi.',
        short:   'Nama minimal 3 karakter.',
      },
    },
    wa: {
      required: true,
      pattern:  /^(\+62|08)\d{7,13}$/,
      messages: {
        empty:   'Nomor WhatsApp wajib diisi.',
        invalid: 'Format tidak valid. Contoh: 08123456789',
      },
    },
  };

  /* — Validate a single field — */
  function validateField(id) {
    const el    = document.getElementById(id);
    const errEl = document.getElementById(id + '-err');
    if (!el || !rules[id]) return true;

    const val  = el.value.trim().replace(/\s/g, '');
    const rule = rules[id];
    let   msg  = '';

    if (rule.required && !val) {
      msg = rule.messages.empty;
    } else if (rule.minLength && val.length < rule.minLength) {
      msg = rule.messages.short;
    } else if (rule.pattern && !rule.pattern.test(val)) {
      msg = rule.messages.invalid;
    }

    el.classList.toggle('error', !!msg);
    if (errEl) errEl.textContent = msg;
    return !msg;
  }

  /* — Live validation on blur + re-check while error is shown — */
  ['nama', 'wa'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur',  () => validateField(id));
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) validateField(id);
    });
  });

  /* — Submission — */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const namaOk = validateField('nama');
    const waOk   = validateField('wa');
    if (!namaOk || !waOk) {
      // Focus first errored field
      const firstErr = form.querySelector('input.error');
      if (firstErr) firstErr.focus();
      return;
    }

    const nama  = document.getElementById('nama').value.trim();
    const wa    = document.getElementById('wa').value.trim().replace(/\s/g, '');
    const kota  = (document.getElementById('kota') || {}).value || '';

    setSubmitLoading(true);

    try {
      await submitToGoogleSheets({ nama, wa, kota });
      fireConversionEvents(nama, wa);
      showThankYouPopup(nama);
    } catch (err) {
      console.warn('[WashNest] Sheets submission failed:', err);
      // Show popup anyway — don't block the user
      fireConversionEvents(nama, wa);
      showThankYouPopup(nama);
    } finally {
      setSubmitLoading(false);
    }
  });
}

function setSubmitLoading(loading) {
  const btn     = document.getElementById('submitBtn');
  if (!btn) return;
  const label   = btn.querySelector('.btn-label');
  const spinner = btn.querySelector('.btn-loading');
  btn.disabled              = loading;
  if (label)   label.style.display   = loading ? 'none' : '';
  if (spinner) spinner.style.display = loading ? 'inline-flex' : 'none';
}

/* ─── GOOGLE SHEETS INTEGRATION ─────────────────────────── */
/**
 * Submits form data to a Google Apps Script Web App.
 *
 * HOW TO SET UP:
 * 1. Go to script.google.com → New Project
 * 2. Paste the Apps Script code below into the editor
 * 3. Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web App URL and paste into CONFIG.SHEETS_URL above
 *
 * ── Apps Script Code ──────────────────────────────────────
 * function doPost(e) {
 *   var ss    = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID');
 *   var sheet = ss.getSheetByName('WaitingList') || ss.insertSheet('WaitingList');
 *   var data  = JSON.parse(e.postData.contents);
 *   if (sheet.getLastRow() === 0) {
 *     sheet.appendRow(['Timestamp','Nama','WhatsApp','Kota','Source']);
 *   }
 *   sheet.appendRow([
 *     new Date().toISOString(),
 *     data.nama || '',
 *     data.wa   || '',
 *     data.kota || '',
 *     data.source || 'landing-page'
 *   ]);
 *   return ContentService
 *     .createTextOutput(JSON.stringify({status:'ok'}))
 *     .setMimeType(ContentService.MimeType.JSON);
 * }
 * ──────────────────────────────────────────────────────────
 */
async function submitToGoogleSheets(payload) {
  if (!CONFIG.SHEETS_URL || CONFIG.SHEETS_URL.includes('YOUR_SCRIPT_ID')) {
    console.info('[WashNest] Google Sheets URL not configured — skipping.');
    return;
  }

  const body = JSON.stringify({
    ...payload,
    source:    'washnest-landing',
    timestamp: new Date().toISOString(),
  });

  const response = await fetch(CONFIG.SHEETS_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'text/plain' }, // avoid CORS preflight
    body,
  });

  if (!response.ok) throw new Error('HTTP ' + response.status);
  return response.json();
}

/* ─── CONVERSION EVENTS ──────────────────────────────────── */
function fireConversionEvents(nama, wa) {
  // GA4 — Lead event
  if (typeof gtag === 'function') {
    gtag('event', 'generate_lead', {
      event_category: 'WaitingList',
      event_label:    'Hero Form Submission',
      value:          1,
    });
    // Google Ads conversion
    gtag('event', 'conversion', {
      send_to: CONFIG.GADS_ID + '/' + CONFIG.GADS_CONV,
    });
  }

  // Meta Pixel — Lead event
  if (typeof fbq === 'function') {
    fbq('track', 'Lead', {
      content_name:     'WashNest Waiting List',
      content_category: 'Laundry Service',
    });
  }
}

/* ─── THANK YOU POPUP ────────────────────────────────────── */
function initPopup() {
  const overlay  = document.getElementById('popupOverlay');
  const closeBtn = document.getElementById('popupClose');
  if (!overlay) return;

  // Close on button
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closePopup());
  }

  // Close on overlay backdrop click
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closePopup();
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closePopup();
  });
}

function showThankYouPopup(nama) {
  const overlay    = document.getElementById('popupOverlay');
  const nameSpan   = document.getElementById('popupName');
  const form       = document.getElementById('waitlistForm');
  if (!overlay) return;

  // Set personalised name
  if (nameSpan) nameSpan.textContent = nama.split(' ')[0];

  // Hide the original form so it can't be re-submitted
  if (form) form.style.display = 'none';

  // Show popup
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');
  overlay.querySelector('.popup-card').focus?.();

  // Increment visual counter
  incrementWaitlistCounter();
}

function closePopup() {
  const overlay = document.getElementById('popupOverlay');
  if (!overlay) return;
  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');
}

function incrementWaitlistCounter() {
  const el = document.getElementById('counterNum');
  if (!el) return;
  const current = parseInt(el.textContent.replace(/\./g, ''), 10) || 847;
  el.textContent = (current + 1).toLocaleString('id-ID');
}

/* ─── CLEANUP TEMP FILES ─────────────────────────────────── */
// Note: read_docx.py was created during development — safe to delete manually.

/* ─── UTILITY: throttle ──────────────────────────────────── */
function throttle(fn, ms) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= ms) { last = now; fn.apply(this, args); }
  };
}

/* ─── PERFORMANCE: passive scroll listeners already set ─── */
// All scroll listeners use { passive: true } for smooth 60fps.

/* ─── CORE WEB VITALS HINT ───────────────────────────────── */
// Images use loading="eager" for hero (LCP) and loading="lazy" elsewhere.
// Fonts use preconnect + display=swap for CLS/FID optimisation.

/* ─── SEO / STRUCTURED DATA (JSON-LD) ───────────────────── */
(function injectStructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "WashNest by Bersih.in",
    "description": "Hybrid laundry pertama yang menggabungkan teknologi, kenyamanan, dan kepedulian lingkungan. Self service, full service, dan antar-jemput radius 10 km.",
    "url": "https://washnest.bersih.in",
    "logo": "https://washnest.bersih.in/1.png",
    "image": "https://washnest.bersih.in/WhatsApp Image 2026-07-16 at 21.00.13.jpeg",
    "telephone": "+6281234567890",
    "email": "hello@bersih.in",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "ID"
    },
    "priceRange": "Rp",
    "openingHours": "Mo-Su 08:00-22:00",
    "sameAs": [
      "https://www.instagram.com/washnest.id",
      "https://www.tiktok.com/@washnest.id"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Layanan WashNest",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Self Service Laundry" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Full Service Laundry" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Antar-Jemput Laundry Radius 10 km" } }
      ]
    }
  };

  const script = document.createElement('script');
  script.type  = 'application/ld+json';
  script.textContent = JSON.stringify(schema, null, 2);
  document.head.appendChild(script);
})();

/* ─── TOUCH DEVICE: remove hover flicker on cards ────────── */
(function patchHoverTouch() {
  if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
  }
})();
