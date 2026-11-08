/* ============================================================
   FERNODE — site behaviour
   Vanilla JavaScript (ES6+)
   ============================================================ */

'use strict';

/* ---------- Release data ---------- */
/* Newest first. `zip` and `exe` are absolute URLs or paths relative to this page.
   Set them to null for versions that are not uploaded yet. */
const RELEASES = [
  {
    version: '1.3.0',
    date: '2026-11-08',
    latest: true,
    zip: 'https://github.com/FerKunG/server-tool/releases/download/v1.3.0/Server-Tool-1.3.0-win-x64.zip',
    exe: 'https://github.com/FerKunG/server-tool/releases/download/v1.3.0/Server.Tool.Setup.1.3.0.exe',
    format: 'ZIP · portable',
    size: '149 MB',
    sha256: 'C14927C535DED1340C9B6394A1F41D41DDDD83073D9312ABA5A1D99CF68BDDEC',
    note: 'Portable build. Extract the folder, then run the app.',
    noteHtml: 'Portable build. Extract the folder, then run the app.'
  },
  {
    version: '1.2.1',
    date: '2026-10-30',
    latest: false,
    zip: 'https://github.com/FerKunG/server-tool/releases/download/v1.2.1/Server-Tool-1.2.1-win-x64.zip',
    exe: 'https://github.com/FerKunG/server-tool/releases/download/v1.2.1/Server.Tool.Setup.1.2.1.exe',
    format: 'ZIP · portable',
    size: '157 MB',
    sha256: '72CEF577C9A8B3747F57BA0C78CC67BA0CD840C1E8033045243786242625C580',
    note: 'Portable build. Extract the folder, then run the app.',
    noteHtml: 'Portable build. Extract the folder, then run the app.'
  },
  {
    version: '1.2.0',
    date: '2026-09-18',
    latest: false,
    zip: null,
    exe: null,
    format: 'ZIP · archived',
    size: null,
    sha256: null,
    note: 'This build is archived and its installer has not been uploaded yet. Choose v1.3.0 from the version menu.',
    noteHtml: 'This build is archived and its installer has not been uploaded yet. Choose v1.3.0 from the version menu.'
  },
  {
    version: '1.1.0',
    date: '2026-08-02',
    latest: false,
    zip: null,
    exe: null,
    format: 'ZIP · archived',
    size: null,
    sha256: null,
    note: 'This build is archived and its installer has not been uploaded yet. Choose v1.3.0 from the version menu.',
    noteHtml: 'This build is archived and its installer has not been uploaded yet. Choose v1.3.0 from the version menu.'
  },
  {
    version: '1.0.0',
    date: '2026-07-11',
    latest: false,
    zip: null,
    exe: null,
    format: 'ZIP · archived',
    size: null,
    sha256: null,
    note: 'The first public release is archived and no longer distributed. Choose v1.2.1 from the version menu.',
    noteHtml: 'The first public release is archived and no longer distributed. Choose v1.2.1 from the version menu.'
  }
];

const latestRelease = RELEASES.find((release) => release.latest) || RELEASES[0];

/* ---------- Helpers ---------- */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const getRelease = (version) => RELEASES.find((release) => release.version === version) || latestRelease;
const isAvailable = (release) => Boolean(release && (release.zip || release.exe));
const fileName = (path) => path.split('/').pop();

let toastTimer = null;

function toast(message) {
  const element = $('#toast');
  if (!element) return;

  element.textContent = message;
  element.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => element.classList.remove('is-visible'), 2600);
}

/* ---------- Version picker ---------- */
let currentVersion = latestRelease.version;

function renderVersionOptions() {
  const select = $('#version-select');
  if (!select) return;

  select.innerHTML = RELEASES.map((release) => {
    const state = release.latest
      ? ' (latest)'
      : isAvailable(release) ? '' : ' (archived)';
    return `<option value="${release.version}">v${release.version}${state}</option>`;
  }).join('');
}

function setDownloadLink(link, path, availableLabel, unavailableLabel) {
  if (!link) return;

  const text = $('span', link);

  if (path) {
    link.setAttribute('href', path);
    link.setAttribute('download', fileName(path));
    link.classList.remove('is-disabled');
    link.removeAttribute('aria-disabled');
    if (text) text.textContent = availableLabel;
  } else {
    link.removeAttribute('href');
    link.removeAttribute('download');
    link.classList.add('is-disabled');
    link.setAttribute('aria-disabled', 'true');
    if (text) text.textContent = unavailableLabel;
  }
}

function applyVersion(version, options = {}) {
  const release = getRelease(version);
  currentVersion = release.version;

  const select = $('#version-select');
  if (select && select.value !== release.version) select.value = release.version;

  const metaVersion = $('#meta-version');
  const metaSize = $('#meta-size');
  const metaFormat = $('#meta-format');
  const hashValue = $('#hash-value');
  const note = $('#download-note');
  const copyButton = $('#copy-hash');

  if (metaVersion) metaVersion.textContent = 'v' + release.version;
  if (metaSize) metaSize.textContent = release.size || 'Not uploaded';
  if (metaFormat) metaFormat.textContent = release.format;

  if (hashValue) {
    hashValue.textContent = release.sha256 || 'No checksum on file';
    hashValue.title = release.sha256 || '';
  }

  if (copyButton) {
    copyButton.disabled = !release.sha256;
    copyButton.setAttribute('aria-disabled', String(!release.sha256));
  }

  setDownloadLink($('#download-zip'), release.zip, 'Download tool', 'Not uploaded');
  setDownloadLink($('#download-exe'), release.exe, 'Installer (.exe)', 'Installer not uploaded');

  if (note) {
    // Static strings from RELEASES only — safe to use for the inline detail.
    note.innerHTML = release.noteHtml || release.note;
    note.classList.toggle('is-warn', !isAvailable(release));
  }

  try {
    localStorage.setItem('fernode-version', release.version);
  } catch (error) { /* private mode — ignore */ }

  if (options.updateUrl !== false) {
    try {
      const params = new URLSearchParams(window.location.search);
      params.set('v', release.version);
      history.replaceState(null, '', window.location.pathname + '?' + params.toString() + window.location.hash);
    } catch (error) {
      /* file:// in some browsers blocks replaceState — ignore */
    }
  }
}

function initialVersion() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get('v');
  if (fromUrl && RELEASES.some((release) => release.version === fromUrl)) return fromUrl;

  try {
    // Only restore versions that still have a downloadable file.
    const saved = localStorage.getItem('fernode-version');
    if (saved && RELEASES.some((release) => release.version === saved && isAvailable(release))) return saved;
  } catch (error) { /* ignore */ }

  return latestRelease.version;
}

function wireVersionPicker() {
  const select = $('#version-select');
  if (select) {
    select.addEventListener('change', (event) => applyVersion(event.target.value));
  }

  const zip = $('#download-zip');
  const installer = $('#download-exe');

  [zip, installer].forEach((link) => {
    if (!link) return;
    link.addEventListener('click', (event) => {
      if (link.classList.contains('is-disabled')) {
        event.preventDefault();
        toast(`v${currentVersion} is not uploaded yet`);
        return;
      }
      if (link.id === 'download-zip') {
        toast(`Starting download · FerNode v${currentVersion}`);
        link.classList.add('is-downloading');
        window.setTimeout(() => link.classList.remove('is-downloading'), 1700);
      }
    });
  });

  const copyButton = $('#copy-hash');
  if (copyButton) {
    copyButton.addEventListener('click', () => {
      const release = getRelease(currentVersion);
      if (release.sha256) copyText(release.sha256, 'SHA-256 checksum');
      else toast('No checksum on file for this version');
    });
  }
}

/* ---------- Clipboard ---------- */
async function copyText(text, label) {
  try {
    await navigator.clipboard.writeText(text);
    toast(label + ' copied');
  } catch (error) {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-1000px';
    document.body.appendChild(area);
    area.select();

    try {
      document.execCommand('copy');
      toast(label + ' copied');
    } catch (fallbackError) {
      toast('Could not copy — select the checksum manually');
    }

    area.remove();
  }
}

/* ---------- Plugin library ---------- */
let activeCategory = 'all';

function updatePluginCards() {
  const grid = $('#plugin-grid');
  const empty = $('#plugin-empty');
  const count = $('#plugin-count');
  const search = $('#plugin-search');
  const versionSelect = $('#mc-version');
  if (!grid || !empty || !count || !search || !versionSelect) return;

  const query = search.value.trim().toLowerCase();
  const version = versionSelect.value;
  const cards = $$('.plugin-card', grid);
  let shown = 0;

  cards.forEach((card) => {
    const categories = (card.dataset.category || '').toLowerCase().split(/\s+/);
    const versions = (card.dataset.versions || '').split(/\s+/);
    const haystack = (card.dataset.search || '').toLowerCase();

    const matchesCategory = activeCategory === 'all' || categories.includes(activeCategory.toLowerCase());
    const matchesVersion = versions.includes(version);
    const matchesQuery = !query || haystack.includes(query);
    const visible = matchesCategory && matchesVersion && matchesQuery;

    card.hidden = !visible;
    if (visible) {
      shown += 1;
    } else {
      const video = $('.plugin-video', card);
      if (video && !video.paused) video.pause();
    }
  });

  count.textContent = `Showing ${shown} of ${cards.length} plugins`;
  empty.hidden = shown !== 0;
}

function setCategory(category) {
  activeCategory = category;
  $$('.chip[data-category]').forEach((chip) => {
    const active = chip.dataset.category === category;
    chip.classList.toggle('is-active', active);
    chip.setAttribute('aria-pressed', String(active));
  });
  updatePluginCards();
}

function resetPluginFilters() {
  const search = $('#plugin-search');
  const version = $('#mc-version');
  if (search) search.value = '';
  if (version) version.value = '1.21.x';
  setCategory('all');
}

function wirePluginLibrary() {
  const search = $('#plugin-search');
  const version = $('#mc-version');
  const reset = $('#reset-filters');

  search?.addEventListener('input', updatePluginCards);
  version?.addEventListener('change', updatePluginCards);

  $$('.chip[data-category]').forEach((chip) => {
    chip.addEventListener('click', () => setCategory(chip.dataset.category || 'all'));
  });

  reset?.addEventListener('click', resetPluginFilters);

  $$('.plugin-download').forEach((link) => {
    link.addEventListener('click', () => {
      const card = link.closest('.plugin-card');
      const name = $('h3', card)?.textContent || 'plugin';
      const label = $('.download-label', link);

      if (label) {
        const original = label.textContent;
        label.textContent = 'Starting…';
        link.classList.add('is-downloading');
        window.setTimeout(() => {
          label.textContent = original;
          link.classList.remove('is-downloading');
        }, 1600);
      }

      toast(`Downloading ${name}`);
    });
  });

  $('.bundle-link')?.addEventListener('click', () => toast('Downloading all 3 FerNode plugins'));
  $('.bundle-download')?.addEventListener('click', () => toast('Downloading the FerNode plugin bundle'));

  updatePluginCards();
}

/* ---------- Plugin demos ---------- */
function wirePluginVideos() {
  const videos = $$('.plugin-video');
  if (!videos.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canAutoplay = !reduceMotion && 'IntersectionObserver' in window;

  if (!canAutoplay) {
    // Leave the preview paused and let the visitor start it themselves.
    videos.forEach((video) => { video.controls = true; });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      const card = video.closest('.plugin-card');
      const visible = !card || !card.hidden;

      if (entry.isIntersecting && visible && !document.hidden) {
        const play = video.play();
        if (play && typeof play.catch === 'function') play.catch(() => {});
      } else {
        video.pause();
      }
    });
  }, {
    rootMargin: '120px 0px',
    threshold: 0.3
  });

  videos.forEach((video) => {
    video.muted = true;
    video.loop = true;
    observer.observe(video);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) videos.forEach((video) => video.pause());
  });
}

/* ---------- Mobile menu ---------- */
function wireMenu() {
  const toggle = $('#menu-toggle');
  const nav = $('#mobile-nav');
  if (!toggle || !nav) return;

  const query = window.matchMedia('(max-width: 700px)');

  const setMenu = (open) => {
    nav.hidden = !open;
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  toggle.addEventListener('click', () => setMenu(nav.hidden));

  $$('a', nav).forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !nav.hidden) {
      setMenu(false);
      toggle.focus();
    }
  });

  const handleViewportChange = () => {
    if (!query.matches) setMenu(false);
  };

  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', handleViewportChange);
  } else if (typeof query.addListener === 'function') {
    query.addListener(handleViewportChange);
  }
}

/* ---------- FAQ ---------- */
function wireFaq() {
  const items = $$('.faq-item');
  if (!items.length) return;

  const setItem = (item, open) => {
    const button = $('button', item);
    item.classList.toggle('open', open);
    button?.setAttribute('aria-expanded', String(open));
  };

  items.forEach((item) => {
    const button = $('button', item);
    if (!button) return;

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach((other) => setItem(other, false));
      if (!isOpen) setItem(item, true);
    });
  });
}

/* ---------- Scroll reveal ---------- */
function wireReveal() {
  const elements = $$('.reveal');
  if (!elements.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -8% 0px'
  });

  elements.forEach((element) => observer.observe(element));
}

/* ---------- Misc ---------- */
function wireMisc() {
  // Deep links: re-align after fonts and dynamic content have settled.
  if (window.location.hash.length > 1) {
    let target = null;
    try {
      target = document.querySelector(window.location.hash);
    } catch (error) {
      target = null;
    }

    if (target) {
      const root = document.documentElement;
      const previous = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      target.scrollIntoView({ block: 'start' });
      root.style.scrollBehavior = previous;
    }
  }
}

/* ---------- Boot ---------- */
function init() {
  renderVersionOptions();
  wireVersionPicker();
  applyVersion(initialVersion());
  wirePluginLibrary();
  wirePluginVideos();
  wireMenu();
  wireFaq();
  wireReveal();
  wireMisc();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
