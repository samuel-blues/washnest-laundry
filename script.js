/* ============================================================
   WASHNEST BY BERSIH.IN — script.js (Jakarta Selatan Pickup Edition)
   ============================================================ */

'use strict';

const CONFIG = {
  SHEETS_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
  GA4_ID: 'G-XXXXXXXXXX',
  META_PIXEL: 'XXXXXXXXXXXXXXXXX',
  GADS_ID: 'AW-XXXXXXXXX',
  GADS_CONV: 'CONVERSION_LABEL'
};

document.addEventListener('DOMContentLoaded', () => {
  detectTouchDevice();
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
  injectStructuredData();
  initLeadTracking();
});

function detectTouchDevice() {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add('touch-device');
  }
}

function initAnnouncementBar() {
  const bar = document.getElementById('announcementBar');
  const close = document.getElementById('annClose');
  const navbar = document.getElementById('navbar');
  if (!bar || !close) return;

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

function initNavbar() {
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (!navbar) return;

  const handler = throttle(() => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 60);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', y > 420);
  }, 80);

  window.addEventListener('scroll', handler, { passive: true });
  handler();
}

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
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

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) closeMenu();
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const ann = document.getElementById('announcementBar');
      const nav = document.getElementById('navbar');
      const annH = (ann && !ann.classList.contains('hidden')) ? (ann.offsetHeight || 42) : 0;
      const navH = nav ? nav.offsetHeight : 68;
      const offset = annH + navH + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    });
  });
}

function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    elements.forEach(el => el.classList.add('aos-animate'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.aosDelay || '0', 10);
      setTimeout(() => el.classList.add('aos-animate'), delay);
      observer.unobserve(el);
    });
  }, {
    threshold: 0.10,
    rootMargin: '0px 0px -36px 0px',
  });

  elements.forEach(el => observer.observe(el));
}

function initActiveNav() {
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const links = document.querySelectorAll('.nav-links a');
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

function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initStickyCtaMobile() {
  const cta = document.getElementById('stickyCta');
  const form = document.getElementById('waitlist');
  if (!cta || !form) return;

  const observer = new IntersectionObserver(([entry]) => {
    cta.classList.toggle('visible', !entry.isIntersecting);
  }, { threshold: 0.12 });

  observer.observe(form);
}

const RULES = {
  nama: {
    required: true,
    minLength: 3,
    messages: {
      empty: 'Nama lengkap wajib diisi.',
      short: 'Nama minimal 3 karakter.',
    },
  },
  wa: {
    required: true,
    pattern: /^(\+62|08)\d{7,13}$/,
    messages: {
      empty: 'Nomor WhatsApp wajib diisi.',
      invalid: 'Format tidak valid. Contoh: 08123456789 atau +6281234567890',
    },
  },
};
  consent: {
    required: true,
    messages: {
      empty: 'Centang kotak ini untuk melanjutkan pendaftaran.',
    },
  },
function initForm() {
  const form = document.getElementById('waitlistForm');
  const submitBtn = document.getElementById('submitBtn');
  if (!form || !submitBtn) return;

  ['nama', 'wa'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', () => validateField(id));
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) validateField(id);
    });
  });
const consentEl = document.getElementById('consent');
if (consentEl) {
  consentEl.addEventListener('change', () => validateField('consent'));
}
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const namaOk = validateField('nama');
    const waOk   = validateField('wa');
const consentOk = validateField('consent');
   if (!namaOk || !waOk || !consentOk) {
      const firstErr = form.querySelector('input.error');
      if (firstErr) firstErr.focus();
      return;
    }

    const nama = document.getElementById('nama').value.trim();
    const wa   = document.getElementById('wa').value.trim().replace(/\s/g, '');
    const kota = (document.getElementById('kota') || {}).value?.trim() || '';

    fireConversionEvents(nama, wa);
    setSubmitLoading(true);

    try {
      await submitToSheets({ nama, wa, kota });
    } catch (err) {
      console.warn('[WashNest] Sheets submission error:', err.message);
    } finally {
      setSubmitLoading(false);
    }

    showThankYouPopup(nama);
  });
}

function validateField(id) {
  const el = document.getElementById(id);
  const errEl = document.getElementById(id + '-err');
  if (!el || !RULES[id]) return true;

  const rule = RULES[id];
  const val = el.value.trim().replace(/\s/g, '');
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

function setSubmitLoading(loading) {
  const btn = document.getElementById('submitBtn');
  if (!btn) return;
  const label = btn.querySelector('.btn-label');
  const spinner = btn.querySelector('.btn-loading');

  btn.disabled = loading;
  if (label) label.style.display = loading ? 'none' : '';
  if (spinner) {
    spinner.style.display = loading ? 'inline-flex' : 'none';
    spinner.setAttribute('aria-hidden', String(!loading));
  }
}

async function submitToSheets(payload) {
  if (!CONFIG.SHEETS_URL || CONFIG.SHEETS_URL.includes('YOUR_SCRIPT_ID')) {
    console.info('[WashNest] Google Sheets URL not configured — skipping.');
    return;
  }

  const body = JSON.stringify({
    ...payload,
    source: 'washnest-Jakarta Selatan-landing-page',
    userAgent: navigator.userAgent.substring(0, 200),
    timestamp: new Date().toISOString(),
  });

  const res = await fetch(CONFIG.SHEETS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body,
  });

  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

function initLeadTracking() {
  function trackLead(contentName) {
    if (typeof fbq !== 'function') return;
    fbq('track', 'Lead', {
      content_name: contentName,
      content_category: 'WashNest Jakarta Selatan',
    });
  }

  function resolveLabel(el) {
    let node = el;
    for (let i = 0; i < 4; i++) {
      if (!node || node === document.body) break;

      const tag = node.tagName;
      const href = (node.getAttribute && node.getAttribute('href')) || '';
      const cls = (node.className && typeof node.className === 'string') ? node.className : '';
      const id = node.id || '';

      if (tag === 'A' && href.includes('wa.me')) {
        if (cls.includes('wa-float')) return 'WhatsApp Float Button';
        if (cls.includes('btn')) return 'WhatsApp CTA Button';
        return 'WhatsApp Link';
      }

      if (tag === 'A' && href === '#waitlist') {
        if (id === 'stickyCta' || cls.includes('sticky-cta')) return 'Sticky CTA – Waitlist';
        if (cls.includes('mob-cta')) return 'Mobile Menu CTA – Waitlist';
        if (cls.includes('btn-nav')) return 'Navbar CTA – Waitlist';
        return 'CTA Button – Waitlist';
      }

      if (tag === 'BUTTON' && id === 'submitBtn') return null;
      if (tag === 'BUTTON' && id === 'popupClose') return null;
      if (tag === 'BUTTON' && id === 'popupXClose') return null;

      node = node.parentElement;
    }
    return null;
  }

  document.addEventListener('click', function (e) {
    const label = resolveLabel(e.target);
    if (label) trackLead(label);
  });
}

function fireConversionEvents(nama, wa) {
  try {
    if (typeof fbq === 'function') {
      const eventID = 'wn_lead_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
      fbq('track', 'Lead', {
        content_name    : 'WashNest Membership – Jakarta Selatan Form Submit',
        content_category: 'Laundry Service',
      }, { eventID });
    }
  } catch (_err) {}

  try {
    if (typeof gtag === 'function') {
      gtag('event', 'generate_lead', {
        event_category: 'WaitingList',
        event_label   : 'Jakarta Selatan Form Submission',
        value         : 1,
        currency      : 'IDR',
      });

      gtag('event', 'conversion', {
        send_to: `${CONFIG.GADS_ID}/${CONFIG.GADS_CONV}`,
      });
    }
  } catch (_err) {}
}

function initPopup() {
  const overlay = document.getElementById('popupOverlay');
  const closeBtn = document.getElementById('popupClose');
  const xCloseBtn = document.getElementById('popupXClose');
  if (!overlay) return;

  if (closeBtn) closeBtn.addEventListener('click', () => closePopup());
  if (xCloseBtn) xCloseBtn.addEventListener('click', () => closePopup());

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closePopup();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closePopup();
  });
}

function showThankYouPopup(nama) {
  const overlay = document.getElementById('popupOverlay');
  const nameSpan = document.getElementById('popupName');
  const form = document.getElementById('waitlistForm');
  if (!overlay) return;

  if (nameSpan) {
    const firstName = nama.split(/\s+/)[0];
    nameSpan.textContent = firstName;
  }

  if (form) form.style.display = 'none';

  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');

  const card = overlay.querySelector('.popup-card');
  if (card) {
    card.setAttribute('tabindex', '-1');
    card.focus();
  }

  document.body.style.overflow = 'hidden';
}

function closePopup() {
  const overlay = document.getElementById('popupOverlay');
  if (!overlay) return;
  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) submitBtn.focus();
}

function injectStructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'WashNest by Bersih.in',
    'description': 'Layanan laundry antar jemput modern ramah lingkungan di area Jakarta Selatan.',
    'url': 'https://www.washnest.online',
    'telephone': '+6281234567890',
    'email': 'hello@bersih.in',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Jakarta Selatan',
      'addressLocality': 'Jakarta Selatan',
      'addressRegion': 'DKI Jakarta',
      'addressCountry': 'ID',
    },
    'priceRange': 'Rp'
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema, null, 2);
  document.head.appendChild(script);
}

function throttle(fn, ms) {
  let lastTime = 0;
  let timer = null;

  return function (...args) {
    const now = Date.now();
    const wait = ms - (now - lastTime);

    if (wait <= 0) {
      if (timer) { clearTimeout(timer); timer = null; }
      lastTime = now;
      fn.apply(this, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        lastTime = Date.now();
        timer = null;
        fn.apply(this, args);
      }, wait);
    }
  };
}