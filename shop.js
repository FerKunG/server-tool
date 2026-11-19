/* ============================================================
   FerNode shop — catalog, cart and checkout helpers
   Vanilla JavaScript, no dependencies. Loaded after config.js.
   ============================================================ */

'use strict';

(function () {
  var API = (window.FERNODE_PAYMENTS_API || '').replace(/\/+$/, '');
  var CART_KEY = 'fernnode-cart-v1';

  /* ---------------------------------------------------------- catalog
     One entry per product. Licence prices come from the payments API at
     runtime; `falls back to` is only the price already published on
     pro.html, never an invented one. */
  var CATALOG = [
    {
      slug: 'server-tool-pro-lifetime',
      type: 'licence',
      plan: 'pro_lifetime',
      name: 'Server Tool Pro — Lifetime',
      kind: 'One-time licence',
      badge: 'LAUNCH PRICE',
      icon: 'i-shield',
      accent: 'violet',
      fallbackSatang: 28900,
      compareAtSatang: 39900,
      summary:
        'Every Pro feature unlocked, unlimited servers, offline activation. Pay once and keep using the licence.',
      highlights: [
        'Unlimited server profiles and worlds',
        'Purpur, Fabric and Bedrock support',
        'Console commands, file editor and player tools',
        'One-click Fabric mod installs',
        'Scheduled backups, Discord alerts and auto-restart',
        'Offline activation — the app never needs an account'
      ],
      details: [
        {
          title: 'How delivery works',
          body:
            'After payment the shop issues a signed licence key immediately. Open the claim link, copy the key, then paste it into Server Tool → Settings → License. The key verifies offline, so the app keeps working without a network.'
        },
        {
          title: 'What is included',
          body:
            'A perpetual licence for Server Tool Pro 1.x, including updates in that major version. It is one licence for the computers you own; sharing keys publicly is not allowed.'
        },
        {
          title: 'Trial first',
          body:
            'The Pro build includes a 7-day trial. Install it, run a server, and only buy a key if the workflow fits you.'
        }
      ],
      notes: 'Windows 10/11 · offline activation · 1.x updates included'
    },
    {
      slug: 'server-tool-pro-monthly',
      type: 'licence',
      plan: 'pro_monthly',
      name: 'Server Tool Pro — Monthly',
      kind: 'Subscription',
      badge: 'PLANNED',
      icon: 'i-clock',
      accent: 'slate',
      planned: true,
      summary:
        'Monthly access to every Pro feature, renewed by card. Not on sale yet: it switches on when a real recurring price exists.',
      highlights: [
        'Every Pro feature while the subscription is active',
        'Cancel at the end of the billing period',
        'Card payment and Customer Portal access',
        'Switches on only when a recurring price is configured'
      ],
      details: [
        {
          title: 'Why it is not on sale',
          body:
            'A monthly plan needs a real recurring price and stored card. Planning numbers shown on the Pro page are placeholders for tiers, not an offer. Credit cannot pay for a subscription because renewals need a card.'
        }
      ],
      notes: 'Planned · not on sale yet'
    },
    {
      slug: 'plugin-ultratreefeller',
      type: 'plugin',
      name: 'UltraTreeFeller',
      kind: 'Paper plugin',
      badge: 'FREE',
      version: 'v1.1.0',
      icon: 'i-tree',
      accent: 'green',
      file: 'downloads/plugins/ultratreefeller-1.1.0.jar',
      fileName: 'ultratreefeller-1.1.0.jar',
      demo: 'assets/plugins/ultratreefeller.mp4',
      tags: ['Paper', '1.21.x'],
      summary:
        'Fell entire trees with one SHIFT-activated swing, with a cooldown, progress display and protection for nearby trees.',
      highlights: [
        'SHIFT + hit fells the whole tree',
        'Progress display and configurable cooldown',
        'Protects nearby saplings and player builds',
        'Drops behave like normal block breaks'
      ],
      details: [
        {
          title: 'Install',
          body:
            'Drop the JAR into plugins/ and restart the server. Works on Paper 1.21.x. Full settings and permissions are in the plugin guide.'
        }
      ],
      notes: 'Free download · no account needed'
    },
    {
      slug: 'plugin-ferkungstacker',
      type: 'plugin',
      name: 'FerKunG Stacker',
      kind: 'Paper / Spigot plugin',
      badge: 'FREE',
      version: 'v1.3.0',
      icon: 'i-layers',
      accent: 'blue',
      file: 'downloads/plugins/ferkungstacker-1.3.0.jar',
      fileName: 'ferkungstacker-1.3.0.jar',
      demo: 'assets/plugins/ferkungstacker.mp4',
      tags: ['Paper / Spigot', '1.20 - 1.21'],
      summary:
        'Group nearby drops into clean stacks with a visible count, while custom stacks fill every free inventory slot on pickup.',
      highlights: [
        'Nearby drops merge into readable stacks',
        'Visible stack counts in the world',
        'Custom stacks top up free inventory slots on pickup',
        'Runs on Paper and Spigot 1.20 - 1.21'
      ],
      details: [
        {
          title: 'Install',
          body:
            'Drop the JAR into plugins/ and restart. No dependencies. Stack limits and merge radius are configurable in config.yml.'
        }
      ],
      notes: 'Free download · no account needed'
    },
    {
      slug: 'plugin-autorefill',
      type: 'plugin',
      name: 'AutoRefill',
      kind: 'Paper plugin',
      badge: 'FREE',
      version: 'v1.1.0',
      icon: 'i-refresh',
      accent: 'amber',
      file: 'downloads/plugins/autorefill-1.1.0.jar',
      fileName: 'autorefill-1.1.0.jar',
      demo: 'assets/plugins/autorefill.mp4',
      tags: ['Paper', '1.21.x', '6.9 KB'],
      summary:
        'Refill the item in your hand after use, block breaks and tool breakage — with ignored items respected for custom gear.',
      highlights: [
        'Refills the held item from the inventory',
        'Works after block breaks and tool breakage',
        'Ignore list keeps custom gear untouched',
        'Lightweight: a single JAR, no dependencies'
      ],
      details: [
        {
          title: 'Install',
          body:
            'Drop the JAR into plugins/ and restart. Works on Paper 1.21.x. Add items to the ignore list if another plugin manages them.'
        }
      ],
      notes: 'Free download · no account needed'
    },
    {
      slug: 'plugin-bundle',
      type: 'plugin',
      name: 'FerNode Plugin Bundle',
      kind: 'All three plugins',
      badge: 'FREE',
      version: 'v1.0.0',
      icon: 'i-box',
      accent: 'slate',
      file: 'downloads/plugins/FerNode-Plugins-1.0.0.zip',
      fileName: 'FerNode-Plugins-1.0.0.zip',
      tags: ['3 JARs', 'Install notes'],
      summary:
        'UltraTreeFeller, FerKunG Stacker and AutoRefill in one ZIP with install notes, for a fresh Paper server.',
      highlights: [
        'All three plugins at their current versions',
        'Install notes for Paper and Spigot',
        'Same files as the individual downloads'
      ],
      details: [
        {
          title: 'Install',
          body:
            'Unzip into plugins/, delete any older copies of the same JARs, then restart the server. Read the included notes for commands and permissions.'
        }
      ],
      notes: 'Free download · no account needed'
    }
  ];

  var bySlug = {};
  CATALOG.forEach(function (item) {
    bySlug[item.slug] = item;
  });

  /* ------------------------------------------------------------ helpers */

  function formatMoney(satang, currency) {
    var amount = (Number(satang) || 0) / 100;
    var code = (currency || 'thb').toUpperCase();
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        maximumFractionDigits: amount % 1 === 0 ? 0 : 2
      }).format(amount);
    } catch (error) {
      return code + ' ' + amount.toFixed(2);
    }
  }

  function apiEnabled() {
    return Boolean(API);
  }

  function request(path, options) {
    var config = options || {};
    var headers = { accept: 'application/json' };
    if (config.body) headers['content-type'] = 'application/json';
    if (config.headers) Object.assign(headers, config.headers);
    return fetch(API + path, {
      method: config.method || 'GET',
      credentials: 'include',
      headers: headers,
      body: config.body ? JSON.stringify(config.body) : undefined
    }).then(function (response) {
      return response
        .json()
        .catch(function () {
          return {};
        })
        .then(function (body) {
          if (!response.ok) {
            var error = new Error(
              (body && body.error && body.error.message) || 'Request failed (' + response.status + ')'
            );
            error.status = response.status;
            error.code = body && body.error && body.error.code;
            error.details = body && body.error && body.error.details;
            throw error;
          }
          return body;
        });
    });
  }

  function idempotencyKey() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
    return 'shop-' + Date.now() + '-' + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
  }

  /* ----------------------------------------------------------- cart */

  function readCart() {
    try {
      var parsed = JSON.parse(window.localStorage.getItem(CART_KEY) || '[]');
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(function (slug) {
        return typeof slug === 'string' && bySlug[slug] && bySlug[slug].type === 'licence';
      });
    } catch (error) {
      return [];
    }
  }

  function writeCart(slugs) {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(slugs));
    } catch (error) {
      /* storage can be disabled; the cart simply stays empty */
    }
    updateCartBadges();
  }

  function addToCart(slug) {
    var item = bySlug[slug];
    if (!item || item.type !== 'licence') return { ok: false, reason: 'NOT_IN_CART' };
    var current = readCart();
    if (current.indexOf(slug) !== -1) return { ok: true, already: true };
    // One licence per order: a second licence would need its own payment.
    writeCart([slug]);
    return { ok: true, replaced: current.length > 0 };
  }

  function removeFromCart(slug) {
    writeCart(
      readCart().filter(function (entry) {
        return entry !== slug;
      })
    );
  }

  function clearCart() {
    writeCart([]);
  }

  function cartEntries() {
    return readCart().map(function (slug) {
      return bySlug[slug];
    });
  }

  function cartTotalSatang(plans) {
    var entries = cartEntries();
    if (!entries.length) return 0;
    var plan = plans && plans[entries[0].plan];
    return plan && typeof plan.amountSatang === 'number' ? plan.amountSatang : entries[0].fallbackSatang;
  }

  function updateCartBadges() {
    var count = readCart().length;
    var badges = document.querySelectorAll('[data-cart-count]');
    Array.prototype.forEach.call(badges, function (badge) {
      badge.textContent = String(count);
      badge.hidden = count === 0;
    });
  }

  /* ----------------------------------------------------------- plans */

  var planCache = null;

  function loadPlans() {
    if (planCache) return Promise.resolve(planCache);
    if (!apiEnabled()) {
      planCache = { offline: true, plans: {} };
      return Promise.resolve(planCache);
    }
    return request('/api/plans')
      .then(function (data) {
        var indexed = {};
        (data.plans || []).forEach(function (plan) {
          indexed[plan.code] = plan;
        });
        planCache = { offline: false, plans: indexed };
        return planCache;
      })
      .catch(function () {
        planCache = { offline: true, plans: {} };
        return planCache;
      });
  }

  /** Live price, availability and reason for one catalog item. */
  function planState(item, store) {
    if (item.type !== 'licence') {
      return { priceSatang: 0, purchasable: true, creditPurchasable: false, cardReady: false, reason: null };
    }
    var plan = store.plans[item.plan];
    if (item.planned) {
      return {
        priceSatang: plan && plan.amountSatang ? plan.amountSatang : null,
        purchasable: false,
        creditPurchasable: false,
        cardReady: false,
        reason: 'Planned — not on sale yet'
      };
    }
    if (!plan) {
      return {
        priceSatang: item.fallbackSatang,
        purchasable: false,
        creditPurchasable: false,
        cardReady: false,
        reason: 'Checkout opens when the payment service is live'
      };
    }
    return {
      priceSatang: typeof plan.amountSatang === 'number' ? plan.amountSatang : item.fallbackSatang,
      purchasable: Boolean(plan.purchasable),
      creditPurchasable: Boolean(plan.creditPurchasable),
      cardReady: Boolean(plan.purchasable),
      reason:
        plan.purchasable || plan.creditPurchasable
          ? null
          : plan.unavailableReason || plan.creditUnavailableReason || null
    };
  }

  function currentSession() {
    if (!apiEnabled()) return Promise.resolve(null);
    return request('/api/auth/me')
      .then(function (data) {
        return data.account || null;
      })
      .catch(function () {
        return null;
      });
  }

  function buyWithCredit(slug) {
    var item = bySlug[slug];
    if (!item) return Promise.reject(new Error('Unknown product'));
    if (!apiEnabled()) return Promise.reject(new Error('Checkout is not open yet'));
    return request('/api/account/purchase', {
      method: 'POST',
      headers: { 'idempotency-key': idempotencyKey() },
      body: { plan: item.plan }
    });
  }

  function startCardCheckout(slug, email, name) {
    var item = bySlug[slug];
    if (!item) return Promise.reject(new Error('Unknown product'));
    if (!apiEnabled()) return Promise.reject(new Error('Checkout is not open yet'));
    return request('/api/checkout', {
      method: 'POST',
      headers: { 'idempotency-key': idempotencyKey() },
      body: { plan: item.plan, email: email, name: name }
    });
  }

  /* ------------------------------------------------------- rendering */

  function icon(id, className) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'icon' + (className ? ' ' + className : ''));
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#' + id);
    svg.appendChild(use);
    return svg;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function productCard(item, store) {
    var state = planState(item, store);
    var card = el('article', 'shop-card');
    card.setAttribute('data-product', item.slug);

    var media = el('a', 'shop-card-media accent-' + (item.accent || 'slate'));
    media.href = 'product.html?p=' + encodeURIComponent(item.slug);
    media.setAttribute('aria-label', item.name);
    media.appendChild(icon(item.icon, 'shop-card-icon'));
    if (item.demo) {
      var video = document.createElement('video');
      video.className = 'shop-card-video';
      video.src = item.demo;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'metadata';
      media.appendChild(video);
    }
    if (item.badge) {
      var badge = el('span', 'shop-badge badge-' + (item.badge === 'FREE' ? 'free' : item.badge === 'PLANNED' ? 'planned' : 'launch'), item.badge);
      media.appendChild(badge);
    }
    card.appendChild(media);

    var body = el('div', 'shop-card-body');
    var meta = el('div', 'shop-card-meta');
    meta.appendChild(el('span', 'shop-card-kind', item.kind));
    if (item.version) meta.appendChild(el('span', 'shop-card-version', item.version));
    body.appendChild(meta);

    var title = el('h3', 'shop-card-title');
    var link = el('a', null, item.name);
    link.href = 'product.html?p=' + encodeURIComponent(item.slug);
    title.appendChild(link);
    body.appendChild(title);
    body.appendChild(el('p', 'shop-card-summary', item.summary));

    var foot = el('div', 'shop-card-foot');
    var price = el('div', 'shop-price');
    if (item.type === 'licence' && state.priceSatang) {
      price.appendChild(el('strong', null, formatMoney(state.priceSatang)));
      if (item.compareAtSatang && item.compareAtSatang > state.priceSatang) {
        price.appendChild(el('s', 'shop-price-was', formatMoney(item.compareAtSatang)));
      }
    } else if (item.type === 'licence') {
      price.appendChild(el('strong', 'shop-price-planned', item.planned ? 'Planned' : 'Not priced'));
    } else {
      price.appendChild(el('strong', 'shop-price-free', 'Free'));
    }
    foot.appendChild(price);

    var action = el('a', 'shop-card-action', item.type === 'licence' ? 'View licence' : 'Download');
    action.href =
      item.type === 'licence' ? 'product.html?p=' + encodeURIComponent(item.slug) : item.file;
    if (item.type === 'plugin') action.setAttribute('download', item.fileName);
    foot.appendChild(action);

    body.appendChild(foot);
    card.appendChild(body);
    return card;
  }

  function updateCartLink(link) {
    if (!link) return;
    var count = readCart().length;
    var label = link.querySelector('[data-cart-label]');
    if (label) {
      label.textContent = count ? 'Cart (' + count + ')' : 'Cart';
      return;
    }
    link.textContent = count ? 'Cart (' + count + ')' : 'Cart';
  }

  /* ------------------------------------------------------------ boot */

  document.addEventListener('DOMContentLoaded', function () {
    updateCartBadges();
    Array.prototype.forEach.call(document.querySelectorAll('[data-cart-link]'), updateCartLink);
  });

  window.FerShop = {
    API: API,
    CATALOG: CATALOG,
    bySlug: bySlug,
    apiEnabled: apiEnabled,
    formatMoney: formatMoney,
    request: request,
    idempotencyKey: idempotencyKey,
    loadPlans: loadPlans,
    planState: planState,
    currentSession: currentSession,
    buyWithCredit: buyWithCredit,
    startCardCheckout: startCardCheckout,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    clearCart: clearCart,
    cartEntries: cartEntries,
    cartTotalSatang: cartTotalSatang,
    updateCartBadges: updateCartBadges,
    updateCartLink: updateCartLink,
    productCard: productCard,
    icon: icon,
    el: el
  };
})();
