# FerNode website

The public site for **FerNode** by **FerKunGsXD**. Plain HTML, CSS and vanilla
JavaScript — no build step and no framework.

The site has three main jobs:

1. Offer the FerNode Windows app download, with version history and a SHA-256 checksum.
2. Offer the FerNode plugin library, with search, Minecraft version filtering and direct
   JAR downloads.
3. Run the shop: the Pro licence and the free plugins as product pages, with a cart,
   sign-in, credit checkout and order history.

> **Brand note:** the website is branded FerNode. The current 1.4.1 app downloads still
> contain `Server Tool.exe` and use the original asset filenames. Rebuild and rename the app
> before changing those download paths.

## Files

```text
website/
├─ index.html                 homepage: hero, plugins, principles, app, gallery, guides, FAQ
├─ pro.html                   Server Tool Pro storefront: pricing, comparison, trial, order
├─ pro.css                    Pro storefront layout layered on top of style.css
├─ products.html              shop grid: filters, search, sort and product cards
├─ product.html               product detail (`?p=slug`): media, price, buy, cart, related
├─ cart.html                  cart and checkout (noindex)
├─ shop.css                   storefront, product and cart styles
├─ shop.js                    product catalog, cart storage and checkout helpers
├─ track.html                 order lookup by order id + claim token (calls the payments API)
├─ account.html               sign-in, order history and internal credit (calls the payments API)
├─ config.js                  public runtime config: FERNODE_PAYMENTS_API (empty until deployed)
├─ terms.html                 Server Tool Pro license terms
├─ about.html                 project background, funding and support
├─ privacy.html               privacy policy (AdSense disclosure)
├─ style.css                  dark Manrope/DM Mono design system and responsive states
├─ guides.css                 guide cards, article layout, tables and callouts
├─ script.js                  version picker, plugin filters, checksum, menu, FAQ
├─ ads.txt                    AdSense publisher authorization
├─ robots.txt                 crawl rules and sitemap location
├─ sitemap.xml                canonical page list
├─ guides/
│  ├─ index.html              guide hub (10 articles)
│  ├─ setup-server.html       first Paper server walkthrough
│  ├─ install-plugins.html    safe plugin install and rollback
│  ├─ plugin-settings.html    config, command and permission reference
│  ├─ troubleshooting.html    common plugin and server failures
│  ├─ paper-vs-spigot.html    server software comparison
│  ├─ server-properties.html  configuration reference
│  ├─ backups-upgrades.html   backups, restore tests and upgrades
│  ├─ permissions-luckperms.html  permission groups and nodes
│  ├─ read-logs.html          logs, stack traces and crash reports
│  └─ hosting-options.html    home PC, VPS and managed hosting
├─ assets/
│  ├─ favicon.svg             FerNode favicon
│  ├─ hero-wide.webp          wide hero banner (2048 × 768)
│  ├─ gallery/                voxel artwork for the gallery cards
│  └─ plugins/                muted plugin demo clips
└─ downloads/
   ├─ Server-Tool-1.4.1-win-x64.zip     portable build (154 MB)
   ├─ Server Tool Setup 1.4.1.exe       NSIS installer (117 MB)
   └─ plugins/
      ├─ autorefill-1.1.0.jar
      ├─ ferkungstacker-1.3.0.jar
      ├─ ultratreefeller-1.1.0.jar
      ├─ FerNode-Plugins-1.0.0.zip      all three plugins + install notes
      └─ README.txt
```

Open `index.html` directly in a browser, or upload the folder to any static host
(GitHub Pages, Netlify, Cloudflare Pages, nginx). The live site is
<https://fernode.online/>, served by GitHub Pages from the `FerKunG/server-tool`
repository (`main /`) with a root `CNAME` file containing `fernode.online`. The deployed copy
uses `?v=1.3.0-dark` on `style.css` and `script.js` to bust the previous light-theme cache.

### Domain and DNS

`fernode.online` is registered at Spaceship and uses Spaceship's nameservers. GitHub Pages
needs these records:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `ferkung.github.io` |

Do not point the apex at Spaceship parking and do not use Spaceship's Connect or URL-redirect
features for GitHub Pages. Keep the `CNAME` file in the site root; GitHub Pages uses it to
serve the custom domain and to redirect `www` and `http://` to `https://fernode.online/`.

## Visual system

The page is a static port of the dark FerNode design reference:

- Near-black background (`#09090a`) with layered panels and a blue radial glow.
- Manrope for UI and headings, DM Mono for labels, metadata and the console panel.
- Floating blurred top bar, oversized editorial headings, and plugin cards with grid art.
- Inline SVG icon sprite in `index.html` and `privacy.html`; no icon library is loaded.
- Scroll-reveal, hero boot-in and compatibility bar animations; all disabled under
  `prefers-reduced-motion`.
- Sections: hero, compatibility bar, plugin library, principles, server-tool panel,
  gallery, bundle strip, guides, FAQ and footer.

The custom favicon is `assets/favicon.svg`. The gallery images are local SVGs, so the
homepage does not depend on remote artwork.

## Plugin library

Plugin cards live in `index.html`. Each card carries:

- `data-category` — one of `Gameplay`, `Utility`, `Building`.
- `data-versions` — space-separated Minecraft versions the build supports.
- `data-search` — extra words used by the search box.
- `.plugin-download` — the direct JAR link.

`script.js` filters cards by search text, category and selected Minecraft version. If
JavaScript is unavailable, every plugin card and download link is still present in the HTML.

Each plugin card has a short muted demo clip in `assets/plugins/`. Clips autoplay only while
the card is in the viewport, pause when it leaves or is filtered out, and remain paused with
native controls when the visitor prefers reduced motion.

Current build targets:

| Plugin | Version | Minecraft | Java |
| --- | --- | --- | --- |
| AutoRefill | 1.1.0 | Paper/Spigot 1.21.x | 17+ |
| FerKunGStacker | 1.3.0 | Paper/Spigot 1.20.x – 1.21.x | 17+ |
| UltraTreeFeller | 1.1.0 | Paper/Spigot 1.21.x | 17+ |

To add a plugin, copy its JAR into `downloads/plugins/`, add a card, and update the bundle
ZIP if you want it included. Also add the new version to `data-versions` and the Minecraft
version menu in the library toolbar when needed.

## Guides

`guides/` holds the long-form content: first Paper server setup, safe plugin installation, a
config/command/permission reference, troubleshooting, server software comparison, a
`server.properties` reference, backups and upgrades, LuckPerms permissions, reading logs and
hosting options. Each article is standalone HTML and shares `style.css` plus `guides.css`. The
homepage links to six featured articles; the hub lists all ten.

The guide pages are also the only pages that carry ad units. Do not add ads to the homepage,
the guide hub, the about page, the privacy page or a download screen; those lack the publisher
content that AdSense expects around an ad. If a guide is shortened or replaced with a stub,
remove its ad unit as well.

## App downloads

Release data lives at the top of `script.js`:

```js
{
  version: '1.4.1',
  zip: 'https://github.com/FerKunG/server-tool/releases/download/v1.4.1/Server-Tool-1.4.1-win-x64.zip',
  exe: 'https://github.com/FerKunG/server-tool/releases/download/v1.4.1/Server.Tool.Setup.1.4.1.exe',
  size: '154 MB',
  sha256: '50A3E3289AE8E045EF243FE4F22375DCDF56FB82BB8948C2B402FF9732A02DA1',
  ...
}
```

Both the local source and the public GitHub Pages copy use absolute GitHub Release URLs,
so the large binaries are never stored in the site repository. Versions with `zip: null`
and `exe: null` show as `(archived)` and disable the download buttons. The selected
version is stored in `localStorage` and in `?v=…`.

The download panel is in the **Server tool** section; the hero CTA scrolls to it. The
SHA-256 row has a copy button with a clipboard fallback and a toast confirmation.

## Server Tool Pro storefront

`pro.html` is the paid edition page. It is deliberately separate from the free download panel
and covers:

- Launch pricing (฿289 one-time, regular ฿399) and what the license includes.
- A full Free vs Pro comparison, including the enforced limits in the free build and the Pro-only Bedrock server type and Discord crash/memory alerts.
- The one-time seven-day trial and how to start it.
- Manual ordering instructions, delivery expectations, refunds/reissues and a link to order tracking.
- A **planned** monthly pricing block (Starter ฿99, Pro ฿149, Business ฿199) marked "not on sale yet".
- Direct Pro installer and portable ZIP links, plus the installer SHA-256.

`pro.css` holds the storefront layout and depends on `style.css` for the site shell. The page
uses `script.js` for the mobile menu and FAQ only; its checksum copy button is a small inline
script with its own `#pro-hash-value` element so it does not collide with the free release data
in `script.js`.

The “Buy Pro” buttons inside the app open `https://fernode.online/pro.html` (configured in
`App/shared/edition.ts`). Update the order CTA on `pro.html` when a hosted checkout replaces the
manual YouTube ordering flow.

### Wiring `pro.html` to the payments service

`payments/` (see `payments/README.md`) exposes the hosted checkout API. No deployed URL is
checked into this repository — set it when the service has a public HTTPS host. The storefront
flow is:

1. `GET /api/plans` on page load to render prices and hide plans where `purchasable` is `false`
   (for example the monthly plan when no Stripe recurring price is configured).
2. `POST /api/checkout` with a JSON body `{ "plan": "pro_lifetime", "email": "…", "name": "…" }`
   and a unique `Idempotency-Key` header (8–128 chars: letters, digits, `.`, `:`, `_`, `-`).
   Generate one per click (for example `crypto.randomUUID()`), persist it for the retry, and
   reuse it only when retrying that same request.
3. On `201`, redirect the browser to the returned `checkoutUrl`. Do not mark the order paid or
   show a licence in the page — activation only happens when Stripe's verified webhook lands.
4. On `409 IDEMPOTENCY_KEY_REUSED`, generate a new key. On `502 CHECKOUT_FAILED` or `503`, show
   an error and let the customer retry; never fake a checkout URL.

Keep the call server-to-server or from an allowed browser origin. If the page calls the API
directly from the browser, add the exact site origin to the payments service's `ALLOWED_ORIGINS`
(comma-separated, no `*`). Stripe redirects back to `/checkout/success` and `/checkout/cancel`
on the payments host, so `pro.html` only starts the flow.

The service never returns the Stripe secret, webhook secret, admin token or price ids to the
page. A purchase notification is posted to Discord by the service, not by the site. Email
delivery is optional and opt-in: when the operator configures `EMAIL_PROVIDER`, the service
emails the claim link; otherwise point customers at the claim page / support. The website must
not claim that an email was sent unless email delivery is configured and enabled.

### Monthly plans section

`pro.html` shows three planned monthly tiers (Starter ฿99, Pro ฿149, Business ฿199) with an
explicit **"Planned · not on sale yet"** badge. Keep that badge until a real Stripe recurring
price exists and `POST /api/checkout` accepts the monthly plan code; then swap the badge for a
purchase button and remove the "not on sale yet" sentences in the section note and FAQ 06.
Prices and limits live only in `pro.html`; change them in one place and keep the FAQ consistent.

### Order tracking (`track.html`)

`track.html` calls `GET {FERNODE_PAYMENTS_API}/api/orders/:id?token=…` and renders status, plan,
amount, dates and a claim link. It never displays a licence key.

- `config.js` holds `window.FERNODE_PAYMENTS_API`. It is **empty** in the repository, so the page
  shows an honest "online order tracking is not open yet" notice and disables the form.
- Set it to the public HTTPS origin of the deployed payments service (for example
  `https://pay.fernode.online`) once that host exists. Do not put secrets in `config.js`; it is
  public.
- The payments service must allow `https://fernode.online` in `ALLOWED_ORIGINS` for the browser
  call to succeed, and the page needs the Stripe-era claim token from the customer's message.
- The page is `noindex` and intentionally absent from `sitemap.xml`, because it renders
  query-string tokens.

### Shop (`products.html`, `product.html`, `cart.html`)

The shop turns the same catalogue into a storefront without adding a build step:

- `shop.js` holds one entry per product: `server-tool-pro-lifetime` (launch price),
  `server-tool-pro-monthly` (planned, not on sale) and the three free plugins plus the bundle.
  Licence cards read the live price and availability from `GET /api/plans`; the static fallback
  is only the price already published on `pro.html`.
- `products.html` renders the grid with category chips, search and sorting. Every card links to
  `product.html?p=<slug>`.
- `product.html` renders the media, highlights, details and buy box. A licence can be bought with
  account credit (sign-in required) or by card when `purchasable` is true. The planned monthly
  plan is disabled with an explicit "not on sale yet" note.
- `cart.html` keeps **one licence** in `localStorage` (`fernnode-cart-v1`); adding another licence
  replaces it, because each licence needs its own payment. Free plugins are direct downloads and
  never enter the cart.
- Credit checkout calls `POST /api/account/purchase` with a per-click `Idempotency-Key` and only
  reports success after the service returns a paid order. The order then appears on
  `account.html` with a fresh claim link. Card checkout calls `POST /api/checkout` and redirects
  to the returned Stripe URL; nothing is marked paid on the site.
- `config.js` is still the only switch. While `FERNODE_PAYMENTS_API` is empty, shop buttons are
  disabled and the page states that checkout is not connected. No order, key or "paid" state is
  ever simulated in the browser.
- `products.html` is in `sitemap.xml`; `product.html` uses it as the canonical URL; `cart.html`
  is `noindex`. The cart badge and header cart link are wired with `data-cart-link`.

### Accounts and internal credit (`account.html`)

`account.html` handles registration, sign-in, order history and buying a one-time licence with
credit. It is linked from the nav and footer of every page.

- Like `track.html`, it reads `window.FERNODE_PAYMENTS_API` from `config.js`. While that is empty
  the page shows **"Accounts are not open yet"** and hides the sign-in form. Do not remove that
  notice without a working API origin.
- Sessions use an `HttpOnly`, `SameSite=Lax` cookie, so the API must be on the **same site** as the
  page (for example `pay.fernode.online` next to `fernode.online`). A different domain breaks the
  cookie, and the browser also needs the page origin listed in `ALLOWED_ORIGINS`.
- Orders appear only when they were created while signed in (`orders.account_id`). Guest orders and
  orders from before registration are never attached by email, because there is no email
  verification.
- The page never displays a licence key. A paid order offers a fresh signed claim link; opening the
  page again mints a new one.
- **Credit is added by the seller, not bought on the site.** `account.html` has no top-up form and
  no card fields. The seller adds credit from the admin **Customers** tab after a bank transfer or
  PromptPay payment arrives, and the customer then clicks *Buy* on the page. Credit is
  non-withdrawable, cannot move between accounts, and only buys one-time plans — the page hides the
  button and explains why for subscription plans (`creditPurchasable: false`).
- Credit purchases send an `Idempotency-Key` per click; the balance and the append-only history
  come from `GET /api/account/credit`, so the page can always explain the balance it shows.

## Google AdSense

- Publisher ID: `pub-1821900542837424`
- Client ID: `ca-pub-1821900542837424`
- Ad slot: `9015687951`

The loader is in the `<head>` of the guide articles; one responsive unit sits inside each
long-form article, surrounded by the guide text. `ads.txt` is served from the domain root at
<https://fernode.online/ads.txt>.

Ads are deliberately not placed on the homepage, the download panel, the guide hub, the about
page or the privacy page. Those screens are navigational or download-oriented, and Google's
"ads on screens without publisher content" policy does not allow ad units there. Keep it that
way: if you add a new page, give it substantial original content before adding an ad unit.

AdSense does not fill ads on `localhost`; a local preview may show an empty container and a
`googleads` 400 message. That is expected until AdSense approves the public domain.

## Notes

- The site is responsive and keyboard accessible: skip link, visible focus states,
  labelled controls, `aria-live` result counts, and a focus-managed mobile menu.
- The mobile menu closes with Escape, on link selection, and when the viewport grows.
- The FAQ is a single-open accordion with `aria-expanded` and `aria-controls`.
- The large app files are not committed to the GitHub Pages repository; they live in GitHub
  Releases. Plugin JARs are small enough to serve directly from the site.
