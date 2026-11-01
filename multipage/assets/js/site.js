/* Consolidated shared behaviour: bundle order matters (main -> newsflash -> noticeboard -> experience). */
/* === main.js === */
/* Shared progressive enhancements for the static multipage prototype. */
'use strict';

document.documentElement.classList.add('js');

function initNavigation() {
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#main-navigation');
  if (!menuButton || !navigation) return;

  function closeMenu(returnFocus = false) {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
    navigation.classList.remove('is-open');
    if (returnFocus) menuButton.focus();
  }

  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    navigation.classList.toggle('is-open', open);
  });

  // Navigation uses real HTML documents. Let the browser follow each link.
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  window.matchMedia('(max-width: 800px)').addEventListener('change', () => closeMenu());
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  window.addEventListener('pageshow', () => closeMenu());
}

function initHeroSlideshow() {
  const slideshow = document.querySelector('.hero-slideshow');
  if (!slideshow) return;
  const slides = [...slideshow.querySelectorAll('.hero-photo')];
  if (slides.length < 2) return;
  const frame = slideshow.closest('.hero-visual');
  const dotsContainer = frame ? frame.querySelector('.slideshow-dots') : null;
  const interval = 5000;
  let index = 0;

  function show(next) {
    const target = (next + slides.length) % slides.length;
    if (target === index) return;
    const current = slides[index];
    // Snap any still-exiting slide back to the right without animating,
    // so it can slide in again cleanly on its next turn.
    slides.forEach(slide => {
      if (slide !== current && slide.classList.contains('is-exiting')) {
        slide.classList.add('no-transition');
        slide.classList.remove('is-exiting');
        void slide.offsetWidth;
        slide.classList.remove('no-transition');
      }
    });
    current.classList.remove('is-active');
    current.classList.add('is-exiting');
    if (dotsContainer) dotsContainer.children[index].classList.remove('is-active');
    index = target;
    slides[index].classList.add('is-active');
    if (dotsContainer) dotsContainer.children[index].classList.add('is-active');
  }

  if (dotsContainer) {
    slides.forEach((slide, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Show image ${i + 1} of ${slides.length}`);
      if (i === index) dot.classList.add('is-active');
      dot.addEventListener('click', () => show(i));
      dotsContainer.appendChild(dot);
    });
  }

  // Autoplay always runs. Under prefers-reduced-motion the global reduced-motion
  // styles in styles.css disable the slide animations, so slides swap instantly
  // (no motion) instead of animating — the interval itself keeps working.
  let timer = null;

  function stopAutoplay() {
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function startAutoplay() {
    if (timer === null && !document.hidden) {
      timer = window.setInterval(() => show(index + 1), interval);
    }
  }

  document.addEventListener('visibilitychange', () => (document.hidden ? stopAutoplay() : startAutoplay()));
  startAutoplay();
}

function initResources() {
  const search = document.querySelector('#resource-search');
  const results = document.querySelector('#resource-results');
  const count = document.querySelector('#resource-count');
  const empty = document.querySelector('#resource-empty');
  if (!search || !results || !count || !empty) return;

  const cards = [...results.querySelectorAll('.resource-card')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const allowedCategories = new Set(filters.map(button => button.dataset.filter));
  const requestedCategory = new URLSearchParams(window.location.search).get('category');
  let category = allowedCategories.has(requestedCategory) ? requestedCategory : 'all';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let shownCount = null;

  function updateResults() {
    const query = search.value.trim().toLowerCase();
    let visibleCount = 0;
    const visible = [];
    for (const card of cards) {
      const matchesCategory = category === 'all' || card.dataset.category === category;
      const matchesSearch = card.textContent.toLowerCase().includes(query);
      card.hidden = !(matchesCategory && matchesSearch);
      if (!card.hidden) {
        visibleCount += 1;
        visible.push(card);
      }
    }
    empty.hidden = visibleCount !== 0;
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
    if (shownCount === null || reduceMotion.matches || typeof count.animate !== 'function') {
      // First fill (or reduced motion): set the final text with no transition.
      shownCount = visibleCount;
      count.textContent = `${visibleCount} sample resource${visibleCount === 1 ? '' : 's'} shown`;
      return;
    }
    const from = shownCount;
    shownCount = visibleCount;
    // Staggered re-entry of the surviving cards.
    visible.forEach((card, index) => {
      const animation = card.animate([
        { opacity: .35, transform: 'translateY(6px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 240, delay: Math.min(index * 30, 210), easing: 'ease-out', fill: 'backwards' });
      animation.onfinish = animation.oncancel = () => animation.cancel();
    });
    // Count rolls from the previous total to the new one.
    if (from === visibleCount) {
      count.textContent = `${visibleCount} sample resource${visibleCount === 1 ? '' : 's'} shown`;
      return;
    }
    const started = performance.now();
    const duration = 420;
    const label = `sample resource${visibleCount === 1 ? '' : 's'} shown`;
    const rollCount = now => {
      const progress = Math.min(1, (now - started) / duration);
      const value = Math.round(from + (visibleCount - from) * (1 - Math.pow(1 - progress, 3)));
      count.textContent = `${value} ${label}`;
      if (progress < 1) window.requestAnimationFrame(rollCount);
    };
    window.requestAnimationFrame(rollCount);
  }

  search.disabled = false;
  search.addEventListener('input', updateResults);
  filters.forEach(button => {
    button.disabled = false;
    button.addEventListener('click', () => {
      category = button.dataset.filter;
      updateResults();
    });
  });
  updateResults();
}

function initEventPreviews() {
  const dialog = document.querySelector('#event-dialog');
  if (!dialog) return;
  const programmes = {
    workshop: {
      title: 'Airworthiness & certification workshop',
      description: 'This sample programme represents a future technical workshop. The approved agenda, learning objectives, and participation details will be added here.'
    },
    session: {
      title: 'Perspectives on aviation safety',
      description: 'This sample programme represents a future knowledge session. The approved topic, speaker information, and joining details will be added here.'
    },
    dialogue: {
      title: 'Connecting the airworthiness community',
      description: 'This sample programme represents a future member dialogue. The approved discussion themes, format, and participation details will be added here.'
    }
  };
  let previousOverflow = '';
  let scrollLocked = false;

  function restoreScroll() {
    if (scrollLocked && !dialog.open) {
      document.body.style.overflow = previousOverflow;
      scrollLocked = false;
    }
  }
  function closeDialog() {
    dialog.close();
    restoreScroll();
  }

  document.querySelectorAll('[data-event]').forEach(button => {
    button.disabled = false;
    button.addEventListener('click', () => {
      const programme = programmes[button.dataset.event];
      if (!programme) return;
      dialog.querySelector('#event-title').textContent = programme.title;
      dialog.querySelector('#event-description').textContent = programme.description;
      previousOverflow = document.body.style.overflow;
      dialog.showModal();
      document.body.style.overflow = 'hidden';
      scrollLocked = true;
    });
  });
  dialog.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', closeDialog));
  dialog.addEventListener('close', restoreScroll);
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    closeDialog();
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDialog();
  });
}

function initFeedbackForm() {
  const form = document.querySelector('#feedback-form');
  if (!form) return;
  const status = document.querySelector('#form-status');
  const topic = form.querySelector('#topic');
  const requestedTopic = new URLSearchParams(window.location.search).get('topic');
  if ([...topic.options].some(option => option.value === requestedTopic)) topic.value = requestedTopic;

  form.addEventListener('submit', event => {
    event.preventDefault();
    status.hidden = false;
    status.textContent = 'Preview complete. Your message has not been sent or stored. The live enquiry and feedback service will be connected after the design and contact details are approved.';
    status.focus({ preventScroll: true });
    status.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
  form.querySelector('button[type="submit"]').disabled = false;
}

initNavigation();
initHeroSlideshow();
initResources();
initEventPreviews();
initFeedbackForm();
const copyrightYear = document.querySelector('#copyright-year');
if (copyrightYear) copyrightYear.textContent = String(new Date().getFullYear());

/* === newsflash.js === */
/* Animate only announcements that do not fit on one line. */
(() => {
  'use strict';

  const message = document.querySelector('#news-text');
  if (!message) return;
  const row = message.closest('.news-inner');
  if (!row) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Narrow screens wrap the announcement statically instead of scrolling,
  // so no words are cut at the container edge.
  const compact = window.matchMedia('(max-width: 640px)');

  let track;
  let original;
  let repeated;
  let scheduled = false;

  function measure() {
    scheduled = false;
    if (compact.matches) {
      message.classList.remove('is-scrolling');
      message.removeAttribute('tabindex');
      message.style.removeProperty('--newsflash-distance');
      message.style.removeProperty('--newsflash-duration');
      return;
    }
    const availableWidth = message.clientWidth;
    const textWidth = original.getBoundingClientRect().width;
    const shouldScroll = textWidth > availableWidth + 1;

    if (repeated.textContent !== original.textContent) repeated.textContent = original.textContent;
    message.classList.toggle('is-scrolling', shouldScroll);
    if (shouldScroll) {
      const trackGap = parseFloat(getComputedStyle(track).columnGap) || 48;
      const distance = textWidth + trackGap;
      message.style.setProperty('--newsflash-distance', `${distance}px`);
      const speed = reducedMotion.matches ? 28 : 42;
      message.style.setProperty('--newsflash-duration', `${Math.max(12, distance / speed)}s`);
      message.setAttribute('tabindex', '0');
    } else {
      message.removeAttribute('tabindex');
      message.style.removeProperty('--newsflash-distance');
      message.style.removeProperty('--newsflash-duration');
    }
  }

  function scheduleMeasure() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(measure);
  }

  const contentObserver = new MutationObserver(records => {
    if (!message.contains(track) || !track.contains(original)) {
      buildTrack();
    } else if (records.some(record => record.target === message || record.target === track)) {
      buildTrack();
    } else if (records.some(record => record.target === original || original.contains(record.target))) {
      scheduleMeasure();
    }
  });

  function buildTrack() {
    contentObserver.disconnect();
    // Preserve the editable, original content if text is appended after setup.
    if (track?.parentNode === message && original?.parentNode === track) {
      const contents = document.createDocumentFragment();
      while (original.firstChild) contents.append(original.firstChild);
      track.replaceWith(contents);
    }
    original = document.createElement('span');
    original.className = 'news-copy';
    while (message.firstChild) original.append(message.firstChild);
    repeated = document.createElement('span');
    repeated.className = 'news-repeat';
    repeated.setAttribute('aria-hidden', 'true');
    repeated.textContent = original.textContent;
    track = document.createElement('span');
    track.className = 'news-track';
    track.append(original, repeated);
    message.append(track);
    contentObserver.observe(message, { childList: true, subtree: true, characterData: true });
    scheduleMeasure();
  }

  reducedMotion.addEventListener('change', scheduleMeasure);
  compact.addEventListener('change', scheduleMeasure);
  window.addEventListener('resize', scheduleMeasure, { passive: true });
  if ('ResizeObserver' in window) {
    const sizeObserver = new ResizeObserver(scheduleMeasure);
    sizeObserver.observe(message);
    sizeObserver.observe(row);
  }
  if (document.fonts) document.fonts.ready.then(scheduleMeasure);
  buildTrack();
})();

/* === noticeboard.js === */
/* Continuous upward rotation of original, clickable notices in a three-row window. */
(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('.notice-board').forEach((board, boardIndex) => {
    const list = board.querySelector('.notice-list');
    const heading = board.querySelector('.notice-heading');
    if (!list || !heading) return;

    const marker = heading.querySelector('.notice-mark');
    if (marker) marker.hidden = false;
    if (!list.id) list.id = `${board.id || `notice-board-${boardIndex + 1}`}-list`;

    let notices = [];
    let observedNotices = new Set();
    let active = false;
    let hovered = false;
    let scheduled = false;
    let frame = null;
    let previousTime = null;
    let progress = 0;
    let lastWrittenTop = 0;
    let rowHeight = 0;
    const observerOptions = { childList: true, subtree: true, characterData: true };
    const contentObserver = new MutationObserver(scheduleMeasure);
    const sizeObserver = 'ResizeObserver' in window
      ? new ResizeObserver(scheduleMeasure)
      : null;

    function canMove() {
      return active && !hovered && !document.hidden
        && !list.contains(document.activeElement);
    }

    function stopMovement() {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      previousTime = null;
      progress = list.scrollTop;
      lastWrittenTop = progress;
    }

    function rotatePastFirst() {
      if (progress < rowHeight || !rowHeight) return;
      // Reuse real links; no hidden or unclickable duplicate notices are needed.
      contentObserver.disconnect();
      while (progress >= rowHeight) {
        const first = notices.shift();
        list.append(first);
        notices.push(first);
        progress -= rowHeight;
      }
      contentObserver.observe(list, observerOptions);
    }

    function step(time) {
      frame = null;
      if (!canMove()) return;
      if (scheduled) {
        previousTime = null;
        frame = window.requestAnimationFrame(step);
        return;
      }
      const elapsed = previousTime === null ? 0 : Math.min((time - previousTime) / 1000, .05);
      previousTime = time;
      // Native touch, wheel, keyboard and scrollbar changes remain usable.
      // Compare against the last rendered position, preserving subpixel progress
      // without reacting to scroll events generated by our own frame writes.
      if (Math.abs(list.scrollTop - lastWrittenTop) > .5) progress = list.scrollTop;
      const speed = reducedMotion.matches ? 8 : 18;
      progress += elapsed * speed;
      rotatePastFirst();
      list.scrollTop = progress;
      lastWrittenTop = list.scrollTop;
      frame = window.requestAnimationFrame(step);
    }

    function startMovement() {
      if (!canMove() || frame !== null) return;
      progress = list.scrollTop;
      lastWrittenTop = progress;
      previousTime = null;
      frame = window.requestAnimationFrame(step);
    }

    function measure() {
      scheduled = false;
      const relativePosition = rowHeight ? list.scrollTop / rowHeight : 0;
      stopMovement();
      notices = [...list.children].filter(child => child.matches('a'));
      active = notices.length > 3;
      list.classList.toggle('is-scrollable', active);
      board.classList.toggle('has-moving-notices', active);

      if (active) {
        // Equal rows keep exactly three notices in view at every screen width.
        list.style.setProperty('--notice-row-height', '0px');
        rowHeight = Math.ceil(Math.max(...notices.map(notice => notice.getBoundingClientRect().height)));
        list.style.setProperty('--notice-row-height', `${rowHeight}px`);
        list.style.setProperty('--notice-window-height', `${rowHeight * 3}px`);
        list.scrollTop = relativePosition * rowHeight;
        list.setAttribute('tabindex', '0');
        list.setAttribute('role', 'region');
        const title = board.getAttribute('aria-labelledby');
        if (title) list.setAttribute('aria-labelledby', title);
      } else {
        rowHeight = 0;
        list.style.removeProperty('--notice-row-height');
        list.style.removeProperty('--notice-window-height');
        list.removeAttribute('tabindex');
        list.removeAttribute('role');
        list.removeAttribute('aria-labelledby');
        list.scrollTop = 0;
      }

      if (sizeObserver) {
        const currentNotices = new Set(notices);
        observedNotices.forEach(notice => {
          if (!currentNotices.has(notice)) sizeObserver.unobserve(notice);
        });
        notices.forEach(notice => {
          if (!observedNotices.has(notice)) sizeObserver.observe(notice);
        });
        observedNotices = currentNotices;
      }
      startMovement();
    }

    function scheduleMeasure() {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(measure);
    }

    list.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      hovered = true;
      stopMovement();
    });
    list.addEventListener('pointerleave', () => {
      hovered = false;
      startMovement();
    });
    list.addEventListener('focusin', stopMovement);
    list.addEventListener('focusout', () => window.queueMicrotask(startMovement));
    document.addEventListener('visibilitychange', () => {
      stopMovement();
      startMovement();
    });
    reducedMotion.addEventListener('change', () => {
      stopMovement();
      startMovement();
    });
    window.addEventListener('resize', scheduleMeasure, { passive: true });
    contentObserver.observe(list, observerOptions);
    if (sizeObserver) sizeObserver.observe(list);
    if (document.fonts) document.fonts.ready.then(scheduleMeasure);
    scheduleMeasure();
  });
})();

/* === experience.js === */
/* Optional, dependency-free improvements. Never hide content while waiting for JS. */
(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const seen = new WeakSet();
  const running = new Set();
  let entranceObserver;

  function animateEntry(element, delay = 0) {
    if (seen.has(element)) return;
    seen.add(element);
    if (reducedMotion.matches || typeof element.animate !== 'function') return;
    const animation = element.animate([
      { opacity: 1, transform: 'translateY(10px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], {
      duration: 420,
      delay,
      easing: 'cubic-bezier(.16, 1, .3, 1)',
      fill: 'backwards'
    });
    running.add(animation);
    animation.onfinish = animation.oncancel = () => running.delete(animation);
  }

  function playIntroduction() {
    const text = document.querySelectorAll(
      '.hero-copy > .eyebrow, .hero-copy > h1, .hero-copy > .hero-description, '
      + '.page-intro .eyebrow, .page-intro h1, .page-intro .page-width > p:not(.eyebrow)'
    );
    text.forEach((element, index) => animateEntry(element, Math.min(index * 45, 135)));
    const photo = document.querySelector('.hero-photo');
    if (!photo || seen.has(photo) || reducedMotion.matches || typeof photo.animate !== 'function') return;
    seen.add(photo);
    const animation = photo.animate([
      { transform: 'scale(1.035)' },
      { transform: 'scale(1)' }
    ], { duration: 1600, easing: 'cubic-bezier(.16, 1, .3, 1)' });
    running.add(animation);
    animation.onfinish = animation.oncancel = () => running.delete(animation);
  }

  function observeContent() {
    entranceObserver?.disconnect();
    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      // Timelines not covered by the observer (no IntersectionObserver, reduced
      // motion) must still draw instantly: the CSS only hides items under
      // .experience-ready while the reveal class is missing.
      revealTimelines();
      return;
    }
    entranceObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target;
        if (element.matches('.india-timeline')) element.classList.add('is-revealed');
        const grid = element.parentElement;
        const stagger = grid?.matches('.people-grid, .event-grid, .pathways, .home-pillars-grid, '
          + '.membership-grid, .home-events-grid, .event-quick-list, .domain-topics, .pub-grid')
          ? ([...grid.children].indexOf(element) % 3) * 70
          : 0;
        animateEntry(element, stagger);
        entranceObserver.unobserve(element);
      }
    }, { threshold: .08, rootMargin: '0px 0px -25px 0px' });
    document.querySelectorAll(
      '.about-copy, .notice-board, .section-heading, .person-card, .event-card, '
      + '.message-inner, .kit-copy, .kit-features, .contact-grid > div, .feedback-form, '
      + '.focus-panel, .callout-inner, .resource-library, .kit-sidebar, .pathways > a, '
      + '.home-pillar, .event-quick-list li, .home-events-grid > img, .domain-topic, '
      + '.pub-grid > .home-pillar, .india-timeline, .table-scroll'
    ).forEach(element => {
      if (!seen.has(element)) entranceObserver.observe(element);
    });
  }

  function revealTimelines() {
    document.querySelectorAll('.india-timeline').forEach(timeline => timeline.classList.add('is-revealed'));
  }

  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  const progressFill = document.createElement('span');
  progress.append(progressFill);
  document.body.prepend(progress);

  const header = document.querySelector('.site-header');
  const backToTop = document.createElement('a');
  backToTop.className = 'back-to-top';
  backToTop.href = `#${header?.id || 'main'}`;
  backToTop.hidden = true;
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.setAttribute('title', 'Back to top');
  backToTop.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#arrow"/></svg>';
  document.body.append(backToTop);

  // On wide screens the brand strip scrolls away and the navigation bar stays pinned (see header.css).
  const navigationBar = header?.querySelector('.navigation-bar');
  const pinnedNavigation = window.matchMedia('(min-width: 801px) and (min-height: 560px)');
  let pinOffset = 0;
  function measureHeader() {
    if (!header || !navigationBar) return;
    pinOffset = navigationBar.getBoundingClientRect().top - header.getBoundingClientRect().top;
    header.style.setProperty('--stick-offset', `${Math.round(pinOffset * 100) / 100}px`);
  }

  let updateScheduled = false;
  function updateScrollControls() {
    updateScheduled = false;
    const maximum = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const ratio = maximum > 0 ? Math.max(0, Math.min(1, window.scrollY / maximum)) : 0;
    progressFill.style.transform = `scaleX(${ratio})`;
    const editingField = document.activeElement?.matches('input, textarea, select, [contenteditable="true"]');
    const visible = window.scrollY > 420 && !editingField;
    // Do not strand keyboard focus if the control becomes hidden while scrolling.
    if (!visible && document.activeElement === backToTop) header?.querySelector('.brand')?.focus({ preventScroll: true });
    backToTop.hidden = !visible;
    header?.classList.toggle('is-stuck', pinnedNavigation.matches && window.scrollY > pinOffset);
  }
  function scheduleScrollUpdate() {
    if (updateScheduled) return;
    updateScheduled = true;
    window.requestAnimationFrame(updateScrollControls);
  }

  backToTop.addEventListener('click', event => {
    event.preventDefault();
    header?.querySelector('.brand')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    scheduleScrollUpdate();
  });
  window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
  window.addEventListener('resize', scheduleScrollUpdate, { passive: true });
  window.addEventListener('resize', measureHeader, { passive: true });
  if ('ResizeObserver' in window && header) new ResizeObserver(measureHeader).observe(header);
  document.fonts?.ready.then(measureHeader);
  // A link to the header cannot scroll once the pinned header already sits at the top of the window.
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (event.defaultPrevented || !link || !header?.id || link.hash !== `#${header.id}` || !pinnedNavigation.matches) return;
    event.preventDefault();
    header.querySelector('.brand')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    scheduleScrollUpdate();
  });
  document.addEventListener('focusin', event => {
    for (const animation of [...running]) {
      if (animation.effect?.target?.contains(event.target)) animation.finish();
    }
    scheduleScrollUpdate();
  });
  document.addEventListener('focusout', scheduleScrollUpdate);
  if ('ResizeObserver' in window) {
    new ResizeObserver(scheduleScrollUpdate).observe(document.body);
  }
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      entranceObserver?.disconnect();
      revealTimelines();
      for (const animation of [...running]) animation.cancel();
    } else {
      playIntroduction();
      observeContent();
    }
  });

  // Membership fee category highlight: buttons arrive hidden; JS reveals them and
  // dims/highlights fee rows. Without JavaScript the full table simply shows.
  const feeFilter = document.querySelector('.fee-filter');
  const feeRows = [...document.querySelectorAll('.fee-table tbody tr[data-fee]')];
  if (feeFilter && feeRows.length) {
    feeFilter.hidden = false;
    const feeButtons = [...feeFilter.querySelectorAll('button[data-fee]')];
    feeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const value = button.dataset.fee;
        feeButtons.forEach(other => {
          other.classList.toggle('is-active', other === button);
          other.setAttribute('aria-pressed', String(other === button));
        });
        feeRows.forEach(row => {
          const match = value === 'all' || row.dataset.fee === value;
          row.classList.toggle('is-dimmed', !match);
          row.classList.toggle('is-highlighted', match && value !== 'all');
        });
      });
    });
  }

  // Homepage illustrative countdown: static HTML shows a truthful "dates to be
  // announced" line; JS swaps in a live ticking countdown against a clearly-labelled
  // sample date. Ticking text is informational content, not motion, so it runs the
  // same under reduced-motion preferences.
  const countdown = document.querySelector('#event-countdown');
  if (countdown) {
    const sampleTime = new Date('2027-01-15T09:00:00+05:30').getTime();
    const countdownLabel = 'Illustrative countdown — sample workshop begins in ';
    const countdownSuffix = ' (sample date, awaiting approval)';
    const two = value => String(value).padStart(2, '0');
    function updateCountdown() {
      const remaining = sampleTime - Date.now();
      if (remaining <= 0) {
        countdown.textContent = 'Illustrative sample workshop date has passed — real dates await approval';
        window.clearInterval(countdownTimer);
        return;
      }
      const days = Math.floor(remaining / 86400000);
      const hours = Math.floor(remaining / 3600000) % 24;
      const minutes = Math.floor(remaining / 60000) % 60;
      const seconds = Math.floor(remaining / 1000) % 60;
      countdown.textContent = countdownLabel + days + 'd ' + two(hours) + 'h '
        + two(minutes) + 'm ' + two(seconds) + 's' + countdownSuffix;
    }
    updateCountdown();
    const countdownTimer = window.setInterval(updateCountdown, 1000);
  }

  document.documentElement.classList.add('experience-ready');
  measureHeader();
  updateScrollControls();
  if (!reducedMotion.matches) playIntroduction();
  observeContent();
})();
