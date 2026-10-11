/* ============================================================
   AmericanAbroad.net — Landing Page JS Engine
   Shared logic for all 40+ topic landing pages
   ============================================================ */

// ── Extended FEEDS CONFIG with 30+ new sources ──
const EXTENDED_FEEDS = {

  // ── EXPAT LIFE ─────────────────────────────────────────
  expat_life: [
    { name: "The Connexion France", url: "https://www.connexionfrance.com/rss", tag: "Expat Life", color: "#c0392b", icon: "📰" },
    { name: "The Local France", url: "https://www.thelocal.fr/feed/", tag: "France News", color: "#e74c3c", icon: "🗞️" },
    { name: "Expatica France", url: "https://www.expatica.com/fr/feed/", tag: "Expat Guide", color: "#27ae60", icon: "🌍" },
    { name: "FrenchEntrée", url: "https://www.frenchentree.com/feed/", tag: "Living in France", color: "#2980b9", icon: "🏡" },
    { name: "FabExpat", url: "https://www.fabexpat.com/feed/", tag: "Expat Community", color: "#8e44ad", icon: "🗺️" },
    { name: "The American in Paris", url: "https://theamericaninparis.com/feed/", tag: "American Expat", color: "#c0392b", icon: "🗼" },
    { name: "Américaine en France", url: "https://www.americaineinfrance.com/feed/", tag: "American Expat", color: "#e74c3c", icon: "🇺🇸" },
    { name: "The Good Life France", url: "https://thegoodlifefrance.com/feed/", tag: "French Life", color: "#27ae60", icon: "🌻" },
    { name: "Renestance", url: "https://www.renestance.com/blog/feed/", tag: "Relocation", color: "#2980b9", icon: "🏘️" },
    { name: "French Morning", url: "https://frenchmorning.com/feed/", tag: "French-American", color: "#8e44ad", icon: "☕" },
    { name: "AngloInfo France", url: "https://www.angloinfo.com/rss/france.rss", tag: "Community", color: "#16a085", icon: "🌐" }
  ],

  // ── VISAS & RESIDENCY ──────────────────────────────────
  visas: [
    { name: "FrenchEntrée — Visas", url: "https://www.frenchentree.com/category/visas-residency/feed/", tag: "Visa", color: "#2980b9", icon: "🛂" },
    { name: "Expatica — Visas", url: "https://www.expatica.com/fr/moving-to-france/feed/", tag: "Moving", color: "#27ae60", icon: "✈️" },
    { name: "The Connexion — Admin", url: "https://www.connexionfrance.com/rss", tag: "Admin", color: "#c0392b", icon: "📋" },
    { name: "harrisonbrook.fr", url: "https://harrisonbrook.fr/feed/", tag: "Visa Guide", color: "#1a5f8a", icon: "🔎" },
    { name: "FabExpat — Visas", url: "https://www.fabexpat.com/feed/", tag: "Residency", color: "#8e44ad", icon: "🪪" }
  ],

  // ── TAXES ─────────────────────────────────────────────
  taxes: [
    { name: "IRS Newswire", url: "https://www.irs.gov/rss-feeds/news-releases-for-tax-professionals", tag: "IRS Alert", color: "#8B6914", icon: "💸" },
    { name: "IRS Tax Tips", url: "https://www.irs.gov/rss-feeds/irs-tax-tips", tag: "Tax Tips", color: "#8B6914", icon: "📋" },
    { name: "Tax Fairness Abroad", url: "https://www.taxfairnessabroad.org/feed/", tag: "Advocacy", color: "#c0392b", icon: "✊" },
    { name: "Expat Tax Online", url: "https://www.expattaxonline.com/feed/", tag: "Tax Guide", color: "#8B6914", icon: "🧮" },
    { name: "MyExpatTaxes Blog", url: "https://www.myexpattaxes.com/expat-tax-tips/feed/", tag: "Tax Service", color: "#8B6914", icon: "💼" },
    { name: "Taxes For Expats Blog", url: "https://www.taxesforexpats.com/articles/feed/", tag: "Tax Advice", color: "#8B6914", icon: "📊" },
    { name: "1040 Abroad Blog", url: "https://1040abroad.com/blog/feed/", tag: "FATCA/FBAR", color: "#8B6914", icon: "📁" },
    { name: "H&R Block Expat", url: "https://www.hrblock.com/expat-tax-preparation/blog/feed/", tag: "Filing", color: "#e74c3c", icon: "🗃️" }
  ],

  // ── BANKING & FINANCE ─────────────────────────────────
  banking: [
    { name: "Wise Blog", url: "https://wise.com/us/blog/feed/", tag: "International Banking", color: "#00B9FF", icon: "💱" },
    { name: "Expatica — Finance", url: "https://www.expatica.com/fr/finance/feed/", tag: "Finance", color: "#27ae60", icon: "🏦" },
    { name: "The Connexion — Finance", url: "https://www.connexionfrance.com/rss", tag: "Banking", color: "#c0392b", icon: "💳" },
    { name: "Live & Invest Overseas", url: "https://www.liveandinvestoverseas.com/feed/", tag: "Expat Finance", color: "#2980b9", icon: "📈" }
  ],

  // ── BUSINESS IN FRANCE ────────────────────────────────
  business_france: [
    { name: "AmCham France", url: "https://amchamfrance.org/feed/", tag: "Business", color: "#0A1F5C", icon: "🏛️" },
    { name: "Business France", url: "https://www.businessfrance.fr/rss.xml", tag: "Trade", color: "#1a5f8a", icon: "📈" },
    { name: "BPI France", url: "https://www.bpifrance.fr/rss", tag: "Finance", color: "#27ae60", icon: "💡" },
    { name: "The American in Paris", url: "https://theamericaninparis.com/feed/", tag: "American Business", color: "#c0392b", icon: "🏢" },
    { name: "Ibanista", url: "https://www.ibanista.com/feed/", tag: "Business Setup", color: "#8e44ad", icon: "⚙️" },
    { name: "Station F News", url: "https://stationf.co/feed/", tag: "Startup", color: "#6c3483", icon: "🚀" }
  ],

  // ── US MARKET EXPANSION ───────────────────────────────
  us_market: [
    { name: "SelectUSA", url: "https://www.selectusa.gov/rss.xml", tag: "Invest USA", color: "#c0392b", icon: "🇺🇸" },
    { name: "US Trade.gov", url: "https://www.trade.gov/rss.xml", tag: "US Trade", color: "#c0392b", icon: "📊" },
    { name: "France in the US", url: "https://media.franceintheus.org/feed/", tag: "Franco-American", color: "#1a5f8a", icon: "🤝" },
    { name: "AmCham France", url: "https://amchamfrance.org/feed/", tag: "Business", color: "#0A1F5C", icon: "🏛️" },
    { name: "Business France — Export", url: "https://www.businessfrance.fr/rss.xml", tag: "Export", color: "#1a5f8a", icon: "🌎" },
    { name: "TechCrunch", url: "https://techcrunch.com/feed/", tag: "Tech & Startup", color: "#0a8f08", icon: "💻" },
    { name: "Harvard Business Review", url: "https://hbr.org/rss/all/", tag: "Strategy", color: "#c0392b", icon: "📚" }
  ],

  // ── HEALTHCARE ───────────────────────────────────────
  healthcare: [
    { name: "Expatica — Health France", url: "https://www.expatica.com/fr/healthcare/feed/", tag: "Healthcare", color: "#27ae60", icon: "🏥" },
    { name: "The Connexion — Health", url: "https://www.connexionfrance.com/rss", tag: "Health", color: "#c0392b", icon: "💊" },
    { name: "The Local — Health", url: "https://www.thelocal.fr/feed/", tag: "France Health", color: "#e74c3c", icon: "🩺" }
  ],

  // ── REAL ESTATE ──────────────────────────────────────
  real_estate: [
    { name: "FrenchEntrée — Property", url: "https://www.frenchentree.com/category/property/feed/", tag: "Property", color: "#2980b9", icon: "🏡" },
    { name: "The Connexion — Property", url: "https://www.connexionfrance.com/rss", tag: "Real Estate", color: "#c0392b", icon: "🏠" },
    { name: "The Local — Property", url: "https://www.thelocal.fr/feed/", tag: "Property France", color: "#e74c3c", icon: "🔑" },
    { name: "The Good Life France", url: "https://thegoodlifefrance.com/feed/", tag: "French Life", color: "#27ae60", icon: "🌻" }
  ],

  // ── EUROPE GENERAL ───────────────────────────────────
  europe: [
    { name: "Expatica Europe", url: "https://www.expatica.com/feed/", tag: "Europe Expat", color: "#27ae60", icon: "🇪🇺" },
    { name: "Expat Focus", url: "https://www.expatfocus.com/rss/rss.xml", tag: "Expat Tips", color: "#2980b9", icon: "🌍" },
    { name: "InterNations Blog", url: "https://www.internations.org/blog/feed/", tag: "Expat Network", color: "#1abc9c", icon: "🤝" },
    { name: "Live & Invest Overseas", url: "https://www.liveandinvestoverseas.com/feed/", tag: "Investing Abroad", color: "#2980b9", icon: "💰" },
    { name: "Expat Tax Online", url: "https://www.expattaxonline.com/feed/", tag: "Expat Tax", color: "#8B6914", icon: "🧮" },
    { name: "The Local Europe", url: "https://www.thelocal.com/feed/", tag: "Europe News", color: "#e74c3c", icon: "📰" }
  ],

  // ── COMMUNITY & CONSULAR ─────────────────────────────
  community: [
    { name: "Americans in Paris", url: "https://www.americansinparis.org/feed/", tag: "Community", color: "#c0392b", icon: "🗼" },
    { name: "AARO", url: "https://americansabroad.org/feed/", tag: "Advocacy", color: "#0A1F5C", icon: "🌍" },
    { name: "Democrats Abroad", url: "https://www.democratsabroad.org/feed/", tag: "Political", color: "#2980b9", icon: "🗳️" },
    { name: "French Morning", url: "https://frenchmorning.com/feed/", tag: "French-American", color: "#8e44ad", icon: "☕" }
  ],

  // ── LEGAL & ADMIN ────────────────────────────────────
  legal: [
    { name: "Service-Public.fr", url: "https://www.service-public.fr/rss/particuliers.xml", tag: "French Gov", color: "#0A1F5C", icon: "🏛️" },
    { name: "The Connexion — Legal", url: "https://www.connexionfrance.com/rss", tag: "Legal", color: "#c0392b", icon: "⚖️" },
    { name: "Expatica — Legal", url: "https://www.expatica.com/fr/living/feed/", tag: "Admin", color: "#27ae60", icon: "📋" }
  ],

  // ── FRENCH LANGUAGE & CULTURE ─────────────────────────
  culture: [
    { name: "The Good Life France", url: "https://thegoodlifefrance.com/feed/", tag: "French Life", color: "#27ae60", icon: "🌻" },
    { name: "French Morning", url: "https://frenchmorning.com/feed/", tag: "Culture", color: "#8e44ad", icon: "☕" },
    { name: "The Local France", url: "https://www.thelocal.fr/feed/", tag: "France Culture", color: "#e74c3c", icon: "🗞️" },
    { name: "FrenchEntrée", url: "https://www.frenchentree.com/feed/", tag: "French Life", color: "#2980b9", icon: "🏡" }
  ]
};

// ── Make available globally ──
window.EXTENDED_FEEDS = EXTENDED_FEEDS;

// ── Render a mini live feed widget on a landing page ──
async function renderLandingFeed(containerId, feedKeys, maxItems = 6) {
  const container = document.getElementById(containerId);
  if (!container || !window.AIF_Feeds) return;

  const { fetchFeed, buildFeedCard, renderSkeletons } = window.AIF_Feeds;

  // Show skeletons
  const skeletonGrid = document.createElement('div');
  skeletonGrid.className = 'lp-feed-grid';
  container.appendChild(skeletonGrid);
  renderSkeletons(skeletonGrid, 4);

  // Collect feeds
  const feedsToLoad = [];
  feedKeys.forEach(key => {
    if (EXTENDED_FEEDS[key]) {
      feedsToLoad.push(...EXTENDED_FEEDS[key].slice(0, 3));
    }
  });

  try {
    const results = await Promise.allSettled(feedsToLoad.map(f => fetchFeed(f)));
    const loaded = results
      .filter(r => r.status === 'fulfilled' && r.value)
      .map(r => r.value);

    const allItems = loaded
      .flatMap(r => (r.items || []).slice(0, 3).map(item => ({ item, source: r.source })))
      .sort((a, b) => new Date(b.item.pubDate) - new Date(a.item.pubDate))
      .slice(0, maxItems);

    if (allItems.length === 0) {
      skeletonGrid.innerHTML = '<p style="color:var(--mid-grey);font-size:0.85rem;padding:16px;grid-column:1/-1;">Live feed temporarily unavailable.</p>';
      return;
    }

    skeletonGrid.innerHTML = allItems.map(({ item, source }) =>
      buildFeedCard(item, source)
    ).join('');

  } catch (e) {
    skeletonGrid.innerHTML = '<p style="color:var(--mid-grey);font-size:0.85rem;padding:16px;grid-column:1/-1;">Could not load live feed.</p>';
  }
}

// ── Inline newsletter form handler ──
function initInlineNewsletter(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    if (!emailInput) return;
    const email = emailInput.value.trim();
    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Subscribing…'; }
    try {
      await fetch('tables/newsletter_subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subscribed_at: new Date().toISOString() })
      });
      form.innerHTML = '<p style="color:var(--gold);font-weight:600;margin:0;">✅ You\'re subscribed! Welcome to AmericanAbroad.</p>';
    } catch {
      if (btn) { btn.disabled = false; btn.textContent = 'Subscribe'; }
    }
  });
}

// ── Make available globally ──
window.renderLandingFeed = renderLandingFeed;
window.initInlineNewsletter = initInlineNewsletter;
