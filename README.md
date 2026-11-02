# FerNode website

The public site for **FerNode** by **FerKunGsXD**. Plain HTML, CSS and vanilla
JavaScript — no build step and no framework.

The site has two main jobs:

1. Offer the FerNode Windows app download, with version history and a SHA-256 checksum.
2. Offer the FerNode plugin library, with search, Minecraft version filtering and direct
   JAR downloads.

> **Brand note:** the website is branded FerNode. The current 1.2.1 app downloads still
> contain `Server Tool.exe` and use the original asset filenames. Rebuild and rename the app
> before changing those download paths.

## Files

```text
website/
├─ index.html                 homepage: hero, plugins, principles, app, gallery, FAQ
├─ style.css                  dark Manrope/DM Mono design system and responsive states
├─ script.js                  version picker, plugin filters, checksum, menu, FAQ
├─ privacy.html               privacy policy (AdSense disclosure)
├─ ads.txt                    AdSense publisher authorization
├─ assets/
│  ├─ favicon.svg             FerNode favicon
│  ├─ hero-wide.webp          wide hero banner (2048 × 768)
│  ├─ gallery/                voxel artwork for the gallery cards
│  └─ plugins/                muted plugin demo clips
└─ downloads/
   ├─ Server-Tool-1.2.1-win-x64.zip     portable build (157 MB)
   ├─ Server Tool Setup 1.2.1.exe       NSIS installer (117 MB)
   └─ plugins/
      ├─ autorefill-1.1.0.jar
      ├─ ferkungstacker-1.3.0.jar
      ├─ ultratreefeller-1.1.0.jar
      ├─ FerNode-Plugins-1.0.0.zip      all three plugins + install notes
      └─ README.txt
```

Open `index.html` directly in a browser, or upload the folder to any static host
(GitHub Pages, Netlify, Cloudflare Pages, nginx). The deployed GitHub Pages copy uses
`?v=1.3.0-dark` on `style.css` and `script.js` to bust the previous light-theme cache.

## Visual system

The page is a static port of the dark FerNode design reference:

- Near-black background (`#09090a`) with layered panels and a blue radial glow.
- Manrope for UI and headings, DM Mono for labels, metadata and the console panel.
- Floating blurred top bar, oversized editorial headings, and plugin cards with grid art.
- Inline SVG icon sprite in `index.html` and `privacy.html`; no icon library is loaded.
- Scroll-reveal, hero boot-in and compatibility bar animations; all disabled under
  `prefers-reduced-motion`.
- Sections: hero, compatibility bar, plugin library, principles, server-tool panel,
  gallery, bundle strip, FAQ, advertisement and footer.

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

## App downloads

Release data lives at the top of `script.js`:

```js
{
  version: '1.2.1',
  zip: 'https://github.com/FerKunG/server-tool/releases/download/v1.2.1/Server-Tool-1.2.1-win-x64.zip',
  exe: 'https://github.com/FerKunG/server-tool/releases/download/v1.2.1/Server.Tool.Setup.1.2.1.exe',
  size: '157 MB',
  sha256: '72CEF577C9A8B3747F57BA0C78CC67BA0CD840C1E8033045243786242625C580',
  ...
}
```

Both the local source and the public GitHub Pages copy use absolute GitHub Release URLs,
so the large binaries are never stored in the site repository. Versions with `zip: null`
and `exe: null` show as `(archived)` and disable the download buttons. The selected
version is stored in `localStorage` and in `?v=…`.

The download panel is in the **Server tool** section; the hero CTA scrolls to it. The
SHA-256 row has a copy button with a clipboard fallback and a toast confirmation.

## Google AdSense

- Publisher ID: `pub-1821900542837424`
- Client ID: `ca-pub-1821900542837424`
- Ad slot: `9015687951`

The loader is in the `<head>` of `index.html`; one responsive horizontal unit sits below
the FAQ. `ads.txt` must be served from the domain root, so a custom domain is still
needed for AdSense verification.

AdSense does not fill ads on `localhost`; a local preview may show an empty container and a
`googleads` 400 message. That is expected until the site is served from its public domain.

## Notes

- The site is responsive and keyboard accessible: skip link, visible focus states,
  labelled controls, `aria-live` result counts, and a focus-managed mobile menu.
- The mobile menu closes with Escape, on link selection, and when the viewport grows.
- The FAQ is a single-open accordion with `aria-expanded` and `aria-controls`.
- The large app files are not committed to the GitHub Pages repository; they live in GitHub
  Releases. Plugin JARs are small enough to serve directly from the site.
