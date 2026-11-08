# FerNode website

The public site for **FerNode** by **FerKunGsXD**. Plain HTML, CSS and vanilla
JavaScript — no build step and no framework.

The site has two main jobs:

1. Offer the FerNode Windows app download, with version history and a SHA-256 checksum.
2. Offer the FerNode plugin library, with search, Minecraft version filtering and direct
   JAR downloads.

> **Brand note:** the website is branded FerNode. The current 1.3.0 app downloads still
> contain `Server Tool.exe` and use the original asset filenames. Rebuild and rename the app
> before changing those download paths.

## Files

```text
website/
├─ index.html                 homepage: hero, plugins, principles, app, gallery, guides, FAQ
├─ pro.html                   Server Tool Pro storefront: pricing, comparison, trial, order
├─ pro.css                    Pro storefront layout layered on top of style.css
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
   ├─ Server-Tool-1.3.0-win-x64.zip     portable build (149 MB)
   ├─ Server Tool Setup 1.3.0.exe       NSIS installer (117 MB)
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
  version: '1.3.0',
  zip: 'https://github.com/FerKunG/server-tool/releases/download/v1.3.0/Server-Tool-1.3.0-win-x64.zip',
  exe: 'https://github.com/FerKunG/server-tool/releases/download/v1.3.0/Server.Tool.Setup.1.3.0.exe',
  size: '149 MB',
  sha256: '304DAF679255119022A8C49650B8DAEFDFCB56F1CDBEA2584FCD55911D7285DD',
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

- Launch pricing (฿399 one-time, regular ฿599) and what the license includes.
- A full Free vs Pro comparison, including the enforced limits in the free build.
- The one-time seven-day trial and how to start it.
- Manual ordering instructions and license delivery.
- Direct Pro installer and portable ZIP links, plus the installer SHA-256.

`pro.css` holds the storefront layout and depends on `style.css` for the site shell. The page
uses `script.js` for the mobile menu and FAQ only; its checksum copy button is a small inline
script with its own `#pro-hash-value` element so it does not collide with the free release data
in `script.js`.

The “Buy Pro” buttons inside the app open `https://fernode.online/pro.html` (configured in
`App/shared/edition.ts`). Update the order CTA on `pro.html` when a hosted checkout replaces the
manual YouTube ordering flow.

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
