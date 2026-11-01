/* Detail outlines and search helpers for the E-Kit. All content is illustrative. */
(() => {
  'use strict';
  const search = document.querySelector('#resource-search');
  const clearButton = document.querySelector('#clear-resource-search');
  const resetButton = document.querySelector('#reset-resource-filters');
  const filters = [...document.querySelectorAll('[data-filter]')];
  const dialog = document.querySelector('#resource-detail');
  if (!search || !clearButton || !resetButton || !dialog) return;

  function updateSearchControls() {
    clearButton.hidden = !search.value;
    clearButton.disabled = !search.value;
    const category = filters.find(button => button.getAttribute('aria-pressed') === 'true')?.dataset.filter || 'all';
    resetButton.disabled = !search.value && category === 'all';
    try {
      const url = new URL(window.location.href);
      if (category === 'all') url.searchParams.delete('category');
      else url.searchParams.set('category', category);
      const query = search.value.trim();
      if (query) url.searchParams.set('q', query);
      else url.searchParams.delete('q');
      if (url.href !== window.location.href) window.history.replaceState(null, '', url.href);
    } catch {
      // Some direct-file viewers disallow URL changes; filtering still works.
    }
  }

  const initialQuery = new URLSearchParams(window.location.search).get('q');
  if (initialQuery) {
    search.value = initialQuery.slice(0, 120);
    search.dispatchEvent(new Event('input', { bubbles: true }));
  }
  clearButton.addEventListener('click', () => {
    search.value = '';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    search.focus({ preventScroll: true });
  });
  resetButton.addEventListener('click', () => {
    search.value = '';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    filters.find(button => button.dataset.filter === 'all')?.click();
    search.focus({ preventScroll: true });
  });
  // main.js owns matching and counts; its listeners run before these helpers.
  search.addEventListener('input', updateSearchControls);
  filters.forEach(button => button.addEventListener('click', updateSearchControls));
  updateSearchControls();

  const outlines = {
    'papers-articles': {
      heading: 'Proposed technical papers collection',
      description: 'A reserved outline for society and member papers on airworthiness and certification topics.',
      topics: ['Papers organised by subject and programme', 'Author and review information once approved', 'Routes to ask questions about a paper'],
      topic: 'certification'
    },
    'rnd-updates': {
      heading: 'Proposed research & development digest',
      description: 'A planned digest of research and development activity relevant to certification practice.',
      topics: ['Summaries of relevant R&D activity', 'Links to fuller papers where published', 'Contact points for follow-up questions'],
      topic: 'certification'
    },
    'standards-guidelines': {
      heading: 'Proposed standards & guidelines collection',
      description: 'A reserved outline for reviewed military and civil airworthiness standards and guidelines.',
      topics: ['Standards organised by domain and authority', 'Context for each referenced document', 'Relevant society contacts for questions'],
      topic: 'certification'
    },
    'reference-material': {
      heading: 'Proposed reference material library',
      description: 'A planned set of reference links and context for published airworthiness material.',
      topics: ['Reference links organised by topic', 'Notes on the intended use of each resource', 'Routes to suggest additional references'],
      topic: 'feedback'
    },
    'case-studies': {
      heading: 'Proposed case studies & lessons learnt',
      description: 'A planned series of reviewed case studies and lessons from airworthiness practice.',
      topics: ['Case studies grouped by programme or theme', 'Lessons prepared and reviewed before publication', 'Routes to propose a case study'],
      topic: 'members'
    },
    'experience-notes': {
      heading: 'Proposed certification experience notes',
      description: 'A reserved space for member-contributed experience notes on certification programmes.',
      topics: ['Contribution guidance and review process', 'Notes organised by certification phase', 'Contact routes for contributors'],
      topic: 'members'
    },
    'expert-lectures': {
      heading: 'Proposed expert lectures library',
      description: 'A planned library of expert lectures given at society events, with slides and summaries.',
      topics: ['Lectures listed by event and speaker', 'Slides and summaries where approved', 'Routes to propose a future lecture'],
      topic: 'members'
    },
    'webinars': {
      heading: 'Proposed webinar recordings & slides',
      description: 'A reserved place for recorded webinars, slides, and reading lists.',
      topics: ['Recordings listed by programme date', 'Slides and reading lists where approved', 'Routes to suggest webinar topics'],
      topic: 'feedback'
    }
  };
  let opener = null;
  let previousOverflow = '';
  const title = dialog.querySelector('#resource-detail-title');
  const body = dialog.querySelector('#resource-detail-body');
  const contact = dialog.querySelector('#resource-detail-contact');
  const closeButton = dialog.querySelector('.resource-detail-close');

  document.querySelectorAll('[data-resource-preview]').forEach(button => {
    const outline = outlines[button.dataset.resourcePreview];
    if (!outline || typeof dialog.showModal !== 'function') return;
    button.disabled = false;
    button.addEventListener('click', () => {
      const card = button.closest('.resource-card');
      title.textContent = card.querySelector('h3').textContent;
      const heading = document.createElement('h3');
      heading.textContent = outline.heading;
      const description = document.createElement('p');
      description.textContent = outline.description;
      const list = document.createElement('ul');
      for (const topic of outline.topics) {
        const item = document.createElement('li');
        item.textContent = topic;
        list.append(item);
      }
      body.replaceChildren(heading, description, list);
      contact.href = `contact.html?topic=${encodeURIComponent(outline.topic)}`;
      opener = button;
      previousOverflow = document.body.style.overflow;
      dialog.showModal();
      document.body.style.overflow = 'hidden';
      closeButton.focus({ preventScroll: true });
    });
  });
  dialog.querySelectorAll('[data-close-resource]').forEach(button => {
    button.addEventListener('click', () => dialog.close());
  });
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    dialog.close();
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right
        || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    if (opener?.isConnected && !opener.closest('[hidden]')) opener.focus({ preventScroll: true });
  });
})();
