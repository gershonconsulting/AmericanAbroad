/* ============================================================
   AmericanAbroad.net — Main JavaScript
   Handles: Navbar, Forms, Search, Filtering, FAQ, Toasts, Brevo API
   ============================================================ */

// ---- REGISTRATION ENDPOINT ----
// Every form posts to the site's own PHP handler on Hostinger
// (api/submit.php): stored in api/data/submissions.csv + email notification.
const SITE_ROOT = (function () {
  const s = document.currentScript && document.currentScript.src;
  return s ? s.replace(/js\/main\.js(\?.*)?$/, '') : '/';
})();
const SUBMIT_ENDPOINT = SITE_ROOT + 'api/submit.php';
const TRACK_ENDPOINT  = SITE_ROOT + 'api/t.php';

// ---- CAMPAIGN ATTRIBUTION (UTM) ----
// First-touch UTM tags are kept for the browser session so a visitor who
// lands from a Snov.io email and applies two pages later is still attributed.
const AAN_UTM = (function () {
  const q = new URLSearchParams(location.search);
  let saved = null;
  try { saved = JSON.parse(sessionStorage.getItem('aan_utm') || 'null'); } catch (e) {}
  if (q.get('utm_source') || q.get('utm_campaign')) {
    saved = {
      utm_source: q.get('utm_source') || '', utm_medium: q.get('utm_medium') || '',
      utm_campaign: q.get('utm_campaign') || '', utm_content: q.get('utm_content') || '',
      landing_page: location.pathname, referrer: document.referrer || ''
    };
    try { sessionStorage.setItem('aan_utm', JSON.stringify(saved)); } catch (e) {}
  }
  return saved || { utm_source: '', utm_medium: '', utm_campaign: '', utm_content: '',
                    landing_page: location.pathname, referrer: document.referrer || '' };
})();

// Page-visit beacon (first-party, no cookies)
(function () {
  if (location.protocol === 'file:') return;
  const q = new URLSearchParams({
    p: location.pathname, us: AAN_UTM.utm_source, um: AAN_UTM.utm_medium,
    uc: AAN_UTM.utm_campaign, ut: AAN_UTM.utm_content, r: document.referrer || ''
  });
  try { navigator.sendBeacon ? navigator.sendBeacon(TRACK_ENDPOINT + '?' + q) : fetch(TRACK_ENDPOINT + '?' + q, { keepalive: true }); } catch (e) {}
})();

async function submitToAAN(formType, data) {
  const payload = Object.assign({}, AAN_UTM, data, {
    form_type: formType,
    website: data.website || '',          // honeypot (must stay empty for real users)
    submitted_at: new Date().toISOString()
  });
  const res = await fetch(SUBMIT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    let msg = 'Submission failed';
    try { const j = await res.json(); msg = j.error || msg; } catch {}
    throw new Error(msg);
  }
  return res.json().catch(() => ({ ok: true }));
}
window.submitToAAN = submitToAAN;

// ---- NAVBAR ----
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  const btn = document.getElementById('back-to-top');
  if (btn) btn.classList.toggle('visible', window.scrollY > 400);
});

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });
}

// ---- BACK TO TOP ----
const backBtn = document.getElementById('back-to-top');
if (backBtn) {
  backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ---- TOAST NOTIFICATION ----
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 4200);
}

// ---- INTEREST / EXPERTISE TAG TOGGLES ----
document.querySelectorAll('.interest-tag, .expertise-tag').forEach(tag => {
  tag.addEventListener('click', () => tag.classList.toggle('selected'));
});

// ---- FAQ ACCORDION ----
function toggleFaq(el) {
  const answer = el.nextElementSibling;
  const isOpen = answer.classList.contains('open');
  // Close all open
  document.querySelectorAll('.faq-answer.open').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-question.open').forEach(q => q.classList.remove('open'));
  if (!isOpen) {
    answer.classList.add('open');
    el.classList.add('open');
  }
}

// ---- ACTIVE SIDEBAR NAVIGATION (resources page) ----
const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
if (sidebarLinks.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        sidebarLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });
  document.querySelectorAll('.category-section').forEach(section => observer.observe(section));
}

// ---- RESOURCE SEARCH ----
const resourceSearch = document.getElementById('resourceSearch');
const searchCount = document.getElementById('searchCount');

if (resourceSearch) {
  resourceSearch.addEventListener('input', () => {
    const q = resourceSearch.value.toLowerCase().trim();
    const links = document.querySelectorAll('.resource-link');
    let visible = 0;
    links.forEach(link => {
      const text = (link.textContent + ' ' + (link.dataset.keywords || '')).toLowerCase();
      const show = !q || text.includes(q);
      link.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (searchCount) {
      searchCount.textContent = q ? `${visible} result${visible !== 1 ? 's' : ''}` : '';
    }
    // Show/hide category sections based on visible children
    document.querySelectorAll('.category-section').forEach(section => {
      const anyVisible = [...section.querySelectorAll('.resource-link')].some(l => l.style.display !== 'none');
      section.style.display = anyVisible ? '' : 'none';
    });
  });
}

// ---- FILTER BUTTONS (resources page) ----
const filterBtns = document.querySelectorAll('.filter-btn');
if (filterBtns.length > 0) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      const links = document.querySelectorAll('.resource-link');
      links.forEach(link => {
        if (filter === 'all') {
          link.style.display = '';
        } else {
          const cat = link.dataset.category || '';
          link.style.display = (cat === filter) ? '' : 'none';
        }
      });
      // Hide empty sections
      document.querySelectorAll('.category-section').forEach(section => {
        const anyVisible = [...section.querySelectorAll('.resource-link')].some(l => l.style.display !== 'none');
        section.style.display = anyVisible ? '' : 'none';
      });
    });
  });
}

// ---- COLLECT SELECTED INTERESTS ----
function getSelectedInterests(gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return [];
  return [...grid.querySelectorAll('input[type="checkbox"]:checked')].map(cb => cb.value);
}

// ---- NEWSLETTER FORM (homepage inline) ----
const heroNewsletterForm = document.getElementById('heroNewsletterForm');
if (heroNewsletterForm) {
  heroNewsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('heroEmail').value.trim();
    if (!email) return;
    try {
      await submitToAAN('newsletter', { email, signup_source: 'hero' });
      showToast('✅ Check your email to confirm. Welcome to AmericanAbroad!', 'success');
      heroNewsletterForm.reset();
    } catch (err) {
      showToast('Something went wrong: ' + err.message, 'error');
    }
  });
}

// ---- NEWSLETTER FULL FORM (newsletter.html) ----
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('subSubmitBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:8px"></i>Subscribing…';

    const data = {
      first_name: document.getElementById('firstName').value.trim(),
      last_name: document.getElementById('lastName').value.trim(),
      email: document.getElementById('subEmail').value.trim(),
      city: document.getElementById('subCity').value.trim(),
      country: (document.getElementById('subCountry') || {}).value || '',
      years_abroad: document.getElementById('yearsAbroad').value,
      interests: getSelectedInterests('interestsGrid'),
      is_consultant: document.getElementById('isConsultant').checked,
      leader_interest: !!(document.getElementById('leaderInterest') || {}).checked,
      signup_source: 'newsletter_page'
    };

    try {
      await submitToAAN('newsletter', data);
      newsletterForm.style.display = 'none';
      document.getElementById('subSuccess').style.display = 'block';
      showToast('✅ Check your email to confirm your subscription.', 'success');
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-envelope" style="margin-right:8px"></i>Subscribe to the Newsletter';
      showToast('Something went wrong: ' + err.message, 'error');
    }
  });
}

// ---- PARTNER APPLICATION FORM (partners.html) ----
const partnerForm = document.getElementById('partnerForm');
if (partnerForm) {
  partnerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('partnerSubmitBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:8px"></i>Submitting…';

    const data = {
      full_name: document.getElementById('partnerName').value.trim(),
      email: document.getElementById('partnerEmail').value.trim(),
      phone: document.getElementById('partnerPhone').value.trim(),
      city: document.getElementById('partnerCity').value.trim(),
      country: (document.getElementById('partnerCountry') || {}).value || '',
      linkedin: document.getElementById('partnerLinkedin').value.trim(),
      years_experience: document.getElementById('partnerExperience').value,
      expertise: getSelectedInterests('expertiseGrid'),
      network_description: document.getElementById('partnerNetwork').value.trim()
    };

    try {
      await submitToAAN('partner', data);
      partnerForm.style.display = 'none';
      document.getElementById('partnerSuccess').style.display = 'block';
      showToast('🤝 Application received! Check your email to confirm.', 'success');
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-handshake" style="margin-right:8px"></i>Submit My Application';
      showToast('Something went wrong: ' + err.message, 'error');
    }
  });
}

// ---- CONTACT FORM (partners.html) ----
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    try {
      await submitToAAN('partner', {
        full_name: name,
        email,
        network_description: message,
        signup_source: 'contact_form'
      });
      showToast('✉️ Message sent! Check your email to confirm.', 'success');
      contactForm.reset();
    } catch (err) {
      showToast('Something went wrong: ' + err.message, 'error');
    }
  });
}

// ---- SMOOTH SCROLL for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').substring(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- ANIMATE NUMBERS (hero stats) ----
function animateNumbers() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const text = el.textContent.trim();
    const match = text.match(/^(~?\d+)/);
    if (!match) return;
    const target = parseInt(match[1].replace('~', ''), 10);
    if (isNaN(target) || target > 1000000) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      el.textContent = text.replace(/\d+/, start.toLocaleString());
      if (start >= target) clearInterval(timer);
    }, 20);
  });
}

const heroSection = document.querySelector('.hero');
if (heroSection) {
  const statObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateNumbers();
      statObserver.disconnect();
    }
  });
  statObserver.observe(heroSection);
}
