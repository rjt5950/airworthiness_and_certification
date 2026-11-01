# Society for Airworthiness and Certification — multipage version

> **New here?** Read **`WEBSITE-GUIDE.md`** — the complete plain-language guide to every file,
> component, and common change. This README is a shorter technical summary.

This is the refined multipage prototype. It has a task-led homepage, a compact mobile introduction, readable page layouts, a searchable resource library with sample outline previews, and a stationary notices archive. The original version is maintained separately in the sibling `singlepage/` folder.

## Open and compare

- Original scrolling version: `../singlepage/index.html`
- New multipage version: `index.html` in this folder

Double-click this folder's `index.html` to open the new version. No build step, server, package installation, or internet connection is needed.

You can also serve this folder with:

```powershell
python -m http.server 8080 --bind 127.0.0.1 --directory multipage
```

Run the command from the workspace root and visit http://127.0.0.1:8080.

## Page structure

| Navigation | File | Content |
|---|---|---|
| Home | `index.html` | Hero slideshow, three pillars, society introduction, upcoming events with an illustrative countdown line, moving notices |
| About us | `pages/about.html` | Society overview, areas of focus, CE Message, office bearers (`#office-bearers`) |
| Technical Domain | `pages/e-certification-kit.html` | Core airworthiness topics and the proposed "Airworthiness in India" section |
| Events | `pages/events.html` | Sample programme cards and accessible programme previews |
| Knowledge Centre | `pages/knowledge-centre.html` | Search, category counts, clear/reset controls, eight sample repository outlines, contribution enquiries |
| Membership | `pages/membership.html` | Proposed categories, benefits, sample fee table with a JavaScript category-highlight filter, and membership enquiry preview (`#join`) |
| Publications | `pages/publications.html` | Proposed newsletter, annual report, proceedings, journal placeholder, and notices archive |
| Contact Us | `pages/contact.html` | Contact placeholders and enquiry/feedback form preview |
| Notices (via NEWSFLASH, notice board, or footer) | `pages/notices.html` | All seven sample notices in a stationary list |
| Dignitaries (retired) | `pages/dignitaries.html` | Redirect stub to `pages/about.html#office-bearers`; kept only for old links and bookmarks |

The menu is a flat eight-item structure — Home, About us, Technical Domain, Events, Knowledge Centre, Membership, Publications, Contact Us — plus a gold "Join SAC" call to action. There are no dropdowns or submenus at any width; below 1024px the same links appear in the hamburger menu. Shared navigation and footer are present in each HTML document, so navigation works even when JavaScript is disabled. The current page is identified with `aria-current="page"`.

## Shared assets and maintenance

- `pages/`: dedicated inner HTML pages.
- `assets/css/styles.css`: a copy of the original design styles.
- `assets/css/pages.css`: multipage layout styles and responsive adjustments.
- `assets/css/refinement.css`: the multipage design system, homepage layout, readable typography, compact event cards, and larger controls. Make design refinements here instead of changing the baseline single-page styles.
- `assets/css/library.css` and `assets/js/library.js`: Knowledge Centre repository presentation, clear/reset helpers, shareable search/category URLs, and keyboard-accessible sample outline dialogs. Loaded only on the Knowledge Centre page.
- `assets/css/notices.css`: the stationary notices page layout. This page does not load the notice carousel assets.
- `assets/css/header.css`: the shared navy-and-gold header, logo frame, desktop contact link, navigation states, and mobile menu styling; loaded last on all pages.
- `assets/css/experience.css` and `assets/js/experience.js`: optional entrance animations and scroll reveals (including the homepage pillars, topic cards, and the Technical Domain timeline), the membership fee category highlight, the homepage illustrative event countdown, the publications cover tilt and enlarge preview, refined cards and form focus, reading progress, and back-to-top navigation. They load locally without additional packages.
- `assets/js/main.js`: guarded page-specific enhancements for the menu, resource library, events, and contact form. Nothing depends on the original version's script.
- `assets/images/`: separate copies of the supplied logo and sample aviation photograph. This folder can be copied or hosted on its own.
- `preview/`: screenshots and the browser-check report.
- `tools/check_multipage.py`: development-only browser verification. This tool is not needed to view or host the website.

All top-level menu items use real HTML file links. No frontend framework, client-side router, JavaScript-generated header, or server-side include is required. When updating shared navigation or footer markup, apply the change to all nine standard pages (the 404 page and the dignitaries redirect stub are standalone). The eight agreed main menu labels are flat with no submenus; Notices is a supporting page, and the Join SAC call to action links to `pages/membership.html#join`.

Repository resources are present in the Knowledge Centre's HTML and remain readable without JavaScript. Search, category filtering, outline previews, the mobile hamburger, and event dialogs use JavaScript. Without JavaScript, navigation links remain visible and preview/submit buttons remain disabled. Filter links can use `pages/knowledge-centre.html?category=papers`, `?category=standards`, `?category=cases`, or `?category=lectures`; the search query uses `q`.

The homepage uses the existing illustrative photograph on desktop. On narrow screens, the compact text introduction and its guidance/contact actions take priority. Approved inspection, testing, engineering, or society photographs can replace `assets/images/aviation-hero.jpg` when supplied; no new photograph is presented as an official society image.

The visual refinements include a gentle hero entrance, content appearing as it enters the viewport (homepage pillars, topic and publication cards, fee table, and the Technical Domain timeline items in sequence), small card/button hover effects, and brief menu/dialog entrances. The Knowledge Centre rolls its result count and re-enters surviving cards when filters change. The homepage Upcoming Events block shows a clearly-labelled illustrative countdown ticking live (days, hours, minutes, seconds) against a sample date; the membership fee table offers a category highlight filter. All interactive additions are progressive enhancements: the full content stays available with JavaScript disabled. New decorative animations are skipped for reduced-motion preferences, and content is never hidden while waiting for JavaScript. A slim reading-progress indicator and a keyboard-accessible back-to-top control help with longer pages; the control hides while editing form fields.

The NEWSFLASH on every page stays on one line and scrolls from right to left when the message exceeds the available width on viewports wider than 640px. On narrow screens it wraps over at most two lines instead of scrolling, so no words are cut at the container edge. Short messages remain still. Hover or keyboard focus pauses the text temporarily; there is no play/pause button. The behaviour lives in the `assets/css/theme.css` and `assets/js/site.js` bundles, including viewport and content changes.

The homepage Notice board stays static with up to three notices. With more than three, equal-height rows move upward continuously through a three-notice window, repeating indefinitely while the heading stays fixed. Original notice links rotate to the bottom to keep the loop seamless. Hover or keyboard focus pauses the list temporarily; it resumes on leave or blur. Clicking or manually scrolling does not leave rotation stopped, and there is no play/pause button. The independent `assets/css/noticeboard.css` and `assets/js/noticeboard.js` files handle this behaviour. Add further notices as direct `<a>` children of `.notice-list`; no configuration change or duplicate markup is needed.

The homepage includes seven labelled sample notices, and every page has an extended NEWSFLASH message, to demonstrate both animations. Reduced-motion preferences use a slower pace while preserving the one-line newsflash and three-notice window. All sample announcements remain subject to content approval.

NEWSFLASH links, the notice-board footer, and footer navigation open `pages/notices.html`. All seven notices can be read there without automatic notice movement. When publishing real notices, update both the homepage list and this archive so their text and destination links agree.

## Visual review and verification

Open `preview/tickers-multipage-desktop.png` and `preview/tickers-multipage-mobile.png` for the latest homepage, including the button-free NEWSFLASH. The matching `tickers-multipage-notices-*.png` files show the rotating notice board. Additional `refinement-*` screenshots cover the resource library, event cards, and notices archive.

The independent development runner is `python multipage/tools/check_refinement.py` from the workspace root. It requires Python, `websocket-client`, and Chrome, and writes only into this folder's `preview/`. The website itself requires none of these development tools.

The design review passes 94 multipage checks (`python multipage/tools/check_multipage.py`), 54 ticker checks (`check_tickers.py`), and 48 refinement checks (`check_refinement.py`) across nine pages at 320, 390, 768, 801, and 1440px widths, plus eight final checks for immediate action visibility, direct-file opening, no-JavaScript fallbacks, and reduced decorative motion. Reports are `preview/refinement-checks.json` and `preview/refinement-postchange-checks.json`; the final check can be repeated with `--postchange`. Hosted Core Web Vitals and production backend services have not been measured or implemented.

The later button-free ticker behaviour is checked with `python multipage/tools/check_tickers.py` from the workspace root. This focused comparison checks both independent versions and writes `preview/tickers-checks.json` plus current screenshots. It verifies right-to-left single-line news, upward three-row notices, repeated loops, and automatic resumption after hover, focus, or manual interaction.

## Prototype limitations

Approved society text, contact information, photographs, office-bearer details (`pages/about.html#office-bearers`), notices, and programme information are still to be supplied. All sample material is labelled. CE Message follows the handwritten note; confirm the expanded designation with the approved message.

The contact form validates fields and displays a demonstration confirmation. It does not send or store information. The Knowledge Centre contains no approved documents, member authentication, or restricted files, and the membership fee table is illustrative pending approval. Resource outlines are illustrative and marked “Publication pending”; publication dates, version numbers, and download links must be added only with approved documents. Publishing approved resources, collecting feedback, and member-only access remain future development work.

The original photograph came from [Unsplash](https://images.unsplash.com/photo-1436491865332-7a61a109cc05); replace it with approved imagery before launch. The structural reference is https://www.aesibangalore.com/; reference-site text and brand assets are not copied.
