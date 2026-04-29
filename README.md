# AmericanAbroad.net — Project Documentation

**A Gershon Consulting Initiative**
*The definitive resource hub for Americans living abroad — anywhere in the world.*

Sister site to [AmericanInFrance.fr](https://americaninfrance.fr).

---

## What this site is for

1. **Resource Hub** — 200+ curated links across 16 categories for Americans abroad
2. **Topic Library** — 30+ universal landing-page guides (taxes, residency, banking, voting, healthcare, business)
3. **Newsletter & Community** — Weekly digest, partner recruitment, local leader recruitment
4. **Local Leaders Program** — Recruit one trusted leader per city to organize meetups and grow local communities
5. **Gershon Consulting Funnel** — Business development for US market entry services

---

## Tech stack

- Pure HTML5 + CSS3 + Vanilla JavaScript (no build step)
- Fonts: Google Fonts (Playfair Display + Inter)
- Icons: Font Awesome 6.4.0 (CDN)
- Data: Static — no backend required for the static site itself
- Forms: post to `/tables/{table_name}` endpoints (configure backend in Hostinger or proxy via Cloudflare Worker)
- Hosting: Hostinger (static hosting)
- DNS / SSL / CDN: Cloudflare
- Auto-deploy: GitHub Actions → FTP → Hostinger

---

## Brand

- **Navy:** `#0A2463` (USA flag navy)
- **Red:** `#BF0A30` (Old Glory red)
- **White / off-white:** `#FFFFFF` / `#F7F8FC`
- **Typography:** Playfair Display (serif, headings) + Inter (sans, body)

---

## Repository

GitHub: https://github.com/gershonconsulting/americanabroad
Production URL: https://americanabroad.net (pending DNS / Hostinger configuration)

---

## Deployment

Push to `main` → GitHub Actions runs `.github/workflows/deploy.yml` → site deploys via FTP to Hostinger.

Required GitHub Secrets (Settings → Secrets and variables → Actions):
- `FTP_SERVER` — Hostinger FTP host (e.g., `ftp.americanabroad.net` or the server hostname from Hostinger)
- `FTP_USERNAME` — dedicated FTP user for this site
- `FTP_PASSWORD` — that user's password
- `FTP_SERVER_DIR` — target directory on Hostinger (e.g., `/public_html/` or `/domains/americanabroad.net/public_html/`) — **trailing slash matters**

---

## Color & Design Tokens

Defined in `css/style.css` `:root`:

```css
--navy:      #0A2463;
--navy-light:#1B3A8C;
--red:       #BF0A30;
--red-light: #E63946;
--red-dark:  #8A0820;
--white:     #FFFFFF;
--off-white: #F7F8FC;
--light-grey:#EEF0F5;
--mid-grey:  #8A93A6;
--dark:      #1C1C2E;
```

Class renames vs AmericanInFrance:
- `.btn-outline-gold` → `.btn-outline-red`
- `.text-gold` → `.text-red`
- `.tag-gold` → `.tag-red`
- `.tip-gold` → `.tip-red`

---

## Local Leaders Program

A new feature unique to AmericanAbroad.net (no AIF equivalent). One local leader per city, recruited via `leaders.html`. Leaders organize monthly meetups, become the trusted point of contact, and get early access to AmericanAbroad partner program. Form submissions go to the `local_leaders` table.

---

## Forms / table endpoints

| Form | Posts to | Used by |
|---|---|---|
| Hero newsletter | `tables/newsletter_subscribers` | `index.html` |
| Newsletter full form | `tables/newsletter_subscribers` | `newsletter.html` |
| Partner application | `tables/consultant_partners` | `partners.html` |
| Local leader application | `tables/local_leaders` | `leaders.html` |
| Contact | `tables/consultant_partners` | various |

---

## License & Disclaimer

© 2025 AmericanAbroad.net — A Gershon Consulting Initiative.
Content is general information about life and tax obligations as a US citizen abroad. **Not legal, tax, or financial advice.** Consult a qualified cross-border professional for your specific situation.

