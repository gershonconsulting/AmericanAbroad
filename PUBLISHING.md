# Publishing articles on americanabroad.net

Articles live in `/articles/<lang>/<slug>.html` (lang = en, fr, es, de, it, pt).
The hub is `/articles/index.html`; the page template is `/articles/_template.html`.

## To publish an article
1. Copy `articles/_template.html` to `articles/<lang>/<slug>.html`.
2. Replace every `{{PLACEHOLDER}}`: LANG, SLUG, TITLE, DESCRIPTION, DATE (YYYY-MM-DD),
   BODY_HTML (plain p / h2 / ul / ol / table / strong / em / a), CTA_HEADING, CTA_TEXT, CTA_BUTTON.
   Every article must link to https://www.gershonconsulting.com and the calendar CTA (already in the template).
   For translations, add one `<link rel="alternate" hreflang=...>` line per language version.
3. In `articles/index.html`, add a card between `<!-- ARTICLES:<lang>:START -->` and `<!-- ARTICLES:<lang>:END -->`
   (newest first):
   `<li><a href="<lang>/<slug>.html"><strong>TITLE</strong><span>DATE — one-line summary</span></a></li>`
4. Add the URL to `sitemap.xml`.
5. Commit to `main`. Deployment is automatic: GitHub Actions FTP to Hostinger on every push to main (.github/workflows/deploy.yml).
6. Check the live URL returns 200.
