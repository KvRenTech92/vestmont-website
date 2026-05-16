# Vestmont Website — Project Reference

Working notes for Claude Code sessions. Read this first before doing anything.

## What this is

- **vestmont.com** — marketing site for Vestmont Capital, a Phoenix-based CRE firm (capital placement, direct lending, brokerage, advisory).
- Owner: Kevin Barr.
- Audience: sponsors, LPs, brokers, lenders, sellers.

## Tech stack

- **Plain static HTML/CSS/JS.** No framework, no bundler, no build step.
- Single shared stylesheet `styles.css` (~46 KB). Cache-busted via `?v=NNN` query string — bump the number on `<link rel="stylesheet">` when CSS changes.
- Page-specific overrides live in inline `<style>` blocks inside each HTML file.
- Shared header/footer rendered client-side by `partials.js` — every page has empty mount points (`<div id="site-header"></div>` etc.) and `partials.js` injects HTML on load.
- Fonts: Fraunces (display), Inter / Inter Tight (UI), via Google Fonts.
- Local preview: `./serve.sh 8000` runs `python3 -m http.server 8000`.

## Deployment chain

```
edit files → git push origin main → Vercel builds → live at vestmont.com (~30s)
```

- **GitHub:** `KvRenTech92/vestmont-website` (account `kvrentech92`).
- **Vercel:** project `prj_jJwwFLnPOMolAQktqPNDQUWLBhPX`, auto-deploys `main`. No CI, no GitHub Actions, no manual deploy step.
- **Cloudflare:** DNS only (A record points to `76.76.21.21`, CNAME `www → cname.vercel-dns.com`). Cloudflare is **not** proxying / CDNing — Vercel handles the edge.
- `vercel.json` only has one rule: redirect `www.vestmont.com → vestmont.com`.
- **No staging environment.** Push to main = live. Treat every push as a prod deploy.

## Service accounts

Full list in `vestmont-accounts.xlsx` (no credentials stored there — just service mapping). Live integrations:

| Purpose | Service | Notes |
|---|---|---|
| Forms (Contact, Start a Deal) | Formspree | Submissions go to `info@vestmont.com` |
| LinkedIn auto-posts | Zapier | Pulls from `feed.xml` (RSS) → posts to Vestmont company page |
| X / Twitter auto-posts | dlvr.it | Pulls from `feed.xml` (RSS) → posts to `@Vestmont` |
| Analytics | Google Analytics | Property `G-MGFTREPZ11`, embedded in every page `<head>` |
| Search indexing | Google Search Console | Verification meta tag in every page `<head>` |
| Video hosting | Vimeo | Life Storage case study video |

**Editing the RSS feed (`feed.xml`)** triggers Zapier + dlvr.it. Don't change titles/links lightly — auto-posts may re-fire on perceived "new" items.

## Repo / file layout

```
vestmont-website/
├── index.html              # homepage
├── about.html
├── capital.html            # Capital Markets
├── investment-sales.html   # Brokerage
├── advisory.html
├── track-record.html       # deal log
├── insights.html           # blog index
├── insights/               # 7 long-form articles
│   ├── bridge-to-perm.html
│   ├── entitled-vs-raw.html
│   ├── grocery-anchored.html
│   ├── mixed-use-comps.html
│   ├── select-service-hotel.html
│   ├── small-bay-vs-big-box.html
│   └── west-valley-basis-trade.html
├── contact.html
├── start-a-deal.html       # form CTA
├── styles.css              # design system + all components
├── partials.js             # injects site-wide nav and footer
├── feed.xml                # RSS for Zapier/dlvr.it
├── sitemap.xml, robots.txt # SEO
├── favicon.ico             # plus assets/favicon-* variants
├── vercel.json             # deploy config (www redirect only)
├── .vercelignore           # files excluded from deploy (see below)
├── serve.sh                # local preview helper
├── vestmont-accounts.xlsx  # service mapping doc
└── assets/                 # images, video, logos
    ├── heroes/             # NEW — page hero images (untracked as of 2026-05-15)
    ├── property-types/     # NEW — carousel images for capital page (untracked)
    ├── deals/              # NEW — deal card thumbnails (untracked)
    ├── rezide-ba/          # NEW — case study assets (untracked)
    └── (many legacy subfolders — see "State of the repo" below)
```

## CSS conventions

Design tokens (in `:root` at top of `styles.css`):

```
--brand-ink:    #1F2937   /* primary dark text */
--brand-light:  #C5A572   /* signature gold */
--brand-tint:   #F1F3F5   /* soft background */
--bg:           #FAFBFC
--muted:        #6B7280
--max:          1200px    /* .container max-width */
--nav-h:        72px
--ease:         cubic-bezier(.4, 0, .2, 1)
```

Recurring class patterns (deployed version):

- `.container` — centered wrapper, max-width `--max`, 32px side padding.
- `.section`, `.section-stats`, `.section-dark`, `.page-hero` — section primitives.
- `.reveal`, `.reveal-stagger` — scroll-triggered fade-in (toggled to `.is-visible` by JS).
- `.property-types-grid` / `.prop-type` — property-type grid on capital page (deployed). The local redesign replaces this with `.pt-carousel` / `.pt-card`.
- `.two-paths` / `.path-card` — three solution cards on capital page (Direct Lending / Capital Placement / Equity Placement). Collapses to single column at `≤1000px`. Local redesign uses `.cs-cards` / `.cs-card` instead.
- `.deal` / `.deal-img` / `.deal-tag` — deal cards on track-record and capital pages, with modal popups (`.deal-modal-overlay`).
- `.logo-mark`, `.wordmark` — brand-mark composition.

Mobile breakpoint convention: `@media (max-width: 768px)` for fine-grained mobile, `≤1000px` for tablet-and-down collapse points.

## State of the repo — IMPORTANT

As of 2026-05-15, the working tree is in a messy intermediate state:

- **Last clean commit on `main`:** `94e99fa` ("Move email logo to assets folder", 2026-05-14). That's what's live.
- **145 files dirty.** Mostly an in-progress redesign across every HTML page, plus a major asset reorganization.
- **Hundreds of legacy asset files deleted locally** (entire folders like `assets/Flow Pics/`, `Gemini/`, `Property Pics/`, `The Team Pics/`, `Vestmont Logo/`, and many top-level hero videos). Many of these are still referenced by the **deployed** HTML.
- **New asset folders are UNTRACKED** (`assets/heroes/`, `assets/property-types/`, `assets/deals/`, `assets/rezide-ba/`). The new local HTML references them but a `git push` would NOT include them — page would 404.
- `_archive/` (untracked, in `.vercelignore`) contains moved-out legacy assets and `Tombestone Details/` (deal docs).

**Do not assume `local capital.html == live capital.html`.** They're significantly different. Check `git diff <file>` before reasoning about any page.

## Deployment safety rules

1. **Push = instant live.** No staging. Every commit on `main` deploys in ~30s.
2. **Never run `git add -A` or `git add .`** in this repo. The working tree has lots of in-flight work; a sweep will deploy unintended changes. (This already happened once — see commits `522580d` and `94e99fa`, which accidentally pushed unrelated edits to `capital.html` and `west-valley-basis-trade.html` while moving the email logo.)
3. **Stage explicit files only:** `git add path/to/file.html`.
4. **Before any commit, run `git diff --cached`** and confirm exactly what's about to ship.
5. **Before pushing a redesigned page, verify all referenced assets are tracked.** Grep the file for `src=` / `url(` / `href=` and `git ls-files` each one. Untracked assets will 404 in production.
6. **For surgical hotfixes on a dirty working tree:** `git stash push -u` first, then make the small change against the clean `HEAD`, commit, push, then `git stash pop`.
7. **Never force-push `main`.** Vercel auto-deploys whatever `main` points to.
8. **Bump the CSS cache-buster** (`styles.css?v=NNN`) on every page when shipping a `styles.css` change, or visitors will see stale styles for hours. (Not needed for inline-`<style>` edits — HTML already has `Cache-Control: no-cache` meta.)

## .vercelignore

Files in the repo but excluded from deploy:
- All `hero-*.mp4` videos in `assets/` (too large; site uses hero **images** in production, not video)
- `_archive/` (legacy work-in-progress)
- `Tombestone Details/` (private deal docs)
- `serve.sh` (dev helper)
- `.claude/`, `.DS_Store`

## Common gotchas

- **Header/footer not appearing on a new page?** Add `<div id="site-header"></div>` (and the footer mount) and include `<script src="partials.js"></script>` before `</body>`. For pages in `insights/` subfolder, `partials.js` already handles the `../` prefix automatically via the `knownSubDirs` list — add any new subdirectory there if you create one.
- **Form submissions failing?** Formspree endpoint URLs are in `contact.html` and `start-a-deal.html`. The destination email is `info@vestmont.com`.
- **Mobile testing:** capital page uses `≤1000px` for the main grid collapse (`.two-paths` → 1 column). Many sections have separate mobile rules — search the file for `@media` before assuming one global rule.
- **Insights articles** share a common layout. When adding a new one, copy an existing file from `insights/` and update the slug + content; then add an entry to `insights.html` (index) and `feed.xml` (RSS).
- **Inline styles in pages override `styles.css`.** Capital page in particular has a large inline `<style>` block at the top with `!important` rules — check there first if a global CSS change doesn't take effect.

## When you sit down to work

1. Run `git status` and `git diff --stat` first. Understand what's already dirty.
2. Run `git log --oneline -10` to see what shipped recently.
3. If asked to fix something Kevin saw on the live site, fetch `https://vestmont.com/<page>` and verify the CSS/markup matches what's at `HEAD`, not what's local. The two can be very different.
4. Confirm scope with Kevin before any non-trivial change. He has been burned by over-eager `git add` once already.
