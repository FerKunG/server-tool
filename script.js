/* ============================================================
   FERNODE — FerKunGsXD
   Vanilla JavaScript (ES6+)
   ------------------------------------------------------------
   Replace the values below when you publish a new build or
   move the files to another host.
   ============================================================ */

'use strict';

/* ---------- Release data ---------- */
/* Newest first. `zip` and `exe` are relative to this page (or absolute URLs).
   Set them to null for versions that are not uploaded yet. */
const RELEASES = [
  {
    version: '1.2.1',
    date: '2026-10-30',
    latest: true,
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
    note: 'This build is archived and its installer has not been uploaded yet. Choose v1.2.1 from the version menu.'
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
    note: 'This build is archived and its installer has not been uploaded yet. Choose v1.2.1 from the version menu.'
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
    note: 'The first public release is archived and no longer distributed. Choose v1.2.1 from the version menu.'
  }
];

const latestRelease = RELEASES.find((r) => r.latest) || RELEASES[0];

/* ---------- Tiny helpers ---------- */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const getRelease = (version) => RELEASES.find((r) => r.version === version) || latestRelease;
const isAvailable = (release) => Boolean(release && (release.zip || release.exe));
const fileName = (path) => path.split('/').pop();

let toastTimer = null;
function toast(message) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove('is-visible'), 2600);
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

function setDownloadButton(button, path, label) {
  if (!button) return;
  const text = $('span', button);

  if (path) {
    button.href = encodeURI(path);
    button.setAttribute('download', fileName(path));
    button.classList.remove('is-disabled');
    button.removeAttribute('aria-disabled');
    if (text) text.textContent = label;
  } else {
    button.removeAttribute('href');
    button.removeAttribute('download');
    button.classList.add('is-disabled');
    button.setAttribute('aria-disabled', 'true');
    if (text) text.textContent = 'Unavailable';
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

  setDownloadButton($('#download-zip'), release.zip, 'Download ZIP');
  setDownloadButton($('#download-exe'), release.exe, 'Installer (.exe)');

  if (note) {
    // Static strings from RELEASES only — safe to use for the inline <code> detail.
    note.innerHTML = release.noteHtml || release.note;
    note.classList.toggle('is-warn', !isAvailable(release));
  }

  try {
    localStorage.setItem('server-tool-version', release.version);
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
  if (fromUrl && RELEASES.some((r) => r.version === fromUrl)) return fromUrl;

  try {
    // Only restore versions that still have a downloadable file. A shared
    // ?v= link can still point at an archived build for reference.
    const saved = localStorage.getItem('server-tool-version');
    if (saved && RELEASES.some((r) => r.version === saved && isAvailable(r))) return saved;
  } catch (error) { /* ignore */ }

  return latestRelease.version;
}

function wireVersionPicker() {
  const select = $('#version-select');
  if (select) {
    select.addEventListener('change', (event) => applyVersion(event.target.value));
  }

  const zip = $('#download-zip');
  const exe = $('#download-exe');

  [zip, exe].forEach((button) => {
    if (!button) return;
    button.addEventListener('click', (event) => {
      if (button.classList.contains('is-disabled')) {
        event.preventDefault();
        toast(`v${currentVersion} is not uploaded yet`);
        return;
      }
      toast(`Starting download · FERNODE v${currentVersion}`);
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

/* ---------- Mobile navigation ---------- */
function wireNavigation() {
  const toggle = $('#nav-toggle');
  const menu = $('#nav-menu');
  const header = $('#site-header');
  if (!toggle || !menu) return;

  const isOpen = () => header.classList.contains('menu-open');

  const setIcon = (open) => {
    toggle.innerHTML = `<i data-lucide="${open ? 'x' : 'menu'}" aria-hidden="true"></i>`;
    if (window.lucide) window.lucide.createIcons();
  };

  const setOpen = (open) => {
    header.classList.toggle('menu-open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    setIcon(open);

    if (open) {
      const firstLink = $('.nav-link', menu);
      if (firstLink) window.setTimeout(() => firstLink.focus(), 180);
    }
  };

  toggle.addEventListener('click', () => setOpen(!isOpen()));

  $$('a', menu).forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (!isOpen()) return;

    if (event.key === 'Escape') {
      setOpen(false);
      toggle.focus();
      return;
    }

    // Keep keyboard focus inside the open menu (toggle + links + CTA).
    if (event.key !== 'Tab') return;

    const focusables = [toggle, ...$$('a, button', menu)]
      .filter((el) => !el.hasAttribute('disabled') && el.getClientRects().length > 0);
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && (document.activeElement === first || document.activeElement === document.body)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.matchMedia('(min-width: 1401px)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

/* ---------- Scroll behaviour ---------- */
function wireScroll() {
  const header = $('#site-header');
  const toTop = $('#to-top');
  let ticking = false;

  const update = () => {
    const y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 12);
    if (toTop) toTop.classList.toggle('is-visible', y > 700);
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }, { passive: true });

  update();

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ---------- Scroll spy ---------- */
function wireScrollSpy() {
  const links = $$('.nav-link');
  const sections = $$('main section[id]');
  if (!links.length || !sections.length || !('IntersectionObserver' in window)) return;

  const setActive = (id) => {
    links.forEach((link) => {
      const active = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visible[0]) setActive(visible[0].target.id);
  }, {
    rootMargin: '-42% 0px -50% 0px',
    threshold: [0, 0.2, 0.6]
  });

  sections.forEach((section) => observer.observe(section));
}

/* ---------- Reveal on scroll ---------- */
function wireReveal() {
  const items = $$('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  items.forEach((item) => observer.observe(item));
}

/* ---------- Misc ---------- */
function wireMisc() {
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Deep links: re-align after the version picker has rendered.
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
  if (window.lucide) window.lucide.createIcons();

  renderVersionOptions();
  wireVersionPicker();
  applyVersion(initialVersion());
  wireNavigation();
  wireScroll();
  wireScrollSpy();
  wireReveal();
  wireMisc();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
