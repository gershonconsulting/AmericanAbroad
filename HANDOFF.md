================================================================
HANDOFF.md  -  AmericanAbroad
Written by: Claude (nightly run) - token-limit handoff protocol
Date: 2026-10-22 (night of 2026-10-21 ET)
Reason: every repo must carry a handoff so another AI can continue
        from this file alone.
================================================================

0. WHO YOU ARE READING THIS
----------------------------------------------------------------
You are an AI assistant taking over this repository for Olivier Attia,
founder / CTO of Gershon Consulting LLC.

Read the MASTER HANDOFF first:
  github.com/gershonconsulting/memory -> HANDOFF.txt

CRITICAL OPERATING RULES:
  * Olivier does NOT use a terminal, CLI, git or PowerShell. Never give
    him commands or 'just run this' steps.
  * He does NOT upload/download/move files. YOU find the route.
  * End every actionable reply with:
      GREEN CHECK = ready for him to test (+ link)
      RED CROSS   = something still to do (+ exactly 3 options he can
                    action - never a CLI step)
  * Executors: Ariel = code/repo work. Charles = Chrome extension and web
    admin panels (Cloudflare, GitHub settings, DNS, publishing).

1. WHAT THIS REPO IS
----------------------------------------------------------------
Product / site name : AmericanAbroad.net - 'A Gershon Consulting Initiative'
Live URL            : https://americanabroad.net (README says 'pending DNS /
                      Hostinger configuration'; the 2026-10-11 commit imported
                      the LIVE site, so it is live - exact status unverified)
What it does        : Resource hub for Americans living abroad: 200+ curated
                      links, 30+ topic guides, newsletter, partner
                      (consultant) recruitment, Local Leaders program
                      (leaders.html), a multilingual /articles/ hub, and a
                      funnel to Gershon Consulting US-market services.
Who uses it         : Americans abroad; American consultants abroad (partner /
                      local-representative recruitment). Sister of
                      AmericanInFrance.fr.

2. STACK AND DEPLOY ROUTE
----------------------------------------------------------------
Language / framework: Pure HTML5 + CSS3 + vanilla JS, no build. Google Fonts
                      (Playfair Display, Inter), Font Awesome 6.5.2 CDN.
Hosting             : Hostinger static hosting.
DNS / registrar     : Tierra.net; Cloudflare CDN/DNS/SSL.
Deploy method       : GitHub Actions -> FTP -> Hostinger on every push to
                      main (.github/workflows/deploy.yml, SamKirkland
                      FTP-Deploy-Action; also workflow_dispatch). It uploads
                      the REPO ROOT and excludes only .git*, .github,
                      node_modules, *.md, *.xlsx. Keep notes in .md files.
Default branch      : main
How to ship a change: Branch, PR, merge to main -> auto FTP deploy. Check the
                      Actions tab for a green run.
Secrets / env vars  : GitHub Actions secrets (names only): FTP_SERVER,
                      FTP_USERNAME, FTP_PASSWORD, FTP_SERVER_DIR (trailing
                      slash matters). Values live in 1Password / GitHub.

3. RECENTLY DONE  [DONE]
----------------------------------------------------------------
- 2026-04-29 README + FTP deploy workflow added.
- 2026-10-11 Live site imported into the repo (it was not stored here, so a
  push would have overwritten it) + multilingual /articles/ hub, sitemap,
  robots.
- 2026-10-19 LinkedIn Group and X (@AmericanAbroadN) links added site-wide,
  Organization JSON-LD with sameAs, community band on homepage, Font
  Awesome bumped to 6.5.2.

4. PENDING  [TODO]  (from Olivier's memory file areas/american-abroad.md)
----------------------------------------------------------------
- Local-representative recruiting campaign: target American consultants
  (consultancies under 10 employees) in the top 20 target countries,
  email only on Snov.io, sent from a new americanabroad.net mailbox.
  Americans only; no LinkedIn campaign; WhatsApp parked.
- Campaign links must point to americanabroad.net with tracking links so
  success can be measured.
- SEO on americanabroad.net (Olivier says it lacks it today). The 10-19
  JSON-LD is a start; sitemap exists. Titles/meta audit not done.
- New americanabroad.net mailbox (info@ plus forwarders) - status unverified.

5. MISSING / NOT BUILT YET
----------------------------------------------------------------
- Backend for forms: README says forms post to /tables/<name> endpoints
  (newsletter_subscribers, consultant_partners, local_leaders). Those came
  from a Genspark-era setup; the sibling AmericanInFrance repo removed its
  dead handlers because 'Genspark Tables endpoints don't exist on Pages'.
  Whether these forms work on Hostinger is UNVERIFIED and likely broken.
- Tracking/UTM links and analytics: not in repo.

6. KNOWN BUGS / NEEDS FIXING
----------------------------------------------------------------
- Possible dead forms (see section 5). Test newsletter.html, partners.html,
  leaders.html end to end.
- README repo URL says github.com/gershonconsulting/americanabroad
  (lowercase) and 'pending DNS' - stale text.
- topics/gershon-* links were repointed to gershonconsulting.com because
  those pages did not exist.

7. NEXT ACTION - START HERE
----------------------------------------------------------------
The single most valuable next step is:
  -> Get main deployed (see section 11), then submit each form on the live
     site once and see where it lands; if it fails, repoint the forms (e.g.
     to the newsletter link approach used on AmericanInFrance) before the
     local-rep campaign sends traffic here.

8. GOTCHAS / HARD-WON LESSONS
----------------------------------------------------------------
- NEVER push without confirming the repo mirrors production: the live site
  was once absent from this repo.
- FTP_SERVER_DIR needs a trailing slash.
- Any non-.md file in the repo is uploaded to the public web root.
- Brand tokens: navy #0A2463, red #BF0A30 (defined in css/style.css :root).
- Site must stay US-citizen focused; content is not legal/tax advice.

9. CONTACT / ESCALATION
----------------------------------------------------------------
Olivier Attia (owner)
Report mailbox - report@gershonconsulting.com

10. NIGHTLY 2026-11-07 AUDIT (folded in from PR #3)
----------------------------------------------------------------
AUDIT FINDINGS ON LIVE https://americanabroad.net
- JS parse error "Unexpected token ']'": from live /js/feeds.js line 102
  (stray "];").
- 553px horizontal overflow at 390px viewport (scrollWidth 553; 32 elements
  past right edge, in homepage card/feed rows).

ROOT CAUSE
- Live site is STALE. Repo main (c18267e) already contains the fix (commit
  c88307f removed the stray "];" in js/feeds.js) plus the layout fixes. The
  live HTML lacks css/fixes.css and the SEO tags that main has, so main has
  not been deployed to Hostinger.

VERIFIED ON main (served locally, Playwright chromium)
[x] js/feeds.js, js/main.js, js/landing.js pass node --check; inline scripts
    in index.html parse
[x] No JS parse/page errors at 1280 and 390
[x] scrollWidth at 390 = 390 (live: 553); at 1280 = 1280
[ ] Only remaining >390 element is the fixed-position .toast (offscreen by
    design, no scroll effect)

11. NIGHTLY 2026-11-17 STATUS
----------------------------------------------------------------
[DONE] Handoff renamed HANDOFF.txt -> HANDOFF.md so the FTP deploy
       (which excludes **/*.md) never uploads it to the public web root.
       PR #3's separate HANDOFF-2026-11-07.txt folded in here (section 10).
[TODO] Live site still stale vs main (live homepage has no css/fixes.css,
       checked 2026-11-17). Options for Olivier:
       (1) Charles: GitHub -> AmericanAbroad -> Actions -> "Deploy to
           Hostinger via FTP" -> Run workflow on main;
       (2) Charles: open the last failed run and check the 4 FTP secrets
           (FTP_SERVER_DIR needs a trailing slash);
       (3) move hosting to Cloudflare Pages (push-to-deploy like the other
           Gershon sites).

================================================================
END OF HANDOFF
================================================================
