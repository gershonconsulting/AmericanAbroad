# Campaign links & tracking — americanabroad.net

Every page records visits with their UTM tags (`api/t.php`), and every form
submission carries the first-touch UTM tags of the visitor (`api/submit.php`).
Data is stored on Hostinger in `api/data/` (blocked from the web) and each
submission is emailed to olivier@gershonconsulting.com.

Results: `https://americanabroad.net/api/stats.php?k=<key>` (key is kept in the
claude.ai AmericanAbroad.net project, not in this public repo). Views, unique
visitors, submissions and conversion per campaign/email, plus CSV export.

## Local Representative campaign (Snov.io, email only)

| Email in sequence | Link to use |
|---|---|
| Email 1 | https://americanabroad.net/representatives.html?utm_source=snovio&utm_medium=email&utm_campaign=local-reps-2026&utm_content=email1 |
| Email 2 (follow-up) | https://americanabroad.net/representatives.html?utm_source=snovio&utm_medium=email&utm_campaign=local-reps-2026&utm_content=email2 |
| Email 3 (follow-up) | https://americanabroad.net/representatives.html?utm_source=snovio&utm_medium=email&utm_campaign=local-reps-2026&utm_content=email3 |
| Direct "apply" button | https://americanabroad.net/representatives.html?utm_source=snovio&utm_medium=email&utm_campaign=local-reps-2026&utm_content=apply#apply |

To split results by country, append the country to the campaign name, e.g.
`utm_campaign=local-reps-2026-de`.

## Rules
- utm_source = the tool sending (snovio, linkedin, x, newsletter)
- utm_medium = email | social | referral
- utm_campaign = short-name-year (lowercase, hyphens)
- utm_content = which email / which button
