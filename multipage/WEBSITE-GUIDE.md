# SAC Website — Complete Guide
### Society for Airworthiness and Certification — `multipage/` website

This document explains the **entire website**: how it is built, what every file does, what each
component (header, hero, cards, forms…) is, where it is used, and **why**. It is written for a
normal person — no web-development background needed. If you read it top to bottom, you will be
able to open the right file and make changes with confidence.

> **Golden rule:** everything lives in plain `.html`, `.css`, `.js` and image files. There is no
> build step, no framework, no server code, and nothing to install. To see a change, save the file
> and refresh the browser.

---

## 1. The big picture

| Question | Answer |
|---|---|
| What is this? | A static website prototype: 10 real pages + a 404 page + a redirect stub |
| Language used | Plain HTML (structure), CSS (appearance), JavaScript (interactions) |
| Build step? | **None.** Double-click `index.html` and the site opens |
| Server needed? | No. (Optional local preview: `python -m http.server 8080 --bind 127.0.0.1 --directory multipage`) |
| Internet needed? | Only for the two Google Fonts (Fraunces + Inter). Without internet the site still works using Georgia/Arial fallbacks |
| Where is the design decided? | `assets/css/styles.css` (base design) → `assets/css/theme.css` (all shared layout, components and refinements, loaded *after* and therefore winning) |
| Where is behaviour decided? | `assets/js/site.js` (all pages) + `assets/js/library.js` (Knowledge Centre only) |

**How the pages relate:** every page is a complete standalone HTML file. There is **no template
engine** — the shared header, newsflash strip and footer are copied into each page's HTML. This is
why navigation works even with JavaScript disabled, and it also means: *when you change the menu or
footer, you must repeat the change in all 9 standard pages* (index + 8 inner pages).

---

## 2. Folder map — what every file is

```
multipage/
├── index.html                  ← HOME page
├── 404.html                    ← "page not found" page (standalone styling)
├── site.webmanifest            ← tiny file telling browsers how to "install"/brand the site
├── sitemap.xml, robots.txt     ← hints for Google/search engines
├── README.md                   ← short technical readme (older; this guide is the full reference)
├── WEBSITE-GUIDE.md            ← THIS DOCUMENT
├── pages/                      ← the 8 inner pages + 1 redirect stub (see table in §3)
├── assets/
│   ├── css/
│   │   ├── styles.css          ← base/original design: variables, buttons, cards, footer, home hero
│   │   ├── theme.css           ← ALL shared layout & components for the multipage site (56 KB,
│   │   │                          consolidated from several older files — see §6 for the map)
│   │   ├── library.css         ← Knowledge Centre only (search, repository list, outline dialogs)
│   │   └── notices.css         ← Notices page only (stationary notice boards)
│   ├── js/
│   │   ├── site.js             ← ALL page behaviour for every page (menu, slideshow, dialogs,
│   │   │                          ticker, notice carousel, animations, countdown, back-to-top…)
│   │   └── library.js          ← Knowledge Centre only (search box + shareable filter URLs)
│   └── images/                 ← logo, favicon, photos (full inventory in §8)
├── preview/                    ← screenshots + reports produced by the check tools (not part of site)
└── tools/                      ← development-only Python scripts for testing/refactoring (§10)
```

---

## 3. The pages — which file shows what

| Menu item | File | What the page contains |
|---|---|---|
| Home | `index.html` | Photo hero with text + 2 buttons, **image slideshow** (right frame), three "pillar" cards, society intro, sample event with live countdown, notices strip |
| About us | `pages/about.html` | Tejas photo hero, overview, areas-of-focus, CE message, CEMILAC logo, office bearers (`#office-bearers`) |
| Technical Domain | `pages/e-certification-kit.html` | Inspectors photo hero, 7 core-topic cards, "Airworthiness in India" section, "Explore further" button row |
| Events | `pages/events.html` | Audience photo hero, sample programme cards, accessible **programme preview dialogs** |
| Knowledge Centre | `pages/knowledge-centre.html` | Photo hero, **live search**, category filters, 8 sample repository outlines with preview dialogs |
| Membership | `pages/membership.html` | Photo hero, proposed categories, benefits, fee table with **category-highlight filter**, enquiry form (`#join`) |
| Publications | `pages/publications.html` | Photo hero, newsletter/annual-report/journal placeholders, notices archive |
| Contact Us | `pages/contact.html` | Photo hero (**keeps its semi-circle decoration**), contact details, enquiry/feedback form preview |
| Notices (footer/newsflash link) | `pages/notices.html` | All 7 sample notices on stationary, scrollable boards |
| *(no menu)* Dignitaries | `pages/dignitaries.html` | Tiny redirect stub → `pages/about.html#office-bearers` (kept for old bookmarks) |

Navigation is a **flat menu of 8 items + a gold "Join SAC" button** (→ `pages/membership.html#join`).
No dropdowns anywhere. Below 1024 px the same links appear in a hamburger menu. The current page is
marked with `aria-current="page"` (gold underline).

## 4. Anatomy of a page (read this before editing any HTML)

Every standard page has the same skeleton. Using `pages/contact.html` as the example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">                      ← text encoding (always first)
  <meta name="viewport" …>                    ← makes the page responsive on phones
  <meta name="description" …>                 ← text Google shows under the link
  <title>Contact Us | Society for …</title>   ← browser tab text
  <meta property="og:…" …>                    ← preview card when the link is shared on WhatsApp etc.
  <link rel="icon" …>                         ← tab favicon (SVG + PNG fallbacks)
  <link rel="manifest" href="../site.webmanifest">
  <link … fonts.googleapis.com …>             ← Fraunces + Inter web fonts (internet only)
  <link rel="stylesheet" href="../assets/css/styles.css">   ← 1st: base design
  <link rel="stylesheet" href="../assets/css/theme.css">    ← 2nd: shared layout/components (wins)
  <script src="../assets/js/site.js" defer></script>        ← behaviour, deferred (loads after HTML)
</head>
<body class="inner-page">                     ← body class switches home vs inner-page styling

  <!-- SVG icon sprite: hidden box that DEFINES the icons once -->
  <svg class="icon-definitions" …><defs>
     <symbol id="arrow">…</symbol> <symbol id="shield">…</symbol> …
  </defs></svg>

  <!-- skip link for keyboard/screen-reader users -->
  <a class="skip-link" href="#main">Skip to content</a>

  <header> … masthead (logo + brand + tagline) and navigation bar … </header>

  <div class="newsflash"> … scrolling announcement ticker + "View notices" link … </div>

  <main id="main">
     <section class="page-intro page-hero">   ← the photo hero at the top of inner pages
        <img class="hero-photo" src="../assets/images/about-us.jpg" …>
        <div class="hero-shade"></div>        ← navy gradient so white text stays readable
        <div class="page-width"> breadcrumb / eyebrow / h1 / description </div>
     </section>
     … content sections …
  </main>

  <footer> … contact details, quick links, copyright … </footer>

  <!-- reading progress bar + back-to-top button (injected/managed by site.js) -->
</body>
</html>
```

**Key ideas:**
- **Paths:** pages live in `pages/`, so they reference assets with `../` (one folder up).
  `index.html` lives at the top, so it writes `assets/…` without the `../`.
- **Icons:** never paste icon graphics. Define/reuse the sprite symbols with
  `<svg class="icon"><use href="#arrow"/></svg>`. Icons available: `arrow`, `arrow-up`, `book`,
  `shield`, `people`, `document`, `calendar`, `mail`, `pin`, `search`, `flight`, `notices`.
- **`body class`:** `home-page` on index, `inner-page` on the rest. Many CSS rules are scoped with
  these (e.g. only the home hero is teal-tinted). 404 and dignitaries are standalone.
- **`page-width`:** wrapper class that centers content and sets side margins everywhere.

---

## 5. The design system (colors, fonts, shared building blocks)

### 5.1 Colors — change the whole site's mood here
Defined **once** as CSS variables at the top of `styles.css` (`:root { … }`), reused everywhere:

| Variable | Value | Used for |
|---|---|---|
| `--navy` | `#102d47` | Primary brand navy: header, buttons, headings |
| `--navy-dark` | `#0b2238` | Utility bar, dark hero ends |
| `--blue` | `#234d72` | Secondary blue accents |
| `--ink` | `#19334a` | Normal body text on light backgrounds |
| `--muted` | `#536777` | Secondary/small grey text |
| `--gold` | `#edc68b` | Brand gold: eyebrows, highlights, primary buttons |
| `--gold-dark` | `#8b652e` | Gold text on light backgrounds (contrast) |
| `--gold-soft` / `--gold-cream` | `#f5d9ad` / `#f6ead7` | Soft gold fills |
| `--paper` / `--surface` / `--surface-soft` | `#f7f9f8` / `#fff` / `#f1f4f3` | Page and card backgrounds |
| `--ice` | `#dce8ee` | Light text on navy |
| `--line` (+ `-soft`/`-strong`) | `#dbe3e7` | Border colors |
| `--max` | `1240px` | Maximum content width |

👉 **To re-brand colors, edit `:root` in `styles.css` only.** Every page updates automatically.

### 5.2 Fonts
- **Fraunces** — display serif for big headings (the elegant headline font).
- **Inter** — clean sans for everything else.
- Loaded from Google Fonts in each page's `<head>`. Fallbacks: Georgia / Arial.

### 5.3 Reusable building blocks (learn these 8 and you can edit anything)

| Class | What it looks like | Where used |
|---|---|---|
| `.button .button-gold` | Solid gold pill button with arrow icon | Primary actions ("Join SAC", "Explore certification guidance") |
| `.button .button-navy` | Solid navy button | Secondary action next to a gold one (e.g. "See events & workshops") |
| `.button-row` | Flex row of buttons with a 28 px gap (stacks on phones) | Hero buttons, "Explore further" row on Technical Domain |
| `.eyebrow` | Tiny uppercase letter-spaced gold label with a small line | Above every h1/h2: "01 / CORE TOPICS", "KNOWLEDGE. PEOPLE. PROGRESS." |
| `.page-width` | Centered container with consistent side margins | Wraps every section's content |
| `.section` | Standard vertical padding for a content block | All content sections |
| `.page-intro` (+ `.page-hero`) | Inner-page top banner: navy field or photo + text | Top of all 8 inner pages |
| `.card`-family (`.focus-panel`, `.event-card`, `.notice-card`, `.person-card`…) | Navy-bordered rounded card, lifts on hover | Every boxed content item |

---

## 6. Component-by-component reference (what, where, why, how)

### 6.1 Header + navigation (all pages; the `header.css` section inside theme.css)
- **What:** thin navy utility bar, masthead (round CEMILAC logo + two-line brand name + right-side
  tagline and "Contact the society" link), then the navy navigation bar: 8 links + gold "Join SAC".
- **Why:** shared identity and consistent navigation on every page.
- **How:** plain links; `aria-current="page"` marks the current page (gold underline). Below 1024 px
  the bar collapses into a **hamburger** (`.menu-toggle`). On wide screens the masthead scrolls away
  but the nav bar stays **pinned** to the top. Escape closes the mobile menu and focus is restored.
- **Edit:** menu markup is copied into **every** page — repeat changes in all 9.

### 6.2 Newsflash ticker (`.newsflash`, all standard pages)
- **What:** pale strip under the header: gold "NEWSFLASH" label, announcement text, "View notices".
- **How:** if the text is wider than the strip, site.js turns it into a seamless **marquee**
  (moving right-to-left). On narrow screens it wraps statically instead — nothing is cut.
  (A screenshot catching it mid-scroll shows a half word at the edge — that is normal.)
- **Edit:** the announcement text is plain HTML inside `.newsflash` in each page.

### 6.3 Home hero + image slideshow (`index.html` only)
- **What:** large navy hero. Left: eyebrow, big headline (gold italic accent), description, 2
  buttons, footnote. Right: rounded **slideshow frame** with gold corner brackets.
- **Slideshow:** 3 stacked `<img class="hero-photo">` images (a photo + two hand-drawn SVG scenes,
  `hero-slide-2.svg` / `hero-slide-3.svg`). site.js `initHeroSlideshow()` shows one at a time,
  slides it in, renders **3 dots** (real buttons, keyboard accessible) and **autoplays**.
  With "reduce motion" enabled in the OS, slides swap instantly instead of animating.
- **Bottom caption:** "Every detail matters…" + "Illustrative photograph" note.

### 6.4 Inner-page photo hero (`.page-intro.page-hero`, all 8 inner pages)
- **What:** top banner: background photo + navy gradient + breadcrumb/eyebrow/h1/description.
- **Recipe (identical on every page):**
  ```html
  <section class="page-intro page-hero" aria-labelledby="page-title">
    <img class="hero-photo" src="../assets/images/XXX.jpg" width="W" height="H"
         alt="describe the photo…" fetchpriority="high">
    <div class="hero-shade"></div>
    <div class="page-width"> breadcrumb, .eyebrow, <h1 id="page-title">, description </div>
  </section>
  ```
- **Layers:** the section isolates its own stacking context; photo sits at z-index −3, the
  `.hero-shade` gradient at −2 (near-opaque navy on the **left** under the text, fading to ~5 % on
  the right so the photo shows), text at 1. The base `.page-intro::after` decorative **semi-circle**
  is hidden on photo heroes — **except Contact Us**, which adds class `page-hero-ring` to keep the
  ring visible over the photo (an explicit earlier request).
- **Current heroes:** About us → Tejas take-off (`about-us.jpg`); Technical Domain →
  `technical-domain.jpg`; Events → `events-gallery.jpg`; Knowledge Centre →
  `note/knowledge-centre.jpg`; Membership → `note/membership.jpg`; Publications →
  `note/publications.jpg`; Contact Us → `contact-us.jpg`.

### 6.5 Section headers ("01 / CORE TOPICS")
Numbered gold eyebrow + big Fraunces heading + optional grey note. The number is just part of the
eyebrow text. Gives every inner page the same guided, magazine-like rhythm.

### 6.6 Cards family
`.focus-panel`, `.event-card`, `.notice-card`, `.person-card`, topic/category/publication cards —
rounded, 1 px navy-tinted border, generous padding, **hover lift** plus a gold border sheen, gold
accent + arrow nudge on notice cards. site.js adds gentle entrance reveals. Cards remain fully
visible with JavaScript off.

### 6.7 Events programme previews (`pages/events.html`)
- **What:** "Programme preview" buttons on event cards open a **dialog** with a sample agenda.
- **How:** the native `<dialog>` element — Escape closes it, focus returns to the opening button,
  the page behind is blocked. Titles/descriptions come from the `programmes` object at the top of
  `site.js` — **edit that object to change the agenda text**.

### 6.8 Knowledge Centre search + repository (`pages/knowledge-centre.html` + `library.css`/`library.js`)
- **What:** search box, category links (Papers/Standards/Cases/Lectures) with live counts, 8 sample
  outline entries, each with a keyboard-accessible preview dialog.
- **How:** every entry is plain HTML — **without JavaScript everything is visible**. With JS,
  typing hides non-matching entries, updates counts, and syncs the state to the URL, so filtered
  views are shareable: `?category=papers` / `?category=standards` / `?category=cases` /
  `?category=lectures`, and free text via `?q=…`. Matching/counting lives in site.js
  (`initResources()`); URL sync and clear/reset live in `library.js`.

### 6.9 Membership fee highlight (`pages/membership.html`)
Buttons above the fee table are hidden in HTML; site.js reveals them and **dims non-matching fee
rows** so one category can be compared. Without JS the plain full table simply shows.

### 6.10 Homepage countdown (`#event-countdown`, index.html)
Static HTML truthfully says "dates to be announced". site.js swaps in a **live ticking countdown**
to a clearly-labelled *sample* date (`2027-01-15T09:00:00+05:30`, in the `updateCountdown()` block
of site.js). Edit that string to point at a real or new sample date.

### 6.11 Notice boards (home carousel + `pages/notices.html`)
- **Home:** a horizontally draggable/swipeable track of notice cards (site.js `buildTrack`,
  `canMove`, `step`, `startMovement`…). Native touch, wheel and keyboard scrolling stay usable;
  arrow buttons nudge one card at a time; exactly three cards stay in view per row on desktop.
- **Notices page:** stationary boards — fixed heading, scrollable body when there are more than
  three notices (notices.css). This page deliberately does **not** load the carousel behaviour.

### 6.12 Publications cover preview (`pages/publications.html`)
Journal/report covers enlarge on hover/focus (pure CSS); site.js adds only a gentle tilt.

### 6.13 Contact & membership forms (demo only)
Validation errors and a confirmation dialog are **preview-only**: **no data is sent or stored**
(there is no server). To collect real enquiries, connect the form to a service (see §10.7).

### 6.14 Reading progress + back-to-top (all standard pages)
site.js injects a thin gold progress bar and a "back to top" button; `updateScrollControls()` shows
them only after scrolling starts. Both are hidden when printing. Keyboard focus is never stranded
if the button hides.

### 6.15 Footer (all pages)
Contact details, quick links (including Notices), brand line, copyright. Same copy-paste rule as
the header: edit it in **all 9 standard pages**.

---

## 7. The CSS files — which file to edit for what

**Load order matters** (later rules override earlier ones):
`styles.css` → `theme.css` → (page-specific: `library.css` or `notices.css`).

| File | Size | Role | Edit here when… |
|---|---|---|---|
| `assets/css/styles.css` | 27 KB | Original base design: `:root` variables, buttons, home hero, footer, slideshow animation | Changing a **global** variable (colors, max width), the base button look, slideshow timing |
| `assets/css/theme.css` | 56 KB | **Everything shared for the multipage site**, consolidated from older files; organised by `=== name.css ===` comment markers (map below) | Most layout / component / responsive work |
| `assets/css/library.css` | 9 KB | Knowledge Centre only | The repository list / search look |
| `assets/css/notices.css` | 2 KB | Notices page only | The stationary notice boards |

**Map of the `=== sections ===` inside theme.css, in order (later wins):**
1. `=== pages.css ===` — inner-page layouts layered over the base design
2. `=== newsflash.css ===` — the single-line announcement ticker
3. `=== noticeboard.css ===` — notice boards (home + notices page)
4. `=== experience.css ===` — small refinements and optional motion (reveals, countdown row…)
5. `=== refinement.css ===` — the multipage design system: typography scale, hover motion (card
   lift, nav gold underline, footer link nudge), webfonts, **photo heroes**, home pillars
6. `=== header.css ===` — shared header, nav states, mobile menu (loaded **last**)

**Responsive breakpoints:** 1100 px, 1024 px (hamburger appears), 800 px, 480 px. site.js adds
`experience-ready` to `<html>`; CSS only hides content *after* that class exists, so content is
never invisible if JavaScript fails.

---

## 8. The JavaScript — what runs, and what happens without it

### 8.1 `assets/js/site.js` (29 KB, loaded by every standard page with `defer`)
One self-contained script ending in a single initialisation block. Features:
- **`initNavigation()`** — mobile hamburger open/close, Escape-to-close, focus restore.
- **`initHeroSlideshow()`** — home slideshow: active slide, dots, autoplay.
- **`initResources()`** — Knowledge Centre search, category counts, result animations.
- **`initEventPreviews()` / `closeDialog()`** — programme/membership/contact dialogs.
- **`initFeedbackForm()`** — demo validation + confirmation for forms.
- **Notice carousel** — `buildTrack`, `canMove`, `step`, `startMovement`, drag + arrows.
- **Experience pass** — `playIntroduction()` (hero entrance), `observeContent()` /
  `revealTimelines()` (fade-in on scroll), `animateEntry()`.
- **`measureHeader()` / `updateScrollControls()`** — pinned-header offset, progress bar, back-to-top.
- **`updateCountdown()`** — homepage event countdown.
- Respects `prefers-reduced-motion`: informational updates still happen; *movement* does not.

### 8.2 `assets/js/library.js` (7 KB, Knowledge Centre only)
Shareable filtered URLs (`?category=…`, `?q=…`) and clear/reset helpers. It cooperates with the
search logic owned by site.js (site.js matches/counts; library.js handles the URL).

### 8.3 The no-JavaScript promise (an important design decision)
Navigation links, all text, repository entries, the fee table, and notices are **plain HTML and
stay visible**. JavaScript is needed only for: hamburger toggle, slideshow controls, search and
filtering, dialogs, carousel arrows, countdown ticking, and form previews. Nothing on the site
*requires* JavaScript just to be read.

---

## 9. Image inventory (assets/images/)

All images are local. `note/` holds the newer photos; the rest are originals.

| File | Size | Used on | Notes |
|---|---|---|---|
| `cemilac_logo.png` | 75 KB | **Every page** (header, footer, favicon fallback) | The round CEMILAC emblem |
| `favicon.svg` | <1 KB | Every page | Browser-tab icon |
| `aviation-hero.jpg` | 268 KB | Home hero background (+ referenced in theme.css) | Wing-above-clouds photo |
| `hero-slide-2.svg` | 8 KB | Home slideshow slide 2 | Hand-drawn scene (editable text/vector) |
| `hero-slide-3.svg` | 6 KB | Home slideshow slide 3 | Hand-drawn engine-inspection scene |
| `note/about-engineers.jpg` | 252 KB | Home slide 1 + Technical Domain body | Engineers at schematics |
| `about-us.jpg` | 72 KB | **About us hero** | Tejas take-off (optimised from 1.5 MB) |
| `technical-domain.jpg` | 166 KB | Technical Domain hero | Inspection/testing imagery |
| `events-gallery.jpg` | 168 KB | **Events hero** | Lecture-hall audience (replaced old `event.jpg`) |
| `note/knowledge-centre.jpg` | 229 KB | Knowledge Centre hero | Team at monitors |
| `note/membership.jpg` | 228 KB | Membership hero + in-page | Professionals meeting |
| `note/publications.jpg` | 192 KB | Publications hero | Desk with laptop/book |
| `contact-us.jpg` | 15 KB | Contact Us hero | Laptop + glowing comms icons (small source: 491×223 — keep the dark overlay) |
| `note/home-events.jpg` | 71 KB | Home events section | Event imagery |
| `note/about-community.jpg` | 197 KB | *(unused)* | Spare community photo |
| `note/events-stage.jpg` | 216 KB | *(unused)* | Spare conference-stage photo |
| `sac-emblem.jpg` | 74 KB | *(unused)* | Retired emblem (kept for reference) |
| `journal-sample.jpg` | 234 KB | *(unused)* | Spare journal cover |

**Rules of thumb for new images:** hero photos ≈ 1600 px wide, JPEG quality ~82, under ~250 KB
(otherwise upscale softness/slowness hurts the site); always set `width=`/`height=` on `<img>` to
avoid layout shift; describe the photo in `alt="…"`; end hero alt text with "used as illustrative
imagery" while photos are placeholders.

---

## 10. How to make common changes (step-by-step recipes)

**Before editing:** make a copy of the file (or use version control). After editing, refresh with
Ctrl+F5 (hard refresh) to bypass cached CSS/JS. Ideally run the check tools (§11).

### 10.1 Change any text
Search the page's HTML for the text and edit it. Text lives in the HTML — *not* in CSS — except:
- event programme agendas → `programmes` object in `site.js`;
- countdown labels/sample date → `updateCountdown()` block in `site.js`.

### 10.2 Change a menu item or footer link (affects all pages)
1. Open all 9 standard pages (`index.html` + the 8 files in `pages/`).
2. Find the `<nav>` (or `<footer>`) block and edit the `<a href="…">Label</a>`.
3. Keep `aria-current="page"` only on the link pointing to the page itself.
4. If adding a **new page**, also update `sitemap.xml`.

### 10.3 Change the site colors or fonts
Colors: edit the `:root { … }` block at the top of `styles.css`. Fonts: change the Google Fonts
`<link>` in each page's `<head>` **and** the `--serif`/`--sans` variables in `:root`.

### 10.4 Replace a photo
1. Put the new file in `assets/images/` (or `assets/images/note/`).
2. Find the `<img>` (or CSS `url(...)`) referencing the old file; update `src`, `width`, `height`,
   and `alt`.
3. Hero photos: keep ≈1600 px wide, optimise the size, and check the left third still darkens
   nicely under the navy gradient (text legibility).
4. Use the image inventory table (§9) to see every place a file is referenced.

### 10.5 Add a new inner page
1. Copy an existing simple page (e.g. `pages/events.html`) as a starting point.
2. Change `<title>`, meta description, `og:` tags, `<h1>`, and the hero text.
3. Point the hero `<img>` at your image; keep the `page-intro page-hero` recipe from §6.4.
4. Update the nav in all 9 pages, add the page to `sitemap.xml`.
5. Keep the correct asset prefix: files in `pages/` use `../assets/…`.

### 10.6 Add an event card / notice / repository entry
Copy an existing card block inside the same grid/list, change its text, image and date. For the
Knowledge Centre, keep the markup pattern of a neighbouring entry so search/counting keeps working.
Home notices go in the carousel track; Notices page notices go in the stationary boards.

### 10.7 Make the contact/membership forms real
The forms currently demo-validate and show a confirmation dialog without sending anything. To go
live, either point the `<form action="…">` at a form service (e.g. a forms provider) or add a tiny
server/backend — then disable the demo dialog in site.js's `initFeedbackForm()`.

### 10.8 Adjust hero text contrast or the overlay
The gradient lives in the `.hero-shade` rules (refinement section of theme.css). Making the left
stop darker (e.g. `rgba(7,28,47,.94)` → higher alpha) increases text contrast over busy photos.

---

## 11. Development tools (`tools/` — not needed to run the website)

| Script | Purpose |
|---|---|
| `check_multipage.py` | **Main test suite**: opens every page in headless Chrome and runs 94 checks (page loads, images, no overflow at 320–1440 px, mobile menu, no JS errors). Run: `python multipage/tools/check_multipage.py` |
| `check_refinement.py` | **Focused design review**: 48 checks (hero fits at five widths, dialogs, menus, forms) |
| `check_tickers.py` | Newsflash ticker review across versions |
| `probe_*.py` | Small temporary diagnostics (slideshow autoplay, hero heights, hover lift, margins) |
| `consolidate_assets.py`, `restructure_nav.py`, `repurpose_kit.py`, `update_*.py`, `revert_*.py`, `truncate_*.py` | One-shot **history** scripts that produced today's files. Safe to ignore — do not re-run them |

Both check suites print `PASS/FAIL` lines and write screenshots to `preview/`. If you change
layout, run both suites and confirm `94/94` and `48/48 checks passed`.

---

## 12. Glossary (plain-English terms used above)

- **HTML** — the content/structure file the browser reads (`.html`).
- **CSS** — appearance rules (`.css`); "cascade" = later/equal-specificity rules win.
- **JavaScript (JS)** — the behaviour layer (`.js`); runs after the page loads (`defer`).
- **CSS variable** — a named value (`--navy`) defined once, reused everywhere.
- **Class** — a label like `class="button"` that connects HTML to CSS rules (`.button`).
- **Responsive / breakpoint** — the layout adapts to screen width; a breakpoint is a width where
  rules change (here: 1100/1024/800/480 px).
- **Hero** — the big banner at the top of a page.
- **Dialog** — a pop-up panel built with the native `<dialog>` element (Escape closes it).
- **`aria-current`, `alt`, `aria-label`** — accessibility attributes for screen readers.
- **Sprite** — one hidden SVG block that defines icons reused via `<use href="#icon-name"/>`.
- **Favicon / webmanifest** — the tab icon / install-and-branding metadata.
- **`prefers-reduced-motion`** — an operating-system setting the site honours by removing motion.

---

*Last updated: after the About/Events/Contact photo-hero work, slideshow badge removal, and the
Technical Domain button-spacing fix. If the README and this guide ever disagree, this guide is the
current reference — the README still describes some pre-consolidation file names.*






